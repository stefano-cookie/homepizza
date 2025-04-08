<?php

namespace App\Http\Controllers;

use App\Models\TelegramChat;
use App\Models\TelegramMessage;
use Illuminate\Http\Request;
use Telegram\Bot\Laravel\Facades\Telegram;
use Carbon\Carbon;
use App\Events\NewTelegramMessage;
use Illuminate\Support\Facades\Log;

class TelegramController extends Controller
{
    /**
     * Gestisce il webhook di Telegram.
     */
    public function handleWebhook(Request $request)
    {
        try {
            Log::info('Webhook Telegram ricevuto', ['data' => $request->all()]);

            $update = $request->all();

            if (isset($update['message'])) {
                $message = $update['message'];
                $chatId = $message['chat']['id'];

                // Salva o aggiorna la chat
                $chat = TelegramChat::updateOrCreate(
                    ['chat_id' => $chatId],
                    [
                        'username' => $message['chat']['username'] ?? null,
                        'first_name' => $message['chat']['first_name'] ?? null,
                        'last_name' => $message['chat']['last_name'] ?? null,
                        'type' => $message['chat']['type'],
                    ]
                );

                // Determina il tipo di messaggio e imposta il testo appropriato
                $text = null;
                if (isset($message['text'])) {
                    $text = $message['text'];
                } elseif (isset($message['photo'])) {
                    $text = '[Foto]';
                } elseif (isset($message['document'])) {
                    $text = '[Documento]';
                } elseif (isset($message['voice'])) {
                    $text = '[Messaggio vocale]';
                } elseif (isset($message['sticker'])) {
                    $text = '[Sticker]';
                } else {
                    $text = '[Altro tipo di messaggio]';
                }

                // Salva il messaggio utilizzando l'istanziazione diretta
                $telegramMessage = new TelegramMessage();
                $telegramMessage->message_id = $message['message_id'];
                $telegramMessage->telegram_chat_id = $chat->id;
                $telegramMessage->text = $text;
                $telegramMessage->direction = 'incoming';
                $telegramMessage->sent_at = Carbon::createFromTimestamp($message['date']);
                $telegramMessage->save();

                // Trasmette l'evento per il nuovo messaggio
                try {
                    Log::info('Tentativo di trasmettere l\'evento NewTelegramMessage', [
                        'chat_id' => $chat->id,
                        'message_id' => $telegramMessage->id
                    ]);

                    broadcast(new NewTelegramMessage($telegramMessage));

                    Log::info('Evento trasmesso con successo');
                } catch (\Exception $broadcastError) {
                    Log::error('Errore durante la trasmissione dell\'evento', [
                        'error' => $broadcastError->getMessage(),
                        'trace' => $broadcastError->getTraceAsString()
                    ]);
                }

                Log::info('Messaggio salvato con successo', [
                    'message_id' => $telegramMessage->message_id,
                    'db_id' => $telegramMessage->id
                ]);
            }

            return response()->json(['status' => 'success']);
        } catch (\Exception $e) {
            Log::error('Errore nel webhook Telegram', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'data' => $request->all()
            ]);

            // È importante restituire 200 anche in caso di errore
            // per evitare che Telegram continui a riprovare
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 200);
        }
    }

    /**
     * Invia un messaggio tramite Telegram.
     */
    public function sendMessage(Request $request)
    {
        $request->validate([
            'chat_id' => 'required',
            'text' => 'required|string',
        ]);

        try {
            $chat = TelegramChat::where('chat_id', $request->chat_id)->firstOrFail();

            // Invia il messaggio tramite Telegram
            $response = Telegram::sendMessage([
                'chat_id' => $request->chat_id,
                'text' => $request->text,
            ]);

            Log::info('Risposta di Telegram', [
                'response' => $response,
                'response_type' => gettype($response)
            ]);

            // Estrae l'ID del messaggio in modo sicuro
            $messageId = null;
            if (method_exists($response, 'getMessageId')) {
                $messageId = $response->getMessageId();
            } elseif (is_object($response) && isset($response->message_id)) {
                $messageId = $response->message_id;
            } elseif (is_array($response) && isset($response['message_id'])) {
                $messageId = $response['message_id'];
            }

            if (!$messageId) {
                $messageId = time() . rand(1000, 9999);
            }

            // Salva il messaggio nel database con istanziazione diretta
            $message = new TelegramMessage();
            $message->message_id = $messageId;
            $message->telegram_chat_id = $chat->id;
            $message->text = $request->text;
            $message->direction = 'outgoing';
            $message->sent_at = now();
            $message->save();

            Log::info('Messaggio salvato nel database', [
                'message_id' => $messageId,
                'db_message_id' => $message->id
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Messaggio inviato con successo.',
                'saved_message' => $message
            ]);
        } catch (\Exception $e) {
            Log::error('Errore nell\'invio del messaggio', [
                'chat_id' => $request->chat_id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Restituisce la lista delle chat.
     */
    public function getChats()
    {
        try {
            $chats = TelegramChat::withCount('messages')->get();
            return response()->json($chats);
        } catch (\Exception $e) {
            Log::error('Errore durante il recupero delle chat', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Restituisce i messaggi di una chat specifica.
     */
    public function getMessages($chatId)
    {
        try {
            $chat = TelegramChat::where('chat_id', $chatId)->firstOrFail();
            $messages = $chat->messages()->orderBy('sent_at', 'asc')->get();

            return response()->json($messages);
        } catch (\Exception $e) {
            Log::error('Errore durante il recupero dei messaggi', [
                'chat_id' => $chatId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Testa la connessione con l'API di Telegram.
     */
    public function testConnection()
    {
        try {
            $response = Telegram::getMe();
            return response()->json([
                'status' => 'success',
                'bot_info' => $response
            ]);
        } catch (\Exception $e) {
            Log::error('Errore durante il test di connessione con Telegram', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Testa il broadcasting.
     */
    public function testBroadcast(Request $request)
    {
        try {
            $chat = TelegramChat::first();

            if (!$chat) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Nessuna chat trovata per il test'
                ], 404);
            }

            // Crea un messaggio fittizio per il test
            $message = new TelegramMessage();
            $message->message_id = time();
            $message->telegram_chat_id = $chat->id;
            $message->text = 'Messaggio di test del broadcast ' . date('H:i:s');
            $message->direction = 'incoming';
            $message->sent_at = now();
            $message->save();

            // Tenta di trasmettere l'evento
            broadcast(new NewTelegramMessage($message));

            return response()->json([
                'status' => 'success',
                'message' => 'Evento di test trasmesso con successo',
                'chat_id' => $chat->id,
                'test_message' => $message
            ]);
        } catch (\Exception $e) {
            Log::error('Errore durante il test di broadcasting', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}