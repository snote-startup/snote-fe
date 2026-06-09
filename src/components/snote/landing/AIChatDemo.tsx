'use client';

import { Bot, FileAudio, MessageSquareText, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Reveal } from './Reveal';

const demoTranscript = [
    {
        time: '00:32',
        speaker: 'Jamie',
        text: 'We need to finalize the pricing tier before Thursday launch.',
    },
    {
        time: '01:15',
        speaker: 'Sam',
        text: 'Marketing confirmed the announcement goes out at 9 AM UTC.',
    },
    {
        time: '02:04',
        speaker: 'Priya',
        text: 'The free-tier limit should be 60 minutes per month, not 30.',
    },
];

const aiQA = [
    {
        q: 'What was decided about pricing?',
        a: 'Free-tier limit set to 60 min/month. Final pricing tier to be confirmed before Thursday launch.',
    },
    {
        q: 'Any action items?',
        a: 'Jamie to confirm pricing tier. Marketing to send announcement at 9 AM UTC on launch day.',
    },
];

export function AIChatDemo() {
    return (
        <section
            id="ai-demo"
            className="border-border bg-muted/20 relative z-10 border-y py-20 sm:py-24"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                    {/* Left: copy */}
                    <Reveal>
                        <p className="text-primary mb-3 text-sm font-semibold">
                            Transcript + AI chat
                        </p>
                        <h2 className="text-foreground mb-4 text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
                            Ask questions.
                            <br className="hidden sm:block" /> Get answers from
                            the actual conversation.
                        </h2>
                        <p className="text-muted-foreground mb-6 text-base leading-relaxed">
                            Every AI answer is grounded in the transcript — not
                            hallucinated. Ask about decisions, open questions,
                            action items, or anything said in the meeting.
                        </p>
                        <Button asChild>
                            <Link href="/dashboard">
                                Try it on your recording
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </Reveal>

                    {/* Right: demo panel */}
                    <Reveal delay={120}>
                        <div className="border-border bg-card/70 rounded-2xl border p-3 shadow-xl shadow-black/5 dark:shadow-black/30">
                            {/* Window chrome */}
                            <div className="mb-3 flex items-center gap-1.5 px-1">
                                <span className="h-2 w-2 rounded-full bg-red-400/70" />
                                <span className="h-2 w-2 rounded-full bg-yellow-400/70" />
                                <span className="h-2 w-2 rounded-full bg-emerald-400/70" />
                                <span className="text-muted-foreground ml-3 text-xs">
                                    Launch planning · AI chat
                                </span>
                            </div>

                            <div className="border-border bg-background/80 rounded-xl border">
                                {/* File header */}
                                <div className="border-border flex items-center gap-3 border-b px-4 py-3">
                                    <div className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                                        <FileAudio className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-foreground text-xs font-medium">
                                            launch-planning-call.mp3
                                        </p>
                                        <p className="text-muted-foreground text-[11px]">
                                            3 speakers · 12 min
                                        </p>
                                    </div>
                                    <span className="ml-auto rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                                        Transcript ready
                                    </span>
                                </div>

                                <div className="grid gap-3 p-3 lg:grid-cols-2">
                                    {/* Transcript */}
                                    <div className="space-y-2">
                                        <p className="text-muted-foreground px-1 text-[10px] font-semibold tracking-wider uppercase">
                                            Transcript
                                        </p>
                                        {demoTranscript.map(
                                            ({ time, speaker, text }) => (
                                                <div
                                                    key={time}
                                                    className="bg-muted/30 rounded-lg px-3 py-2"
                                                >
                                                    <div className="mb-1 flex items-center gap-2">
                                                        <span className="text-muted-foreground font-mono text-[10px]">
                                                            {time}
                                                        </span>
                                                        <span className="text-primary text-[11px] font-semibold">
                                                            {speaker}
                                                        </span>
                                                    </div>
                                                    <p className="text-foreground text-[11px] leading-4">
                                                        {text}
                                                    </p>
                                                </div>
                                            ),
                                        )}
                                    </div>

                                    {/* AI chat */}
                                    <div className="space-y-2">
                                        <p className="text-muted-foreground flex items-center gap-1.5 px-1 text-[10px] font-semibold tracking-wider uppercase">
                                            <Bot className="h-3 w-3" />
                                            AI chat
                                        </p>
                                        {aiQA.map(({ q, a }) => (
                                            <div
                                                key={q}
                                                className="bg-muted/30 space-y-1.5 rounded-lg px-3 py-2"
                                            >
                                                <div className="flex items-start gap-1.5">
                                                    <MessageSquareText className="text-muted-foreground mt-0.5 h-3 w-3 shrink-0" />
                                                    <p className="text-foreground text-[11px] font-medium">
                                                        {q}
                                                    </p>
                                                </div>
                                                <p className="text-muted-foreground pl-4.5 text-[11px] leading-4">
                                                    {a}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
