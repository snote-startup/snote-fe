'use client';

import { Reveal } from './Reveal';

const quotes = [
    {
        text: 'Instead of digging through recordings, I can ask the transcript directly. It changed how we do post-meeting review.',
        role: 'Product team lead',
    },
    {
        text: 'Having speaker labels on every line makes it easy to find exactly who said what. No more scrubbing audio.',
        role: 'Research lead',
    },
    {
        text: "The AI doesn't just summarize — it answers specific questions. That's the difference.",
        role: 'Founder',
    },
];

export function Testimonials() {
    return (
        <section
            id="testimonials"
            className="border-border bg-muted/20 relative z-10 border-y py-20 sm:py-24"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Reveal className="mb-12 max-w-2xl">
                    <p className="text-primary mb-3 text-sm font-semibold">
                        What teams say
                    </p>
                    <h2 className="text-foreground text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
                        What teams use Snote for.
                    </h2>
                </Reveal>

                <div className="grid gap-4 sm:grid-cols-3">
                    {quotes.map((q, i) => (
                        <Reveal key={i} delay={i * 80}>
                            <figure className="border-border bg-card flex h-full flex-col rounded-2xl border p-6">
                                <blockquote className="flex-1">
                                    <p className="text-foreground text-base leading-7">
                                        &ldquo;{q.text}&rdquo;
                                    </p>
                                </blockquote>
                                <figcaption className="border-border text-muted-foreground mt-5 border-t pt-4 text-sm">
                                    {q.role}
                                </figcaption>
                            </figure>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
