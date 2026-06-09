'use client';

import {
    FileAudio,
    MessageSquareText,
    CheckCircle2,
    Users,
    FileText,
    Sparkles,
} from 'lucide-react';

const transcriptLines = [
    {
        time: '00:14',
        speaker: 'Mina',
        text: 'The onboarding handoff is where customers lose context.',
    },
    {
        time: '01:02',
        speaker: 'Ken',
        text: 'We should tag follow-up questions directly on transcript segments.',
    },
    {
        time: '02:21',
        speaker: 'Ari',
        text: 'The support team needs a searchable summary by account.',
    },
];

const sideStats = [
    {
        icon: CheckCircle2,
        label: 'Transcript ready',
        color: 'text-emerald-500',
    },
    { icon: Users, label: '3 speakers detected', color: 'text-blue-500' },
    { icon: Sparkles, label: 'AI summary ready', color: 'text-purple-500' },
];

export function ProductShowcase() {
    return (
        <div className="border-border bg-card/70 rounded-2xl border p-3 shadow-2xl shadow-black/10 backdrop-blur dark:shadow-black/40">
            {/* Window chrome */}
            <div className="mb-3 flex items-center gap-1.5 px-1">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
                <span className="text-muted-foreground ml-3 text-xs">
                    Project: Weekly Product Review
                </span>
            </div>

            <div className="border-border bg-background/80 overflow-hidden rounded-xl border">
                {/* Project header */}
                <div className="border-border flex items-center justify-between border-b px-4 py-3">
                    <div>
                        <p className="text-muted-foreground text-xs">
                            Project workspace
                        </p>
                        <p className="text-foreground text-sm font-semibold">
                            Weekly Product Review
                        </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Audio uploaded
                    </span>
                </div>

                <div className="grid gap-3 p-3 sm:grid-cols-[1fr_168px]">
                    {/* Left: audio file + transcript */}
                    <div className="space-y-2">
                        {/* Audio file row */}
                        <div className="border-border bg-muted/30 flex items-center gap-3 rounded-xl border px-3 py-2.5">
                            <div className="bg-primary/10 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
                                <FileAudio className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-foreground truncate text-sm font-medium">
                                    product-review-june.mp3
                                </p>
                                <p className="text-muted-foreground text-xs">
                                    Transcript generated · 3 speakers
                                </p>
                            </div>
                        </div>

                        {/* Transcript rows */}
                        {transcriptLines.map(({ time, speaker, text }) => (
                            <div
                                key={time}
                                className="group bg-muted/20 hover:border-border hover:bg-muted/50 rounded-xl border border-transparent px-3 py-2.5 transition-colors"
                            >
                                <div className="mb-1 flex items-center gap-2">
                                    <span className="text-muted-foreground font-mono text-[10px]">
                                        {time}
                                    </span>
                                    <span className="text-primary text-xs font-semibold">
                                        {speaker}
                                    </span>
                                </div>
                                <p className="text-foreground text-xs leading-5">
                                    {text}
                                </p>
                            </div>
                        ))}

                        {/* AI chat block */}
                        <div className="border-border bg-muted/30 rounded-xl border px-3 py-2.5">
                            <div className="mb-2 flex items-center gap-2">
                                <MessageSquareText className="text-primary h-3.5 w-3.5" />
                                <span className="text-foreground text-xs font-medium">
                                    AI answer
                                </span>
                            </div>
                            <p className="text-muted-foreground mb-2 text-xs">
                                <span className="text-foreground font-medium">
                                    Q:
                                </span>{' '}
                                What decisions were made?
                            </p>
                            <ul className="text-muted-foreground space-y-1 text-xs">
                                <li className="flex items-start gap-1.5">
                                    <span className="bg-primary mt-1 h-1 w-1 shrink-0 rounded-full" />
                                    Tag follow-ups directly on transcript
                                    segments
                                </li>
                                <li className="flex items-start gap-1.5">
                                    <span className="bg-primary mt-1 h-1 w-1 shrink-0 rounded-full" />
                                    Route searchable summaries to support team
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Right: side stats */}
                    <div className="flex flex-col gap-2">
                        {sideStats.map(({ icon: Icon, label, color }) => (
                            <div
                                key={label}
                                className="border-border bg-muted/30 flex items-center gap-2.5 rounded-xl border px-3 py-3"
                            >
                                <Icon className={`h-4 w-4 shrink-0 ${color}`} />
                                <p className="text-foreground text-xs leading-tight font-medium">
                                    {label}
                                </p>
                            </div>
                        ))}

                        {/* Mini file icon */}
                        <div className="border-border bg-muted/30 mt-auto rounded-xl border px-3 py-3 text-center">
                            <FileText className="text-muted-foreground mx-auto mb-1 h-5 w-5" />
                            <p className="text-muted-foreground text-[10px]">
                                Export-ready
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
