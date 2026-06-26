'use client';

import { Mic, FileText, MessageSquareText, ListTodo } from 'lucide-react';
import { Reveal } from './Reveal';
import { useI18n } from '@/features/i18n/use-i18n';
import type { TranslationKey } from '@/features/i18n/use-i18n';

const steps: Array<{
    step: string;
    icon: typeof Mic;
    titleKey: TranslationKey;
    descKey: TranslationKey;
}> = [
    {
        step: '01',
        icon: Mic,
        titleKey: 'workflow.step1.title',
        descKey: 'workflow.step1.desc',
    },
    {
        step: '02',
        icon: FileText,
        titleKey: 'workflow.step2.title',
        descKey: 'workflow.step2.desc',
    },
    {
        step: '03',
        icon: MessageSquareText,
        titleKey: 'workflow.step3.title',
        descKey: 'workflow.step3.desc',
    },
    {
        step: '04',
        icon: ListTodo,
        titleKey: 'workflow.step4.title',
        descKey: 'workflow.step4.desc',
    },
];

export function Workflow() {
    const { t } = useI18n();

    return (
        <section id="workflow" className="relative z-10 py-20 sm:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Reveal className="mb-14 max-w-2xl">
                    <p className="mb-3 text-sm font-semibold text-violet-600 dark:text-violet-400">
                        {t('workflow.label')}
                    </p>
                    <h2 className="text-3xl leading-tight font-semibold tracking-tight text-slate-900 sm:text-4xl dark:text-zinc-100">
                        {t('workflow.title')}
                    </h2>
                    <p className="mt-4 text-base leading-relaxed text-slate-500 dark:text-zinc-500">
                        {t('workflow.subtitle')}
                    </p>
                </Reveal>

                {/* Steps grid */}
                <div className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Connector line — desktop */}
                    <div className="pointer-events-none absolute top-10 right-0 left-0 hidden border-t border-dashed border-slate-200 lg:block dark:border-white/[0.08]" />

                    {steps.map((s, i) => {
                        const Icon = s.icon;
                        return (
                            <Reveal key={s.step} delay={i * 100}>
                                <article className="group relative h-full rounded-2xl border border-slate-200/80 bg-white/50 p-5 transition-all duration-300 hover:border-violet-500/30 hover:bg-white dark:border-white/[0.08] dark:bg-white/[0.03] dark:hover:border-violet-500/20 dark:hover:bg-white/[0.05]">
                                    {/* Step icon */}
                                    <div className="relative z-10 mb-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm dark:border-white/[0.1] dark:bg-zinc-950">
                                        <Icon className="text-violet-650 h-4.5 w-4.5 dark:text-violet-400" />
                                    </div>

                                    <span className="mb-3 block text-xs font-bold tracking-wider text-violet-600/70 dark:text-violet-400/60">
                                        {s.step}
                                    </span>
                                    <h3 className="mb-2 text-base font-semibold text-slate-800 dark:text-zinc-200">
                                        {t(s.titleKey)}
                                    </h3>
                                    <p className="text-sm leading-6 text-slate-500 dark:text-zinc-500">
                                        {t(s.descKey)}
                                    </p>
                                </article>
                            </Reveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
