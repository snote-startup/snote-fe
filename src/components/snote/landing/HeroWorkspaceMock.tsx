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
        text: 'Phần bàn giao onboarding là nơi khách hàng dễ mất ngữ cảnh.',
        highlighted: false,
    },
    {
        time: '01:02',
        speaker: 'Ken',
        text: 'Nên gắn câu hỏi follow-up trực tiếp vào từng đoạn transcript.',
        highlighted: true,
    },
    {
        time: '02:21',
        speaker: 'Ari',
        text: 'Đội hỗ trợ cần bản tóm tắt có thể tìm kiếm theo tài khoản.',
        highlighted: false,
    },
];

const aiAnswer = {
    question: 'Có quyết định gì về việc follow-up?',
    answer: 'Ken đề xuất gắn câu hỏi follow-up trực tiếp vào đoạn transcript. Ari đề xuất chuyển bản tóm tắt có thể tìm kiếm cho đội hỗ trợ theo từng tài khoản.',
    references: [
        { label: 'Ken · 01:02', segment: 'Gắn follow-up vào đoạn' },
        { label: 'Ari · 02:21', segment: 'Tóm tắt theo tài khoản' },
    ],
};

const statusItems = [
    {
        icon: CheckCircle2,
        label: 'Transcript sẵn sàng',
        color: 'text-emerald-600 dark:text-emerald-400',
    },
    {
        icon: Users,
        label: '3 người nói',
        color: 'text-blue-600 dark:text-blue-400',
    },
    {
        icon: Sparkles,
        label: 'AI đã phân tích',
        color: 'text-violet-600 dark:text-violet-400',
    },
];

export function HeroWorkspaceMock() {
    return (
        <div className="animate-gentle-float rounded-2xl border border-slate-200 bg-white/70 p-2 shadow-2xl shadow-slate-200/50 backdrop-blur-sm sm:p-3 dark:border-white/[0.08] dark:bg-white/[0.03] dark:shadow-black/40">
            {/* ── Window chrome ── */}
            <div className="mb-2 flex items-center gap-1.5 px-1.5 sm:mb-3">
                <span className="h-2 w-2 rounded-full bg-red-400/60 sm:h-2.5 sm:w-2.5" />
                <span className="h-2 w-2 rounded-full bg-yellow-400/60 sm:h-2.5 sm:w-2.5" />
                <span className="h-2 w-2 rounded-full bg-emerald-400/60 sm:h-2.5 sm:w-2.5" />
                <span className="ml-2 text-[10px] text-slate-500 sm:ml-3 sm:text-xs dark:text-zinc-500">
                    Họp review sản phẩm hằng tuần
                </span>
            </div>

            {/* ── Main workspace ── */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50/90 dark:border-white/[0.06] dark:bg-zinc-950/80">
                {/* Project header */}
                <div className="flex items-center justify-between border-b border-slate-200/60 px-3 py-2 sm:px-4 sm:py-2.5 dark:border-white/[0.06]">
                    <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/10 sm:h-8 sm:w-8">
                            <FileAudio className="text-violet-650 h-3.5 w-3.5 sm:h-4 sm:w-4 dark:text-violet-400" />
                        </div>
                        <div>
                            <p className="text-[11px] font-medium text-slate-800 sm:text-xs dark:text-zinc-200">
                                product-review-june.mp3
                            </p>
                            <p className="text-[10px] text-slate-500 dark:text-zinc-500">
                                12 phút · 3 người nói
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="hidden items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 sm:inline-flex dark:text-emerald-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                            Sẵn sàng
                        </span>
                        <button className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-200/50 text-slate-500 transition-colors hover:text-slate-800 dark:bg-white/[0.06] dark:text-zinc-400 dark:hover:text-zinc-200">
                            <Play className="h-3 w-3" />
                        </button>
                    </div>
                </div>

                {/* ── Two-panel layout ── */}
                <div className="hero-parallax-deep grid gap-0 sm:grid-cols-[1fr_1fr]">
                    {/* LEFT — Transcript */}
                    <div className="border-b border-slate-200/60 p-2 sm:border-r sm:border-b-0 sm:p-3 dark:border-white/[0.06]">
                        <p className="mb-2 px-0.5 text-[9px] font-semibold tracking-widest text-slate-400 uppercase sm:text-[10px] dark:text-zinc-500">
                            Transcript
                        </p>
                        <div className="space-y-1.5">
                            {transcriptLines.map(
                                ({ time, speaker, text, highlighted }) => (
                                    <div
                                        key={time}
                                        className={`rounded-lg px-2.5 py-2 transition-colors ${
                                            highlighted
                                                ? 'border border-violet-500/20 bg-violet-500/10 dark:bg-violet-500/[0.06]'
                                                : 'bg-white/80 hover:bg-slate-200/40 dark:bg-white/[0.02] dark:hover:bg-white/[0.04]'
                                        }`}
                                    >
                                        <div className="mb-0.5 flex items-center gap-2">
                                            <span className="font-mono text-[9px] text-slate-400 sm:text-[10px] dark:text-zinc-600">
                                                {time}
                                            </span>
                                            <span className="text-violet-650 text-[10px] font-semibold sm:text-[11px] dark:text-violet-400">
                                                {speaker}
                                            </span>
                                            {highlighted && (
                                                <Link2 className="h-2.5 w-2.5 text-violet-500/60 dark:text-violet-400/60" />
                                            )}
                                        </div>
                                        <p className="text-[10px] leading-4 text-slate-700 sm:text-[11px] dark:text-zinc-300">
                                            {text}
                                        </p>
                                    </div>
                                ),
                            )}
                        </div>
                    </div>

                    {/* RIGHT — AI Chat */}
                    <div className="p-2 sm:p-3">
                        <p className="mb-2 flex items-center gap-1.5 px-0.5 text-[9px] font-semibold tracking-widest text-slate-400 uppercase sm:text-[10px] dark:text-zinc-500">
                            <MessageSquareText className="h-3 w-3" />
                            Trợ lý AI
                        </p>

                        {/* Question */}
                        <div className="mb-2 rounded-lg bg-slate-200/50 px-2.5 py-2 dark:bg-white/[0.04]">
                            <p className="text-[10px] leading-4 text-slate-700 sm:text-[11px] dark:text-zinc-300">
                                <span className="font-medium text-slate-800 dark:text-zinc-100">
                                    Q:
                                </span>{' '}
                                {aiAnswer.question}
                            </p>
                        </div>

                        {/* Answer */}
                        <div className="rounded-lg border border-slate-200/60 bg-white px-2.5 py-2 dark:border-white/[0.06] dark:bg-white/[0.02]">
                            <p className="text-slate-650 mb-2 text-[10px] leading-4 sm:text-[11px] dark:text-zinc-400">
                                {aiAnswer.answer}
                            </p>

                            {/* Reference chips */}
                            <div className="flex flex-wrap gap-1.5">
                                {aiAnswer.references.map((ref, i) => (
                                    <span
                                        key={ref.label}
                                        className={`animate-chip-pulse inline-flex items-center gap-1 rounded-md border border-violet-500/20 bg-violet-500/10 px-2 py-0.5 text-[9px] font-medium text-violet-700 sm:text-[10px] dark:text-violet-300 ${
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
                                    className="inline-flex items-center gap-1 rounded-md bg-slate-200/50 px-2 py-1 text-[9px] text-slate-500 sm:text-[10px] dark:bg-white/[0.04] dark:text-zinc-400"
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
