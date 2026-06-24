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
        title: 'Câu trả lời có nguồn',
        description:
            'Mỗi phản hồi AI liên kết về đúng đoạn transcript. Bấm vào nguồn để quay lại lượt nói gốc.',
    },
    {
        icon: Search,
        title: 'Tìm trong toàn bộ transcript',
        description:
            'Tìm từ khóa, tên người nói hoặc cụm từ trong toàn bộ cuộc họp.',
    },
    {
        icon: Download,
        title: 'Tải audio gốc',
        description: 'Mở lại bản ghi đầy đủ khi cần kiểm chứng nội dung.',
    },
    {
        icon: MessageSquareText,
        title: 'Review cùng trợ lý AI',
        description:
            'Hỏi tiếp tự nhiên trên cùng ngữ cảnh cuộc họp và xem nguồn từ transcript.',
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
                            Nguồn tham chiếu
                        </p>
                        <h2 className="mb-4 text-3xl leading-tight font-semibold tracking-tight text-zinc-100 sm:text-4xl">
                            AI trả lời kèm căn cứ.
                        </h2>
                        <p className="text-base leading-relaxed text-zinc-400">
                            Không chỉ tóm tắt. Mỗi câu trả lời có thể truy về
                            đoạn transcript có mốc thời gian để bạn kiểm chứng.
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
                            Ví dụ nguồn:
                        </span>
                        {[
                            {
                                label: 'Mina · 00:14',
                                topic: 'Lỗ hổng onboarding',
                            },
                            { label: 'Ken · 01:02', topic: 'Gắn follow-up' },
                            {
                                label: 'Ari · 02:21',
                                topic: 'Tóm tắt tìm kiếm được',
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
