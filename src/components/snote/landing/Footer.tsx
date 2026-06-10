'use client';

import Link from 'next/link';
import Image from 'next/image';

const footerLinks = [
    {
        section: 'Product',
        links: [
            { label: 'Features', href: '#features' },
            { label: 'Workflow', href: '#workflow' },
            { label: 'Pricing', href: '/pricing' },
        ],
    },
    {
        section: 'Workspace',
        links: [
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Meetings', href: '/meetings' },
            { label: 'Tasks', href: '/tasks' },
        ],
    },
    {
        section: 'Account',
        links: [
            { label: 'Sign in', href: '/login' },
            { label: 'Register', href: '/register' },
        ],
    },
];

export function Footer() {
    return (
        <footer className="border-border bg-muted/10 relative z-10 border-t">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[240px_repeat(3,1fr)]">
                    {/* Brand */}
                    <div className="sm:col-span-2 lg:col-span-1">
                        <Link href="/" className="mb-4 inline-flex">
                            <Image
                                src="/snote-logo.png"
                                alt="Snote"
                                width={100}
                                height={28}
                                className="h-auto w-[92px]"
                            />
                        </Link>
                        <p className="text-muted-foreground mt-3 max-w-xs text-sm leading-6">
                            Meeting audio intelligence. Create a project, upload
                            audio, review transcripts, and ask AI questions over
                            the conversation.
                        </p>
                    </div>

                    {/* Links */}
                    {footerLinks.map(({ section, links }) => (
                        <div key={section}>
                            <p className="text-foreground mb-4 text-xs font-semibold tracking-wider uppercase">
                                {section}
                            </p>
                            <ul className="space-y-2.5">
                                {links.map(({ label, href }) => (
                                    <li key={label}>
                                        <Link
                                            href={href}
                                            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                                        >
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="border-border mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
                    <p className="text-muted-foreground text-xs" suppressHydrationWarning>
                        © {new Date().getFullYear()} Snote. Meeting
                        transcription workspace.
                    </p>
                    <p className="text-muted-foreground text-xs">
                        Built with audio intelligence in mind.
                    </p>
                </div>
            </div>
        </footer>
    );
}
