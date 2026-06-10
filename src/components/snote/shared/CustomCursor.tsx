'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';

/**
 * Ambient Cursor Follower (Desktop Only)
 *
 * Features:
 * - Ambient ring that smoothly trails the native cursor (native cursor remains visible).
 * - Client-only render to avoid hydration mismatch.
 * - Detects fine pointer devices (mouse). Disabled on touch screen/mobile.
 * - requestAnimationFrame loop for 60fps+ stutter-free performance.
 * - Ring expands and changes color on hoverable items (links, buttons, interactive elements).
 * - Ring fades out completely when hovering inputs/textareas to avoid distraction.
 * - Respects prefers-reduced-motion (disabled if active).
 */
export function CustomCursor() {
    // Check if mounted client-side
    const mounted = useSyncExternalStore(
        () => () => undefined,
        () => true,
        () => false,
    );

    const ringRef = useRef<HTMLDivElement>(null);
    const ringPos = useRef({ x: -100, y: -100 });
    const cursorPos = useRef({ x: -100, y: -100 });
    const rafId = useRef<number>(0);
    const isHovering = useRef(false);
    const isTextInput = useRef(false);
    const isVisible = useRef(false);
    const isEnabled = useRef(false);

    useEffect(() => {
        // Disable on touch-only or touch-primary devices
        const isFinePointer = window.matchMedia('(pointer: fine)').matches;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (!isFinePointer || prefersReducedMotion) {
            return;
        }

        isEnabled.current = true;
        const ring = ringRef.current;
        if (ring) {
            ring.style.display = 'block';
        }

        const handleMouseMove = (e: MouseEvent) => {
            cursorPos.current = { x: e.clientX, y: e.clientY };

            if (!isVisible.current) {
                isVisible.current = true;
                ringPos.current = { x: e.clientX, y: e.clientY };
                if (ring) {
                    ring.style.opacity = '1';
                }
            }

            // Detect element under cursor
            const target = e.target as HTMLElement;
            if (!target) return;

            const tag = target.tagName?.toLowerCase();
            const isInputEl = ['input', 'textarea', 'select'].includes(tag) || target.isContentEditable;

            const isClickable = !isInputEl && (
                tag === 'a' ||
                tag === 'button' ||
                target.closest('a') !== null ||
                target.closest('button') !== null ||
                target.getAttribute('role') === 'button' ||
                target.closest('[role="button"]') !== null
            );

            isTextInput.current = !!isInputEl;
            isHovering.current = !!isClickable;
        };

        const handleMouseLeave = () => {
            if (ring) {
                ring.style.opacity = '0';
            }
            isVisible.current = false;
        };

        document.addEventListener('mousemove', handleMouseMove, { passive: true });
        document.addEventListener('mouseleave', handleMouseLeave);

        const lerp = (start: number, end: number, factor: number) => {
            return start + (end - start) * factor;
        };

        // Animation Loop
        const tick = () => {
            const el = ringRef.current;
            if (el && isVisible.current) {
                // Smooth follow
                ringPos.current.x = lerp(ringPos.current.x, cursorPos.current.x, 0.15);
                ringPos.current.y = lerp(ringPos.current.y, cursorPos.current.y, 0.15);

                el.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px) translate(-50%, -50%)`;

                if (isTextInput.current) {
                    el.style.opacity = '0';
                    el.style.width = '12px';
                    el.style.height = '12px';
                } else if (isHovering.current) {
                    el.style.opacity = '0.85';
                    el.style.width = '48px';
                    el.style.height = '48px';
                    el.style.borderColor = 'var(--brand-primary)';
                    el.style.backgroundColor = 'color-mix(in oklab, var(--brand-primary) 8%, transparent)';
                } else {
                    el.style.opacity = '0.6';
                    el.style.width = '28px';
                    el.style.height = '28px';
                    el.style.borderColor = 'color-mix(in oklab, var(--brand-primary) 60%, transparent)';
                    el.style.backgroundColor = 'transparent';
                }
            }
            rafId.current = requestAnimationFrame(tick);
        };

        rafId.current = requestAnimationFrame(tick);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(rafId.current);
        };
    }, []);

    if (!mounted) return null;

    return (
        <div
            ref={ringRef}
            aria-hidden="true"
            style={{
                display: 'none',
                position: 'fixed',
                top: 0,
                left: 0,
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                border: '1.5px solid color-mix(in oklab, var(--brand-primary) 60%, transparent)',
                boxShadow: '0 0 10px color-mix(in oklab, var(--brand-primary) 20%, transparent)',
                pointerEvents: 'none',
                zIndex: 9999,
                willChange: 'transform, width, height, opacity',
                transition: 'opacity 0.25s ease, width 0.25s ease, height 0.25s ease, border-color 0.25s ease, background-color 0.25s ease',
                opacity: 0,
            }}
        />
    );
}
