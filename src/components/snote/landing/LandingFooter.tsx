'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Reveal } from './Reveal';
import { track } from '@vercel/analytics';

const footerLinks = [
    {
        section: 'Sản phẩm',
        links: [
            { label: 'Tính năng', href: '#workspace' },
            { label: 'Quy trình', href: '#workflow' },
            { label: 'Nguồn tham chiếu', href: '#references' },
            { label: 'Gói dịch vụ', href: '/pricing' },
        ],
    },
    {
        section: 'Workspace',
        links: [
            { label: 'Tổng quan', href: '/dashboard' },
            { label: 'Cuộc họp', href: '/meetings' },
        ],
    },
    {
        section: 'Tài khoản',
        links: [
            { label: 'Đăng nhập', href: '/login' },
            { label: 'Đăng ký', href: '/register' },
        ],
    },
];

export function LandingFooter() {
    return (
        <footer className="relative z-10">
            {/* ── CTA Section ── */}
            <section className="py-20 sm:py-28">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Reveal>
                        <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.03] p-10 text-center sm:p-16">
                            {/* Glow behind */}
                            <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgb(124_58_237_/_0.08),transparent_60%)]" />

                            <p className="mb-4 text-sm font-semibold text-violet-400">
                                Bắt đầu
                            </p>
                            <h2 className="mb-5 text-3xl leading-tight font-semibold tracking-tight text-zinc-100 sm:text-4xl lg:text-5xl">
                                Sẵn sàng xem lại cuộc họp tiếp theo?
                            </h2>
                            <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-zinc-400">
                                Tạo dự án và tải audio đầu tiên lên. Không cần
                                thẻ thanh toán.
                            </p>
                            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                                <Button
                                    asChild
                                    size="lg"
                                    className="h-12 bg-violet-600 px-8 text-white hover:bg-violet-500"
                                    onClick={() =>
                                        track('landing_primary_cta_clicked')
                                    }
                                >
                                    <Link href="/dashboard">
                                        Mở ứng dụng
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    size="lg"
                                    variant="ghost"
                                    className="h-12 border border-white/[0.1] px-8 text-zinc-300 hover:bg-white/[0.06] hover:text-zinc-100"
                                >
                                    <Link href="/login">Đăng nhập</Link>
                                </Button>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ── Footer links ── */}
            <div className="border-t border-white/[0.06]">
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[240px_repeat(3,1fr)]">
                        {/* Brand */}
                        <div className="sm:col-span-2 lg:col-span-1">
                            <Link href="/" className="mb-4 inline-flex">
                                <Image
                                    src="/snote-logo.png"
                                    alt="Snote"
                                    width={100}
                                    height={28}
                                    className="h-auto w-[92px] brightness-0 invert"
                                />
                            </Link>
                            <p className="mt-3 max-w-xs text-sm leading-6 text-zinc-500">
                                Workspace cuộc họp với AI. Tải audio, xem
                                transcript và nhận câu trả lời có nguồn.
                            </p>
                        </div>

                        {/* Links */}
                        {footerLinks.map(({ section, links }) => (
                            <div key={section}>
                                <p className="mb-4 text-xs font-semibold tracking-wider text-zinc-400 uppercase">
                                    {section}
                                </p>
                                <ul className="space-y-2.5">
                                    {links.map(({ label, href }) => (
                                        <li key={label}>
                                            <Link
                                                href={href}
                                                className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
                                            >
                                                {label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Bottom bar */}
                    <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 sm:flex-row">
                        <p
                            className="text-xs text-zinc-600"
                            suppressHydrationWarning
                        >
                            © {new Date().getFullYear()} Snote. Workspace cuộc
                            họp với AI.
                        </p>
                        <p className="text-xs text-zinc-600">
                            Xây dựng cho transcript có thể kiểm chứng.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
