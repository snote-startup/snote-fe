'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navLinks = [
    { href: '#workspace', label: 'Product' },
    { href: '#workflow', label: 'Workflow' },
    { href: '#references', label: 'References' },
    { href: '/pricing', label: 'Pricing' },
];

export function LandingNavbar() {
    const [open, setOpen] = useState(false);

    return (
        <header className="fixed top-0 right-0 left-0 z-50">
            <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
                <nav className="flex h-14 items-center justify-between rounded-2xl border border-white/[0.08] bg-zinc-950/60 px-4 backdrop-blur-xl sm:px-6">
                    {/* Logo */}
                    <Link href="/" className="flex shrink-0 items-center">
                        <Image
                            src="/snote-logo.png"
                            alt="Snote"
                            width={112}
                            height={32}
                            priority
                            className="h-auto w-[88px] brightness-0 invert"
                        />
                    </Link>

                    {/* Desktop nav links */}
                    <div className="hidden items-center gap-6 text-sm md:flex">
                        {navLinks.map((l) => (
                            <Link
                                key={l.href}
                                href={l.href}
                                className="text-zinc-400 transition-colors hover:text-zinc-100"
                            >
                                {l.label}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop actions */}
                    <div className="hidden items-center gap-2 md:flex">
                        <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-100"
                        >
                            <Link href="/login">Sign in</Link>
                        </Button>
                        <Button
                            asChild
                            size="sm"
                            className="bg-violet-600 text-white hover:bg-violet-500"
                        >
                            <Link href="/dashboard">
                                Open app
                                <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </Button>
                    </div>

                    {/* Mobile hamburger */}
                    <div className="flex items-center md:hidden">
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label={open ? 'Close menu' : 'Open menu'}
                            onClick={() => setOpen((v) => !v)}
                            className="text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-100"
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
                <div className="mx-4 mt-2 rounded-2xl border border-white/[0.08] bg-zinc-950/90 px-4 pt-3 pb-4 backdrop-blur-xl sm:mx-6 md:hidden">
                    <nav className="flex flex-col gap-1">
                        {navLinks.map((l) => (
                            <Link
                                key={l.href}
                                href={l.href}
                                onClick={() => setOpen(false)}
                                className="rounded-lg px-3 py-2.5 text-sm text-zinc-400 transition-colors hover:bg-white/[0.06] hover:text-zinc-100"
                            >
                                {l.label}
                            </Link>
                        ))}
                        <div className="mt-3 flex flex-col gap-2">
                            <Button
                                asChild
                                variant="outline"
                                className="w-full border-white/[0.1] bg-transparent text-zinc-300 hover:bg-white/[0.06]"
                            >
                                <Link
                                    href="/login"
                                    onClick={() => setOpen(false)}
                                >
                                    Sign in
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
                                    Open app
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
