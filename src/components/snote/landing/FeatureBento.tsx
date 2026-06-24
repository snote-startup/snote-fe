'use client';

import {
    Bot,
    FileAudio,
    FolderKanban,
    Search,
    Sparkles,
    UsersRound,
} from 'lucide-react';
import { Reveal } from './Reveal';

const features = [
    {
        icon: FolderKanban,
        title: 'Không gian theo dự án',
        description:
            'Audio, transcript, lịch sử chat AI và công việc được gom theo từng cuộc họp.',
        span: 'md:col-span-2',
        accent: 'from-purple-500/10 to-transparent',
    },
    {
        icon: FileAudio,
        title: 'Tải audio lên',
        description:
            'Tải bản ghi cuộc họp lên để backend xử lý transcript theo dự án.',
        span: 'md:col-span-1',
        accent: 'from-blue-500/10 to-transparent',
    },
    {
        icon: UsersRound,
        title: 'Transcript theo người nói',
        description:
            'Xem các đoạn hội thoại theo mốc thời gian và người nói khi dữ liệu có sẵn.',
        span: 'md:col-span-1',
        accent: 'from-indigo-500/10 to-transparent',
    },
    {
        icon: Bot,
        title: 'Hỏi đáp với trợ lý AI',
        description:
            'Đặt câu hỏi trên transcript để tìm quyết định, rủi ro và bước tiếp theo.',
        span: 'md:col-span-2',
        accent: 'from-violet-500/10 to-transparent',
    },
    {
        icon: Search,
        title: 'Tìm kiếm và rà soát',
        description:
            'Tìm nhanh trong transcript theo từ khóa hoặc đoạn hội thoại.',
        span: 'md:col-span-1',
        accent: 'from-sky-500/10 to-transparent',
    },
    {
        icon: Sparkles,
        title: 'Công việc sau cuộc họp',
        description: 'Tạo task từ transcript bằng API project-scoped hiện có.',
        span: 'md:col-span-1',
        accent: 'from-fuchsia-500/10 to-transparent',
    },
];

export function FeatureBento() {
    return (
        <section id="features" className="relative z-10 py-20 sm:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Reveal>
                    <div className="mb-12 max-w-2xl">
                        <p className="text-primary mb-3 text-sm font-semibold">
                            Tính năng
                        </p>
                        <h2 className="text-foreground text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
                            Mọi thứ xoay quanh transcript cuộc họp.
                        </h2>
                        <p className="text-muted-foreground mt-4 text-base leading-relaxed">
                            Một nơi để quản lý audio, transcript, câu hỏi AI và
                            công việc cần theo dõi.
                        </p>
                    </div>
                </Reveal>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {features.map((f, i) => {
                        const Icon = f.icon;
                        return (
                            <Reveal
                                key={f.title}
                                delay={i * 60}
                                className={f.span}
                            >
                                <article className="group border-border bg-card hover:border-primary/25 relative h-full overflow-hidden rounded-2xl border p-6 transition-all duration-200 hover:shadow-md hover:shadow-black/5 dark:hover:shadow-black/20">
                                    <div
                                        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${f.accent} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                                    />

                                    <div className="relative">
                                        <div className="bg-primary/10 text-primary mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl">
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <h3 className="text-foreground mb-2 text-base font-semibold">
                                            {f.title}
                                        </h3>
                                        <p className="text-muted-foreground text-sm leading-6">
                                            {f.description}
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
