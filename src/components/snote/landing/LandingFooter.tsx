'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Reveal } from './Reveal';
import { track } from '@vercel/analytics';
import { useI18n } from '@/features/i18n/use-i18n';

export function LandingFooter() {
    const { t } = useI18n();

    const footerLinks = [
        {
            section: t('footer.section.product'),
            links: [
                { label: t('footer.link.features'), href: '#workspace' },
                { label: t('footer.link.workflow'), href: '#workflow' },
                { label: t('footer.link.references'), href: '#references' },
                { label: t('footer.link.pricing'), href: '/pricing' },
                { label: t('footer.link.privacy'), href: '/policy' },
            ],
        },
        {
            section: t('footer.section.workspace'),
            links: [
                { label: t('footer.link.dashboard'), href: '/dashboard' },
                { label: t('footer.link.meetings'), href: '/meetings' },
            ],
        },
        {
            section: t('footer.section.account'),
            links: [
                { label: t('footer.link.login'), href: '/login' },
                { label: t('footer.link.register'), href: '/register' },
            ],
        },
    ];

    return (
        <footer className="relative z-10">
            {/* ── CTA Section ── */}
            <section className="py-20 sm:py-28">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Reveal>
                        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-50/80 p-10 text-center sm:p-16 dark:border-white/[0.08] dark:bg-white/[0.03]">
                            {/* Glow behind */}
                            <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgb(124_58_237_/_0.08),transparent_60%)]" />

                            <p className="mb-4 text-sm font-semibold text-violet-600 dark:text-violet-400">
                                {t('footer.cta.label')}
                            </p>
                            <h2 className="mb-5 text-3xl leading-tight font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl dark:text-zinc-100">
                                {t('footer.cta.title')}
                            </h2>
                            <p className="text-slate-650 mx-auto mb-8 max-w-xl text-base leading-relaxed dark:text-zinc-400">
                                {t('footer.cta.subtitle')}
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
                                        {t('footer.cta.openApp')}
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    size="lg"
                                    variant="ghost"
                                    className="h-12 border border-slate-200 px-8 text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:border-white/[0.1] dark:text-zinc-300 dark:hover:bg-white/[0.06] dark:hover:text-zinc-100"
                                >
                                    <Link href="/login">
                                        {t('footer.cta.login')}
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ── Footer links ── */}
            <div className="border-t border-slate-200 dark:border-white/[0.06]">
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
                                    className="h-auto w-[92px] dark:brightness-0 dark:invert"
                                />
                            </Link>
                            <p className="mt-3 max-w-xs text-sm leading-6 text-slate-500 dark:text-zinc-500">
                                {t('footer.brand')}
                            </p>
                        </div>

                        {/* Links */}
                        {footerLinks.map(({ section, links }) => (
                            <div key={section}>
                                <p className="mb-4 text-xs font-semibold tracking-wider text-slate-800 uppercase dark:text-zinc-400">
                                    {section}
                                </p>
                                <ul className="space-y-2.5">
                                    {links.map(({ label, href }) => (
                                        <li key={label}>
                                            <Link
                                                href={href}
                                                className="text-sm text-slate-500 transition-colors hover:text-slate-800 dark:text-zinc-500 dark:hover:text-zinc-300"
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
                    <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 sm:flex-row dark:border-white/[0.06]">
                        <p
                            className="text-xs text-slate-500 dark:text-zinc-600"
                            suppressHydrationWarning
                        >
                            © {new Date().getFullYear()} Snote.{' '}
                            {t('footer.copyright')}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-zinc-600">
                            {t('footer.tagline')}
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
