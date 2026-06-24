'use client';

import Link from 'next/link';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Reveal } from './Reveal';

type Tier = {
    name: string;
    description: string;
    highlight: boolean;
    perks: string[];
    cta: {
        label: string;
        href?: string;
    };
};

const tiers: Tier[] = [
    {
        name: 'Truy cập hiện tại',
        description: 'Tài khoản đang hoạt động.',
        highlight: false,
        perks: [
            'Tạo dự án cuộc họp',
            'Tải audio lên',
            'Xem transcript',
            'Hỏi đáp với trợ lý AI',
        ],
        cta: { label: 'Bắt đầu', href: '/register' },
    },
    {
        name: 'Gói nâng cấp',
        description:
            'Thông tin gói dịch vụ sẽ dùng API thật khi backend sẵn sàng.',
        highlight: true,
        perks: [
            'Thanh toán thật',
            'Trạng thái gói dịch vụ thật',
            'Lịch sử hóa đơn thật',
            'Không hiển thị số sử dụng giả',
        ],
        cta: { label: 'Chờ API billing' },
    },
];

export function PricingTeaser() {
    return (
        <section id="pricing" className="relative z-10 py-20 sm:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Reveal className="mb-12 max-w-2xl">
                    <p className="text-primary mb-3 text-sm font-semibold">
                        Gói dịch vụ
                    </p>
                    <h2 className="text-foreground text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
                        Dùng luồng thật, không hiển thị số giả.
                    </h2>
                    <p className="text-muted-foreground mt-4 text-base leading-relaxed">
                        Trang billing sẽ được mở đầy đủ khi backend cung cấp API
                        thanh toán và trạng thái gói dịch vụ.
                    </p>
                </Reveal>

                <div className="grid gap-4 sm:grid-cols-2 lg:max-w-3xl">
                    {tiers.map((tier, i) => (
                        <Reveal key={tier.name} delay={i * 80}>
                            <div
                                className={`relative flex h-full flex-col rounded-2xl border p-6 ${
                                    tier.highlight
                                        ? 'border-primary/40 from-primary/5 bg-gradient-to-b to-transparent'
                                        : 'border-border bg-card'
                                }`}
                            >
                                {tier.highlight && (
                                    <span className="bg-primary text-primary-foreground absolute top-4 right-4 rounded-full px-2.5 py-0.5 text-[10px] font-semibold">
                                        Chờ backend
                                    </span>
                                )}
                                <h3 className="text-foreground mb-1 text-lg font-semibold">
                                    {tier.name}
                                </h3>
                                <p className="text-muted-foreground mb-5 text-sm">
                                    {tier.description}
                                </p>
                                <ul className="mb-6 flex-1 space-y-2">
                                    {tier.perks.map((perk) => (
                                        <li
                                            key={perk}
                                            className="text-muted-foreground flex items-center gap-2 text-sm"
                                        >
                                            <Check className="text-primary h-4 w-4 shrink-0" />
                                            {perk}
                                        </li>
                                    ))}
                                </ul>
                                {tier.cta.href ? (
                                    <Button asChild className="w-full">
                                        <Link href={tier.cta.href}>
                                            {tier.cta.label}
                                        </Link>
                                    </Button>
                                ) : (
                                    <Button
                                        disabled
                                        variant="outline"
                                        className="w-full"
                                    >
                                        {tier.cta.label}
                                    </Button>
                                )}
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
