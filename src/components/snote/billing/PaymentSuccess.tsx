'use client';

import { useRouter } from 'next/navigation';
import { Info } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function PaymentSuccess() {
    const router = useRouter();

    return (
        <div className="mx-auto flex max-w-2xl flex-col items-center p-8 text-center">
            <div className="bg-muted mb-5 flex h-16 w-16 items-center justify-center rounded-2xl">
                <Info className="text-muted-foreground h-8 w-8" />
            </div>
            <h1 className="text-foreground mb-2 text-3xl font-semibold">
                Chưa có thanh toán thật
            </h1>
            <p className="text-muted-foreground mb-6">
                Backend billing chưa được tích hợp, nên Snote không hiển thị
                trạng thái thanh toán thành công giả.
            </p>
            <Button onClick={() => router.push('/billing')}>
                Quay lại gói dịch vụ
            </Button>
        </div>
    );
}
