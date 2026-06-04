'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Mic, Check, AlertCircle } from 'lucide-react';

export function AudioPermissions() {
    const router = useRouter();
    const [permissionGranted, setPermissionGranted] = useState(false);
    const [permissionDenied] = useState(false);

    const handleRequestPermission = () => {
        // Simulate permission request
        setTimeout(() => {
            setPermissionGranted(true);
            // Auto-navigate to audio check after permission granted
            setTimeout(() => {
                router.push('/live-assistant/audio-check');
            }, 1500);
        }, 500);
    };

    return (
        <div className="mx-auto max-w-2xl p-8">
            <div className="text-center">
                {/* Icon */}
                <div
                    className={`mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full ${
                        permissionGranted
                            ? 'bg-green-100'
                            : permissionDenied
                              ? 'bg-red-100'
                              : 'bg-blue-100'
                    }`}
                >
                    {permissionGranted ? (
                        <Check className="h-10 w-10 text-green-600" />
                    ) : permissionDenied ? (
                        <AlertCircle className="h-10 w-10 text-red-600" />
                    ) : (
                        <Mic className="h-10 w-10 text-blue-600" />
                    )}
                </div>

                {/* Content */}
                <h1 className="mb-3 text-2xl font-semibold text-gray-900">
                    {permissionGranted
                        ? 'Microphone Access Granted'
                        : permissionDenied
                          ? 'Microphone Access Denied'
                          : 'Microphone Access Required'}
                </h1>

                {!permissionGranted && !permissionDenied && (
                    <>
                        <p className="mb-8 text-gray-600">
                            MeetingAI needs access to your microphone to record
                            and transcribe your meetings.
                            <br />
                            Your audio is processed securely and never shared.
                        </p>

                        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6">
                            <div className="space-y-4">
                                <div className="flex items-start gap-3 text-left">
                                    <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                                        <Check className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            Secure Recording
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            All audio is encrypted end-to-end
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 text-left">
                                    <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                                        <Check className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            Privacy Protected
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            You control all recordings and can
                                            delete anytime
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 text-left">
                                    <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                                        <Check className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            Easy Control
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Pause or stop recording at any time
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Button onClick={handleRequestPermission} size="lg">
                                <Mic className="mr-2 h-4 w-4" />
                                Grant Microphone Access
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => router.push('/dashboard')}
                            >
                                Cancel
                            </Button>
                        </div>
                    </>
                )}

                {permissionGranted && (
                    <p className="mb-6 text-gray-600">
                        Great! Now checking your audio levels...
                    </p>
                )}

                {permissionDenied && (
                    <>
                        <p className="mb-8 text-gray-600">
                            Microphone access was denied. Please enable
                            microphone permissions in your browser settings to
                            use the Live Assistant.
                        </p>
                        <div className="flex flex-col gap-3">
                            <Button onClick={handleRequestPermission}>
                                Try Again
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => router.push('/dashboard')}
                            >
                                Back to Dashboard
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
