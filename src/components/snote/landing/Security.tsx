'use client';

import { FolderLock, KeyRound, ShieldCheck, UserCheck } from 'lucide-react';
import { Reveal } from './Reveal';

const points = [
    {
        icon: KeyRound,
        title: 'Token-based session flow',
        description:
            'Every workspace session is protected by authenticated tokens. No anonymous access to project data.',
    },
    {
        icon: UserCheck,
        title: 'Role-aware navigation',
        description:
            'Interface elements are scoped to your account role. Admin tools only appear for verified admin accounts.',
    },
    {
        icon: FolderLock,
        title: 'Project-based organization',
        description:
            'Audio files, transcripts, and AI chat are isolated per project. No cross-project data leakage in the UI.',
    },
    {
        icon: ShieldCheck,
        title: 'Authenticated workspace',
        description:
            'All routes are guarded. Accessing any workspace page without an active session redirects to sign-in.',
    },
];

export function Security() {
    return (
        <section id="security" className="relative z-10 py-20 sm:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-12 lg:grid-cols-[380px_1fr] lg:items-center">
                    <Reveal>
                        <p className="text-primary mb-3 text-sm font-semibold">
                            Security
                        </p>
                        <h2 className="text-foreground mb-4 text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
                            Designed for authenticated workspaces.
                        </h2>
                        <p className="text-muted-foreground text-base leading-relaxed">
                            Snote is built with role-aware access and
                            project-scoped isolation. Your meeting data is only
                            visible to authenticated users.
                        </p>
                    </Reveal>

                    <div className="grid gap-4 sm:grid-cols-2">
                        {points.map((p, i) => {
                            const Icon = p.icon;
                            return (
                                <Reveal key={p.title} delay={i * 60}>
                                    <article className="border-border bg-card hover:border-primary/20 flex h-full gap-4 rounded-2xl border p-5 transition-colors">
                                        <div className="bg-primary/10 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
                                            <Icon className="h-4.5 w-4.5" />
                                        </div>
                                        <div>
                                            <h3 className="text-foreground mb-1.5 text-sm font-semibold">
                                                {p.title}
                                            </h3>
                                            <p className="text-muted-foreground text-sm leading-6">
                                                {p.description}
                                            </p>
                                        </div>
                                    </article>
                                </Reveal>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
