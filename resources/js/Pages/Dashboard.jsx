import React, { useState, useEffect, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { Pizza, Send, MessageCircle, User } from 'lucide-react';

export default function Dashboard({ auth }) {
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);
    const echoChannelRef = useRef(null);
    const chatPollingIntervalRef = useRef(null);

    // Configurazione di axios per le richieste CSRF
    useEffect(() => {
        // Ottieni il token CSRF dal meta tag
        const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

        // Configura axios per includere il token in tutte le richieste
        if (token) {
            axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
        }

        console.log('CSRF Token configurato:', token ? 'presente' : 'mancante');
    }, []);

    // Funzione per ottenere i dati delle chat
    const fetchChats = async () => {
        try {
            console.log('Richiesta chat in corso...');

            // Usa la route web invece della route API
            const response = await axios.get('/telegram/chats');

            console.log('Risposta chat ricevuta:', response.data);
            setChats(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Errore durante il recupero delle chat:', err);
            setError('Impossibile caricare le chat. Riprova più tardi.');
            setLoading(false);
        }
    };

    // Funzione per ottenere i messaggi di una chat
    const fetchMessages = async (chatId) => {
        try {
            console.log(`Richiesta messaggi per chat ${chatId} in corso...`);
            setLoading(true);
            const response = await axios.get(`/telegram/chats/${chatId}/messages`);

            console.log(`Messaggi ricevuti per chat ${chatId}:`, response.data);
            setMessages(response.data);
            setLoading(false);
        } catch (err) {
            console.error(`Errore durante il recupero dei messaggi per la chat ${chatId}:`, err);
            setError('Impossibile caricare i messaggi. Riprova più tardi.');
            setLoading(false);
        }
    };

    // Funzione per inviare un messaggio
    const sendMessage = async (e) => {
        e.preventDefault();

        if (!newMessage.trim() || !selectedChat) return;

        try {
            console.log('Invio messaggio:', {
                chat_id: selectedChat.chat_id,
                text: newMessage
            });


            // Memorizza il messaggio da inviare
            const messageToSend = newMessage;

            // Pulisci il campo di input subito
            setNewMessage('');

            const response = await axios.post('/telegram/send-message', {
                chat_id: selectedChat.chat_id,
                text: messageToSend
            });

            console.log('Risposta invio messaggio:', response.data);

            // Aggiungi il messaggio alla UI
            const tempMessage = {
                id: 'temp_' + Date.now(),
                message_id: Date.now(),
                telegram_chat_id: selectedChat.id,
                text: messageToSend,
                direction: 'outgoing',
                sent_at: new Date().toISOString()
            };

            setMessages(prevMessages => [...prevMessages, tempMessage]);

            // Aggiorna la lista dei messaggi dopo 1000ms
            setTimeout(() => {
                fetchMessages(selectedChat.chat_id);
            }, 1000);
        } catch (err) {
            console.error('Errore durante l\'invio del messaggio:', err);
            console.error('Dettagli errore:', err.response?.data || err.message);
            setError(`Errore nell'invio: ${err.response?.data?.message || err.message}`);

            // Ripristina il testo del messaggio in caso di errore
            setNewMessage(newMessage);
        }
    };

    // Sottoscrizione alle chat all'avvio e configurazione del polling per le chat
    useEffect(() => {
        fetchChats();

        // Polling leggero solo per la lista delle chat (non per i messaggi)
        chatPollingIntervalRef.current = setInterval(() => {
            fetchChats();
        }, 30000); // Ogni 30 secondi per mantenere aggiornata la lista delle chat

        return () => {
            if (chatPollingIntervalRef.current) {
                clearInterval(chatPollingIntervalRef.current);
                chatPollingIntervalRef.current = null;
            }

            if (echoChannelRef.current) {
                try {
                    echoChannelRef.current.unsubscribe();
                    echoChannelRef.current = null;
                } catch (error) {
                    console.error('Errore durante l\'unsubscribe del canale:', error);
                }
            }
        };
    }, []);

    // Quando viene selezionata una chat, carica i messaggi e configura WebSocket
    useEffect(() => {
        if (selectedChat) {
            console.log(`Chat selezionata: ID ${selectedChat.id}, Chat ID ${selectedChat.chat_id}`);

            // Prima carica i messaggi esistenti
            fetchMessages(selectedChat.chat_id);

            // Pulisci il canale WebSocket precedente se esiste
            if (echoChannelRef.current) {
                try {
                    echoChannelRef.current.unsubscribe();
                    echoChannelRef.current = null;
                } catch (error) {
                    console.error('Errore durante l\'unsubscribe del canale:', error);
                }
            }

            // Verifica che Echo e Pusher siano disponibili
            if (window.Echo) {
                try {
                    console.log(`Tentativo di sottoscrizione al canale chat.${selectedChat.id} con ID di tipo ${typeof selectedChat.id}`);

                    // Sottoscrizione al canale privato
                    const channel = window.Echo.private(`chat.${selectedChat.id}`);

                    // Registra errori
                    channel.error((error) => {
                        console.error('💥 Errore nel canale WebSocket:', error);
                    });

                    // Ascolta tutti gli eventi (per debug)
                    channel.listenToAll((eventName, data) => {
                        console.log(`🔄 Evento generico "${eventName}" ricevuto:`, data);
                    });

                    // Prova con diversi formati di nome evento
                    channel.listen('.newMessage', (data) => {
                        console.log('📩 EVENTO .newMessage RICEVUTO:', data);
                        handleNewMessage(data, selectedChat);
                    });

                    channel.listen('newMessage', (data) => {
                        console.log('📩 EVENTO newMessage RICEVUTO:', data);
                        handleNewMessage(data, selectedChat);
                    });

                    channel.listen('App\\Events\\NewTelegramMessage', (data) => {
                        console.log('📩 EVENTO App\\Events\\NewTelegramMessage RICEVUTO:', data);
                        handleNewMessage(data, selectedChat);
                    });

                    channel.listen('.new.message', (data) => {
                        console.log('📩 EVENTO .new.message RICEVUTO:', data);
                        handleNewMessage(data, selectedChat);
                    });

                    // Salva il riferimento al canale
                    echoChannelRef.current = channel;

                    console.log(`Sottoscrizione al canale chat.${selectedChat.id} completata`);
                } catch (error) {
                    console.error('Errore durante la sottoscrizione al canale WebSocket:', error);
                }
            } else {
                console.warn('Echo non è disponibile. Non sarà possibile ricevere aggiornamenti in tempo reale.');
            }
        }

        // Cleanup quando cambia la chat o si smonta il componente
        return () => {
            if (echoChannelRef.current) {
                try {
                    echoChannelRef.current.unsubscribe();
                    echoChannelRef.current = null;
                } catch (error) {
                    console.error('Errore durante l\'unsubscribe del canale:', error);
                }
            }
        };
    }, [selectedChat]);

    // Funzione per gestire i nuovi messaggi ricevuti via WebSocket
    const handleNewMessage = (data, chat) => {
        console.log('Elaborazione nuovo messaggio:', data);
        console.log('Dettagli IDs:', {
            'data.telegram_chat_id': data.telegram_chat_id,
            'tipo di data.telegram_chat_id': typeof data.telegram_chat_id,
            'chat.id': chat.id,
            'tipo di chat.id': typeof chat.id,
            'sono uguali?': Number(data.telegram_chat_id) === Number(chat.id)
        });

        // Converti entrambi in numeri per il confronto
        if (Number(data.telegram_chat_id) === Number(chat.id)) {
            console.log('✅ MATCH! Il messaggio appartiene alla chat corrente');

            // Forza l'aggiornamento dei messaggi dall'API
            fetchMessages(chat.chat_id);
        } else {
            console.log('❌ NO MATCH. ID chat diversi, non aggiorno i messaggi');

            // Aggiorna solo la lista delle chat per il contatore
            fetchChats();
        }
    };

    // Scorre automaticamente verso il messaggio più recente
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // Formatta la data del messaggio
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center text-red-800">
                    <h2 className="font-bold text-xl leading-tight">HomePizza Admin Dashboard</h2>
                </div>
            }
        >
            <Head title="Admin Dashboard" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-lg transition-all duration-300">
                        <div className="flex h-[70vh]">
                            {/* Lista delle chat */}
                            <div className="w-1/4 border-r pr-4 overflow-y-auto">
                                <div className="flex items-center mb-4 text-red-800">
                                    <MessageCircle className="text-red-600 w-5 h-5 mr-2" />
                                    <h3 className="font-bold text-lg">Chat Utenti</h3>
                                </div>

                                {loading && !chats.length ? (
                                    <p className="text-gray-500 text-center py-4">Caricamento chat...</p>
                                ) : error && !chats.length ? (
                                    <p className="text-red-500 text-center py-4">{error}</p>
                                ) : (
                                    <ul className="space-y-2">
                                        {chats.map((chat) => (
                                            <li
                                                key={chat.id}
                                                className={`p-3 rounded-lg cursor-pointer hover:bg-red-50 transition-colors ${selectedChat?.id === chat.id ? 'bg-red-100 border-l-4 border-red-500' : ''}`}
                                                onClick={() => setSelectedChat(chat)}
                                            >
                                                <div className="flex items-center">
                                                    <User className="text-red-500 w-5 h-5 mr-2" />
                                                    <div>
                                                        <div className="font-medium text-red-900">
                                                            {chat.first_name} {chat.last_name}
                                                            {chat.username && <span className="text-red-700 ml-1">@{chat.username}</span>}
                                                        </div>
                                                        <div className="text-sm text-red-700">
                                                            {chat.messages_count} messaggi
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* Area messaggi */}
                            <div className="w-3/4 pl-4 flex flex-col">
                                {selectedChat ? (
                                    <>
                                        <div className="border-b border-red-100 pb-3 mb-4">
                                            <div className="flex items-center">
                                                <User className="text-red-600 w-6 h-6 mr-2" />
                                                <h3 className="font-bold text-lg text-red-800">
                                                    {selectedChat.first_name} {selectedChat.last_name}
                                                    {selectedChat.username && <span className="text-red-600 ml-1">@{selectedChat.username}</span>}
                                                </h3>
                                            </div>
                                        </div>

                                        {/* Lista messaggi */}
                                        <div className="flex-1 overflow-y-auto mb-4 px-2">
                                            {loading ? (
                                                <p className="text-gray-500 text-center py-8">Caricamento messaggi...</p>
                                            ) : error ? (
                                                <p className="text-red-500 text-center py-8">{error}</p>
                                            ) : messages.length === 0 ? (
                                                <div className="text-center py-8">
                                                    <MessageCircle className="text-red-300 w-16 h-16 mx-auto mb-2" />
                                                    <p className="text-red-400">Nessun messaggio</p>
                                                </div>
                                            ) : (
                                                <ul className="space-y-3">
                                                    {messages.map((message) => (
                                                        <li
                                                            key={message.id}
                                                            className={`p-3 rounded-lg ${
                                                                message.direction === 'outgoing'
                                                                ? 'bg-red-100 ml-auto max-w-[80%] border-red-200 border'
                                                                : 'bg-gray-50 mr-auto max-w-[80%] border-gray-200 border'
                                                            }`}
                                                        >
                                                            <div className="whitespace-pre-wrap break-words text-red-900">
                                                                {message.text}
                                                            </div>
                                                            <div className="text-xs text-red-500 mt-1 text-right">
                                                                {formatDate(message.sent_at)}
                                                            </div>
                                                        </li>
                                                    ))}
                                                    <div ref={messagesEndRef} />
                                                </ul>
                                            )}
                                        </div>

                                        {/* Input per nuovo messaggio */}
                                        <form onSubmit={sendMessage} className="mt-auto">
                                            <div className="flex">
                                                <input
                                                    type="text"
                                                    value={newMessage}
                                                    onChange={(e) => setNewMessage(e.target.value)}
                                                    className="flex-1 border-red-200 focus:border-red-500 focus:ring-red-500 rounded-lg shadow-sm"
                                                    placeholder="Scrivi un messaggio..."
                                                />
                                                <button
                                                    type="submit"
                                                    className="ml-2 inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 focus:bg-red-700 active:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                                >
                                                    <Send className="w-4 h-4 mr-1" />
                                                    Invia
                                                </button>
                                            </div>
                                        </form>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-red-500">
                                        <Pizza className="w-16 h-16 mb-4 text-red-300" />
                                        <p className="text-lg">Seleziona una chat per visualizzare i messaggi</p>
                                        <p className="text-sm text-red-400 mt-2">Gestisci le conversazioni con gli utenti del tuo bot</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}