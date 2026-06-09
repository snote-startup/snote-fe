'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/snote/ThemeToggle';

const navLinks = [
    { href: '#features', label: 'Features' },
    { href: '#workflow', label: 'Workflow' },
    { href: '#security', label: 'Security' },
    { href: '#faq', label: 'FAQ' },
    { href: '/pricing', label: 'Pricing' },
];

export function LandingNavbar() {
    const [open, setOpen] = useState(false);

    return (
        <header className="border-border bg-background/80 sticky top-0 z-50 border-b backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link href="/" className="flex shrink-0 items-center">
                    <Image
                        src="/snote-logo.png"
                        alt="Snote"
                        width={112}
                        height={32}
                        priority
                        className="h-auto w-[100px]"
                    />
                </Link>

                {/* Desktop nav */}
                <nav className="text-muted-foreground hidden items-center gap-6 text-sm md:flex">
                    {navLinks.map((l) => (
                        <Link
                            key={l.href}
                            href={l.href}
                            className="hover:text-foreground transition-colors"
                        >
                            {l.label}
                        </Link>
                    ))}
                </nav>

                {/* Desktop actions */}
                <div className="hidden items-center gap-2 md:flex">
                    <ThemeToggle variant="ghost" />
                    <Button
                        asChild
                        variant="ghost"
                        className="text-muted-foreground hover:text-foreground"
                    >
                        <Link href="/login">Sign in</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/dashboard">
                            Open app
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                {/* Mobile: theme + hamburger */}
                <div className="flex items-center gap-1 md:hidden">
                    <ThemeToggle variant="ghost" />
                    <Button
                        variant="ghost"
                        size="icon"
                        aria-label={open ? 'Close menu' : 'Open menu'}
                        onClick={() => setOpen((v) => !v)}
                    >
                        {open ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Menu className="h-5 w-5" />
                        )}
                    </Button>
                </div>
            </div>

            {/* Mobile drawer */}
            {open && (
                <div className="border-border bg-background/95 border-t px-4 pt-3 pb-4 md:hidden">
                    <nav className="flex flex-col gap-1">
                        {navLinks.map((l) => (
                            <Link
                                key={l.href}
                                href={l.href}
                                onClick={() => setOpen(false)}
                                className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg px-3 py-2.5 text-sm transition-colors"
                            >
                                {l.label}
                            </Link>
                        ))}
                        <div className="mt-3 flex flex-col gap-2">
                            <Button
                                asChild
                                variant="outline"
                                className="w-full"
                            >
                                <Link
                                    href="/login"
                                    onClick={() => setOpen(false)}
                                >
                                    Sign in
                                </Link>
                            </Button>
                            <Button asChild className="w-full">
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
