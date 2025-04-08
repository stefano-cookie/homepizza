<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerifyTelegramWebhook
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Verifica base del webhook Telegram
        // Puoi aggiungere qui ulteriori controlli di sicurezza

        // Controllo del token
        $telegramBotToken = config('services.telegram.bot_token');

        // Esempio di verifica base
        if (!$request->has('bot_token') || $request->input('bot_token') !== $telegramBotToken) {
            return response()->json([
                'error' => 'Unauthorized Telegram webhook'
            ], 403);
        }

        return $next($request);
    }
}