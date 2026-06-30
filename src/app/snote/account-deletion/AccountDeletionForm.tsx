'use client';

import { FormEvent, useState } from 'react';

const requestTypes = [
    'Delete my account and all associated data',
    'Delete specific projects, transcripts, uploaded files, or app data only',
];

type AccountDeletionFormProps = {
    supportEmail: string;
};

export function AccountDeletionForm({
    supportEmail,
}: AccountDeletionFormProps) {
    const [email, setEmail] = useState('');
    const [requestType, setRequestType] = useState(requestTypes[0]);
    const [note, setNote] = useState('');
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const trimmedEmail = email.trim();
        const trimmedNote = note.trim();

        if (!trimmedEmail || !trimmedEmail.includes('@')) {
            setSubmitted(false);
            setError(
                'Please enter the email address associated with your Snote account.',
            );
            return;
        }

        setError('');

        const body = `Hello Snote team,

I would like to request data deletion for my Snote account.

Account email: ${trimmedEmail}
Request type: ${requestType}

Additional note:
${trimmedNote || 'N/A'}

I understand that Snote may contact me to confirm account ownership before deleting my account or data.

Thank you.`;

        const mailtoUrl = `mailto:${supportEmail}?subject=${encodeURIComponent(
            'Snote account deletion request',
        )}&body=${encodeURIComponent(body)}`;

        window.location.href = mailtoUrl;
        setSubmitted(true);
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:p-6 dark:border-zinc-800 dark:bg-zinc-950/50"
            noValidate
        >
            <div className="space-y-2">
                <label
                    htmlFor="account-email"
                    className="block text-sm font-semibold text-slate-900 dark:text-zinc-100"
                >
                    Email associated with Snote account
                </label>
                <input
                    id="account-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={error ? 'account-email-error' : undefined}
                    className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-950 transition outline-none focus:border-violet-500 focus:ring-3 focus:ring-violet-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-violet-300"
                />
                {error ? (
                    <p
                        id="account-email-error"
                        className="text-sm font-medium text-red-600 dark:text-red-400"
                    >
                        {error}
                    </p>
                ) : null}
            </div>

            <div className="space-y-2">
                <label
                    htmlFor="request-type"
                    className="block text-sm font-semibold text-slate-900 dark:text-zinc-100"
                >
                    Request type
                </label>
                <select
                    id="request-type"
                    required
                    value={requestType}
                    onChange={(event) => setRequestType(event.target.value)}
                    className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-950 transition outline-none focus:border-violet-500 focus:ring-3 focus:ring-violet-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-violet-300"
                >
                    {requestTypes.map((type) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
            </div>

            <div className="space-y-2">
                <label
                    htmlFor="additional-note"
                    className="block text-sm font-semibold text-slate-900 dark:text-zinc-100"
                >
                    Additional note
                </label>
                <textarea
                    id="additional-note"
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    rows={5}
                    className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm leading-6 text-slate-950 transition outline-none focus:border-violet-500 focus:ring-3 focus:ring-violet-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-violet-300"
                />
            </div>

            <button
                type="submit"
                className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-violet-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-800 focus:ring-3 focus:ring-violet-500/30 focus:outline-none sm:w-auto dark:bg-violet-500 dark:hover:bg-violet-400"
            >
                Send deletion request
            </button>

            {submitted ? (
                <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm leading-6 text-emerald-800 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-200">
                    Your email client should open with a prepared deletion
                    request. Please send the email to complete your request.
                </p>
            ) : null}
        </form>
    );
}
