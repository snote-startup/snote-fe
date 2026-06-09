'use client';

import { Reveal } from './Reveal';

const logos = [
    { name: 'Product teams', abbr: 'PT' },
    { name: 'Research leads', abbr: 'RL' },
    { name: 'Customer success', abbr: 'CS' },
    { name: 'Sales calls', abbr: 'SC' },
    { name: 'Design reviews', abbr: 'DR' },
    { name: 'Engineering syncs', abbr: 'ES' },
    { name: 'Executive briefings', abbr: 'EB' },
];

export function TrustStrip() {
    return (
        <section className="border-border bg-muted/20 relative z-10 border-y py-10">
            <Reveal>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <p className="text-muted-foreground mb-6 text-center text-xs font-medium tracking-widest uppercase">
                        Used across teams for
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        {logos.map(({ name, abbr }) => (
                            <span
                                key={name}
                                className="border-border bg-card text-muted-foreground hover:border-primary/20 hover:text-foreground inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors"
                            >
                                <span className="bg-primary/10 text-primary flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold">
                                    {abbr[0]}
                                </span>
                                {name}
                            </span>
                        ))}
                    </div>
                </div>
            </Reveal>
        </section>
    );
}
