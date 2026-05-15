'use client';

import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function Home() {
    return (
        <div className="flex min-h-screen items-center justify-center gap-4">
            <Button
                onClick={() =>
                    toast.info('Thông tin', {
                        description: 'Đây là toast info màu tím Snote.',
                    })
                }
            >
                Info Toast
            </Button>

            <Button
                onClick={() =>
                    toast.success('Thành công', {
                        description: 'Dữ liệu đã được lưu thành công.',
                    })
                }
            >
                Success Toast
            </Button>

            <Button
                onClick={() =>
                    toast.warning('Cảnh báo', {
                        description: 'Bạn có thay đổi chưa được lưu.',
                    })
                }
            >
                Warning Toast
            </Button>

            <Button
                variant="destructive"
                onClick={() =>
                    toast.error('Đã xảy ra lỗi', {
                        description: 'Không thể kết nối tới server.',
                    })
                }
            >
                Error Toast
            </Button>
        </div>
    );
}
