'use client';

import { useRef, useEffect, useCallback, type ReactNode } from 'react';

/**
 * CursorReactiveBackground
 *
 * Wraps children with a container that tracks pointer position and
 * sets CSS custom properties for cursor-driven visual effects.
 *
 * Variables set on the container:
 *   --mouse-x      (0–100%)  horizontal cursor position
 *   --mouse-y      (0–100%)  vertical cursor position
 *   --tilt-x       (-1 to 1) normalized horizontal offset from center
 *   --tilt-y       (-1 to 1) normalized vertical offset from center
 *
 * Server-safe: renders a plain div with no effect; hydration-stable.
 * Disables tracking on touch-primary devices and when prefers-reduced-motion.
 * Uses rAF-throttled pointermove — no setState per frame.
 */

interface CursorReactiveBackgroundProps {
    children: ReactNode;
    className?: string;
}

export function CursorReactiveBackground({
    children,
    className = '',
}: CursorReactiveBackgroundProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number>(0);
    const enabledRef = useRef(false);

    // Memoize handler so the listener identity is stable
    const handlePointerMove = useCallback((e: PointerEvent) => {
        if (!enabledRef.current) return;

        // Cancel any pending frame
        if (rafRef.current) cancelAnimationFrame(rafRef.current);

        rafRef.current = requestAnimationFrame(() => {
            const el = containerRef.current;
            if (!el) return;

            const rect = el.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            const tiltX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            const tiltY = ((e.clientY - rect.top) / rect.height) * 2 - 1;

            el.style.setProperty('--mouse-x', `${x}%`);
            el.style.setProperty('--mouse-y', `${y}%`);
            el.style.setProperty('--tilt-x', `${tiltX.toFixed(4)}`);
            el.style.setProperty('--tilt-y', `${tiltY.toFixed(4)}`);
        });
    }, []);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        // Feature gating: fine pointer + no reduced motion
        const isFinePointer = window.matchMedia('(pointer: fine)').matches;
        const prefersReduced = window.matchMedia(
            '(prefers-reduced-motion: reduce)',
        ).matches;

        enabledRef.current = isFinePointer && !prefersReduced;

        if (!enabledRef.current) {
            // Set defaults for static fallback (center)
            el.style.setProperty('--mouse-x', '50%');
            el.style.setProperty('--mouse-y', '50%');
            el.style.setProperty('--tilt-x', '0');
            el.style.setProperty('--tilt-y', '0');
            return;
        }

        // Start from center
        el.style.setProperty('--mouse-x', '50%');
        el.style.setProperty('--mouse-y', '50%');
        el.style.setProperty('--tilt-x', '0');
        el.style.setProperty('--tilt-y', '0');

        el.addEventListener('pointermove', handlePointerMove, {
            passive: true,
        });

        return () => {
            el.removeEventListener('pointermove', handlePointerMove);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [handlePointerMove]);

    return (
        <div
            ref={containerRef}
            className={`cursor-reactive-bg ${className}`}
            style={
                {
                    '--mouse-x': '50%',
                    '--mouse-y': '50%',
                    '--tilt-x': '0',
                    '--tilt-y': '0',
                } as React.CSSProperties
            }
        >
            {children}
        </div>
    );
}
