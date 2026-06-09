'use client';

import Link from 'next/link';
import { ArrowRight, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductShowcase } from './ProductShowcase';
import { Reveal } from './Reveal';

export function Hero() {
    return (
        <section className="relative z-10 overflow-hidden">
            {/* Background orbs */}
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute top-[15%] left-[10%] h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,#490aad_14%,transparent),transparent_70%)] blur-3xl" />
                <div className="absolute top-[8%] right-[8%] h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,#2563eb_9%,transparent),transparent_70%)] blur-3xl" />
            </div>

            <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-[minmax(0,1fr)_480px] lg:items-center lg:gap-16 lg:px-8 lg:py-28">
                {/* Left — text */}
                <Reveal className="max-w-2xl">
                    {/* Badge */}
                    <div className="border-border bg-muted/60 text-muted-foreground mb-6 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium">
                        <Mic className="text-primary h-3.5 w-3.5" />
                        AI-powered meeting intelligence
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl leading-[1.15] font-semibold tracking-tight sm:text-5xl lg:text-[3.5rem]">
                        Turn meeting audio into{' '}
                        <span className="bg-gradient-to-r from-[#490aad] via-[#7c3aed] to-[#2563eb] bg-clip-text text-transparent">
                            searchable transcripts.
                        </span>
                    </h1>

                    {/* Subheadline */}
                    <p className="text-muted-foreground mt-6 text-base leading-relaxed sm:text-lg">
                        Create a project, upload meeting audio, review speaker
                        transcripts, and ask AI questions over the conversation.
                    </p>

                    {/* CTAs */}
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Button asChild size="lg" className="h-11 px-6">
                            <Link href="/dashboard">
                                Open app
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Button
                            asChild
                            size="lg"
                            variant="outline"
                            className="h-11 px-6"
                        >
                            <Link href="#workflow">See workflow</Link>
                        </Button>
                    </div>

                    {/* Credibility strip */}
                    <div className="text-muted-foreground mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
                        {[
                            'Built for meeting notes',
                            'Audio transcripts',
                            'AI review',
                        ].map((item, i) => (
                            <span
                                key={item}
                                className="flex items-center gap-2"
                            >
                                {i > 0 && (
                                    <span className="bg-muted-foreground/40 h-1 w-1 rounded-full" />
                                )}
                                {item}
                            </span>
                        ))}
                    </div>
                </Reveal>

                {/* Right — product preview */}
                <Reveal y={32} delay={150}>
                    <ProductShowcase />
                </Reveal>
            </div>
        </section>
    );
}
