'use client';

import {
    GraduationCap,
    Users,
    Mic2,
    FlaskConical,
    BookOpen,
} from 'lucide-react';
import { Reveal } from './Reveal';
import { useI18n } from '@/features/i18n/use-i18n';
import type { TranslationKey } from '@/features/i18n/use-i18n';

const cases: Array<{
    icon: typeof GraduationCap;
    labelKey: TranslationKey;
    descKey: TranslationKey;
}> = [
    {
        icon: GraduationCap,
        labelKey: 'usecases.case1.label',
        descKey: 'usecases.case1.desc',
    },
    {
        icon: Users,
        labelKey: 'usecases.case2.label',
        descKey: 'usecases.case2.desc',
    },
    {
        icon: Mic2,
        labelKey: 'usecases.case3.label',
        descKey: 'usecases.case3.desc',
    },
    {
        icon: FlaskConical,
        labelKey: 'usecases.case4.label',
        descKey: 'usecases.case4.desc',
    },
    {
        icon: BookOpen,
        labelKey: 'usecases.case5.label',
        descKey: 'usecases.case5.desc',
    },
];

export function UseCases() {
    const { t } = useI18n();

    return (
        <section id="use-cases" className="relative z-10 py-20 sm:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Reveal className="mx-auto mb-14 max-w-2xl text-center">
                    <p className="mb-3 text-sm font-semibold text-violet-400">
                        {t('usecases.label')}
                    </p>
                    <h2 className="text-3xl leading-tight font-semibold tracking-tight text-zinc-100 sm:text-4xl">
                        {t('usecases.title')}
                    </h2>
                    <p className="mt-4 text-base leading-relaxed text-zinc-500">
                        {t('usecases.subtitle')}
                    </p>
                </Reveal>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {cases.map((c, i) => {
                        const Icon = c.icon;
                        return (
                            <Reveal
                                key={c.labelKey}
                                delay={i * 70}
                                className={
                                    /* last 2 cards: center on lg when 3-col */
                                    i >= 3 && cases.length === 5
                                        ? 'lg:last:col-start-2'
                                        : ''
                                }
                            >
                                <article className="group flex h-full gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 transition-all duration-300 hover:border-violet-500/20 hover:bg-white/[0.05]">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10">
                                        <Icon className="h-5 w-5 text-violet-400" />
                                    </div>
                                    <div>
                                        <h3 className="mb-1.5 text-sm font-semibold text-zinc-200">
                                            {t(c.labelKey)}
                                        </h3>
                                        <p className="text-sm leading-6 text-zinc-500">
                                            {t(c.descKey)}
                                        </p>
                                    </div>
                                </article>
                            </Reveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
