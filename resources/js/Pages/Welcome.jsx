import React from 'react';
import { Pizza, Send, LogIn, UserPlus } from 'lucide-react';

export default function TelegramPizzaBotAdminDashboard({ auth }) {
    const route = (routeName) => {
        switch(routeName) {
            case 'dashboard': return '/dashboard';
            case 'login': return '/login';
            case 'register': return '/register';
            default: return '/dashboard';
        }
    };

    return (
        <div className="bg-red-50 text-red-900 min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className="flex items-center justify-center mb-6">
                        <Pizza className="text-red-600 w-16 h-16 mr-4" />
                        <h1 className="text-3xl font-bold text-red-800">HomePizza Admin</h1>
                    </div>

                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-semibold text-red-900 mb-4">
                            Dashboard di Amministrazione
                        </h2>
                        <p className="text-red-700 mb-6">
                            Gestisci le funzionalità, monitora l'utilizzo e configura le impostazioni del tuo bot Telegram per pizze.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {auth && auth.user ? (
                            <a
                                href={route('dashboard')}
                                className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center"
                            >
                                <Send className="mr-2 w-5 h-5" /> Accedi alla Dashboard
                            </a>
                        ) : (
                            <div className="flex space-x-4">
                                <a
                                    href={route('login')}
                                    className="flex-1 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center"
                                >
                                    <LogIn className="mr-2 w-5 h-5" /> Admin Login
                                </a>
                                <a
                                    href={route('register')}
                                    className="flex-1 bg-red-50 text-red-700 py-3 rounded-lg hover:bg-red-100 transition-colors border border-red-300 flex items-center justify-center"
                                >
                                    <UserPlus className="mr-2 w-5 h-5" /> Nuovo Admin
                                </a>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 text-center">
                        <div className="space-y-4">
                            <div className="bg-red-50 rounded-lg p-4 flex items-center">
                                <Send className="text-red-500 w-8 h-8 mr-4" />
                                <div>
                                    <h3 className="font-semibold text-red-900">Gestione Utenti</h3>
                                    <p className="text-red-700 text-sm">
                                        Monitora e gestisci gli utenti del bot
                                    </p>
                                </div>
                            </div>

                            <div className="bg-red-50 rounded-lg p-4 flex items-center">
                                <Pizza className="text-red-500 w-8 h-8 mr-4" />
                                <div>
                                    <h3 className="font-semibold text-red-900">Configurazione Ricette</h3>
                                    <p className="text-red-700 text-sm">
                                        Aggiorna e personalizza le ricette disponibili
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}