import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Pizza, ChevronDown, Menu, X, User, LogOut } from 'lucide-react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen bg-red-50">
            <nav className="border-b border-red-100 bg-white shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <div className="flex items-center">
                                        <Pizza className="h-9 w-9 text-red-600" />
                                        <span className="ml-2 font-bold text-red-800 text-xl">HomePizza</span>
                                    </div>
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                    className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none"
                                    activeClassName="border-red-500 text-red-900 focus:border-red-700"
                                    inactiveClassName="border-transparent text-red-700 hover:text-red-900 hover:border-red-300 focus:text-red-800 focus:border-red-300"
                                >
                                    Dashboard
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-red-200 bg-white px-3 py-2 text-sm font-medium leading-4 text-red-700 transition duration-150 ease-in-out hover:bg-red-50 hover:text-red-900 focus:outline-none"
                                            >
                                                <User className="w-4 h-4 mr-2" />
                                                {user.name}

                                                <ChevronDown className="w-4 h-4 ml-2" />
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route('profile.edit')}
                                            className="block w-full px-4 py-2 text-left text-sm leading-5 text-red-700 hover:bg-red-50 focus:bg-red-50 focus:outline-none transition duration-150 ease-in-out"
                                        >
                                            Profilo
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className="block w-full px-4 py-2 text-left text-sm leading-5 text-red-700 hover:bg-red-50 focus:bg-red-50 focus:outline-none transition duration-150 ease-in-out"
                                        >
                                            <div className="flex items-center">
                                                <LogOut className="w-4 h-4 mr-2" />
                                                Disconnetti
                                            </div>
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-red-500 transition duration-150 ease-in-out hover:bg-red-50 hover:text-red-700 focus:bg-red-50 focus:text-red-700 focus:outline-none"
                            >
                                {!showingNavigationDropdown ? (
                                    <Menu className="h-6 w-6" />
                                ) : (
                                    <X className="h-6 w-6" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' sm:hidden'
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route('dashboard')}
                            active={route().current('dashboard')}
                            className="block w-full pl-3 pr-4 py-2 border-l-4 text-left text-base font-medium transition duration-150 ease-in-out focus:outline-none"
                            activeClassName="border-red-500 text-red-800 bg-red-50 focus:text-red-900 focus:bg-red-100 focus:border-red-700"
                            inactiveClassName="border-transparent text-red-700 hover:text-red-900 hover:bg-red-50 hover:border-red-300 focus:text-red-900 focus:bg-red-50 focus:border-red-300"
                        >
                            Dashboard
                        </ResponsiveNavLink>
                    </div>

                    <div className="border-t border-red-200 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-red-900">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-red-600">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink
                                href={route('profile.edit')}
                                className="block w-full pl-3 pr-4 py-2 border-l-4 text-left text-base font-medium text-red-700 border-transparent hover:text-red-900 hover:bg-red-50 hover:border-red-300 transition duration-150 ease-in-out focus:outline-none focus:text-red-900 focus:bg-red-50 focus:border-red-300"
                            >
                                Profilo
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                                className="block w-full pl-3 pr-4 py-2 border-l-4 text-left text-base font-medium text-red-700 border-transparent hover:text-red-900 hover:bg-red-50 hover:border-red-300 transition duration-150 ease-in-out focus:outline-none focus:text-red-900 focus:bg-red-50 focus:border-red-300"
                            >
                                Disconnetti
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow-sm border-b border-red-100">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main className="py-4">{children}</main>
        </div>
    );
}