'use client';

import { ArrowRight, Bot, FileAudio, MessageSquareText } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Reveal } from './Reveal';

const demoTranscript = [
    {
        time: '00:32',
        speaker: 'Minh',
        text: 'Chúng ta cần chốt phạm vi MVP trước buổi demo thứ Năm.',
    },
    {
        time: '01:15',
        speaker: 'Lan',
        text: 'Đội backend sẽ xác nhận endpoint task trong hôm nay.',
    },
    {
        time: '02:04',
        speaker: 'Huy',
        text: 'Phần realtime audio sẽ tách sang phase sau khi protocol ổn định.',
    },
];

const aiQA = [
    {
        q: 'Cuộc họp đã quyết định gì?',
        a: 'MVP giữ luồng upload audio, transcript, hỏi đáp AI và task theo dự án.',
    },
    {
        q: 'Có công việc nào cần theo dõi?',
        a: 'Backend xác nhận endpoint task. Frontend defer realtime audio đến phase sau.',
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
                    <Reveal>
                        <p className="text-primary mb-3 text-sm font-semibold">
                            Transcript + Trợ lý AI
                        </p>
                        <h2 className="text-foreground mb-4 text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
                            Hỏi trực tiếp trên nội dung cuộc họp.
                        </h2>
                        <p className="text-muted-foreground mb-6 text-base leading-relaxed">
                            Câu trả lời được nối với transcript và nguồn tham
                            chiếu, giúp người dùng kiểm tra lại ngữ cảnh trước
                            khi ra quyết định.
                        </p>
                        <Button asChild>
                            <Link href="/dashboard">
                                Mở ứng dụng
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </Reveal>

                    <Reveal delay={120}>
                        <div className="border-border bg-card/70 rounded-2xl border p-3 shadow-xl shadow-black/5 dark:shadow-black/30">
                            <div className="mb-3 flex items-center gap-1.5 px-1">
                                <span className="h-2 w-2 rounded-full bg-red-400/70" />
                                <span className="h-2 w-2 rounded-full bg-yellow-400/70" />
                                <span className="h-2 w-2 rounded-full bg-emerald-400/70" />
                                <span className="text-muted-foreground ml-3 text-xs">
                                    Kế hoạch demo - Trợ lý AI
                                </span>
                            </div>

                            <div className="border-border bg-background/80 rounded-xl border">
                                <div className="border-border flex items-center gap-3 border-b px-4 py-3">
                                    <div className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                                        <FileAudio className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-foreground text-xs font-medium">
                                            demo-planning-call.mp3
                                        </p>
                                        <p className="text-muted-foreground text-[11px]">
                                            3 người nói - 12 phút
                                        </p>
                                    </div>
                                    <span className="ml-auto rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                                        Transcript sẵn sàng
                                    </span>
                                </div>

                                <div className="grid gap-3 p-3 lg:grid-cols-2">
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

                                    <div className="space-y-2">
                                        <p className="text-muted-foreground flex items-center gap-1.5 px-1 text-[10px] font-semibold tracking-wider uppercase">
                                            <Bot className="h-3 w-3" />
                                            Trợ lý AI
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
