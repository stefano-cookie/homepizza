// In resources/js/bootstrap.js
import axios from 'axios';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Configura axios
axios.defaults.withCredentials = true;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios = axios;

// Funzione per ottenere il cookie CSRF
const getCsrfCookie = async () => {
    try {
        await axios.get('/sanctum/csrf-cookie');
    } catch (error) {
        console.error('Errore nell\'ottenere il cookie CSRF:', error);
    }
};

// Ottieni il token CSRF per l'autenticazione
const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

// Attiva il logging di debug per Pusher (solo in sviluppo)
Pusher.logToConsole = true;

// Configura Echo per WebSockets con valori diretti
window.Pusher = Pusher;
window.Echo = new Echo({
    broadcaster: 'pusher',
    key: '6687d86c0a8dd6243716',
    cluster: 'eu',
    wsHost: `ws-eu.pusher.com`,
    wsPort: 80,
    wssPort: 443,
    forceTLS: true,
    enabledTransports: ['ws', 'wss'],
    authEndpoint: '/broadcasting/auth',
    auth: {
        headers: {
            'X-CSRF-TOKEN': csrfToken
        }
    }
});

// Esegui la funzione per ottenere il cookie CSRF
getCsrfCookie();