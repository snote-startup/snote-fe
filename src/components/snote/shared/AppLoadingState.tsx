'use client';

interface AppLoadingStateProps {
    variant?: 'brand' | 'list' | 'detail';
    message?: string;
}

export function AppLoadingState({
    variant = 'brand',
    message,
}: AppLoadingStateProps) {
    if (variant === 'brand') {
        return (
            <div className="bg-background text-foreground flex min-h-[50vh] flex-col items-center justify-center gap-5 p-8">
                {/* Animated S mark */}
                <div className="relative flex items-center justify-center">
                    <span className="bg-primary/10 absolute h-20 w-20 animate-ping rounded-full opacity-50" />
                    <span className="bg-primary/8 absolute h-14 w-14 animate-pulse rounded-full" />
                    <div className="bg-primary/12 border-primary/20 relative flex h-12 w-12 items-center justify-center rounded-full border">
                        <span className="text-primary text-xl font-bold tracking-tight">
                            S
                        </span>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-1.5">
                    <p className="text-foreground text-sm font-medium">
                        {message || 'Đang chuẩn bị workspace'}
                    </p>
                    <p className="text-muted-foreground text-xs">
                        Đang kiểm tra phiên đăng nhập...
                    </p>
                </div>

                {/* Progress dots */}
                <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                        <span
                            key={i}
                            className="bg-primary/40 h-1.5 w-1.5 rounded-full"
                            style={{
                                animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite`,
                            }}
                        />
                    ))}
                </div>
            </div>
        );
    }

    if (variant === 'list') {
        return (
            <div className="mx-auto max-w-7xl space-y-6 p-8">
                {/* Header skeleton */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="space-y-2">
                        <div className="bg-muted h-9 w-48 animate-pulse rounded-lg" />
                        <div className="bg-muted h-5 w-80 animate-pulse rounded-lg" />
                    </div>
                    <div className="bg-muted h-10 w-32 animate-pulse rounded-lg" />
                </div>

                {/* Search bar skeleton */}
                <div className="bg-muted/30 border-border/60 h-16 w-full animate-pulse rounded-xl border" />

                {/* Cards skeleton list */}
                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                            key={i}
                            className="border-border bg-card/50 flex animate-pulse flex-col justify-between gap-6 rounded-2xl border p-6"
                        >
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="bg-muted h-6 w-1/3 rounded-lg" />
                                    <div className="bg-muted h-5 w-16 rounded-full" />
                                </div>
                                <div className="space-y-2">
                                    <div className="bg-muted h-4 w-full rounded" />
                                    <div className="bg-muted h-4 w-5/6 rounded" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between border-t pt-4">
                                <div className="bg-muted h-4 w-24 rounded" />
                                <div className="bg-muted h-4 w-4 rounded-full" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // 'detail' variant: Split-pane skeleton
    return (
        <div className="flex h-[calc(100vh-4rem)] flex-col">
            {/* Top workspace nav skeleton */}
            <div className="border-border/60 flex h-14 items-center justify-between border-b px-6">
                <div className="flex items-center gap-3">
                    <div className="bg-muted h-8 w-8 animate-pulse rounded-lg" />
                    <div className="bg-muted h-5 w-32 animate-pulse rounded-lg" />
                </div>
                <div className="flex items-center gap-2">
                    <div className="bg-muted h-8 w-20 animate-pulse rounded-lg" />
                    <div className="bg-muted h-8 w-24 animate-pulse rounded-lg" />
                </div>
            </div>

            {/* Split pane body skeleton */}
            <div className="grid flex-1 grid-cols-1 divide-y overflow-hidden lg:grid-cols-2 lg:divide-x lg:divide-y-0">
                {/* Left panel: Transcript skeleton */}
                <div className="flex flex-col space-y-6 overflow-hidden p-6">
                    <div className="flex items-center justify-between">
                        <div className="bg-muted h-6 w-24 animate-pulse rounded-lg" />
                        <div className="bg-muted h-8 w-32 animate-pulse rounded-lg" />
                    </div>
                    {/* Audio upload progress placeholder */}
                    <div className="bg-muted/30 border-border/40 flex h-28 w-full animate-pulse flex-col items-center justify-center gap-2 rounded-xl border">
                        <div className="bg-muted h-8 w-8 rounded-full" />
                        <div className="bg-muted h-4 w-32 rounded" />
                    </div>
                    {/* Pulsing paragraphs simulating transcript segments */}
                    <div className="flex-1 space-y-6 overflow-hidden">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="animate-pulse space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="bg-muted h-4 w-16 rounded" />
                                    <div className="bg-muted h-3.5 w-10 rounded" />
                                </div>
                                <div className="space-y-1.5">
                                    <div className="bg-muted h-4 w-full rounded" />
                                    <div className="bg-muted h-4 w-11/12 rounded" />
                                    <div className="bg-muted h-4 w-3/4 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right panel: Chat workspace skeleton */}
                <div className="flex flex-col space-y-4 overflow-hidden p-6">
                    <div className="flex items-center justify-between border-b pb-4">
                        <div className="flex items-center gap-2">
                            <div className="bg-muted h-5 w-5 animate-pulse rounded-full" />
                            <div className="bg-muted h-5 w-24 animate-pulse rounded-lg" />
                        </div>
                    </div>
                    {/* Chat messages placeholder */}
                    <div className="flex-1 space-y-4 overflow-hidden py-4">
                        <div className="flex max-w-[80%] animate-pulse gap-3">
                            <div className="bg-muted h-8 w-8 shrink-0 rounded-full" />
                            <div className="bg-muted/40 h-14 w-full rounded-2xl" />
                        </div>
                        <div className="ml-auto flex max-w-[80%] animate-pulse justify-end gap-3">
                            <div className="bg-muted/80 h-10 w-48 rounded-2xl" />
                        </div>
                        <div className="flex max-w-[80%] animate-pulse gap-3">
                            <div className="bg-muted h-8 w-8 shrink-0 rounded-full" />
                            <div className="flex-1 space-y-1.5">
                                <div className="bg-muted/40 h-4 w-full rounded" />
                                <div className="bg-muted/40 h-4 w-5/6 rounded" />
                            </div>
                        </div>
                    </div>
                    {/* Chat input skeleton */}
                    <div className="bg-muted/30 border-border/40 h-12 w-full animate-pulse rounded-xl border" />
                </div>
            </div>
        </div>
    );
}
