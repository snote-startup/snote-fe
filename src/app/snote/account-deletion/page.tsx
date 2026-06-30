import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { AccountDeletionForm } from './AccountDeletionForm';

const supportEmail = 'namdangcoder@gmail.com';

const deletedData = [
    'Account information such as email address and display name',
    'Projects and project metadata',
    'Uploaded or recorded audio files',
    'Transcripts',
    'AI chat messages and generated answers',
    'Generated tasks and related app data',
];

export const metadata: Metadata = {
    title: 'Snote Account and Data Deletion',
    description:
        'Request deletion of a Snote account and associated app data without signing in.',
};

export default function AccountDeletionPage() {
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
                            href="/policy"
                            className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-950 dark:text-zinc-400 dark:hover:text-zinc-100"
                        >
                            Privacy Policy
                        </Link>
                    </div>
                    <p className="mb-3 text-sm font-semibold tracking-wide text-violet-700 uppercase dark:text-violet-300">
                        Snote
                    </p>
                    <h1 className="text-3xl leading-tight font-semibold text-slate-950 sm:text-4xl dark:text-white">
                        Snote Account and Data Deletion
                    </h1>
                    <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-zinc-300">
                        Use this public page to request deletion of your Snote
                        account and associated data.
                    </p>
                </header>

                <div className="space-y-9 px-5 py-7 sm:px-8 sm:py-10">
                    <section>
                        <h2 className="mb-3 text-xl font-semibold text-slate-950 dark:text-white">
                            Request account or data deletion
                        </h2>
                        <p className="text-sm leading-7 text-slate-700 sm:text-base dark:text-zinc-300">
                            Use this page to request deletion of your Snote
                            account and associated data. You do not need to sign
                            in, and Snote will never ask for your password to
                            process this request.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-3 text-xl font-semibold text-slate-950 dark:text-white">
                            How to submit a request
                        </h2>
                        <p className="text-sm leading-7 text-slate-700 sm:text-base dark:text-zinc-300">
                            For security, please send the request from the email
                            address associated with your Snote account. We may
                            reply to confirm ownership before deleting data.
                        </p>
                        <div className="mt-5">
                            <AccountDeletionForm supportEmail={supportEmail} />
                        </div>
                    </section>

                    <section>
                        <h2 className="mb-3 text-xl font-semibold text-slate-950 dark:text-white">
                            What data may be deleted
                        </h2>
                        <ul className="mt-4 space-y-3 pl-5 text-sm leading-7 text-slate-700 sm:text-base dark:text-zinc-300">
                            {deletedData.map((item) => (
                                <li key={item} className="list-disc">
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section>
                        <h2 className="mb-3 text-xl font-semibold text-slate-950 dark:text-white">
                            Processing time
                        </h2>
                        <p className="text-sm leading-7 text-slate-700 sm:text-base dark:text-zinc-300">
                            We aim to process deletion requests within 30 days.
                            Some data may be retained temporarily if required
                            for security, fraud prevention, legal compliance,
                            backups, or legitimate business operations.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-3 text-xl font-semibold text-slate-950 dark:text-white">
                            Contact
                        </h2>
                        <p className="text-sm leading-7 text-slate-700 sm:text-base dark:text-zinc-300">
                            Support email:{' '}
                            <a
                                href={`mailto:${supportEmail}`}
                                className="font-medium text-violet-700 hover:text-violet-900 dark:text-violet-300 dark:hover:text-violet-200"
                            >
                                {supportEmail}
                            </a>
                        </p>
                    </section>
                </div>

                <footer className="border-t border-slate-200 bg-slate-100/70 px-5 py-6 text-sm text-slate-600 sm:px-8 dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-400">
                    <Link
                        href="/policy"
                        className="font-medium text-violet-700 hover:text-violet-900 dark:text-violet-300 dark:hover:text-violet-200"
                    >
                        View Snote Privacy Policy
                    </Link>
                </footer>
            </article>
        </main>
    );
}
