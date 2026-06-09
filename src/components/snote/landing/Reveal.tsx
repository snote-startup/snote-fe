'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface RevealProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    /** translateY amount in px — default 24 */
    y?: number;
}

export function Reveal({
    children,
    className = '',
    delay = 0,
    y = 24,
}: RevealProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)',
        ).matches;
        if (prefersReducedMotion) {
            gsap.set(el, { opacity: 1, y: 0 });
            return;
        }

        const ctx = gsap.context(() => {
            gsap.fromTo(
                el,
                { opacity: 0, y: y },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    delay: delay / 1000,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                        toggleActions: 'play none none none',
                    },
                },
            );
        });

        return () => ctx.revert();
    }, [delay, y]);

    return (
        <div ref={ref} className={className} style={{ opacity: 0 }}>
            {children}
        </div>
    );
}
