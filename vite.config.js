import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            refresh: true,
        }),
        react(),
    ],
    define: {
        // Esponendo le variabili come variabili globali in JavaScript
        '__PUSHER_APP_KEY__': JSON.stringify(process.env.PUSHER_APP_KEY || ''),
        '__PUSHER_APP_CLUSTER__': JSON.stringify(process.env.PUSHER_APP_CLUSTER || ''),
    },
});