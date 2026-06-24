'use client';

import { useState } from 'react';
import {
    AlertCircle,
    ArrowLeft,
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    UserRound,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ThemeToggle } from '@/components/snote/ThemeToggle';
import { useAuthStore } from '@/stores/use-auth-store';

function getSafeNextPath(nextPath: string | null) {
    if (!nextPath || !nextPath.startsWith('/') || nextPath.startsWith('//')) {
        return '/dashboard';
    }

    if (nextPath === '/login' || nextPath === '/register') {
        return '/dashboard';
    }

    return nextPath;
}

function getNextPathFromLocation() {
    if (typeof window === 'undefined') {
        return '/dashboard';
    }

    return getSafeNextPath(
        new URLSearchParams(window.location.search).get('next'),
    );
}

function getDisplayError(error: string | null) {
    if (!error) {
        return null;
    }

    const normalized = error.toLowerCase();

    if (
        normalized.includes('network error') ||
        normalized.includes('failed to fetch') ||
        normalized.includes('cors')
    ) {
        return 'Trình duyệt không kết nối được tới máy chủ xác thực. Backend có thể cần cho phép origin của frontend này.';
    }

    return error;
}

export function Signup() {
    const router = useRouter();
    const register = useAuthStore((state) => state.register);
    const authError = useAuthStore((state) => state.authError);
    const isSubmitting = useAuthStore((state) => state.isSubmitting);
    const clearAuthError = useAuthStore((state) => state.clearAuthError);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const displayError = getDisplayError(submitError ?? authError);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setSubmitError(null);
        clearAuthError();

        try {
            await register(name, email, password);
            router.push(getNextPathFromLocation());
        } catch (error) {
            setSubmitError(
                error instanceof Error
                    ? error.message
                    : 'Không thể tạo tài khoản. Vui lòng thử lại.',
            );
        }
    };

    return (
        <main className="bg-background text-foreground min-h-screen">
            {/* Subtle gradient */}
            <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_10%,color-mix(in_oklab,var(--brand-primary)_8%,transparent),transparent_32%),radial-gradient(circle_at_80%_20%,color-mix(in_oklab,var(--brand-blue)_5%,transparent),transparent_26%)]" />

            {/* Theme toggle — top right */}
            <div className="absolute top-4 right-4 z-50">
                <ThemeToggle variant="ghost" />
            </div>

            <div className="relative mx-auto grid min-h-screen w-full max-w-7xl px-6 py-6 lg:grid-cols-2 lg:items-center lg:gap-16">
                {/* Left column — marketing copy (desktop only) */}
                <section className="hidden lg:block">
                    <Link
                        href="/"
                        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Quay lại Snote
                    </Link>

                    <div className="mt-20 max-w-xl">
                        <Image
                            src="/snote-logo.png"
                            alt="SNOTE"
                            width={132}
                            height={38}
                            priority
                            className="h-auto w-[132px]"
                        />
                        <h1 className="mt-10 text-4xl leading-tight font-semibold tracking-normal xl:text-5xl">
                            Tạo workspace để xem lại transcript.
                        </h1>
                        <p className="text-muted-foreground mt-5 text-base leading-8">
                            Bắt đầu với quy trình rõ ràng: tải audio lên, xem
                            transcript theo người nói và hỏi AI trên nội dung
                            cuộc họp.
                        </p>
                    </div>

                    <div className="mt-10 grid max-w-xl gap-3">
                        {[
                            'Một tài khoản cho dự án, audio và transcript.',
                            'Giao diện tập trung cho việc theo dõi sau họp.',
                            'Quyền quản trị chỉ hiển thị với tài khoản admin.',
                        ].map((item) => (
                            <div
                                key={item}
                                className="border-border bg-muted/30 text-muted-foreground flex items-start gap-3 rounded-xl border p-4 text-sm"
                            >
                                <span className="bg-primary mt-1 h-2 w-2 shrink-0 rounded-full" />
                                {item}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Right column — form */}
                <section className="flex min-h-[calc(100vh-3rem)] items-center justify-center py-10">
                    <div className="w-full max-w-md">
                        <Link
                            href="/"
                            className="text-muted-foreground hover:text-foreground mb-8 inline-flex items-center gap-2 text-sm transition-colors lg:hidden"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Quay lại Snote
                        </Link>

                        <div className="border-border bg-card/80 rounded-2xl border p-6 shadow-xl backdrop-blur sm:p-8">
                            <div className="mb-8">
                                <Image
                                    src="/snote-logo.png"
                                    alt="SNOTE"
                                    width={128}
                                    height={37}
                                    priority
                                    className="h-auto w-[128px] lg:hidden"
                                />
                                <h2 className="mt-8 text-2xl font-semibold lg:mt-0">
                                    Tạo tài khoản
                                </h2>
                                <p className="text-muted-foreground mt-2 text-sm leading-6">
                                    Nhập thông tin cơ bản để bắt đầu dùng Snote.
                                </p>
                            </div>

                            {displayError && (
                                <div className="border-destructive/20 bg-destructive/10 text-destructive mb-5 flex gap-3 rounded-xl border p-3 text-sm leading-6">
                                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                                    <p>{displayError}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="name"
                                        className="text-foreground text-sm"
                                    >
                                        Họ và tên
                                    </Label>
                                    <div className="relative">
                                        <UserRound className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                        <Input
                                            id="name"
                                            type="text"
                                            placeholder="Tên của bạn"
                                            value={name}
                                            onChange={(event) =>
                                                setName(event.target.value)
                                            }
                                            required
                                            disabled={isSubmitting}
                                            className="h-11 pl-10"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="email"
                                        className="text-foreground text-sm"
                                    >
                                        Email
                                    </Label>
                                    <div className="relative">
                                        <Mail className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="you@example.com"
                                            value={email}
                                            onChange={(event) =>
                                                setEmail(event.target.value)
                                            }
                                            required
                                            disabled={isSubmitting}
                                            className="h-11 pl-10"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="password"
                                        className="text-foreground text-sm"
                                    >
                                        Mật khẩu
                                    </Label>
                                    <div className="relative">
                                        <LockKeyhole className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                        <Input
                                            id="password"
                                            type={
                                                showPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            placeholder="Tối thiểu 8 ký tự"
                                            value={password}
                                            onChange={(event) =>
                                                setPassword(event.target.value)
                                            }
                                            required
                                            minLength={8}
                                            disabled={isSubmitting}
                                            className="h-11 pr-11 pl-10"
                                        />
                                        <button
                                            type="button"
                                            aria-label={
                                                showPassword
                                                    ? 'Ẩn mật khẩu'
                                                    : 'Hiện mật khẩu'
                                            }
                                            onClick={() =>
                                                setShowPassword(
                                                    (value) => !value,
                                                )
                                            }
                                            disabled={isSubmitting}
                                            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    size="lg"
                                    disabled={isSubmitting}
                                    className="h-11 w-full"
                                >
                                    {isSubmitting
                                        ? 'Đang tạo tài khoản...'
                                        : 'Tạo tài khoản'}
                                </Button>
                            </form>

                            <p className="text-muted-foreground mt-6 text-center text-sm">
                                Đã có tài khoản?{' '}
                                <Link
                                    href="/login"
                                    className="text-primary font-medium hover:underline"
                                >
                                    Đăng nhập
                                </Link>
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
