'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    CreditCard,
    Clock,
    Calendar,
    AlertCircle,
    Check,
    TrendingUp,
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useApp } from '@/providers/snote-app-provider';
import { toast } from 'sonner';
import { format, addDays } from 'date-fns';

const BILLING_REFERENCE_TIME = Date.now();
const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function Billing() {
    const router = useRouter();
    const { user, setUser } = useApp();
    const [showCancelDialog, setShowCancelDialog] = useState(false);

    if (!user) return null;

    const minutesUsed = user.subscription.minutesUsed;
    const minutesLimit = user.subscription.minutesLimit;
    const minutesRemaining = minutesLimit - minutesUsed;
    const usagePercentage = (minutesUsed / minutesLimit) * 100;

    const handleUpgrade = () => {
        router.push('/pricing');
    };

    const handleCancelSubscription = () => {
        // Simulate cancellation
        setUser({
            ...user,
            subscription: {
                ...user.subscription,
                status: 'cancelled',
                periodEndsAt: addDays(new Date(), 30),
            },
        });
        toast.success(
            'Subscription cancelled. You can use the service until the end of your billing period.',
        );
        setShowCancelDialog(false);
    };

    const getPlanDetails = (plan: string) => {
        switch (plan) {
            case 'trial':
                return {
                    name: '7-Day Free Trial',
                    price: 0,
                    features: [
                        '300 meeting minutes',
                        'All premium features',
                        'No credit card required',
                    ],
                };
            case 'pro':
                return {
                    name: 'Pro Plan',
                    price: 29,
                    features: [
                        '500 meeting minutes/month',
                        'Unlimited transcriptions',
                        'Priority support',
                    ],
                };
            case 'enterprise':
                return {
                    name: 'Enterprise Plan',
                    price: 99,
                    features: [
                        'Unlimited minutes',
                        'Advanced analytics',
                        '24/7 support',
                    ],
                };
            default:
                return {
                    name: 'Free Plan',
                    price: 0,
                    features: ['100 meeting minutes/month', 'Basic features'],
                };
        }
    };

    const planDetails = getPlanDetails(user.subscription.plan);

    return (
        <>
            <div className="mx-auto max-w-5xl p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-foreground mb-2 text-3xl font-semibold">
                        Billing & Subscription
                    </h1>
                    <p className="text-muted-foreground">
                        Manage your subscription and billing information
                    </p>
                </div>

                {/* Trial Warning */}
                {user.subscription.plan === 'trial' &&
                    user.subscription.trialEndsAt && (
                        <div className="border-border bg-muted/40 mb-6 rounded-xl border p-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-muted flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg">
                                    <AlertCircle className="text-foreground h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-foreground mb-1 font-semibold">
                                        Your trial ends in{' '}
                                        {Math.ceil(
                                            (user.subscription.trialEndsAt.getTime() -
                                                BILLING_REFERENCE_TIME) /
                                                MS_PER_DAY,
                                        )}{' '}
                                        days
                                    </h3>
                                    <p className="text-muted-foreground mb-4">
                                        Upgrade to Pro to continue enjoying
                                        unlimited access after{' '}
                                        {format(
                                            user.subscription.trialEndsAt,
                                            'MMMM d, yyyy',
                                        )}
                                    </p>
                                    <Button onClick={handleUpgrade}>
                                        Upgrade Now
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                {/* Cancelled Warning */}
                {user.subscription.status === 'cancelled' &&
                    user.subscription.periodEndsAt && (
                        <div className="border-destructive/30 bg-destructive/5 mb-6 rounded-xl border p-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-destructive/10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg">
                                    <AlertCircle className="text-destructive h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-foreground mb-1 font-semibold">
                                        Subscription Cancelled
                                    </h3>
                                    <p className="text-muted-foreground mb-4">
                                        Your subscription will remain active
                                        until{' '}
                                        {format(
                                            user.subscription.periodEndsAt,
                                            'MMMM d, yyyy',
                                        )}
                                    </p>
                                    <Button onClick={handleUpgrade}>
                                        Reactivate Subscription
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                {/* Current Plan */}
                <div className="border-border bg-card mb-6 rounded-xl border p-6">
                    <div className="mb-6 flex items-start justify-between">
                        <div>
                            <h2 className="text-foreground mb-1 text-xl font-semibold">
                                Current Plan
                            </h2>
                            <p className="text-muted-foreground">
                                {planDetails.name}
                            </p>
                        </div>
                        {planDetails.price > 0 && (
                            <div className="text-right">
                                <div className="text-foreground text-3xl font-semibold">
                                    ${planDetails.price}
                                </div>
                                <div className="text-muted-foreground text-sm">
                                    per month
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mb-6 space-y-3">
                        {planDetails.features.map((feature, index) => (
                            <div
                                key={index}
                                className="text-foreground flex items-center gap-2"
                            >
                                <Check className="h-5 w-5 text-green-600" />
                                <span>{feature}</span>
                            </div>
                        ))}
                    </div>

                    {user.subscription.plan !== 'enterprise' &&
                        user.subscription.status === 'active' && (
                            <Button onClick={handleUpgrade} className="w-full">
                                <TrendingUp className="mr-2 h-4 w-4" />
                                Upgrade Plan
                            </Button>
                        )}
                </div>

                {/* Usage Stats */}
                <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Minutes Remaining */}
                    <div className="border-border bg-card rounded-xl border p-6">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
                                <Clock className="text-foreground h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-muted-foreground text-sm">
                                    Minutes Remaining
                                </p>
                                <p className="text-foreground text-2xl font-semibold">
                                    {minutesRemaining}
                                </p>
                            </div>
                        </div>

                        <div className="bg-muted mb-2 h-2 w-full rounded-full">
                            <div
                                className={`h-2 rounded-full transition-all ${
                                    usagePercentage > 90
                                        ? 'bg-destructive'
                                        : usagePercentage > 70
                                          ? 'bg-yellow-500'
                                          : 'bg-primary'
                                }`}
                                style={{
                                    width: `${Math.min(100, usagePercentage)}%`,
                                }}
                            />
                        </div>

                        <p className="text-muted-foreground text-xs">
                            {minutesUsed} of {minutesLimit} minutes used (
                            {Math.round(usagePercentage)}%)
                        </p>
                    </div>

                    {/* Billing Period */}
                    <div className="border-border bg-card rounded-xl border p-6">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
                                <Calendar className="text-foreground h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-muted-foreground text-sm">
                                    Billing Period
                                </p>
                                <p className="text-foreground text-lg font-semibold">
                                    {user.subscription.plan === 'trial'
                                        ? 'Trial'
                                        : 'Monthly'}
                                </p>
                            </div>
                        </div>

                        {user.subscription.trialEndsAt && (
                            <p className="text-muted-foreground text-sm">
                                {user.subscription.status === 'cancelled'
                                    ? 'Ends'
                                    : 'Renews'}{' '}
                                on{' '}
                                {format(
                                    user.subscription.periodEndsAt ||
                                        user.subscription.trialEndsAt,
                                    'MMMM d, yyyy',
                                )}
                            </p>
                        )}
                    </div>
                </div>

                {/* Payment Method */}
                {user.subscription.plan !== 'trial' &&
                    user.subscription.plan !== 'free' && (
                        <div className="border-border bg-card mb-6 rounded-xl border p-6">
                            <h2 className="text-foreground mb-4 text-lg font-semibold">
                                Payment Method
                            </h2>

                            <div className="bg-muted/50 flex items-center gap-4 rounded-lg p-4">
                                <div className="bg-muted flex h-8 w-12 items-center justify-center rounded">
                                    <CreditCard className="text-foreground h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-foreground font-medium">
                                        •••• •••• •••• 4242
                                    </p>
                                    <p className="text-muted-foreground text-sm">
                                        Expires 12/2026
                                    </p>
                                </div>
                                <Button variant="outline" size="sm">
                                    Update
                                </Button>
                            </div>
                        </div>
                    )}

                {/* Billing History */}
                {user.subscription.plan !== 'trial' &&
                    user.subscription.plan !== 'free' && (
                        <div className="border-border bg-card mb-6 rounded-xl border p-6">
                            <h2 className="text-foreground mb-4 text-lg font-semibold">
                                Billing History
                            </h2>

                            <div className="space-y-3">
                                <div className="border-border flex items-center justify-between rounded-lg border p-4">
                                    <div>
                                        <p className="text-foreground font-medium">
                                            {planDetails.name}
                                        </p>
                                        <p className="text-muted-foreground text-sm">
                                            March 5, 2026
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-foreground font-semibold">
                                            ${planDetails.price}.00
                                        </p>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-primary"
                                        >
                                            Download
                                        </Button>
                                    </div>
                                </div>

                                <div className="border-border flex items-center justify-between rounded-lg border p-4">
                                    <div>
                                        <p className="text-foreground font-medium">
                                            {planDetails.name}
                                        </p>
                                        <p className="text-muted-foreground text-sm">
                                            February 5, 2026
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-foreground font-semibold">
                                            ${planDetails.price}.00
                                        </p>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-primary"
                                        >
                                            Download
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                {/* Cancel Subscription */}
                {user.subscription.status === 'active' &&
                    user.subscription.plan !== 'trial' && (
                        <div className="border-border bg-card rounded-xl border p-6">
                            <h2 className="text-foreground mb-2 text-lg font-semibold">
                                Cancel Subscription
                            </h2>
                            <p className="text-muted-foreground mb-4">
                                You can cancel your subscription at any time.
                                You&apos;ll continue to have access until the
                                end of your billing period.
                            </p>
                            <Button
                                variant="outline"
                                onClick={() => setShowCancelDialog(true)}
                                className="border-destructive text-destructive hover:bg-destructive/5"
                            >
                                Cancel Subscription
                            </Button>
                        </div>
                    )}
            </div>

            {/* Cancel Confirmation Dialog */}
            <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cancel Subscription?</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to cancel your subscription?
                            You&apos;ll lose access to premium features at the
                            end of your billing period.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowCancelDialog(false)}
                        >
                            Keep Subscription
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleCancelSubscription}
                        >
                            Yes, Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
