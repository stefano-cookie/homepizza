import React, { useState } from 'react';
import { useForm, Head, Link } from '@inertiajs/react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Pizza } from 'lucide-react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: true,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="bg-red-50 text-red-900 min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                    <Head title="Log in" />

                    <div className="flex items-center justify-center mb-6">
                        <Pizza className="text-red-600 w-16 h-16 mr-4" />
                        <h1 className="text-3xl font-bold text-red-800">HomePizza</h1>
                    </div>

                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-semibold text-red-900 mb-4">
                            Accedi al tuo Account
                        </h2>
                        <p className="text-red-700 mb-6">
                            Bentornato su HomePizza! Inserisci le tue credenziali.
                        </p>
                    </div>

                    {status && (
                        <div className="mb-4 text-sm font-medium text-green-600">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit}>
                        <div>
                            <InputLabel htmlFor="email" value="Email" className="text-red-700" />

                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) => setData('email', e.target.value)}
                            />

                            <InputError message={errors.email} className="mt-2 text-red-600" />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="password" value="Password" className="text-red-700" />

                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                            />

                            <InputError message={errors.password} className="mt-2 text-red-600" />
                        </div>

                        <div className="mt-4 block">
                            <label className="flex items-center">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData('remember', e.target.checked)
                                    }
                                    className="text-red-600 focus:ring-red-500 border-red-300"
                                />
                                <span className="ms-2 text-sm text-red-700">
                                    Ricordami
                                </span>
                            </label>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-red-600 hover:text-red-800 text-sm underline"
                                >
                                    Password dimenticata?
                                </Link>
                            )}

                            <PrimaryButton
                                className="bg-red-500 text-white hover:bg-red-600 transition-colors"
                                disabled={processing}
                            >
                                Accedi
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}