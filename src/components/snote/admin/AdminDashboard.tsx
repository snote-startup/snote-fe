'use client';

import { useRouter } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useApp } from '@/providers/snote-app-provider';

export function AdminDashboard() {
    const router = useRouter();
    const { isAdmin } = useApp();

    if (!isAdmin) {
        return (
            <div className="bg-background flex min-h-screen items-center justify-center p-6">
                <div className="border-border bg-card w-full max-w-md rounded-xl border p-8 text-center">
                    <div className="bg-muted mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl">
                        <ShieldCheck className="text-muted-foreground h-7 w-7" />
                    </div>
                    <h1 className="text-foreground text-2xl font-semibold">
                        Cần quyền quản trị
                    </h1>
                    <p className="text-muted-foreground mt-2 text-sm">
                        Tài khoản hiện tại không có quyền truy cập trang quản
                        trị.
                    </p>
                    <Button
                        className="mt-6"
                        onClick={() => router.push('/dashboard')}
                    >
                        Quay lại tổng quan
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <main className="mx-auto max-w-4xl p-8">
            <div className="mb-8">
                <h1 className="text-foreground mb-2 text-3xl font-semibold">
                    Quản trị
                </h1>
                <p className="text-muted-foreground">
                    Trang quản trị sẽ được mở sau khi backend cung cấp API thống
                    kê và quản lý người dùng.
                </p>
            </div>

            <div className="border-border bg-card rounded-xl border p-6">
                <div className="mb-4 flex items-start gap-4">
                    <div className="bg-primary/10 text-primary flex h-11 w-11 items-center justify-center rounded-xl">
                        <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-foreground mb-1 text-lg font-semibold">
                            Chưa hiển thị dữ liệu giả
                        </h2>
                        <p className="text-muted-foreground">
                            Các số liệu người dùng, doanh thu và trạng thái hệ
                            thống cần lấy từ backend thật. Giao diện này tạm
                            thời không hiển thị dữ liệu giả.
                        </p>
                    </div>
                </div>
                <Button onClick={() => router.push('/dashboard')}>
                    Về ứng dụng người dùng
                </Button>
            </div>
        </main>
    );
}
