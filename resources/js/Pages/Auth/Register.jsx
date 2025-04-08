import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { Pizza, UserPlus } from 'lucide-react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="bg-red-50 text-red-900 min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className="flex items-center justify-center mb-6">
                        <Pizza className="text-red-600 w-16 h-16 mr-4" />
                        <h1 className="text-3xl font-bold text-red-800">HomePizza</h1>
                    </div>

                    <Head title="Registrati" />

                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-semibold text-red-900 mb-4">
                            Crea il tuo Account
                        </h2>
                        <p className="text-red-700 mb-6">
                            Unisciti a HomePizza e inizia a cucinare pizze straordinarie!
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <InputLabel htmlFor="name" value="Nome" />
                            <TextInput
                                id="name"
                                name="name"
                                value={data.name}
                                className="mt-1 block w-full border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500"
                                autoComplete="name"
                                isFocused={true}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            <InputError message={errors.name} className="mt-2 text-red-600" />
                        </div>

                        <div>
                            <InputLabel htmlFor="email" value="Email" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500"
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                            <InputError message={errors.email} className="mt-2 text-red-600" />
                        </div>

                        <div>
                            <InputLabel htmlFor="password" value="Password" />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500"
                                autoComplete="new-password"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                            <InputError message={errors.password} className="mt-2 text-red-600" />
                        </div>

                        <div>
                            <InputLabel htmlFor="password_confirmation" value="Conferma Password" />
                            <TextInput
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="mt-1 block w-full border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500"
                                autoComplete="new-password"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                            />
                            <InputError
                                message={errors.password_confirmation}
                                className="mt-2 text-red-600"
                            />
                        </div>

                        <div className="flex items-center justify-between mt-4">
                            <Link
                                href={route('login')}
                                className="text-red-600 hover:text-red-800 text-sm underline"
                            >
                                Già registrato?
                            </Link>

                            <PrimaryButton
                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center"
                                disabled={processing}
                            >
                                <UserPlus className="mr-2 w-5 h-5" /> Registrati
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}