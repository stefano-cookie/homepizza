<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TelegramController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Webhook pubblico per Telegram (non richiede autenticazione)
Route::post('telegram/webhook', [TelegramController::class, 'handleWebhook'])->withoutMiddleware(['throttle:api']);

// Se hai bisogno di altri endpoint API, puoi aggiungerli qui
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});