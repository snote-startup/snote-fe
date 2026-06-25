'use client';

import { CreditCard, Info, UserCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/providers/snote-app-provider';
import { useQuota, useBuyQuota } from '@/features/quota/hooks';
import { useProjects } from '@/features/projects/hooks';
import { useI18n } from '@/features/i18n/use-i18n';
import { toast } from 'sonner';

export function Billing() {
    const { user } = useApp();
    const { t } = useI18n();

    const {
        data: quota,
        isLoading: isQuotaLoading,
        error: quotaError,
    } = useQuota();
    const { data: projects, isLoading: isProjectsLoading } = useProjects();
    const buyQuotaMutation = useBuyQuota();

    if (!user) return null;

    const handleUpgrade = () => {
        buyQuotaMutation.mutate(undefined, {
            onSuccess: (paymentUrl) => {
                if (paymentUrl) {
                    window.location.href = paymentUrl;
                } else {
                    toast.error('Không tìm thấy link thanh toán.');
                }
            },
            onError: (err) => {
                toast.error(err.message || 'Lỗi khi tạo yêu cầu thanh toán.');
            },
        });
    };

    const usedCount = projects?.length ?? 0;
    const limitCount = quota?.projectsLimit ?? 5;
    const isPremium = limitCount > 5;

    return (
        <div className="mx-auto max-w-5xl p-8">
            <div className="mb-8">
                <h1 className="text-foreground mb-2 text-3xl font-semibold">
                    {t('billing.title')}
                </h1>
                <p className="text-muted-foreground">{t('billing.subtitle')}</p>
            </div>

            {/* Quota limit card */}
            <div className="border-border bg-card mb-6 rounded-xl border p-6">
                <div className="mb-5 flex items-start gap-4">
                    <div className="bg-primary/10 text-primary flex h-11 w-11 items-center justify-center rounded-xl">
                        <UserCheck className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-foreground mb-1 text-xl font-semibold">
                            {t('billing.statusActive')}
                        </h2>
                        <p className="text-muted-foreground mb-4 text-sm">
                            {t('billing.statusDesc')}
                        </p>

                        {isQuotaLoading || isProjectsLoading ? (
                            <div className="text-muted-foreground flex items-center gap-2 text-sm">
                                <Loader2 className="text-primary h-4 w-4 animate-spin" />
                                <span>{t('billing.loading')}</span>
                            </div>
                        ) : quotaError ? (
                            <p className="text-sm text-red-500">
                                Lỗi khi tải thông tin hạn mức.
                            </p>
                        ) : (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-foreground text-sm font-semibold">
                                        {isPremium
                                            ? t('billing.planPremium')
                                            : t('billing.planFree')}
                                    </span>
                                    <span className="bg-primary/10 text-primary rounded-full px-2.5 py-0.5 text-xs font-semibold">
                                        {isPremium ? 'PRO' : 'FREE'}
                                    </span>
                                </div>
                                <div className="max-w-md">
                                    <div className="text-muted-foreground mb-1.5 flex justify-between text-xs font-medium">
                                        <span>
                                            {t('billing.projectsUsage')
                                                .replace(
                                                    '{used}',
                                                    String(usedCount),
                                                )
                                                .replace(
                                                    '{limit}',
                                                    String(limitCount),
                                                )}
                                        </span>
                                        <span>
                                            {Math.round(
                                                (usedCount / limitCount) * 100,
                                            )}
                                            %
                                        </span>
                                    </div>
                                    <div className="bg-secondary h-2.5 w-full overflow-hidden rounded-full">
                                        <div
                                            className="bg-primary h-full rounded-full transition-all duration-500"
                                            style={{
                                                width: `${Math.min(
                                                    (usedCount / limitCount) *
                                                        100,
                                                    100,
                                                )}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Pricing details and checkout action */}
            <div className="border-border bg-card rounded-xl border p-6">
                <div className="mb-5 flex items-start gap-4">
                    <div className="bg-primary/10 text-primary flex h-11 w-11 items-center justify-center rounded-xl">
                        <CreditCard className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-foreground mb-1 text-lg font-semibold">
                            {isPremium
                                ? t('billing.planPremium')
                                : t('billing.upgradeBtn')}
                        </h2>
                        <p className="text-muted-foreground mb-4 text-sm">
                            {isPremium
                                ? 'Cảm ơn bạn đã nâng cấp gói Premium! Tài khoản của bạn hiện có hạn mức tạo tối đa 20 dự án.'
                                : t('billing.upgradeDesc')}
                        </p>

                        {!isPremium && (
                            <div className="border-border bg-muted/40 text-muted-foreground mb-5 flex items-start gap-2 rounded-lg border p-3 text-sm">
                                <Info className="mt-0.5 h-4 w-4 shrink-0" />
                                <span>{t('common.comingSoon')}</span>
                            </div>
                        )}

                        <div className="flex flex-wrap gap-3">
                            {!isPremium && (
                                <Button
                                    onClick={handleUpgrade}
                                    disabled={buyQuotaMutation.isPending}
                                    className="min-w-[150px]"
                                >
                                    {buyQuotaMutation.isPending && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    {t('billing.upgradeBtn')}
                                </Button>
                            )}
                            <Button variant="outline" disabled>
                                {t('billing.updatePayment')}
                            </Button>
                            <Button variant="outline" disabled>
                                {t('billing.downloadInvoice')}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
