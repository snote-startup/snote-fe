'use client';

import {
    Bot,
    FileAudio,
    FolderKanban,
    Search,
    Sparkles,
    UsersRound,
} from 'lucide-react';
import { Reveal } from './Reveal';

/*
 * Bento-grid pattern adapted from 21st.dev bento layouts.
 * Asymmetric sizing using CSS grid spans for visual hierarchy.
 */

const features = [
    {
        icon: FolderKanban,
        title: 'Project workspaces',
        description:
            'Keep audio files, transcripts, and AI chat history organized by project. One workspace per meeting context.',
        span: 'md:col-span-2',
        accent: 'from-purple-500/10 to-transparent',
    },
    {
        icon: FileAudio,
        title: 'Audio upload',
        description:
            'Upload any meeting recording. Snote prepares transcript-ready context with speaker segmentation.',
        span: 'md:col-span-1',
        accent: 'from-blue-500/10 to-transparent',
    },
    {
        icon: UsersRound,
        title: 'Speaker-aware transcript',
        description:
            'Review timestamped speaker turns without losing meeting context.',
        span: 'md:col-span-1',
        accent: 'from-indigo-500/10 to-transparent',
    },
    {
        icon: Bot,
        title: 'Ask AI over transcript',
        description:
            'Query the transcript directly. Ask about decisions, blockers, or follow-ups and get focused answers.',
        span: 'md:col-span-2',
        accent: 'from-violet-500/10 to-transparent',
    },
    {
        icon: Search,
        title: 'Search and review',
        description:
            'Jump to any part of a meeting by searching speaker turns or keywords across the transcript.',
        span: 'md:col-span-1',
        accent: 'from-sky-500/10 to-transparent',
    },
    {
        icon: Sparkles,
        title: 'Follow-up ready',
        description:
            'AI extracts key action items and decisions, ready to copy into your next review document.',
        span: 'md:col-span-1',
        accent: 'from-fuchsia-500/10 to-transparent',
    },
];

export function FeatureBento() {
    return (
        <section id="features" className="relative z-10 py-20 sm:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Reveal>
                    <div className="mb-12 max-w-2xl">
                        <p className="text-primary mb-3 text-sm font-semibold">
                            Features
                        </p>
                        <h2 className="text-foreground text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
                            Everything around the transcript,
                            <br className="hidden sm:block" /> not scattered
                            across tabs.
                        </h2>
                        <p className="text-muted-foreground mt-4 text-base leading-relaxed">
                            One workspace: audio, speakers, transcript, and AI —
                            all connected.
                        </p>
                    </div>
                </Reveal>

                {/* Bento grid — adapted from 21st.dev asymmetric bento pattern */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {features.map((f, i) => {
                        const Icon = f.icon;
                        return (
                            <Reveal
                                key={f.title}
                                delay={i * 60}
                                className={f.span}
                            >
                                <article className="group border-border bg-card hover:border-primary/25 relative h-full overflow-hidden rounded-2xl border p-6 transition-all duration-200 hover:shadow-md hover:shadow-black/5 dark:hover:shadow-black/20">
                                    {/* Accent gradient blob */}
                                    <div
                                        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${f.accent} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                                    />

                                    <div className="relative">
                                        <div className="bg-primary/10 text-primary mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl">
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <h3 className="text-foreground mb-2 text-base font-semibold">
                                            {f.title}
                                        </h3>
                                        <p className="text-muted-foreground text-sm leading-6">
                                            {f.description}
                                        </p>
                                    </div>
                                </article>
                            </Reveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
