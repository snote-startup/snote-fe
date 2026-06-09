'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Reveal } from './Reveal';

export function FinalCTA() {
    return (
        <section className="relative z-10 py-20 sm:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Reveal>
                    <div className="border-border from-primary/10 via-background relative overflow-hidden rounded-3xl border bg-gradient-to-br to-blue-500/10 p-10 text-center sm:p-16">
                        {/* Very subtle glow behind */}
                        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,#490aad_8%,transparent),transparent_60%)]" />

                        <p className="text-primary mb-4 text-sm font-semibold">
                            Get started
                        </p>
                        <h2 className="text-foreground mb-5 text-3xl leading-tight font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                            Ready to review your next meeting faster?
                        </h2>
                        <p className="text-muted-foreground mx-auto mb-8 max-w-xl text-base leading-relaxed">
                            Create a project and upload your first audio file.
                            No credit card required.
                        </p>
                        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                            <Button asChild size="lg" className="h-11 px-8">
                                <Link href="/dashboard">
                                    Open app
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>
                            <Button
                                asChild
                                size="lg"
                                variant="outline"
                                className="h-11 px-8"
                            >
                                <Link href="/login">Sign in</Link>
                            </Button>
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
