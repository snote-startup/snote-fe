'use client';

import { useRouter } from 'next/navigation';
import { useApp } from '@/providers/snote-app-provider';
import { Users, User } from 'lucide-react';

export function RoleSelection() {
    const router = useRouter();
    const { setUserRole, isAuthenticated } = useApp();

    const handleRoleSelect = (role: 'admin' | 'user') => {
        setUserRole(role);
        if (isAuthenticated) {
            router.push(role === 'admin' ? '/admin' : '/dashboard');
        } else {
            router.push('/login');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#490aad] to-[#a171ff] p-4">
            <div className="w-full max-w-4xl">
                {/* Header */}
                <div className="mb-12 text-center">
                    <h1 className="mb-4 text-5xl font-bold text-white">
                        SNOTE
                    </h1>
                    <p className="text-xl text-white/90">
                        AI-Powered Meeting Assistant
                    </p>
                    <p className="mt-2 text-white/70">
                        Select your role to continue
                    </p>
                </div>

                {/* Role Cards */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* User Role Card */}
                    <button
                        onClick={() => handleRoleSelect('user')}
                        className="group rounded-2xl bg-white p-8 text-left transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                    >
                        <div className="flex flex-col items-center text-center">
                            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#490aad] to-[#a171ff] transition-transform group-hover:scale-110">
                                <User className="h-10 w-10 text-white" />
                            </div>
                            <h2 className="mb-3 text-2xl font-bold text-gray-900">
                                User
                            </h2>
                            <p className="mb-6 text-gray-600">
                                Access your meetings, transcripts, tasks, and
                                AI-powered assistance
                            </p>
                            <ul className="w-full space-y-2 text-left">
                                <li className="flex items-center text-gray-700">
                                    <div className="mr-3 h-1.5 w-1.5 rounded-full bg-[#490aad]"></div>
                                    Live meeting assistance
                                </li>
                                <li className="flex items-center text-gray-700">
                                    <div className="mr-3 h-1.5 w-1.5 rounded-full bg-[#490aad]"></div>
                                    Meeting transcripts & translations
                                </li>
                                <li className="flex items-center text-gray-700">
                                    <div className="mr-3 h-1.5 w-1.5 rounded-full bg-[#490aad]"></div>
                                    Task management
                                </li>
                                <li className="flex items-center text-gray-700">
                                    <div className="mr-3 h-1.5 w-1.5 rounded-full bg-[#490aad]"></div>
                                    Calendar integration
                                </li>
                            </ul>
                        </div>
                    </button>

                    {/* Admin Role Card */}
                    <button
                        onClick={() => handleRoleSelect('admin')}
                        className="group rounded-2xl bg-white p-8 text-left transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                    >
                        <div className="flex flex-col items-center text-center">
                            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#490aad] to-[#a171ff] transition-transform group-hover:scale-110">
                                <Users className="h-10 w-10 text-white" />
                            </div>
                            <h2 className="mb-3 text-2xl font-bold text-gray-900">
                                Admin
                            </h2>
                            <p className="mb-6 text-gray-600">
                                Manage users, view analytics, and configure
                                system settings
                            </p>
                            <ul className="w-full space-y-2 text-left">
                                <li className="flex items-center text-gray-700">
                                    <div className="mr-3 h-1.5 w-1.5 rounded-full bg-[#490aad]"></div>
                                    User management
                                </li>
                                <li className="flex items-center text-gray-700">
                                    <div className="mr-3 h-1.5 w-1.5 rounded-full bg-[#490aad]"></div>
                                    System analytics
                                </li>
                                <li className="flex items-center text-gray-700">
                                    <div className="mr-3 h-1.5 w-1.5 rounded-full bg-[#490aad]"></div>
                                    Meeting overview
                                </li>
                                <li className="flex items-center text-gray-700">
                                    <div className="mr-3 h-1.5 w-1.5 rounded-full bg-[#490aad]"></div>
                                    System configuration
                                </li>
                            </ul>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
