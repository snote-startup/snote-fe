'use client';

import { useRouter } from 'next/navigation';
import { FolderOpen, Radio } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function RealtimeDeferred() {
    const router = useRouter();

    return (
        <div className="mx-auto flex max-w-3xl flex-col items-center p-8 text-center">
            <div className="bg-muted mb-5 flex h-16 w-16 items-center justify-center rounded-2xl">
                <Radio className="text-muted-foreground h-8 w-8" />
            </div>
            <h1 className="text-foreground mb-2 text-3xl font-semibold">
                Realtime stream tạm hoãn
            </h1>
            <p className="text-muted-foreground mb-6 max-w-xl">
                Snote chưa bật realtime audio streaming trong phase này. Tính
                năng sẽ được mở sau khi backend xác nhận protocol. Hiện tại hãy
                dùng flow thật: tạo cuộc họp, tải audio lên, tạo transcript,
                chat AI và quản lý công việc trong từng dự án.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
                <Button onClick={() => router.push('/meetings')}>
                    <FolderOpen className="mr-2 h-4 w-4" />
                    Mở danh sách cuộc họp
                </Button>
                <Button
                    variant="outline"
                    onClick={() => router.push('/dashboard')}
                >
                    Về tổng quan
                </Button>
            </div>
        </div>
    );
}
