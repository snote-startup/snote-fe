'use client';

import {
    FileAudio,
    MessageSquareText,
    CheckCircle2,
    Users,
    Sparkles,
    Link2,
    Play,
} from 'lucide-react';

/* ────────────────────────────────────────────
   Static data – no random values in render
   ──────────────────────────────────────────── */

const transcriptLines = [
    {
        time: '00:14',
        speaker: 'Mina',
        text: 'The onboarding handoff is where customers lose context.',
        highlighted: false,
    },
    {
        time: '01:02',
        speaker: 'Ken',
        text: 'We should tag follow-up questions directly on transcript segments.',
        highlighted: true,
    },
    {
        time: '02:21',
        speaker: 'Ari',
        text: 'The support team needs a searchable summary by account.',
        highlighted: false,
    },
];

const aiAnswer = {
    question: 'What decisions were made about follow-ups?',
    answer: 'Ken proposed tagging follow-up questions directly on transcript segments. Ari suggested routing searchable summaries to the support team by account.',
    references: [
        { label: 'Ken · 01:02', segment: 'Tag follow-ups on segments' },
        { label: 'Ari · 02:21', segment: 'Searchable summary by account' },
    ],
};

const statusItems = [
    {
        icon: CheckCircle2,
        label: 'Transcript ready',
        color: 'text-emerald-400',
    },
    { icon: Users, label: '3 speakers', color: 'text-blue-400' },
    { icon: Sparkles, label: 'AI analysis done', color: 'text-violet-400' },
];

export function HeroWorkspaceMock() {
    return (
        <div className="animate-gentle-float rounded-2xl border border-white/[0.08] bg-white/[0.03] p-2 shadow-2xl shadow-black/40 backdrop-blur-sm sm:p-3">
            {/* ── Window chrome ── */}
            <div className="mb-2 flex items-center gap-1.5 px-1.5 sm:mb-3">
                <span className="h-2 w-2 rounded-full bg-red-400/60 sm:h-2.5 sm:w-2.5" />
                <span className="h-2 w-2 rounded-full bg-yellow-400/60 sm:h-2.5 sm:w-2.5" />
                <span className="h-2 w-2 rounded-full bg-emerald-400/60 sm:h-2.5 sm:w-2.5" />
                <span className="ml-2 text-[10px] text-zinc-500 sm:ml-3 sm:text-xs">
                    Weekly Product Review
                </span>
            </div>

            {/* ── Main workspace ── */}
            <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-zinc-950/80">
                {/* Project header */}
                <div className="flex items-center justify-between border-b border-white/[0.06] px-3 py-2 sm:px-4 sm:py-2.5">
                    <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/10 sm:h-8 sm:w-8">
                            <FileAudio className="h-3.5 w-3.5 text-violet-400 sm:h-4 sm:w-4" />
                        </div>
                        <div>
                            <p className="text-[11px] font-medium text-zinc-200 sm:text-xs">
                                product-review-june.mp3
                            </p>
                            <p className="text-[10px] text-zinc-500">
                                12 min · 3 speakers
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="hidden items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400 sm:inline-flex">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            Ready
                        </span>
                        <button className="flex h-6 w-6 items-center justify-center rounded-md bg-white/[0.06] text-zinc-400 transition-colors hover:text-zinc-200">
                            <Play className="h-3 w-3" />
                        </button>
                    </div>
                </div>

                {/* ── Two-panel layout ── */}
                <div className="hero-parallax-deep grid gap-0 sm:grid-cols-[1fr_1fr]">
                    {/* LEFT — Transcript */}
                    <div className="border-b border-white/[0.06] p-2 sm:border-r sm:border-b-0 sm:p-3">
                        <p className="mb-2 px-0.5 text-[9px] font-semibold tracking-widest text-zinc-500 uppercase sm:text-[10px]">
                            Transcript
                        </p>
                        <div className="space-y-1.5">
                            {transcriptLines.map(
                                ({ time, speaker, text, highlighted }) => (
                                    <div
                                        key={time}
                                        className={`rounded-lg px-2.5 py-2 transition-colors ${
                                            highlighted
                                                ? 'border border-violet-500/20 bg-violet-500/[0.06]'
                                                : 'bg-white/[0.02] hover:bg-white/[0.04]'
                                        }`}
                                    >
                                        <div className="mb-0.5 flex items-center gap-2">
                                            <span className="font-mono text-[9px] text-zinc-600 sm:text-[10px]">
                                                {time}
                                            </span>
                                            <span className="text-[10px] font-semibold text-violet-400 sm:text-[11px]">
                                                {speaker}
                                            </span>
                                            {highlighted && (
                                                <Link2 className="h-2.5 w-2.5 text-violet-400/60" />
                                            )}
                                        </div>
                                        <p className="text-[10px] leading-4 text-zinc-300 sm:text-[11px]">
                                            {text}
                                        </p>
                                    </div>
                                ),
                            )}
                        </div>
                    </div>

                    {/* RIGHT — AI Chat */}
                    <div className="p-2 sm:p-3">
                        <p className="mb-2 flex items-center gap-1.5 px-0.5 text-[9px] font-semibold tracking-widest text-zinc-500 uppercase sm:text-[10px]">
                            <MessageSquareText className="h-3 w-3" />
                            AI Chat
                        </p>

                        {/* Question */}
                        <div className="mb-2 rounded-lg bg-white/[0.04] px-2.5 py-2">
                            <p className="text-[10px] leading-4 text-zinc-300 sm:text-[11px]">
                                <span className="font-medium text-zinc-100">
                                    Q:
                                </span>{' '}
                                {aiAnswer.question}
                            </p>
                        </div>

                        {/* Answer */}
                        <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-2.5 py-2">
                            <p className="mb-2 text-[10px] leading-4 text-zinc-400 sm:text-[11px]">
                                {aiAnswer.answer}
                            </p>

                            {/* Reference chips */}
                            <div className="flex flex-wrap gap-1.5">
                                {aiAnswer.references.map((ref, i) => (
                                    <span
                                        key={ref.label}
                                        className={`animate-chip-pulse inline-flex items-center gap-1 rounded-md border border-violet-500/20 bg-violet-500/10 px-2 py-0.5 text-[9px] font-medium text-violet-300 sm:text-[10px] ${
                                            i === 1
                                                ? '[animation-delay:1.2s]'
                                                : ''
                                        }`}
                                    >
                                        <Link2 className="h-2.5 w-2.5" />
                                        {ref.label}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Status pills */}
                        <div className="mt-2 flex flex-wrap gap-1.5 sm:mt-3">
                            {statusItems.map(({ icon: Icon, label, color }) => (
                                <span
                                    key={label}
                                    className="inline-flex items-center gap-1 rounded-md bg-white/[0.04] px-2 py-1 text-[9px] text-zinc-400 sm:text-[10px]"
                                >
                                    <Icon className={`h-2.5 w-2.5 ${color}`} />
                                    {label}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
