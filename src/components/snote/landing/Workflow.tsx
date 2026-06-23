'use client';

import {
    UploadCloud,
    FileText,
    MessageSquareText,
    ScanSearch,
} from 'lucide-react';
import { Reveal } from './Reveal';

const steps = [
    {
        step: '01',
        icon: UploadCloud,
        title: 'Upload audio',
        description:
            'Attach the meeting recording to a project. Snote handles any common audio format.',
    },
    {
        step: '02',
        icon: FileText,
        title: 'Generate transcript',
        description:
            'Get a timestamped, speaker-segmented transcript ready for review in minutes.',
    },
    {
        step: '03',
        icon: MessageSquareText,
        title: 'Ask AI',
        description:
            'Query the transcript naturally. Ask about decisions, blockers, or follow-ups.',
    },
    {
        step: '04',
        icon: ScanSearch,
        title: 'Verify by references',
        description:
            'Every AI answer cites exact transcript segments. Click to jump to the source.',
    },
];

export function Workflow() {
    return (
        <section id="workflow" className="relative z-10 py-20 sm:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Reveal className="mb-14 max-w-2xl">
                    <p className="mb-3 text-sm font-semibold text-violet-400">
                        Workflow
                    </p>
                    <h2 className="text-3xl leading-tight font-semibold tracking-tight text-zinc-100 sm:text-4xl">
                        From recording to verified review in four steps.
                    </h2>
                    <p className="mt-4 text-base leading-relaxed text-zinc-500">
                        A focused pipeline — no scattered tabs, no guesswork.
                    </p>
                </Reveal>

                {/* Steps grid */}
                <div className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Connector line — desktop */}
                    <div className="pointer-events-none absolute top-10 right-0 left-0 hidden border-t border-dashed border-white/[0.08] lg:block" />

                    {steps.map((s, i) => {
                        const Icon = s.icon;
                        return (
                            <Reveal key={s.step} delay={i * 100}>
                                <article className="group relative h-full rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 transition-all duration-300 hover:border-violet-500/20 hover:bg-white/[0.05]">
                                    {/* Step icon */}
                                    <div className="relative z-10 mb-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.1] bg-zinc-950 shadow-sm">
                                        <Icon className="h-4.5 w-4.5 text-violet-400" />
                                    </div>

                                    <span className="mb-3 block text-xs font-bold tracking-wider text-violet-400/60">
                                        {s.step}
                                    </span>
                                    <h3 className="mb-2 text-base font-semibold text-zinc-200">
                                        {s.title}
                                    </h3>
                                    <p className="text-sm leading-6 text-zinc-500">
                                        {s.description}
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
