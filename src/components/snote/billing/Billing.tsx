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
                    <h1 className="mb-2 text-3xl font-semibold text-gray-900">
                        Billing & Subscription
                    </h1>
                    <p className="text-gray-600">
                        Manage your subscription and billing information
                    </p>
                </div>

                {/* Trial Warning */}
                {user.subscription.plan === 'trial' &&
                    user.subscription.trialEndsAt && (
                        <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-6">
                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100">
                                    <AlertCircle className="h-5 w-5 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="mb-1 font-semibold text-blue-900">
                                        Your trial ends in{' '}
                                        {Math.ceil(
                                            (user.subscription.trialEndsAt.getTime() -
                                                BILLING_REFERENCE_TIME) /
                                                MS_PER_DAY,
                                        )}{' '}
                                        days
                                    </h3>
                                    <p className="mb-4 text-blue-700">
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
                        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-6">
                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-red-100">
                                    <AlertCircle className="h-5 w-5 text-red-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="mb-1 font-semibold text-red-900">
                                        Subscription Cancelled
                                    </h3>
                                    <p className="mb-4 text-red-700">
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
                <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6">
                    <div className="mb-6 flex items-start justify-between">
                        <div>
                            <h2 className="mb-1 text-xl font-semibold text-gray-900">
                                Current Plan
                            </h2>
                            <p className="text-gray-600">{planDetails.name}</p>
                        </div>
                        {planDetails.price > 0 && (
                            <div className="text-right">
                                <div className="text-3xl font-semibold text-gray-900">
                                    ${planDetails.price}
                                </div>
                                <div className="text-sm text-gray-600">
                                    per month
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mb-6 space-y-3">
                        {planDetails.features.map((feature, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-2 text-gray-700"
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
                    <div className="rounded-xl border border-gray-200 bg-white p-6">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                                <Clock className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">
                                    Minutes Remaining
                                </p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {minutesRemaining}
                                </p>
                            </div>
                        </div>

                        <div className="mb-2 h-3 w-full rounded-full bg-gray-200">
                            <div
                                className={`h-3 rounded-full transition-all ${
                                    usagePercentage > 90
                                        ? 'bg-red-500'
                                        : usagePercentage > 70
                                          ? 'bg-yellow-500'
                                          : 'bg-blue-600'
                                }`}
                                style={{
                                    width: `${Math.min(100, usagePercentage)}%`,
                                }}
                            />
                        </div>

                        <p className="text-xs text-gray-500">
                            {minutesUsed} of {minutesLimit} minutes used (
                            {Math.round(usagePercentage)}%)
                        </p>
                    </div>

                    {/* Billing Period */}
                    <div className="rounded-xl border border-gray-200 bg-white p-6">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                                <Calendar className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">
                                    Billing Period
                                </p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {user.subscription.plan === 'trial'
                                        ? 'Trial'
                                        : 'Monthly'}
                                </p>
                            </div>
                        </div>

                        {user.subscription.trialEndsAt && (
                            <p className="text-sm text-gray-600">
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
                        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6">
                            <h2 className="mb-4 text-lg font-semibold text-gray-900">
                                Payment Method
                            </h2>

                            <div className="flex items-center gap-4 rounded-lg bg-gray-50 p-4">
                                <div className="flex h-8 w-12 items-center justify-center rounded bg-gradient-to-r from-blue-600 to-blue-400">
                                    <CreditCard className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">
                                        •••• •••• •••• 4242
                                    </p>
                                    <p className="text-sm text-gray-600">
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
                        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6">
                            <h2 className="mb-4 text-lg font-semibold text-gray-900">
                                Billing History
                            </h2>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {planDetails.name}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            March 5, 2026
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900">
                                            ${planDetails.price}.00
                                        </p>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-blue-600"
                                        >
                                            Download
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {planDetails.name}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            February 5, 2026
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900">
                                            ${planDetails.price}.00
                                        </p>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-blue-600"
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
                        <div className="rounded-xl border border-gray-200 bg-white p-6">
                            <h2 className="mb-2 text-lg font-semibold text-gray-900">
                                Cancel Subscription
                            </h2>
                            <p className="mb-4 text-gray-600">
                                You can cancel your subscription at any time.
                                You&apos;ll continue to have access until the
                                end of your billing period.
                            </p>
                            <Button
                                variant="outline"
                                onClick={() => setShowCancelDialog(true)}
                                className="border-red-600 text-red-600 hover:bg-red-50"
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
