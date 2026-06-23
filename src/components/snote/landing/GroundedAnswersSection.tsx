'use client';

import {
    Link2,
    Search,
    Download,
    FileText,
    MessageSquareText,
} from 'lucide-react';
import { Reveal } from './Reveal';

const proofPoints = [
    {
        icon: Link2,
        title: 'Source-grounded answers',
        description:
            'Every AI response links back to exact transcript segments. Click any reference chip to jump to the original speaker turn.',
    },
    {
        icon: Search,
        title: 'Search the full transcript',
        description:
            'Find any keyword, speaker name, or phrase across the entire meeting. Jump directly to the relevant segment.',
    },
    {
        icon: Download,
        title: 'Download original audio',
        description:
            'Access the full recording anytime. Play back specific segments referenced by the AI for verification.',
    },
    {
        icon: MessageSquareText,
        title: 'Conversational AI review',
        description:
            'Ask follow-up questions naturally. The AI maintains context across your conversation and cites different transcript parts.',
    },
];

export function GroundedAnswersSection() {
    return (
        <section id="references" className="relative z-10 py-20 sm:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-12 lg:grid-cols-[400px_1fr] lg:items-center">
                    {/* Left — copy */}
                    <Reveal>
                        <p className="mb-3 text-sm font-semibold text-violet-400">
                            Grounded references
                        </p>
                        <h2 className="mb-4 text-3xl leading-tight font-semibold tracking-tight text-zinc-100 sm:text-4xl">
                            AI that shows its work.
                        </h2>
                        <p className="text-base leading-relaxed text-zinc-400">
                            Not just summaries — every answer traces back to a
                            timestamped transcript segment. Verify anything the
                            AI tells you with one click.
                        </p>
                    </Reveal>

                    {/* Right — proof cards */}
                    <div className="grid gap-3 sm:grid-cols-2">
                        {proofPoints.map((p, i) => {
                            const Icon = p.icon;
                            return (
                                <Reveal key={p.title} delay={i * 80}>
                                    <article className="group flex h-full gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 transition-all duration-300 hover:border-violet-500/20 hover:bg-white/[0.05]">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/10">
                                            <Icon className="h-4 w-4 text-violet-400" />
                                        </div>
                                        <div>
                                            <h3 className="mb-1.5 text-sm font-semibold text-zinc-200">
                                                {p.title}
                                            </h3>
                                            <p className="text-sm leading-6 text-zinc-500">
                                                {p.description}
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
                    <div className="flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 sm:p-6">
                        <span className="mr-2 text-xs font-medium text-zinc-500">
                            Example references:
                        </span>
                        {[
                            { label: 'Mina · 00:14', topic: 'Onboarding gap' },
                            { label: 'Ken · 01:02', topic: 'Follow-up tags' },
                            {
                                label: 'Ari · 02:21',
                                topic: 'Searchable summary',
                            },
                        ].map((ref) => (
                            <span
                                key={ref.label}
                                className="group/chip inline-flex items-center gap-1.5 rounded-lg border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-xs font-medium text-violet-300 transition-colors hover:border-violet-500/30 hover:bg-violet-500/15"
                            >
                                <FileText className="h-3 w-3 text-violet-400/60" />
                                <span>{ref.label}</span>
                                <span className="hidden text-violet-400/40 sm:inline">
                                    ·
                                </span>
                                <span className="hidden text-zinc-500 sm:inline">
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
