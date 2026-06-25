'use client';

import { useRouter } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/features/i18n/use-i18n';

export function PaymentSuccess() {
    const router = useRouter();
    const { t } = useI18n();

    return (
        <div className="mx-auto flex max-w-2xl flex-col items-center p-8 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/30">
                <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-500" />
            </div>
            <h1 className="text-foreground mb-2 text-3xl font-semibold">
                {t('payment.success.title')}
            </h1>
            <p className="text-muted-foreground mb-6">
                {t('payment.success.desc')}
            </p>
            <Button onClick={() => router.push('/billing')}>
                {t('payment.success.back')}
            </Button>
        </div>
    );
}
