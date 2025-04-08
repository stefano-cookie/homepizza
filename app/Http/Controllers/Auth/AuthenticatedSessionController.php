<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        try {
            \Log::info('Tentativo di login web', [
                'email' => $request->input('email'),
                'ip' => $request->ip(),
                'remember' => $request->boolean('remember')
            ]);

            $request->authenticate();
            $request->session()->regenerate();

            \Log::info('Login web riuscito', [
                'user_id' => Auth::id(),
                'email' => Auth::user()->email,
                'session_id' => session()->getId()
            ]);

            return redirect()->intended(route('dashboard'));

        } catch (\Exception $e) {
            \Log::error('Errore durante il login web', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            throw $e;
        }
    }

    /**
     * Handle an API authentication request.
     */
    public function apiLogin(Request $request)
    {
        try {
            // Log dettagliato dell'input
            \Log::info('API Login Attempt', [
                'email' => $request->input('email'),
                'ip' => $request->ip()
            ]);

            // Validazione manuale più esplicita
            $credentials = $request->validate([
                'email' => ['required', 'email'],
                'password' => ['required'],
            ]);

            // Tentativo di autenticazione con log dettagliato
            if (!Auth::attempt($credentials, true)) {
                \Log::warning('API Login Failed', [
                    'email' => $credentials['email'],
                    'reason' => 'Invalid credentials'
                ]);

                return response()->json([
                    'message' => 'Credenziali non valide',
                    'errors' => [
                        'email' => 'Email o password non corrette'
                    ]
                ], 401);
            }

            // Utente autenticato
            $user = Auth::user();

            // Revoca token esistenti
            $user->tokens()->where('name', 'api-token')->delete();

            // Crea nuovo token
            $token = $user->createToken('api-token')->plainTextToken;

            \Log::info('API Login Successful', [
                'user_id' => $user->id,
                'email' => $user->email
            ]);

            return response()->json([
                'user' => $user,
                'token' => $token,
                'message' => 'Login effettuato con successo'
            ]);

        } catch (\Exception $e) {
            // Log dell'eccezione
            \Log::error('API Login Exception', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Errore interno del server',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}