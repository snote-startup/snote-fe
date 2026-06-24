'use client';

import { CreditCard, Info, UserCheck } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useApp } from '@/providers/snote-app-provider';

export function Billing() {
    const { user } = useApp();

    if (!user) return null;

    return (
        <div className="mx-auto max-w-5xl p-8">
            <div className="mb-8">
                <h1 className="text-foreground mb-2 text-3xl font-semibold">
                    Gói dịch vụ
                </h1>
                <p className="text-muted-foreground">
                    Xem trạng thái tài khoản và thông tin thanh toán.
                </p>
            </div>

            <div className="border-border bg-card mb-6 rounded-xl border p-6">
                <div className="mb-5 flex items-start gap-4">
                    <div className="bg-primary/10 text-primary flex h-11 w-11 items-center justify-center rounded-xl">
                        <UserCheck className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-foreground mb-1 text-xl font-semibold">
                            Tài khoản đang hoạt động
                        </h2>
                        <p className="text-muted-foreground">
                            Snote chưa có API hạn mức/gói dịch vụ chính thức
                            trên frontend này, nên không hiển thị số phút hoặc
                            giới hạn giả.
                        </p>
                    </div>
                </div>
            </div>

            <div className="border-border bg-card rounded-xl border p-6">
                <div className="mb-5 flex items-start gap-4">
                    <div className="bg-muted flex h-11 w-11 items-center justify-center rounded-xl">
                        <CreditCard className="text-muted-foreground h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-foreground mb-1 text-lg font-semibold">
                            Thanh toán chưa khả dụng
                        </h2>
                        <p className="text-muted-foreground">
                            Nâng cấp gói, hủy gói, phương thức thanh toán và hóa
                            đơn sẽ được mở sau khi backend cung cấp API billing.
                        </p>
                    </div>
                </div>

                <div className="border-border bg-muted/40 text-muted-foreground mb-5 flex items-start gap-2 rounded-lg border p-3 text-sm">
                    <Info className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>
                        Tính năng này sẽ được mở sau khi backend hoàn thiện.
                    </span>
                </div>

                <div className="flex flex-wrap gap-3">
                    <Button disabled>Nâng cấp gói</Button>
                    <Button variant="outline" disabled>
                        Cập nhật thanh toán
                    </Button>
                    <Button variant="outline" disabled>
                        Tải hóa đơn
                    </Button>
                </div>
            </div>
        </div>
    );
}
