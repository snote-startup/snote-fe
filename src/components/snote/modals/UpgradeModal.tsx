'use client';

import { useRouter } from 'next/navigation';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Info, Sparkles } from 'lucide-react';

interface UpgradeModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    reason?: 'minutes-exceeded' | 'trial-expired' | 'feature-locked';
}

export function UpgradeModal({
    open,
    onOpenChange,
    reason = 'feature-locked',
}: UpgradeModalProps) {
    const router = useRouter();

    const content = {
        'minutes-exceeded': {
            title: 'Gói dịch vụ chưa kết nối',
            description:
                'Frontend chưa có API thanh toán thật, nên không hiển thị số sử dụng giả.',
            icon: <Info className="h-6 w-6 text-blue-600" />,
        },
        'trial-expired': {
            title: 'Trạng thái tài khoản đang hoạt động',
            description:
                'Backend chưa cung cấp API dùng thử hoặc gói dịch vụ để cập nhật trạng thái này.',
            icon: <Info className="h-6 w-6 text-blue-600" />,
        },
        'feature-locked': {
            title: 'Tính năng chờ backend',
            description:
                'Tính năng này sẽ được mở sau khi backend cung cấp API chính thức.',
            icon: <Sparkles className="h-6 w-6 text-blue-600" />,
        },
    };

    const { title, description, icon } = content[reason];

    const handleOpenBilling = () => {
        onOpenChange(false);
        router.push('/billing');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                        {icon}
                    </div>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                <div className="my-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <p className="text-sm text-blue-900">
                        Tài khoản đang hoạt động. Các thay đổi về gói dịch vụ sẽ
                        chỉ được bật khi có API billing thật.
                    </p>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Đóng
                    </Button>
                    <Button onClick={handleOpenBilling}>Xem gói dịch vụ</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
