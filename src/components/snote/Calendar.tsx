'use client';

import { useRouter } from 'next/navigation';
import { CalendarDays, FolderOpen } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function Calendar() {
    const router = useRouter();

    return (
        <div className="mx-auto flex max-w-3xl flex-col items-center p-8 text-center">
            <div className="bg-muted mb-5 flex h-16 w-16 items-center justify-center rounded-2xl">
                <CalendarDays className="text-muted-foreground h-8 w-8" />
            </div>
            <h1 className="text-foreground mb-2 text-3xl font-semibold">
                Lịch
            </h1>
            <p className="text-muted-foreground mb-6 max-w-xl">
                Tính năng lịch sẽ được mở sau khi backend cung cấp API sự kiện.
                Hiện tại Snote không hiển thị dữ liệu lịch giả.
            </p>
            <Button onClick={() => router.push('/meetings')}>
                <FolderOpen className="mr-2 h-4 w-4" />
                Mở danh sách cuộc họp
            </Button>
        </div>
    );
}
