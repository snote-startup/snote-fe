'use client';

import Link from 'next/link';
import Image from 'next/image';

const footerLinks = [
    {
        section: 'Sản phẩm',
        links: [
            { label: 'Tính năng', href: '#features' },
            { label: 'Quy trình', href: '#workflow' },
            { label: 'Gói dịch vụ', href: '/pricing' },
        ],
    },
    {
        section: 'Không gian làm việc',
        links: [
            { label: 'Tổng quan', href: '/dashboard' },
            { label: 'Cuộc họp', href: '/meetings' },
            { label: 'Công việc', href: '/tasks' },
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

export function Footer() {
    return (
        <footer className="border-border bg-muted/10 relative z-10 border-t">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[240px_repeat(3,1fr)]">
                    <div className="sm:col-span-2 lg:col-span-1">
                        <Link href="/" className="mb-4 inline-flex">
                            <Image
                                src="/snote-logo.png"
                                alt="Snote"
                                width={100}
                                height={28}
                                className="h-auto w-[92px]"
                            />
                        </Link>
                        <p className="text-muted-foreground mt-3 max-w-xs text-sm leading-6">
                            Tạo dự án, tải audio lên, xem transcript và hỏi đáp
                            với trợ lý AI trên nội dung cuộc họp.
                        </p>
                    </div>

                    {footerLinks.map(({ section, links }) => (
                        <div key={section}>
                            <p className="text-foreground mb-4 text-xs font-semibold tracking-wider uppercase">
                                {section}
                            </p>
                            <ul className="space-y-2.5">
                                {links.map(({ label, href }) => (
                                    <li key={label}>
                                        <Link
                                            href={href}
                                            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                                        >
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="border-border mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
                    <p
                        className="text-muted-foreground text-xs"
                        suppressHydrationWarning
                    >
                        © {new Date().getFullYear()} Snote. Không gian
                        transcript cuộc họp.
                    </p>
                    <p className="text-muted-foreground text-xs">
                        Xây dựng cho luồng làm việc sau cuộc họp.
                    </p>
                </div>
            </div>
        </footer>
    );
}
