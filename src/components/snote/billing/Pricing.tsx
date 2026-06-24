'use client';

import { useRouter } from 'next/navigation';
import { Check, Info } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useApp } from '@/providers/snote-app-provider';

const plans = [
    {
        name: 'Cơ bản',
        description:
            'Dùng các flow hiện có: dự án, upload audio, transcript và chat AI.',
        features: [
            'Quản lý dự án cuộc họp',
            'Tải audio lên để tạo transcript',
            'Chat AI có nguồn tham chiếu',
            'Công việc theo từng dự án',
        ],
    },
    {
        name: 'Nâng cao',
        description:
            'Thông tin gói sẽ được xác nhận khi backend billing sẵn sàng.',
        features: [
            'Billing provider thật',
            'Hạn mức và gói dịch vụ từ backend',
            'Hóa đơn và phương thức thanh toán',
            'Chính sách nâng cấp/hủy gói',
        ],
    },
];

export function Pricing() {
    const router = useRouter();
    const { user } = useApp();

    return (
        <div className="min-h-full px-4 py-12">
            <div className="mx-auto max-w-5xl">
                <div className="mb-12 text-center">
                    <h1 className="mb-4 text-4xl font-semibold">Gói dịch vụ</h1>
                    <p className="text-muted-foreground text-lg">
                        Billing chưa có API chính thức, nên trang này không mô
                        phỏng thanh toán hoặc số sử dụng.
                    </p>
                </div>

                <div className="mb-8 flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-left text-sm text-amber-900 dark:border-amber-700/50 dark:bg-amber-950/20 dark:text-amber-300">
                    <Info className="mt-0.5 h-5 w-5 shrink-0" />
                    <span>
                        Nâng cấp gói sẽ được mở sau khi backend hoàn thiện
                        billing provider.
                    </span>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {plans.map((plan) => (
                        <article
                            key={plan.name}
                            className="border-border bg-card rounded-xl border p-6"
                        >
                            <h2 className="text-foreground mb-2 text-2xl font-semibold">
                                {plan.name}
                            </h2>
                            <p className="text-muted-foreground mb-6">
                                {plan.description}
                            </p>
                            <ul className="mb-6 space-y-3">
                                {plan.features.map((feature) => (
                                    <li
                                        key={feature}
                                        className="text-foreground flex items-start gap-2"
                                    >
                                        <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <Button className="w-full" disabled>
                                Nâng cấp sau
                            </Button>
                        </article>
                    ))}
                </div>

                <div className="mt-10 flex flex-wrap justify-center gap-3">
                    {user ? (
                        <Button onClick={() => router.push('/billing')}>
                            Mở gói dịch vụ
                        </Button>
                    ) : (
                        <>
                            <Button onClick={() => router.push('/register')}>
                                Đăng ký
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => router.push('/login')}
                            >
                                Đăng nhập
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
