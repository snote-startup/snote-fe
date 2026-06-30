import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

const contactEmail = 'privacy@snote.app'; // TODO: Replace with the final privacy contact email before Google Play submission if needed.
const lastUpdated = 'June 30, 2026';

const policySections = [
    {
        title: '1. Overview',
        body: [
            'Snote helps users record or upload meeting audio, generate transcripts, ask AI-assisted questions, and create follow-up tasks. This Privacy Policy explains how Snote collects, uses, shares, stores, and protects information when you use the Snote application and related services.',
        ],
    },
    {
        title: '2. Information We Collect',
        list: [
            'Account information, such as email address, display name, and authentication or session information.',
            'User content, such as project titles, descriptions, uploaded or recorded audio files, transcripts, chat prompts and responses, and generated tasks.',
            'Technical information, such as device, browser, and app information, IP address, usage metadata, logs, and error diagnostics needed to operate, secure, debug, and improve the service.',
            'Payment-related information, such as payment status, order reference, subscription or quota status, and transaction metadata. If users purchase a plan or quota, payment processing is handled by a third-party payment provider. Snote does not store full card or bank account details.',
        ],
    },
    {
        title: '3. How We Use Information',
        list: [
            'To provide authentication and account access.',
            'To store and manage projects, audio, transcripts, chat history, and tasks.',
            'To process audio into transcripts.',
            'To provide AI chat, summary, and task generation features.',
            'To operate, secure, monitor, debug, and improve the service.',
            'To manage quota, billing status, and subscription or payment status.',
        ],
    },
    {
        title: '4. Audio, Transcript, and AI Processing',
        list: [
            'Audio uploaded or recorded by the user may be sent to backend services for storage and transcription.',
            'Transcript and chat content may be processed by AI services to generate summaries, answers, or tasks.',
            'Users should only upload or record content that they have the right and permission to process with Snote.',
        ],
    },
    {
        title: '5. Sharing of Information',
        body: [
            'Snote may share data with service providers only as needed to provide and operate the service.',
        ],
        list: [
            'Cloud hosting and storage providers.',
            'Authentication and backend infrastructure providers.',
            'AI and transcription providers.',
            'Payment providers.',
            'Analytics, logging, and error monitoring providers when used to operate, secure, and improve the service.',
        ],
        footer: 'Snote does not sell personal data.',
    },
    {
        title: '6. Data Retention and Deletion',
        list: [
            'User content is retained while the account or project exists, or as needed to provide the service.',
            'Users can request deletion of their account and associated data by contacting the privacy contact listed below.',
            'Some data may be retained temporarily for security, backup, legal, billing, dispute resolution, or abuse-prevention purposes.',
        ],
        deletionLink: true,
    },
    {
        title: '7. Security',
        body: [
            'Snote uses reasonable technical and organizational safeguards designed to protect information, including HTTPS in transit, access controls, and operational controls. No method of transmission or storage is completely secure, so Snote cannot guarantee absolute security.',
        ],
    },
    {
        title: "8. Children's Privacy",
        body: [
            "Snote is not intended for children under 13, or under the minimum age required in the user's jurisdiction. If you believe a child has provided personal information to Snote, contact us so we can take appropriate action.",
        ],
    },
    {
        title: '9. International Processing',
        body: [
            'Information may be processed and stored in countries where Snote or its service providers operate. These countries may have privacy and data protection laws that differ from those in your location.',
        ],
    },
    {
        title: '10. Changes to This Policy',
        body: [
            'Snote may update this Privacy Policy from time to time. When changes are made, Snote will update the Last updated date on this page.',
        ],
    },
    {
        title: '11. Contact',
        body: [
            `For privacy questions, requests, or deletion inquiries, contact Snote at ${contactEmail}.`,
            'Developer/App: Snote',
        ],
    },
];

export const metadata: Metadata = {
    title: 'Privacy Policy | Snote',
    description:
        'Privacy Policy for Snote, including information collection, use, sharing, retention, security, deletion, and contact details.',
};

export default function PolicyPage() {
    return (
        <main className="min-h-svh bg-slate-50 px-4 py-6 text-slate-900 sm:px-6 sm:py-10 dark:bg-zinc-950 dark:text-zinc-100">
            <article className="mx-auto max-w-4xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <header className="border-b border-slate-200 px-5 py-6 sm:px-8 sm:py-8 dark:border-zinc-800">
                    <div className="mb-8 flex items-center justify-between gap-4">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-3 text-sm font-semibold text-slate-900 dark:text-zinc-100"
                            aria-label="Go to Snote home"
                        >
                            <Image
                                src="/snote-logo.png"
                                alt="Snote"
                                width={96}
                                height={27}
                                className="h-auto w-24 dark:brightness-0 dark:invert"
                                priority
                            />
                        </Link>
                        <Link
                            href="/"
                            className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-950 dark:text-zinc-400 dark:hover:text-zinc-100"
                        >
                            Back to Snote
                        </Link>
                    </div>
                    <p className="mb-3 text-sm font-semibold tracking-wide text-violet-700 uppercase dark:text-violet-300">
                        Snote
                    </p>
                    <h1 className="text-3xl leading-tight font-semibold text-slate-950 sm:text-4xl dark:text-white">
                        Privacy Policy
                    </h1>
                    <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-zinc-300">
                        This Privacy Policy applies to the Snote app and related
                        services.
                    </p>
                    <p className="mt-3 text-sm text-slate-500 dark:text-zinc-400">
                        Last updated: {lastUpdated}
                    </p>
                </header>

                <div className="space-y-9 px-5 py-7 sm:px-8 sm:py-10">
                    {policySections.map((section) => (
                        <section key={section.title} className="scroll-mt-8">
                            <h2 className="mb-3 text-xl font-semibold text-slate-950 dark:text-white">
                                {section.title}
                            </h2>
                            {section.body?.map((paragraph) => (
                                <p
                                    key={paragraph}
                                    className="mt-3 text-sm leading-7 text-slate-700 sm:text-base dark:text-zinc-300"
                                >
                                    {paragraph}
                                </p>
                            ))}
                            {section.list ? (
                                <ul className="mt-4 space-y-3 pl-5 text-sm leading-7 text-slate-700 sm:text-base dark:text-zinc-300">
                                    {section.list.map((item) => (
                                        <li key={item} className="list-disc">
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            ) : null}
                            {section.footer ? (
                                <p className="mt-4 text-sm leading-7 font-medium text-slate-800 sm:text-base dark:text-zinc-200">
                                    {section.footer}
                                </p>
                            ) : null}
                            {section.deletionLink ? (
                                <p className="mt-4 text-sm leading-7 sm:text-base">
                                    <Link
                                        href="/snote/account-deletion"
                                        className="font-medium text-violet-700 hover:text-violet-900 dark:text-violet-300 dark:hover:text-violet-200"
                                    >
                                        Request account or data deletion
                                    </Link>
                                </p>
                            ) : null}
                        </section>
                    ))}
                </div>

                <footer className="border-t border-slate-200 bg-slate-100/70 px-5 py-6 text-sm text-slate-600 sm:px-8 dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-400">
                    <p>
                        Snote privacy contact:{' '}
                        <a
                            href={`mailto:${contactEmail}`}
                            className="font-medium text-violet-700 hover:text-violet-900 dark:text-violet-300 dark:hover:text-violet-200"
                        >
                            {contactEmail}
                        </a>
                    </p>
                </footer>
            </article>
        </main>
    );
}
