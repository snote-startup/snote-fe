'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Mic, Volume2, AlertCircle } from 'lucide-react';

export function AudioCheck() {
    const router = useRouter();
    const [audioLevel, setAudioLevel] = useState(0);
    const [audioDetected, setAudioDetected] = useState(false);

    // Simulate audio level detection
    useEffect(() => {
        const interval = setInterval(() => {
            const level = Math.random() * 100;
            setAudioLevel(level);
            if (level > 20) {
                setAudioDetected(true);
            }
        }, 100);

        return () => clearInterval(interval);
    }, []);

    const handleContinue = () => {
        router.push('/live-assistant/active');
    };

    return (
        <div className="mx-auto max-w-2xl p-8">
            <div className="text-center">
                {/* Audio Level Indicator */}
                <div className="relative mb-6 inline-flex h-32 w-32 items-center justify-center rounded-full bg-blue-100">
                    <Mic className="h-16 w-16 text-blue-600" />
                    {audioDetected && (
                        <>
                            <div className="absolute inset-0 animate-ping rounded-full bg-blue-400 opacity-75" />
                            <div className="absolute inset-0 animate-pulse rounded-full bg-blue-300" />
                        </>
                    )}
                </div>

                <h1 className="text-foreground mb-3 text-2xl font-semibold">
                    Audio Check
                </h1>
                <p className="text-muted-foreground mb-8">
                    {audioDetected
                        ? "Audio detected! You're all set to start recording."
                        : 'Speak into your microphone to test audio levels'}
                </p>

                {/* Audio Level Bars */}
                <div className="border-border bg-card mb-6 rounded-xl border p-8">
                    <div className="mb-4 flex items-center gap-2">
                        <Volume2 className="text-muted-foreground h-5 w-5" />
                        <span className="text-foreground font-medium">
                            Audio Level
                        </span>
                    </div>

                    <div className="flex h-16 items-center gap-2">
                        {[...Array(20)].map((_, i) => (
                            <div
                                key={i}
                                className={`flex-1 rounded-full transition-all ${
                                    audioLevel > i * 5
                                        ? audioLevel > 70
                                            ? 'bg-red-500'
                                            : audioLevel > 40
                                              ? 'bg-green-500'
                                              : 'bg-yellow-500'
                                        : 'bg-muted'
                                }`}
                                style={{
                                    height: `${Math.min(100, (i + 1) * 5)}%`,
                                }}
                            />
                        ))}
                    </div>

                    <p className="text-muted-foreground mt-4 text-sm">
                        {audioLevel > 70
                            ? 'Audio level is high - reduce volume or move away from mic'
                            : audioLevel > 20
                              ? 'Good audio level detected'
                              : 'Speak louder or check microphone connection'}
                    </p>
                </div>

                {/* Warning if no audio */}
                {!audioDetected && (
                    <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600" />
                            <div className="text-left">
                                <p className="font-medium text-yellow-900">
                                    No audio detected
                                </p>
                                <p className="mt-1 text-sm text-yellow-700">
                                    Make sure your microphone is connected and
                                    not muted. You can continue, but recording
                                    may not work properly.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                    <Button onClick={handleContinue} size="lg">
                        Start Live Assistant
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => router.push('/live-assistant/setup')}
                    >
                        Back to Setup
                    </Button>
                </div>

                <p className="text-muted-foreground mt-6 text-xs">
                    Recording will start automatically when you continue
                </p>
            </div>
        </div>
    );
}
