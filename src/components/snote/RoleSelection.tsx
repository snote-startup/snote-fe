'use client';

import { useRouter } from 'next/navigation';
import { useApp } from '@/providers/snote-app-provider';
import { User, Users } from 'lucide-react';

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
                <div className="mb-12 text-center">
                    <h1 className="mb-4 text-5xl font-bold text-white">
                        SNOTE
                    </h1>
                    <p className="text-xl text-white/90">
                        Trợ lý transcript cuộc họp
                    </p>
                    <p className="mt-2 text-white/70">
                        Chọn vai trò để tiếp tục
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <button
                        onClick={() => handleRoleSelect('user')}
                        className="group rounded-2xl bg-white p-8 text-left transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                    >
                        <div className="flex flex-col items-center text-center">
                            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#490aad] to-[#a171ff] transition-transform group-hover:scale-110">
                                <User className="h-10 w-10 text-white" />
                            </div>
                            <h2 className="mb-3 text-2xl font-bold text-gray-900">
                                Người dùng
                            </h2>
                            <p className="mb-6 text-gray-600">
                                Quản lý cuộc họp, transcript, công việc và hỏi
                                đáp với trợ lý AI.
                            </p>
                            <ul className="w-full space-y-2 text-left">
                                {[
                                    'Dự án và audio đã tải lên',
                                    'Transcript theo từng cuộc họp',
                                    'Công việc từ transcript',
                                    'Trợ lý AI có nguồn tham chiếu',
                                ].map((item) => (
                                    <li
                                        key={item}
                                        className="flex items-center text-gray-700"
                                    >
                                        <div className="mr-3 h-1.5 w-1.5 rounded-full bg-[#490aad]" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </button>

                    <button
                        onClick={() => handleRoleSelect('admin')}
                        className="group rounded-2xl bg-white p-8 text-left transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                    >
                        <div className="flex flex-col items-center text-center">
                            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#490aad] to-[#a171ff] transition-transform group-hover:scale-110">
                                <Users className="h-10 w-10 text-white" />
                            </div>
                            <h2 className="mb-3 text-2xl font-bold text-gray-900">
                                Quản trị
                            </h2>
                            <p className="mb-6 text-gray-600">
                                Truy cập khu vực quản trị khi tài khoản có quyền
                                admin.
                            </p>
                            <ul className="w-full space-y-2 text-left">
                                {[
                                    'Điều hướng theo vai trò',
                                    'Trang quản trị chờ API thật',
                                    'Chờ API thống kê thật',
                                    'Không dùng số sử dụng giả',
                                ].map((item) => (
                                    <li
                                        key={item}
                                        className="flex items-center text-gray-700"
                                    >
                                        <div className="mr-3 h-1.5 w-1.5 rounded-full bg-[#490aad]" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
