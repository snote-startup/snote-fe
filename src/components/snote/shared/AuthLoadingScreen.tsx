'use client';

/**
 * Branded auth-check loading screen.
 * Shown only on the client (after mount) while bootstrapSession is in-flight
 * for protected or auth routes. Never rendered on the server.
 */
export function AuthLoadingScreen() {
    return (
        <div className="bg-background text-foreground flex min-h-screen flex-col items-center justify-center gap-5">
            {/* Animated S mark */}
            <div className="relative flex items-center justify-center">
                {/* Outer ping ring */}
                <span className="bg-primary/10 absolute h-20 w-20 animate-ping rounded-full opacity-50" />
                {/* Mid ring */}
                <span className="bg-primary/8 absolute h-14 w-14 animate-pulse rounded-full" />
                {/* Logo circle */}
                <div className="bg-primary/12 border-primary/20 relative flex h-12 w-12 items-center justify-center rounded-full border">
                    <span className="text-primary text-xl font-bold tracking-tight">
                        S
                    </span>
                </div>
            </div>

            <div className="flex flex-col items-center gap-1.5">
                <p className="text-foreground text-sm font-medium">
                    Preparing your workspace
                </p>
                <p className="text-muted-foreground text-xs">
                    Checking session…
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
