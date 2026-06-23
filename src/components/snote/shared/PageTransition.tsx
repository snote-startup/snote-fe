'use client';

import { useEffect, useState, type ReactNode } from 'react';

interface PageTransitionProps {
    children: ReactNode;
    className?: string;
}

/**
 * SSR-safe page fade-in wrapper.
 * - Server renders children with opacity 0 class.
 * - After mount, adds the 'animate-fade-in-up' class for a smooth entrance.
 * - Respects `prefers-reduced-motion` via the CSS animation declaration in globals.css.
 * - No Math.random, no window branch in render, no hydration mismatch.
 */
export function PageTransition({
    children,
    className = '',
}: PageTransitionProps) {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        // Tiny delay ensures the browser paints the initial state before animating.
        const id = requestAnimationFrame(() => setReady(true));
        return () => cancelAnimationFrame(id);
    }, []);

    return (
        <div
            className={`${className} ${ready ? 'animate-fade-in-up' : 'opacity-0'}`}
            style={{ willChange: 'opacity, transform' }}
        >
            {children}
        </div>
    );
}
