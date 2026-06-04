'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    LockKeyhole,
    Mail,
    ShieldCheck,
    Sparkles,
    UserRound,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApp } from '@/providers/snote-app-provider';

const onboardingMetrics = [
    { label: 'Free meeting quota', value: '5' },
    { label: 'Realtime languages', value: '24' },
    { label: 'Setup time', value: '2m' },
];

export function Signup() {
    const router = useRouter();
    const { roleProfile, signup } = useApp();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setSubmitError(null);
        setIsSubmitting(true);

        try {
            await signup(email, password, name);
            router.push('/dashboard');
        } catch (error) {
            setSubmitError(
                error instanceof Error
                    ? error.message
                    : 'Unable to create your account. Please try again.',
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="bg-background text-foreground relative isolate flex min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
            <motion.div
                aria-hidden="true"
                className="absolute inset-[-20%] -z-20 opacity-80 blur-3xl"
                style={{
                    background:
                        'radial-gradient(circle at 16% 18%, rgb(73 10 173 / 0.4), transparent 30%), radial-gradient(circle at 82% 16%, rgb(37 99 235 / 0.3), transparent 32%), radial-gradient(circle at 60% 78%, rgb(246 196 83 / 0.18), transparent 30%), linear-gradient(135deg, rgb(248 250 252), rgb(247 246 255) 45%, rgb(226 232 240))',
                    backgroundSize: '140% 140%',
                }}
                animate={{
                    backgroundPosition: [
                        '0% 0%',
                        '100% 38%',
                        '44% 100%',
                        '0% 0%',
                    ],
                    scale: [1, 1.04, 1.02, 1],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />
            <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(255_255_255_/_0.58),rgb(255_255_255_/_0.2)_42%,rgb(255_255_255_/_0.66))] dark:bg-[linear-gradient(180deg,rgb(9_9_11_/_0.3),rgb(9_9_11_/_0.72)_52%,rgb(9_9_11_/_0.9))]"
            />

            <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[minmax(0,1fr)_460px]">
                <section className="hidden lg:block">
                    <Link
                        href="/"
                        className="border-border bg-glass text-muted-foreground hover:text-foreground inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium backdrop-blur-xl transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to SNOTE
                    </Link>

                    <motion.div
                        className="mt-16 max-w-2xl"
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="border-purple-light bg-glass text-purple-primary mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium backdrop-blur">
                            <Sparkles className="h-4 w-4" />
                            Start in the meeting command center
                        </div>
                        <h1 className="text-foreground max-w-3xl text-5xl leading-[1.02] font-semibold tracking-normal xl:text-6xl">
                            Create a workspace that keeps every meeting usable.
                        </h1>
                        <p className="text-muted-foreground mt-6 max-w-xl text-lg leading-8">
                            Start with Free limits, upgrade to Pro when the team
                            needs unlimited meetings, and verify every state
                            from the in-app switcher.
                        </p>
                    </motion.div>

                    <div className="mt-12 grid max-w-2xl grid-cols-3 gap-3">
                        {onboardingMetrics.map((metric) => (
                            <div
                                key={metric.label}
                                className="glass-card rounded-2xl p-4"
                            >
                                <p className="text-foreground text-2xl font-semibold">
                                    {metric.value}
                                </p>
                                <p className="text-muted-foreground mt-2 text-sm leading-5">
                                    {metric.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                <motion.section
                    className="glass-panel mx-auto w-full max-w-[460px] rounded-[28px] p-5 sm:p-6"
                    initial={{ opacity: 0, y: 28, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className="rounded-[22px] border border-white/40 bg-white/60 p-6 shadow-2xl shadow-[#490aad]/10 backdrop-blur-2xl sm:p-8 dark:border-white/10 dark:bg-black/20">
                        <div className="flex items-start justify-between gap-4">
                            <Image
                                src="/snote-logo.png"
                                alt="SNOTE"
                                width={174}
                                height={50}
                                priority
                                className="h-auto w-36"
                            />
                            <span className="border-purple-light bg-glass text-purple-primary inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold">
                                <ShieldCheck className="h-3.5 w-3.5" />
                                {roleProfile.badge}
                            </span>
                        </div>

                        <div className="mt-10">
                            <p className="text-purple-primary text-sm font-medium">
                                Create account
                            </p>
                            <h2 className="text-foreground mt-2 text-3xl leading-tight font-semibold">
                                Start with SNOTE
                            </h2>
                            <p className="text-muted-foreground mt-3 text-sm leading-6">
                                Create your SNOTE account to start in{' '}
                                <span className="text-foreground font-medium">
                                    {roleProfile.label}
                                </span>{' '}
                                .
                            </p>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="mt-8 space-y-5"
                        >
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm">
                                    Full name
                                </Label>
                                <div className="relative">
                                    <UserRound className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                    <Input
                                        id="name"
                                        type="text"
                                        value={name}
                                        onChange={(event) =>
                                            setName(event.target.value)
                                        }
                                        required
                                        disabled={isSubmitting}
                                        className="border-glass-border bg-glass h-12 rounded-2xl pl-10 shadow-inner shadow-white/20 backdrop-blur"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm">
                                    Email
                                </Label>
                                <div className="relative">
                                    <Mail className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(event) =>
                                            setEmail(event.target.value)
                                        }
                                        required
                                        disabled={isSubmitting}
                                        className="border-glass-border bg-glass h-12 rounded-2xl pl-10 shadow-inner shadow-white/20 backdrop-blur"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm">
                                    Password
                                </Label>
                                <div className="relative">
                                    <LockKeyhole className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                    <Input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(event) =>
                                            setPassword(event.target.value)
                                        }
                                        required
                                        minLength={8}
                                        disabled={isSubmitting}
                                        className="border-glass-border bg-glass h-12 rounded-2xl pl-10 shadow-inner shadow-white/20 backdrop-blur"
                                    />
                                </div>
                                <p className="text-muted-foreground text-xs">
                                    Use at least 8 characters.
                                </p>
                            </div>

                            {submitError && (
                                <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                                    {submitError}
                                </p>
                            )}

                            <Button
                                type="submit"
                                size="lg"
                                disabled={isSubmitting}
                                className="h-12 w-full rounded-2xl"
                            >
                                {isSubmitting
                                    ? 'Creating account...'
                                    : 'Create account'}
                            </Button>
                        </form>

                        <div className="text-muted-foreground mt-6 flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                            <Link
                                href="/"
                                className="hover:text-foreground inline-flex items-center gap-2 lg:hidden"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to SNOTE
                            </Link>
                            <span>
                                Already onboarded?{' '}
                                <Link
                                    href="/login"
                                    className="text-purple-primary hover:text-purple-deep font-semibold"
                                >
                                    Sign in
                                </Link>
                            </span>
                        </div>
                    </div>
                </motion.section>
            </div>
        </main>
    );
}
