'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useApp } from '@/providers/snote-app-provider';

export function PaymentSuccess() {
    const router = useRouter();
    const { user } = useApp();

    return (
        <div className="flex min-h-full items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md">
                <div className="text-center">
                    {/* Success Icon */}
                    <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle className="h-12 w-12 text-green-600" />
                    </div>

                    {/* Success Message */}
                    <h1 className="mb-4 text-3xl font-semibold text-gray-900">
                        Welcome to{' '}
                        {user?.subscription.plan === 'pro'
                            ? 'Pro'
                            : 'Enterprise'}
                        !
                    </h1>
                    <p className="mb-8 text-lg text-gray-600">
                        Your subscription has been activated successfully. Start
                        recording unlimited meetings right away!
                    </p>

                    {/* Stats */}
                    <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="mb-1 text-sm text-gray-600">
                                    Meeting Minutes
                                </p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {user?.subscription.plan === 'enterprise'
                                        ? '∞'
                                        : '500'}
                                </p>
                            </div>
                            <div>
                                <p className="mb-1 text-sm text-gray-600">
                                    Plan
                                </p>
                                <p className="text-2xl font-semibold text-gray-900 capitalize">
                                    {user?.subscription.plan}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <Button
                            onClick={() => router.push('/live-assistant/setup')}
                            className="w-full"
                            size="lg"
                        >
                            Start Your First Meeting
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => router.push('/dashboard')}
                            className="w-full"
                        >
                            Go to Dashboard
                        </Button>
                    </div>

                    {/* Receipt */}
                    <p className="mt-6 text-sm text-gray-500">
                        A receipt has been sent to your email
                    </p>
                </div>
            </div>
        </div>
    );
}
