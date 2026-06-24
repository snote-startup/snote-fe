'use client';

import { FolderLock, KeyRound, ShieldCheck, UserCheck } from 'lucide-react';
import { Reveal } from './Reveal';

const points = [
    {
        icon: KeyRound,
        title: 'Phiên đăng nhập bằng token',
        description:
            'Mỗi phiên làm việc cần token xác thực. Dữ liệu dự án không mở cho người dùng ẩn danh.',
    },
    {
        icon: UserCheck,
        title: 'Điều hướng theo vai trò',
        description:
            'Giao diện hiển thị theo quyền tài khoản. Khu vực quản trị chỉ dành cho tài khoản admin.',
    },
    {
        icon: FolderLock,
        title: 'Tổ chức theo dự án',
        description:
            'Audio, transcript và chat AI được tách theo từng dự án để tránh lẫn dữ liệu.',
    },
    {
        icon: ShieldCheck,
        title: 'Không gian cần xác thực',
        description:
            'Các route trong ứng dụng yêu cầu phiên đăng nhập hợp lệ trước khi truy cập.',
    },
];

export function Security() {
    return (
        <section id="security" className="relative z-10 py-20 sm:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-12 lg:grid-cols-[380px_1fr] lg:items-center">
                    <Reveal>
                        <p className="text-primary mb-3 text-sm font-semibold">
                            Bảo mật
                        </p>
                        <h2 className="text-foreground mb-4 text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
                            Thiết kế cho không gian làm việc cần xác thực.
                        </h2>
                        <p className="text-muted-foreground text-base leading-relaxed">
                            Snote giữ dữ liệu cuộc họp trong phạm vi tài khoản,
                            dự án và phiên đăng nhập hợp lệ.
                        </p>
                    </Reveal>

                    <div className="grid gap-4 sm:grid-cols-2">
                        {points.map((p, i) => {
                            const Icon = p.icon;
                            return (
                                <Reveal key={p.title} delay={i * 60}>
                                    <article className="border-border bg-card hover:border-primary/20 flex h-full gap-4 rounded-2xl border p-5 transition-colors">
                                        <div className="bg-primary/10 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
                                            <Icon className="h-4.5 w-4.5" />
                                        </div>
                                        <div>
                                            <h3 className="text-foreground mb-1.5 text-sm font-semibold">
                                                {p.title}
                                            </h3>
                                            <p className="text-muted-foreground text-sm leading-6">
                                                {p.description}
                                            </p>
                                        </div>
                                    </article>
                                </Reveal>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
