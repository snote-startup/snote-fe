'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Check, Sparkles } from 'lucide-react';
import { useApp } from '@/providers/snote-app-provider';

export function Pricing() {
    const router = useRouter();
    const { user } = useApp();

    const plans = [
        {
            id: 'pro',
            name: 'Pro',
            price: 29,
            description: 'Perfect for professionals and small teams',
            features: [
                '500 meeting minutes per month',
                'Unlimited transcriptions',
                'AI-powered insights and summaries',
                'Task and calendar integration',
                'Priority email support',
                'Export to PDF',
                'Share meeting links',
            ],
            cta: 'Upgrade to Pro',
            popular: true,
        },
        {
            id: 'enterprise',
            name: 'Enterprise',
            price: 99,
            description: 'For teams and organizations',
            features: [
                'Unlimited meeting minutes',
                'Everything in Pro',
                'Advanced analytics',
                'Custom integrations',
                'Team collaboration features',
                'Dedicated account manager',
                '24/7 priority support',
                'SSO and advanced security',
            ],
            cta: 'Upgrade to Enterprise',
            popular: false,
        },
    ];

    const handleSelectPlan = (planId: string) => {
        router.push(`/billing/checkout/${planId}`);
    };

    const isAuthenticated = !!user;

    return (
        <div className="min-h-full bg-gray-50 px-4 py-12">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-12 text-center">
                    <h1 className="mb-4 text-4xl font-semibold text-gray-900">
                        Choose Your Plan
                    </h1>
                    <p className="text-xl text-gray-600">
                        Upgrade to unlock unlimited meeting minutes and premium
                        features
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`rounded-2xl border-2 bg-white shadow-lg ${
                                plan.popular
                                    ? 'relative border-blue-600'
                                    : 'border-gray-200'
                            }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform">
                                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-4 py-1 text-sm font-medium text-white">
                                        <Sparkles className="h-4 w-4" />
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            <div className="p-8">
                                {/* Plan Header */}
                                <div className="mb-6">
                                    <h2 className="mb-2 text-2xl font-semibold text-gray-900">
                                        {plan.name}
                                    </h2>
                                    <p className="mb-4 text-gray-600">
                                        {plan.description}
                                    </p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-5xl font-semibold text-gray-900">
                                            ${plan.price}
                                        </span>
                                        <span className="text-gray-600">
                                            /month
                                        </span>
                                    </div>
                                </div>

                                {/* Features */}
                                <ul className="mb-8 space-y-3">
                                    {plan.features.map((feature, index) => (
                                        <li
                                            key={index}
                                            className="flex items-start gap-3"
                                        >
                                            <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                                            <span className="text-gray-700">
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA Button */}
                                <Button
                                    onClick={() => handleSelectPlan(plan.id)}
                                    className="w-full"
                                    variant={
                                        plan.popular ? 'default' : 'outline'
                                    }
                                    size="lg"
                                >
                                    {plan.cta}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Free Trial Info */}
                <div className="mt-12 text-center">
                    <div className="inline-block rounded-xl border border-gray-200 bg-white p-6">
                        <h3 className="mb-2 font-semibold text-gray-900">
                            Not ready to commit?
                        </h3>
                        <p className="mb-4 text-gray-600">
                            Start with our 7-day free trial to test all features
                        </p>
                        {!isAuthenticated && (
                            <Button
                                variant="outline"
                                onClick={() => router.push('/register')}
                            >
                                Start Free Trial
                            </Button>
                        )}
                    </div>
                </div>

                {/* FAQ or Additional Info */}
                <div className="mx-auto mt-12 max-w-3xl">
                    <h2 className="mb-6 text-center text-2xl font-semibold text-gray-900">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-6">
                        <div className="rounded-xl border border-gray-200 bg-white p-6">
                            <h3 className="mb-2 font-semibold text-gray-900">
                                Can I change plans later?
                            </h3>
                            <p className="text-gray-600">
                                Yes! You can upgrade or downgrade your plan at
                                any time. Changes take effect immediately, and
                                we&apos;ll prorate the charges.
                            </p>
                        </div>

                        <div className="rounded-xl border border-gray-200 bg-white p-6">
                            <h3 className="mb-2 font-semibold text-gray-900">
                                What happens if I exceed my meeting minutes?
                            </h3>
                            <p className="text-gray-600">
                                You&apos;ll be notified when you&apos;re close
                                to your limit. If you exceed your minutes,
                                recording will pause and you&apos;ll be prompted
                                to upgrade.
                            </p>
                        </div>

                        <div className="rounded-xl border border-gray-200 bg-white p-6">
                            <h3 className="mb-2 font-semibold text-gray-900">
                                Do you offer refunds?
                            </h3>
                            <p className="text-gray-600">
                                We offer a 30-day money-back guarantee. If
                                you&apos;re not satisfied, contact us for a full
                                refund within 30 days of your purchase.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
