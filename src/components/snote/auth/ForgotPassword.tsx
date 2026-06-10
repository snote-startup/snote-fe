'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
                <div className="w-full max-w-md">
                    <div className="mb-8 text-center">
                        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100">
                            <CheckCircle2 className="h-8 w-8 text-green-600" />
                        </div>
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Check your email
                        </h1>
                        <p className="mt-2 text-gray-600">
                            We&apos;ve sent a password reset link to <br />
                            <span className="font-medium">{email}</span>
                        </p>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
                        <p className="mb-4 text-sm text-gray-600">
                            Didn&apos;t receive the email? Check your spam
                            folder or
                        </p>
                        <Button
                            variant="outline"
                            onClick={() => setSubmitted(false)}
                        >
                            Try another email
                        </Button>
                    </div>

                    <div className="mt-6 text-center">
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 text-sm text-[#6B4EFF] hover:text-[#4B2AA6]"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
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
                        Forgot password?
                    </h1>
                    <p className="mt-2 text-gray-600">
                        No worries, we&apos;ll send you reset instructions
                    </p>
                </div>

                {/* Form */}
                <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="mt-1.5"
                            />
                        </div>

                        <Button type="submit" className="w-full">
                            Reset password
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 text-sm text-[#6B4EFF] hover:text-[#4B2AA6]"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
