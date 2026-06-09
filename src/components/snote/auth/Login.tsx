'use client';

import { useState } from 'react';
import {
    AlertCircle,
    ArrowLeft,
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
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
        return 'Cannot reach the auth server from this browser. Backend CORS may need to allow this frontend origin.';
    }

    return error;
}

export function Login() {
    const router = useRouter();
    const login = useAuthStore((state) => state.login);
    const authError = useAuthStore((state) => state.authError);
    const isSubmitting = useAuthStore((state) => state.isSubmitting);
    const clearAuthError = useAuthStore((state) => state.clearAuthError);
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
            await login(email, password);
            router.push(getNextPathFromLocation());
        } catch (error) {
            setSubmitError(
                error instanceof Error
                    ? error.message
                    : 'Unable to sign in. Please check your credentials.',
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
                        Back to Snote
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
                            Sign in to your transcript workspace.
                        </h1>
                        <p className="text-muted-foreground mt-5 text-base leading-8">
                            Review meeting audio, search speaker transcripts,
                            and ask AI questions over project context from one
                            focused dashboard.
                        </p>
                    </div>

                    <div className="mt-10 grid max-w-xl gap-3">
                        {[
                            'Upload audio and keep files organized by project.',
                            'Review timestamped speaker turns without clutter.',
                            'Ask AI about decisions, risks, and follow-ups.',
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
                            Back to Snote
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
                                    Welcome back
                                </h2>
                                <p className="text-muted-foreground mt-2 text-sm leading-6">
                                    Use your Snote account to continue.
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
                                        Password
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
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(event) =>
                                                setPassword(event.target.value)
                                            }
                                            required
                                            disabled={isSubmitting}
                                            className="h-11 pr-11 pl-10"
                                        />
                                        <button
                                            type="button"
                                            aria-label={
                                                showPassword
                                                    ? 'Hide password'
                                                    : 'Show password'
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
                                    {isSubmitting ? 'Signing in...' : 'Sign in'}
                                </Button>
                            </form>

                            <p className="text-muted-foreground mt-6 text-center text-sm">
                                New to Snote?{' '}
                                <Link
                                    href="/register"
                                    className="text-primary font-medium hover:underline"
                                >
                                    Create an account
                                </Link>
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
