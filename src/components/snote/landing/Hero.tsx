'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HeroWorkspaceMock } from './HeroWorkspaceMock';
import { Reveal } from './Reveal';
import { CursorReactiveBackground } from './CursorReactiveBackground';
import { track } from '@vercel/analytics';

export function Hero() {
    return (
        <CursorReactiveBackground className="landing-grid-bg relative z-10 overflow-hidden pt-28 sm:pt-32">
            {/* Horizontal beam */}
            <div className="cursor-beam" />

            {/* Background glow orbs (static, under cursor layers via z-index) */}
            <div
                className="pointer-events-none absolute inset-0"
                style={{ zIndex: 0 }}
            >
                <div className="animate-glow-pulse absolute top-[10%] left-[8%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgb(124_58_237_/_0.12),transparent_60%)] blur-3xl" />
                <div className="animate-glow-pulse absolute top-[5%] right-[5%] h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgb(37_99_235_/_0.08),transparent_60%)] blur-3xl [animation-delay:2s]" />
                <div className="animate-glow-pulse absolute bottom-[10%] left-[30%] h-[350px] w-[350px] rounded-full bg-[radial-gradient(circle,rgb(73_10_173_/_0.1),transparent_60%)] blur-3xl [animation-delay:3s]" />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Text centered */}
                <Reveal className="mx-auto max-w-3xl text-center">
                    {/* Badge */}
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-xs font-medium text-violet-300">
                        <Sparkles className="h-3.5 w-3.5" />
                        Workspace cuộc họp với AI
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl leading-[1.1] font-bold tracking-tight text-zinc-100 sm:text-5xl lg:text-6xl">
                        Transcript cuộc họp,{' '}
                        <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                            dễ tìm kiếm và có nguồn rõ ràng.
                        </span>
                    </h1>

                    {/* Subheadline */}
                    <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
                        Tải audio lên, tạo transcript và chat với AI kèm nguồn
                        tham chiếu tới đúng đoạn transcript.
                    </p>

                    {/* CTAs */}
                    <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Button
                            asChild
                            size="lg"
                            className="h-12 bg-violet-600 px-8 text-white hover:bg-violet-500"
                            onClick={() => track('landing_primary_cta_clicked')}
                        >
                            <Link href="/dashboard">
                                Bắt đầu tạo transcript
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Button
                            asChild
                            size="lg"
                            variant="ghost"
                            className="h-12 border border-white/[0.1] px-8 text-zinc-300 hover:bg-white/[0.06] hover:text-zinc-100"
                            onClick={() =>
                                track('landing_secondary_cta_clicked')
                            }
                        >
                            <Link href="#workflow">Xem quy trình</Link>
                        </Button>
                    </div>
                </Reveal>

                {/* Workspace preview with parallax */}
                <Reveal y={40} delay={200} className="mt-16 sm:mt-20">
                    <div className="hero-parallax mx-auto max-w-4xl">
                        <HeroWorkspaceMock />
                    </div>
                </Reveal>
            </div>

            {/* Bottom fade to next section */}
            <div className="pointer-events-none relative z-10 h-24 bg-gradient-to-b from-transparent to-[#09090b]" />
        </CursorReactiveBackground>
    );
}
