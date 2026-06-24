'use client';

import {
    GraduationCap,
    Users,
    Mic2,
    FlaskConical,
    BookOpen,
} from 'lucide-react';
import { Reveal } from './Reveal';

const cases = [
    {
        icon: GraduationCap,
        label: 'Lớp học online',
        description:
            'Ghi lại bài giảng và xem lại với AI. Tìm đúng đoạn giảng viên giải thích một khái niệm.',
    },
    {
        icon: Users,
        label: 'Họp nhóm',
        description:
            'Lưu standup, review sprint và planning. Trích xuất quyết định và việc cần làm.',
    },
    {
        icon: Mic2,
        label: 'Phỏng vấn',
        description:
            'Chép lời phỏng vấn ứng viên hoặc người dùng. Tìm câu trả lời cụ thể giữa nhiều buổi.',
    },
    {
        icon: FlaskConical,
        label: 'Cuộc gọi nghiên cứu',
        description:
            'Theo dõi lượt nói theo chủ đề, nhận diện mẫu lặp và trích xuất quote quan trọng.',
    },
    {
        icon: BookOpen,
        label: 'Ôn tập',
        description:
            'Xem lại buổi học đã ghi âm và nhờ AI tóm tắt các chủ đề cụ thể.',
    },
];

export function UseCases() {
    return (
        <section id="use-cases" className="relative z-10 py-20 sm:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Reveal className="mx-auto mb-14 max-w-2xl text-center">
                    <p className="mb-3 text-sm font-semibold text-violet-400">
                        Trường hợp sử dụng
                    </p>
                    <h2 className="text-3xl leading-tight font-semibold tracking-tight text-zinc-100 sm:text-4xl">
                        Dành cho những cuộc trò chuyện quan trọng.
                    </h2>
                    <p className="mt-4 text-base leading-relaxed text-zinc-500">
                        Mọi bản ghi cuộc trò chuyện đều có thể tìm kiếm và xem
                        lại.
                    </p>
                </Reveal>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {cases.map((c, i) => {
                        const Icon = c.icon;
                        return (
                            <Reveal
                                key={c.label}
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
                                            {c.label}
                                        </h3>
                                        <p className="text-sm leading-6 text-zinc-500">
                                            {c.description}
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
