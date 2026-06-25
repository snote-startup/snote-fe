'use client';

import {
    AlertCircle,
    Check,
    CreditCard,
    Loader2,
    UserCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/providers/snote-app-provider';
import { useQuota, useBuyQuota } from '@/features/quota/hooks';
import { useProjects } from '@/features/projects/hooks';
import { useI18n } from '@/features/i18n/use-i18n';
import { toast } from 'sonner';

const FREE_PROJECT_LIMIT = 5;
const PREMIUM_PROJECT_LIMIT = 20;

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
                    toast.error(t('billing.checkoutError'));
                }
            },
            onError: () => {
                toast.error(t('billing.checkoutError'));
            },
        });
    };

    const usedCount = projects?.length ?? 0;
    const limitCount = quota?.projectsLimit ?? FREE_PROJECT_LIMIT;
    const isPremium = limitCount >= PREMIUM_PROJECT_LIMIT;
    const progressPercent =
        limitCount > 0
            ? Math.min(100, Math.round((usedCount / limitCount) * 100))
            : 0;
    const isOverLimit = usedCount > limitCount;
    const isLoading = isQuotaLoading || isProjectsLoading;

    return (
        <div className="mx-auto max-w-5xl p-8">
            <div className="mb-8">
                <h1 className="text-foreground mb-2 text-3xl font-semibold">
                    {t('billing.title')}
                </h1>
                <p className="text-muted-foreground">{t('billing.subtitle')}</p>
            </div>

            {isLoading ? (
                <div className="border-border bg-card rounded-xl border p-6">
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                        <Loader2 className="text-primary h-4 w-4 animate-spin" />
                        <span>{t('billing.loading')}</span>
                    </div>
                </div>
            ) : quotaError ? (
                <div className="rounded-lg border border-red-300/40 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-300">
                    {t('billing.loadError')}
                </div>
            ) : (
                <div className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                    <section className="border-border bg-card rounded-xl border p-6 shadow-sm">
                        <div className="mb-6 flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className="bg-primary/10 text-primary flex h-11 w-11 items-center justify-center rounded-xl">
                                    <UserCheck className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-sm">
                                        {t('billing.currentPlan')}
                                    </p>
                                    <h2 className="text-foreground text-2xl font-semibold">
                                        {isPremium
                                            ? t('billing.planPremiumShort')
                                            : t('billing.planFreeShort')}
                                    </h2>
                                </div>
                            </div>
                            <span className="bg-primary/10 text-primary rounded-full px-2.5 py-1 text-xs font-semibold">
                                {isPremium ? 'Premium' : 'Free'}
                            </span>
                        </div>

                        <div className="space-y-3">
                            <div className="text-muted-foreground flex justify-between gap-3 text-sm font-medium">
                                <span>
                                    {t('billing.projectsUsage')
                                        .replace('{used}', String(usedCount))
                                        .replace('{limit}', String(limitCount))}
                                </span>
                                <span>{progressPercent}%</span>
                            </div>
                            <div className="bg-secondary h-3 w-full overflow-hidden rounded-full">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${
                                        isOverLimit
                                            ? 'bg-amber-500'
                                            : 'bg-primary'
                                    }`}
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                        </div>

                        {isOverLimit && (
                            <div className="mt-5 flex items-start gap-3 rounded-lg border border-amber-300/40 bg-amber-50 px-3 py-3 text-sm text-amber-800 dark:border-amber-800/50 dark:bg-amber-950/20 dark:text-amber-300">
                                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                                <div>
                                    <p className="font-semibold">
                                        {t('billing.overLimitTitle')}
                                    </p>
                                    <p>{t('billing.overLimitDesc')}</p>
                                </div>
                            </div>
                        )}
                    </section>

                    <section className="border-primary/30 bg-card rounded-xl border p-6 shadow-sm">
                        <div className="mb-5 flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className="bg-primary text-primary-foreground flex h-11 w-11 items-center justify-center rounded-xl">
                                    <CreditCard className="h-5 w-5" />
                                </div>
                                <div>
                                    <h2 className="text-foreground text-2xl font-semibold">
                                        {isPremium
                                            ? t('billing.premiumActiveTitle')
                                            : t('billing.upgradeTitle')}
                                    </h2>
                                    <p className="text-muted-foreground mt-1 text-sm">
                                        {isPremium
                                            ? t('billing.premiumActiveDesc')
                                            : t('billing.upgradeDesc')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-5 flex flex-wrap items-end gap-x-4 gap-y-1">
                            <span className="text-foreground text-3xl font-semibold">
                                {PREMIUM_PROJECT_LIMIT}{' '}
                                {t('billing.projectsUnit')}
                            </span>
                            <span className="text-primary text-xl font-semibold">
                                {t('billing.premiumPrice')}
                            </span>
                        </div>

                        <ul className="text-muted-foreground mb-6 space-y-3 text-sm">
                            <li className="flex gap-2">
                                <Check className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                                <span>{t('billing.benefitProjects')}</span>
                            </li>
                            <li className="flex gap-2">
                                <Check className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                                <span>{t('billing.benefitMeetings')}</span>
                            </li>
                            <li className="flex gap-2">
                                <Check className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                                <span>{t('billing.benefitWorkspace')}</span>
                            </li>
                        </ul>

                        {isPremium ? (
                            <Button variant="outline" disabled>
                                {t('billing.premiumActiveButton')}
                            </Button>
                        ) : (
                            <Button
                                onClick={handleUpgrade}
                                disabled={buyQuotaMutation.isPending}
                                className="min-w-[170px]"
                            >
                                {buyQuotaMutation.isPending && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                {buyQuotaMutation.isPending
                                    ? t('billing.checkoutOpening')
                                    : t('billing.upgradeButton')}
                            </Button>
                        )}
                    </section>
                </div>
            )}
        </div>
    );
}
