<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\TelegramChat;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Canale per i messaggi di chat
Broadcast::channel('chat.{chatId}', function ($user, $chatId) {
    // Verifica se l'utente è autorizzato ad accedere a questa chat
    // Nell'implementazione attuale, tutti gli utenti autenticati possono
    // accedere a tutte le chat, ma puoi modificare questa logica se necessario
    return auth()->check();
});