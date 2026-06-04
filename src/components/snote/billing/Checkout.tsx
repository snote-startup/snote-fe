'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Lock, Check } from 'lucide-react';
import { useApp } from '@/providers/snote-app-provider';

export function Checkout() {
    const router = useRouter();
    const { planId } = useParams<{ planId: string }>();
    const { user, setUser } = useApp();

    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    const [name, setName] = useState('');
    const [processing, setProcessing] = useState(false);

    const plans = {
        pro: { name: 'Pro', price: 29, minutes: 500 },
        enterprise: { name: 'Enterprise', price: 99, minutes: 999999 },
    };

    const selectedPlan =
        planId && planId in plans
            ? plans[planId as keyof typeof plans]
            : plans.pro;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        // Simulate payment processing
        setTimeout(() => {
            if (user) {
                setUser({
                    ...user,
                    subscription: {
                        ...user.subscription,
                        plan: planId === 'enterprise' ? 'enterprise' : 'pro',
                        status: 'active',
                        minutesLimit: selectedPlan.minutes,
                        minutesUsed: 0,
                    },
                });
            }
            setProcessing(false);
            router.push('/billing/success');
        }, 2000);
    };

    return (
        <div className="min-h-full bg-gray-50 px-4 py-12">
            <div className="mx-auto max-w-4xl">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="mb-2 text-3xl font-semibold text-gray-900">
                        Complete Your Purchase
                    </h1>
                    <p className="text-gray-600">
                        Start using premium features immediately after checkout
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 rounded-xl border border-gray-200 bg-white p-6">
                            <h2 className="mb-4 font-semibold text-gray-900">
                                Order Summary
                            </h2>

                            <div className="mb-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-700">
                                        {selectedPlan.name} Plan
                                    </span>
                                    <span className="font-medium text-gray-900">
                                        ${selectedPlan.price}/mo
                                    </span>
                                </div>

                                <div className="border-t border-gray-200 pt-4">
                                    <div className="mb-1 flex items-center justify-between">
                                        <span className="font-semibold text-gray-900">
                                            Total
                                        </span>
                                        <span className="text-2xl font-semibold text-gray-900">
                                            ${selectedPlan.price}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Billed monthly
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2 rounded-lg bg-blue-50 p-4">
                                <div className="flex items-center gap-2 text-sm text-blue-900">
                                    <Check className="h-4 w-4 text-blue-600" />
                                    <span>
                                        {selectedPlan.minutes.toLocaleString()}{' '}
                                        meeting minutes/month
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-blue-900">
                                    <Check className="h-4 w-4 text-blue-600" />
                                    <span>Unlimited transcriptions</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-blue-900">
                                    <Check className="h-4 w-4 text-blue-600" />
                                    <span>AI-powered insights</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-blue-900">
                                    <Check className="h-4 w-4 text-blue-600" />
                                    <span>Priority support</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Form */}
                    <div className="lg:col-span-2">
                        <div className="rounded-xl border border-gray-200 bg-white p-8">
                            <h2 className="mb-6 text-xl font-semibold text-gray-900">
                                Payment Information
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Card Number */}
                                <div>
                                    <Label htmlFor="card-number">
                                        Card Number
                                    </Label>
                                    <div className="relative mt-2">
                                        <Input
                                            id="card-number"
                                            type="text"
                                            placeholder="1234 5678 9012 3456"
                                            value={cardNumber}
                                            onChange={(e) =>
                                                setCardNumber(e.target.value)
                                            }
                                            required
                                            className="pl-10"
                                        />
                                        <CreditCard className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                                    </div>
                                </div>

                                {/* Expiry and CVC */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="expiry">
                                            Expiry Date
                                        </Label>
                                        <Input
                                            id="expiry"
                                            type="text"
                                            placeholder="MM/YY"
                                            value={expiry}
                                            onChange={(e) =>
                                                setExpiry(e.target.value)
                                            }
                                            required
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="cvc">CVC</Label>
                                        <Input
                                            id="cvc"
                                            type="text"
                                            placeholder="123"
                                            value={cvc}
                                            onChange={(e) =>
                                                setCvc(e.target.value)
                                            }
                                            required
                                            className="mt-2"
                                        />
                                    </div>
                                </div>

                                {/* Cardholder Name */}
                                <div>
                                    <Label htmlFor="name">
                                        Cardholder Name
                                    </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="John Doe"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        required
                                        className="mt-2"
                                    />
                                </div>

                                {/* Security Notice */}
                                <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-4">
                                    <Lock className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-600" />
                                    <div>
                                        <p className="mb-1 text-sm font-medium text-gray-900">
                                            Secure Payment
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Your payment information is
                                            encrypted and secure. We never store
                                            your card details.
                                        </p>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex flex-col gap-3 pt-4">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full"
                                        size="lg"
                                    >
                                        {processing ? (
                                            'Processing...'
                                        ) : (
                                            <>
                                                Pay ${selectedPlan.price} /
                                                month
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => router.push('/pricing')}
                                        disabled={processing}
                                    >
                                        Cancel
                                    </Button>
                                </div>

                                <p className="text-center text-xs text-gray-500">
                                    By confirming your subscription, you agree
                                    to our Terms of Service and Privacy Policy.
                                    Your subscription will auto-renew monthly.
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
