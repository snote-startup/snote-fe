'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Reveal } from './Reveal';
import { track } from '@vercel/analytics';

const footerLinks = [
    {
        section: 'Product',
        links: [
            { label: 'Features', href: '#workspace' },
            { label: 'Workflow', href: '#workflow' },
            { label: 'References', href: '#references' },
            { label: 'Pricing', href: '/pricing' },
        ],
    },
    {
        section: 'Workspace',
        links: [
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Meetings', href: '/meetings' },
        ],
    },
    {
        section: 'Account',
        links: [
            { label: 'Sign in', href: '/login' },
            { label: 'Register', href: '/register' },
        ],
    },
];

export function LandingFooter() {
    return (
        <footer className="relative z-10">
            {/* ── CTA Section ── */}
            <section className="py-20 sm:py-28">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Reveal>
                        <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.03] p-10 text-center sm:p-16">
                            {/* Glow behind */}
                            <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgb(124_58_237_/_0.08),transparent_60%)]" />

                            <p className="mb-4 text-sm font-semibold text-violet-400">
                                Get started
                            </p>
                            <h2 className="mb-5 text-3xl leading-tight font-semibold tracking-tight text-zinc-100 sm:text-4xl lg:text-5xl">
                                Ready to review your next meeting?
                            </h2>
                            <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-zinc-400">
                                Create a project and upload your first audio
                                file. No credit card required.
                            </p>
                            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                                <Button
                                    asChild
                                    size="lg"
                                    className="h-12 bg-violet-600 px-8 text-white hover:bg-violet-500"
                                    onClick={() =>
                                        track('landing_primary_cta_clicked')
                                    }
                                >
                                    <Link href="/dashboard">
                                        Open app
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    size="lg"
                                    variant="ghost"
                                    className="h-12 border border-white/[0.1] px-8 text-zinc-300 hover:bg-white/[0.06] hover:text-zinc-100"
                                >
                                    <Link href="/login">Sign in</Link>
                                </Button>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ── Footer links ── */}
            <div className="border-t border-white/[0.06]">
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[240px_repeat(3,1fr)]">
                        {/* Brand */}
                        <div className="sm:col-span-2 lg:col-span-1">
                            <Link href="/" className="mb-4 inline-flex">
                                <Image
                                    src="/snote-logo.png"
                                    alt="Snote"
                                    width={100}
                                    height={28}
                                    className="h-auto w-[92px] brightness-0 invert"
                                />
                            </Link>
                            <p className="mt-3 max-w-xs text-sm leading-6 text-zinc-500">
                                AI meeting workspace. Upload audio, review
                                transcripts, and get grounded answers.
                            </p>
                        </div>

                        {/* Links */}
                        {footerLinks.map(({ section, links }) => (
                            <div key={section}>
                                <p className="mb-4 text-xs font-semibold tracking-wider text-zinc-400 uppercase">
                                    {section}
                                </p>
                                <ul className="space-y-2.5">
                                    {links.map(({ label, href }) => (
                                        <li key={label}>
                                            <Link
                                                href={href}
                                                className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
                                            >
                                                {label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Bottom bar */}
                    <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 sm:flex-row">
                        <p
                            className="text-xs text-zinc-600"
                            suppressHydrationWarning
                        >
                            © {new Date().getFullYear()} Snote. AI meeting
                            workspace.
                        </p>
                        <p className="text-xs text-zinc-600">
                            Built for grounded meeting intelligence.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
