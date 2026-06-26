'use client';

import {
    Link2,
    Search,
    Download,
    FileText,
    MessageSquareText,
} from 'lucide-react';
import { Reveal } from './Reveal';
import { useI18n } from '@/features/i18n/use-i18n';
import type { TranslationKey } from '@/features/i18n/use-i18n';

const proofPoints: Array<{
    icon: typeof Link2;
    titleKey: TranslationKey;
    descKey: TranslationKey;
}> = [
    {
        icon: Link2,
        titleKey: 'grounded.card1.title',
        descKey: 'grounded.card1.desc',
    },
    {
        icon: Search,
        titleKey: 'grounded.card2.title',
        descKey: 'grounded.card2.desc',
    },
    {
        icon: Download,
        titleKey: 'grounded.card3.title',
        descKey: 'grounded.card3.desc',
    },
    {
        icon: MessageSquareText,
        titleKey: 'grounded.card4.title',
        descKey: 'grounded.card4.desc',
    },
];

export function GroundedAnswersSection() {
    const { t } = useI18n();

    return (
        <section id="references" className="relative z-10 py-20 sm:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-12 lg:grid-cols-[400px_1fr] lg:items-center">
                    {/* Left — copy */}
                    <Reveal>
                        <p className="mb-3 text-sm font-semibold text-violet-600 dark:text-violet-400">
                            {t('grounded.label')}
                        </p>
                        <h2 className="mb-4 text-3xl leading-tight font-semibold tracking-tight text-slate-900 sm:text-4xl dark:text-zinc-100">
                            {t('grounded.title')}
                        </h2>
                        <p className="text-slate-650 text-base leading-relaxed dark:text-zinc-400">
                            {t('grounded.subtitle')}
                        </p>
                    </Reveal>

                    {/* Right — proof cards */}
                    <div className="grid gap-3 sm:grid-cols-2">
                        {proofPoints.map((p, i) => {
                            const Icon = p.icon;
                            return (
                                <Reveal key={p.titleKey} delay={i * 80}>
                                    <article className="group flex h-full gap-4 rounded-2xl border border-slate-200 bg-white/50 p-5 transition-all duration-300 hover:border-violet-500/30 hover:bg-white dark:border-white/[0.08] dark:bg-white/[0.03] dark:hover:border-violet-500/20 dark:hover:bg-white/[0.05]">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/10">
                                            <Icon className="text-violet-650 h-4 w-4 dark:text-violet-400" />
                                        </div>
                                        <div>
                                            <h3 className="mb-1.5 text-sm font-semibold text-slate-800 dark:text-zinc-200">
                                                {t(p.titleKey)}
                                            </h3>
                                            <p className="text-sm leading-6 text-slate-500 dark:text-zinc-500">
                                                {t(p.descKey)}
                                            </p>
                                        </div>
                                    </article>
                                </Reveal>
                            );
                        })}
                    </div>
                </div>

                {/* Demo reference strip */}
                <Reveal delay={320} className="mt-12">
                    <div className="flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/50 p-4 sm:p-6 dark:border-white/[0.06] dark:bg-white/[0.02]">
                        <span className="mr-2 text-xs font-medium text-slate-500 dark:text-zinc-500">
                            {t('grounded.exampleLabel')}
                        </span>
                        {[
                            {
                                label: 'Mina · 00:14',
                                topic: 'Lỗ hổng onboarding',
                            },
                            { label: 'Ken · 01:02', topic: 'Gắn follow-up' },
                            {
                                label: 'Ari · 02:21',
                                topic: 'Tóm tắt tìm kiếm được',
                            },
                        ].map((ref) => (
                            <span
                                key={ref.label}
                                className="group/chip text-violet-750 inline-flex items-center gap-1.5 rounded-lg border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-xs font-medium transition-colors hover:border-violet-500/30 hover:bg-violet-500/15 dark:text-violet-300"
                            >
                                <FileText className="h-3 w-3 text-violet-500/60 dark:text-violet-400/60" />
                                <span>{ref.label}</span>
                                <span className="hidden text-violet-500/40 sm:inline">
                                    ·
                                </span>
                                <span className="hidden text-slate-500 sm:inline dark:text-zinc-500">
                                    {ref.topic}
                                </span>
                            </span>
                        ))}
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
