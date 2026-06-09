'use client';

import { FolderPlus, Upload, FileText, MessageSquareText } from 'lucide-react';
import { Reveal } from './Reveal';

const steps = [
    {
        step: '01',
        icon: FolderPlus,
        title: 'Create a project',
        description:
            'Start a focused workspace for a meeting, team, or customer conversation. One project keeps everything together.',
    },
    {
        step: '02',
        icon: Upload,
        title: 'Upload audio',
        description:
            'Attach the meeting recording. Snote processes the audio and prepares a timestamped, speaker-segmented transcript.',
    },
    {
        step: '03',
        icon: FileText,
        title: 'Review transcript',
        description:
            'Scan speaker turns chronologically, search by keyword, and surface important moments without replaying the full recording.',
    },
    {
        step: '04',
        icon: MessageSquareText,
        title: 'Ask AI and capture follow-up',
        description:
            'Ask the AI about decisions, blockers, or open questions. Get precise answers grounded in the actual transcript.',
    },
];

export function Workflow() {
    return (
        <section
            id="workflow"
            className="border-border bg-muted/20 relative z-10 border-y py-20 sm:py-24"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Reveal className="mb-12 max-w-2xl">
                    <p className="text-primary mb-3 text-sm font-semibold">
                        Workflow
                    </p>
                    <h2 className="text-foreground text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
                        From recording to review in four clear steps.
                    </h2>
                </Reveal>

                {/* Steps grid */}
                <div className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Connector line — desktop */}
                    <div className="border-border pointer-events-none absolute top-10 right-0 left-0 hidden border-t border-dashed lg:block" />

                    {steps.map((s, i) => {
                        const Icon = s.icon;
                        return (
                            <Reveal key={s.step} delay={i * 80}>
                                <article className="border-border bg-card hover:border-primary/25 relative rounded-2xl border p-5 transition-colors">
                                    {/* Step number dot (on connector) */}
                                    <div className="border-border bg-background text-foreground relative z-10 mb-5 inline-flex h-10 w-10 items-center justify-center rounded-full border text-sm font-bold shadow-sm">
                                        <Icon className="text-primary h-4.5 w-4.5" />
                                    </div>

                                    <span className="text-primary mb-3 block text-xs font-bold tracking-wider">
                                        {s.step}
                                    </span>
                                    <h3 className="text-foreground mb-2 text-base font-semibold">
                                        {s.title}
                                    </h3>
                                    <p className="text-muted-foreground text-sm leading-6">
                                        {s.description}
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
