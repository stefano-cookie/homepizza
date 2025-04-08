<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TelegramController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    // Log per debug
    \Log::info('Accesso a dashboard', [
        'auth_check' => Auth::check(),
        'user_id' => Auth::id() ?? 'non autenticato',
        'session_id' => session()->getId()
    ]);

    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Route per Telegram
    Route::get('/telegram/chats', [TelegramController::class, 'getChats'])->name('telegram.chats');
    Route::get('/telegram/chats/{chatId}/messages', [TelegramController::class, 'getMessages'])->name('telegram.messages');
    Route::post('/telegram/send-message', [TelegramController::class, 'sendMessage'])->name('telegram.send');
    Route::get('/telegram/test-connection', [TelegramController::class, 'testConnection'])->name('telegram.test');

    // Route per testare il broadcasting
    Route::get('/telegram/test-broadcast', [TelegramController::class, 'testBroadcast'])->name('telegram.test-broadcast');
});

Route::get('/test-telegram-insert', function() {
    try {
        // Trova una chat esistente (o creane una nuova)
        $chat = \App\Models\TelegramChat::first();
        if (!$chat) {
            $chat = \App\Models\TelegramChat::create([
                'chat_id' => time(),
                'first_name' => 'Test',
                'type' => 'private'
            ]);
        }

        // Crea un messaggio esplicitamente invece di usare create()
        $message = new \App\Models\TelegramMessage();
        $message->message_id = time();  // Assicurati che sia un intero
        $message->telegram_chat_id = $chat->id;
        $message->text = 'Test messaggio ' . date('H:i:s');
        $message->direction = 'incoming';
        $message->sent_at = now();
        $message->save();

        // Tenta di trasmettere l'evento
        event(new \App\Events\NewTelegramMessage($message));

        return "Messaggio inserito con successo. ID: " . $message->id;
    } catch (\Exception $e) {
        return "ERRORE: " . $e->getMessage() . "<br><pre>" . $e->getTraceAsString() . "</pre>";
    }
});

require __DIR__.'/auth.php';