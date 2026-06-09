'use client';

import { Reveal } from './Reveal';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
    {
        q: 'What kind of audio can I upload?',
        a: 'Snote is designed for meeting recordings. You can upload MP3, M4A, WAV, and other common audio formats. Long recordings with multiple speakers work well because the transcript is segmented by speaker turn and timestamp.',
    },
    {
        q: 'Can I ask questions about a transcript?',
        a: 'Yes. After a transcript is generated, you can use the AI chat to ask focused questions — like "what decisions were made?" or "who owns the follow-up on pricing?" Answers are grounded in the actual transcript content.',
    },
    {
        q: 'Does Snote support multiple speakers?',
        a: 'The transcript is designed to show speaker-segmented turns with timestamps. The number of detected speakers depends on the audio quality and recording setup.',
    },
    {
        q: 'Is this for live translation or uploaded audio?',
        a: 'Snote currently works with uploaded audio files. You record your meeting, upload the file to a project, and Snote processes it into a transcript for review. Live transcription is not available in this version.',
    },
    {
        q: 'How is my workspace protected?',
        a: 'All workspace routes require an authenticated session. Role-based navigation ensures only the right accounts can access admin features. Projects are scoped to your account — no one else can view your audio or transcripts without access.',
    },
];

export function FAQ() {
    return (
        <section
            id="faq"
            className="border-border bg-muted/20 relative z-10 border-y py-20 sm:py-24"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-12 lg:grid-cols-[320px_1fr] lg:items-start">
                    <Reveal>
                        <p className="text-primary mb-3 text-sm font-semibold">
                            FAQ
                        </p>
                        <h2 className="text-foreground text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
                            Common questions.
                        </h2>
                        <p className="text-muted-foreground mt-4 text-base leading-relaxed">
                            Can&apos;t find an answer? Reach out through the
                            app.
                        </p>
                    </Reveal>

                    <Reveal delay={80} className="w-full">
                        <Accordion
                            type="single"
                            collapsible
                            className="w-full space-y-2"
                        >
                            {faqs.map((item, i) => (
                                <AccordionItem
                                    key={i}
                                    value={`item-${i}`}
                                    className="border-border bg-card rounded-xl border px-4"
                                >
                                    <AccordionTrigger className="text-foreground py-4 text-left text-sm font-semibold hover:no-underline">
                                        {item.q}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground pb-4 text-sm leading-6">
                                        {item.a}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
