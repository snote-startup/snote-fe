'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/features/i18n/use-i18n';
import { useQuota } from '@/features/quota/hooks';

export function PaymentSuccess() {
    const router = useRouter();
    const { t } = useI18n();

    const {
        data: quota,
        refetch: refetchQuota,
        isLoading: isQuotaLoading,
    } = useQuota();
    const [pollCount, setPollCount] = useState(0);

    const isUpgraded = !!(
        quota &&
        quota.projectsLimit !== undefined &&
        quota.projectsLimit >= 20
    );
    const isPending = !isUpgraded && pollCount >= 10;
    const isUpdating = !isUpgraded && pollCount < 10;

    useEffect(() => {
        if (isQuotaLoading || isUpgraded || isPending) return;

        const timer = setTimeout(() => {
            setPollCount((prev) => prev + 1);
            refetchQuota();
        }, 2000);
        return () => clearTimeout(timer);
    }, [quota, isQuotaLoading, pollCount, refetchQuota, isUpgraded, isPending]);

    const handleRetry = () => {
        setPollCount(0);
        refetchQuota();
    };

    if (isUpdating) {
        return (
            <div className="mx-auto flex max-w-2xl flex-col items-center p-8 text-center">
                <div className="bg-primary/10 mb-5 flex h-16 w-16 items-center justify-center rounded-2xl">
                    <Loader2 className="text-primary h-8 w-8 animate-spin" />
                </div>
                <h1 className="text-foreground mb-2 text-3xl font-semibold">
                    {t('payment.success.updating')}
                </h1>
                {pollCount > 0 && (
                    <p className="text-muted-foreground mb-6">
                        {t('payment.success.pending')}
                    </p>
                )}
            </div>
        );
    }

    if (isPending) {
        return (
            <div className="mx-auto flex max-w-2xl flex-col items-center p-8 text-center">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-950/30">
                    <AlertCircle className="h-8 w-8 text-amber-600 dark:text-amber-500" />
                </div>
                <h1 className="text-foreground mb-2 text-3xl font-semibold">
                    {t('payment.success.pendingTitle')}
                </h1>
                <p className="text-muted-foreground mb-6">
                    {t('payment.success.timeoutDesc')}
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                    <Button onClick={handleRetry}>
                        {t('payment.success.retryBtn')}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => router.push('/billing')}
                    >
                        {t('payment.success.back')}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto flex max-w-2xl flex-col items-center p-8 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/30">
                <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-500" />
            </div>
            <h1 className="text-foreground mb-2 text-3xl font-semibold">
                {t('payment.success.title')}
            </h1>
            <p className="text-muted-foreground mb-6">
                {t('payment.success.upgradedDesc')}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
                <Button onClick={() => router.push('/dashboard')}>
                    {t('nav.dashboard')}
                </Button>
                <Button
                    variant="outline"
                    onClick={() => router.push('/meetings')}
                >
                    {t('nav.meetings')}
                </Button>
            </div>
        </div>
    );
}
