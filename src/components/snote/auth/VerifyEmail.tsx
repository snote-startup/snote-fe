'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/providers/snote-app-provider';

export function VerifyEmail() {
    const router = useRouter();
    const { user } = useApp();

    const handleContinue = () => {
        router.push('/dashboard');
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <div className="mb-4 inline-flex items-center justify-center">
                        <Image
                            src="/snote-logo.png"
                            alt="SNOTE"
                            width={174}
                            height={50}
                            priority
                            style={{ width: 'auto', height: 'auto' }}
                        />
                    </div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Verify your email
                    </h1>
                    <p className="mt-2 text-gray-600">
                        We&apos;ve sent a verification link to your email
                    </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                    <div className="text-center">
                        <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#F7F6FF]">
                            <Mail className="h-7 w-7 text-[#6B4EFF]" />
                        </div>

                        <p className="mb-2 text-gray-700">
                            Verification email sent to:
                        </p>
                        <p className="mb-6 font-medium text-gray-900">
                            {user?.email || 'your@email.com'}
                        </p>

                        <div className="space-y-3">
                            <Button onClick={handleContinue} className="w-full">
                                Continue to Dashboard
                            </Button>
                            <Button variant="outline" className="w-full">
                                Resend verification email
                            </Button>
                        </div>

                        <p className="mt-6 text-xs text-gray-500">
                            You can verify your email later from your profile
                            settings
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
