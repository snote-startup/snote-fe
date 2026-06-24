'use client';

import { useRouter } from 'next/navigation';
import { CreditCard } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function Checkout() {
    const router = useRouter();

    return (
        <div className="mx-auto flex max-w-2xl flex-col items-center p-8 text-center">
            <div className="bg-muted mb-5 flex h-16 w-16 items-center justify-center rounded-2xl">
                <CreditCard className="text-muted-foreground h-8 w-8" />
            </div>
            <h1 className="text-foreground mb-2 text-3xl font-semibold">
                Thanh toán chưa khả dụng
            </h1>
            <p className="text-muted-foreground mb-6">
                Checkout sẽ được mở sau khi backend hoàn thiện billing provider.
                Trang này không mô phỏng thanh toán và không lưu thông tin thẻ.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
                <Button onClick={() => router.push('/billing')}>
                    Quay lại gói dịch vụ
                </Button>
                <Button
                    variant="outline"
                    onClick={() => router.push('/meetings')}
                >
                    Mở danh sách cuộc họp
                </Button>
            </div>
        </div>
    );
}
