'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageToggle } from '@/features/i18n/LanguageToggle';
import { ThemeToggle } from '@/components/snote/ThemeToggle';
import { useI18n } from '@/features/i18n/use-i18n';

export function LandingNavbar() {
    const [open, setOpen] = useState(false);
    const { t } = useI18n();

    const navLinks = [
        { href: '#workspace', label: t('landing.nav.product') },
        { href: '#workflow', label: t('landing.nav.workflow') },
        { href: '#references', label: t('landing.nav.references') },
        { href: '/pricing', label: t('landing.nav.pricing') },
    ];

    return (
        <header className="fixed top-0 right-0 left-0 z-50">
            <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
                <nav className="flex h-14 items-center justify-between rounded-2xl border border-slate-200 bg-white/70 px-4 backdrop-blur-xl sm:px-6 dark:border-white/[0.08] dark:bg-zinc-950/60">
                    {/* Logo */}
                    <Link href="/" className="flex shrink-0 items-center">
                        <Image
                            src="/snote-logo.png"
                            alt="Snote"
                            width={112}
                            height={32}
                            priority
                            className="h-auto w-[88px] dark:brightness-0 dark:invert"
                        />
                    </Link>

                    {/* Desktop nav links */}
                    <div className="hidden items-center gap-6 text-sm md:flex">
                        {navLinks.map((l) => (
                            <Link
                                key={l.href}
                                href={l.href}
                                className="text-slate-600 transition-colors hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                            >
                                {l.label}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop actions */}
                    <div className="hidden items-center gap-2 md:flex">
                        <LanguageToggle
                            variant="ghost"
                            size="sm"
                            className="text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-white/[0.06] dark:hover:text-zinc-100"
                        />
                        <ThemeToggle
                            variant="ghost"
                            size="sm"
                            className="text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-white/[0.06] dark:hover:text-zinc-100"
                        />
                        <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-white/[0.06] dark:hover:text-zinc-100"
                        >
                            <Link href="/login">{t('landing.nav.login')}</Link>
                        </Button>
                        <Button
                            asChild
                            size="sm"
                            className="bg-violet-600 text-white hover:bg-violet-500"
                        >
                            <Link href="/dashboard">
                                {t('landing.nav.openApp')}
                                <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </Button>
                    </div>

                    {/* Mobile hamburger */}
                    <div className="flex items-center gap-1 md:hidden">
                        <LanguageToggle
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-white/[0.06] dark:hover:text-zinc-100"
                            iconOnly
                        />
                        <ThemeToggle
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-white/[0.06] dark:hover:text-zinc-100"
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label={
                                open ? t('nav.closeMenu') : t('nav.openMenu')
                            }
                            onClick={() => setOpen((v) => !v)}
                            className="text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-white/[0.06] dark:hover:text-zinc-100"
                        >
                            {open ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                        </Button>
                    </div>
                </nav>
            </div>

            {/* Mobile drawer */}
            {open && (
                <div className="mx-4 mt-2 rounded-2xl border border-slate-200 bg-white/95 px-4 pt-3 pb-4 backdrop-blur-xl sm:mx-6 md:hidden dark:border-white/[0.08] dark:bg-zinc-950/90">
                    <nav className="flex flex-col gap-1">
                        {navLinks.map((l) => (
                            <Link
                                key={l.href}
                                href={l.href}
                                onClick={() => setOpen(false)}
                                className="rounded-lg px-3 py-2.5 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-white/[0.06] dark:hover:text-zinc-100"
                            >
                                {l.label}
                            </Link>
                        ))}
                        <div className="mt-3 flex flex-col gap-2">
                            <Button
                                asChild
                                variant="outline"
                                className="w-full border-slate-200 bg-transparent text-slate-700 hover:bg-slate-100 dark:border-white/[0.1] dark:text-zinc-300 dark:hover:bg-white/[0.06]"
                            >
                                <Link
                                    href="/login"
                                    onClick={() => setOpen(false)}
                                >
                                    {t('landing.nav.login')}
                                </Link>
                            </Button>
                            <Button
                                asChild
                                className="w-full bg-violet-600 text-white hover:bg-violet-500"
                            >
                                <Link
                                    href="/dashboard"
                                    onClick={() => setOpen(false)}
                                >
                                    {t('landing.nav.openApp')}
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
