'use client';

import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Reveal } from './Reveal';

const tiers = [
    {
        name: 'Free',
        description: 'Start with one project and your first recording.',
        highlight: false,
        perks: [
            '1 active project',
            'Up to 60 min/month',
            'Transcript review',
            'Basic AI chat',
        ],
        cta: { label: 'Get started free', href: '/register' },
    },
    {
        name: 'Pro',
        description: 'Unlimited projects, more audio, and full AI access.',
        highlight: true,
        perks: [
            'Unlimited projects',
            'Extended audio capacity',
            'Full AI transcript chat',
            'Priority processing',
        ],
        cta: { label: 'Upgrade path coming', href: '/pricing' },
    },
];

export function PricingTeaser() {
    return (
        <section id="pricing" className="relative z-10 py-20 sm:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Reveal className="mb-12 max-w-2xl">
                    <p className="text-primary mb-3 text-sm font-semibold">
                        Pricing
                    </p>
                    <h2 className="text-foreground text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
                        Start free. Upgrade when ready.
                    </h2>
                    <p className="text-muted-foreground mt-4 text-base leading-relaxed">
                        No credit card required to get started. Full pricing
                        details coming soon.
                    </p>
                </Reveal>

                <div className="grid gap-4 sm:grid-cols-2 lg:max-w-3xl">
                    {tiers.map((tier, i) => (
                        <Reveal key={tier.name} delay={i * 80}>
                            <div
                                className={`relative flex h-full flex-col rounded-2xl border p-6 ${
                                    tier.highlight
                                        ? 'border-primary/40 from-primary/5 bg-gradient-to-b to-transparent'
                                        : 'border-border bg-card'
                                }`}
                            >
                                {tier.highlight && (
                                    <span className="bg-primary text-primary-foreground absolute top-4 right-4 rounded-full px-2.5 py-0.5 text-[10px] font-semibold">
                                        Coming soon
                                    </span>
                                )}
                                <h3 className="text-foreground mb-1 text-lg font-semibold">
                                    {tier.name}
                                </h3>
                                <p className="text-muted-foreground mb-5 text-sm">
                                    {tier.description}
                                </p>
                                <ul className="mb-6 flex-1 space-y-2">
                                    {tier.perks.map((perk) => (
                                        <li
                                            key={perk}
                                            className="text-muted-foreground flex items-center gap-2 text-sm"
                                        >
                                            <Check className="text-primary h-4 w-4 shrink-0" />
                                            {perk}
                                        </li>
                                    ))}
                                </ul>
                                <Button
                                    asChild
                                    variant={
                                        tier.highlight ? 'default' : 'outline'
                                    }
                                    className="w-full"
                                >
                                    <Link href={tier.cta.href}>
                                        {tier.cta.label}
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        </Reveal>
                    ))}
                </div>

                <Reveal delay={160} className="mt-6">
                    <p className="text-muted-foreground text-sm">
                        See full details at{' '}
                        <Link
                            href="/pricing"
                            className="text-primary underline-offset-4 hover:underline"
                        >
                            /pricing
                        </Link>
                    </p>
                </Reveal>
            </div>
        </section>
    );
}
