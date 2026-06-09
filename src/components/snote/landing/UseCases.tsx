'use client';

import { Briefcase, Phone, Microscope } from 'lucide-react';
import { Reveal } from './Reveal';

const cases = [
    {
        icon: Briefcase,
        label: 'Product meetings',
        what: 'Weekly standups, sprint reviews, roadmap planning sessions.',
        value: 'Extract decisions, feature discussions, and open blockers across long recordings without replaying the entire meeting.',
    },
    {
        icon: Phone,
        label: 'Client calls',
        what: 'Sales discovery calls, customer interviews, and support escalations.',
        value: 'Review what was promised, identify pain points mentioned, and surface follow-up actions for the account team.',
    },
    {
        icon: Microscope,
        label: 'Research interviews',
        what: '1-on-1 user research sessions with multiple participants.',
        value: 'Tag speaker turns by theme, ask AI to summarize patterns, and export key quotes for research documentation.',
    },
];

export function UseCases() {
    return (
        <section id="use-cases" className="relative z-10 py-20 sm:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Reveal className="mb-12 max-w-2xl">
                    <p className="text-primary mb-3 text-sm font-semibold">
                        Use cases
                    </p>
                    <h2 className="text-foreground text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
                        Built for the meetings that matter most.
                    </h2>
                </Reveal>

                <div className="grid gap-4 sm:grid-cols-3">
                    {cases.map((c, i) => {
                        const Icon = c.icon;
                        return (
                            <Reveal key={c.label} delay={i * 80}>
                                <article className="group border-border bg-card hover:border-primary/25 flex h-full flex-col rounded-2xl border p-6 transition-all">
                                    <div className="bg-primary/10 text-primary mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl">
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <h3 className="text-foreground mb-3 text-base font-semibold">
                                        {c.label}
                                    </h3>
                                    <p className="text-muted-foreground mb-4 text-sm leading-6">
                                        <span className="text-foreground font-medium">
                                            What you upload:{' '}
                                        </span>
                                        {c.what}
                                    </p>
                                    <p className="text-muted-foreground border-border mt-auto border-t pt-4 text-sm leading-6">
                                        <span className="text-foreground font-medium">
                                            What Snote helps:{' '}
                                        </span>
                                        {c.value}
                                    </p>
                                </article>
                            </Reveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
