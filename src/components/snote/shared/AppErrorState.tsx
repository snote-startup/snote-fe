'use client';

import { AlertCircle, ArrowLeft, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AppErrorStateProps {
    title?: string;
    description?: string;
    error?: Error | { message?: string } | null;
    onRetry?: () => void;
    onBack?: () => void;
    backText?: string;
}

export function AppErrorState({
    title = 'An unexpected error occurred',
    description,
    error,
    onRetry,
    onBack,
    backText = 'Back to dashboard',
}: AppErrorStateProps) {
    const message =
        description ||
        (error && 'message' in error && typeof error.message === 'string'
            ? error.message
            : 'We encountered a problem loading this view. Please try again or contact support.');

    return (
        <div className="animate-fade-in mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center p-8 text-center">
            {/* Visual Indicator */}
            <div className="border-destructive/20 bg-destructive/10 text-destructive mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border p-4 shadow-sm">
                <AlertCircle className="h-8 w-8" />
            </div>

            {/* Error message */}
            <h2 className="text-foreground mb-2 text-xl font-semibold tracking-tight">
                {title}
            </h2>
            <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
                {message}
            </p>

            {/* Action buttons */}
            <div className="flex w-full flex-col justify-center gap-3 sm:flex-row">
                {onRetry && (
                    <Button
                        onClick={onRetry}
                        variant="default"
                        className="gap-2"
                    >
                        <RotateCcw className="h-4 w-4" />
                        Try again
                    </Button>
                )}
                {onBack && (
                    <Button
                        onClick={onBack}
                        variant="outline"
                        className="gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        {backText}
                    </Button>
                )}
            </div>
        </div>
    );
}
