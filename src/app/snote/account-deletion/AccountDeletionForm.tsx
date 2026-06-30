'use client';

import { FormEvent, useState } from 'react';

export const SUPPORT_EMAIL = 'namdangcoder@gmail.com';

const SUBJECT = 'Snote account/data deletion request';

const fullAccountRequest = 'Delete my Snote account and all associated data';
const partialDataRequest =
    'Delete specific data only, without deleting my account';

const requestTypes = [fullAccountRequest, partialDataRequest];

const dataTypeOptions = [
    'Projects',
    'Transcripts',
    'Uploaded audio files',
    'Notes or text content',
    'AI chat messages',
    'Other',
];

type FallbackMessage = {
    subject: string;
    body: string;
};

type FormErrors = {
    email?: string;
    requestType?: string;
    dataTypes?: string;
    consent?: string;
};

export function AccountDeletionForm() {
    const [email, setEmail] = useState('');
    const [requestType, setRequestType] = useState('');
    const [selectedDataTypes, setSelectedDataTypes] = useState<string[]>([]);
    const [consent, setConsent] = useState(false);
    const [note, setNote] = useState('');
    const [errors, setErrors] = useState<FormErrors>({});
    const [fallbackMessage, setFallbackMessage] =
        useState<FallbackMessage | null>(null);
    const [copied, setCopied] = useState(false);

    const isPartialDeletion = requestType === partialDataRequest;

    function updateSelectedDataTypes(dataType: string, checked: boolean) {
        setSelectedDataTypes((current) => {
            if (checked) {
                return current.includes(dataType)
                    ? current
                    : [...current, dataType];
            }

            return current.filter((item) => item !== dataType);
        });
    }

    function validateForm() {
        const nextErrors: FormErrors = {};
        const trimmedEmail = email.trim();

        if (!trimmedEmail) {
            nextErrors.email =
                'Please enter the email address associated with your Snote account.';
        } else if (!trimmedEmail.includes('@')) {
            nextErrors.email =
                'Please enter a valid email address that includes @.';
        }

        if (!requestType) {
            nextErrors.requestType = 'Please choose a request type.';
        }

        if (isPartialDeletion && selectedDataTypes.length === 0) {
            nextErrors.dataTypes =
                'Please select at least one type of data to delete.';
        }

        if (!consent) {
            nextErrors.consent =
                'Please confirm that Snote may contact you to verify ownership.';
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    }

    async function copyFallbackMessage() {
        if (!fallbackMessage) {
            return;
        }

        const text = `To: ${SUPPORT_EMAIL}
Subject: ${fallbackMessage.subject}

${fallbackMessage.body}`;

        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
        } catch {
            setCopied(false);
        }
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setCopied(false);

        if (!validateForm()) {
            setFallbackMessage(null);
            return;
        }

        const trimmedEmail = email.trim();
        const trimmedNote = note.trim();
        const requestTypeForEmail =
            requestType === fullAccountRequest
                ? 'delete account'
                : 'delete specific data only';
        const dataForDeletion =
            requestType === fullAccountRequest
                ? 'All account-associated data'
                : selectedDataTypes.join('\n');

        const body = `Hello Snote team,

I would like to request deletion for my Snote account or data.

Account email: ${trimmedEmail}
Request type: ${requestTypeForEmail}

Data requested for deletion:
${dataForDeletion}

Additional details:
${trimmedNote || 'N/A'}

I understand that Snote may contact me to verify account ownership before processing this request.

Thank you.`;

        const subject = encodeURIComponent(SUBJECT);
        const encodedBody = encodeURIComponent(body);
        const mailtoUrl = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${encodedBody}`;

        setFallbackMessage({ subject: SUBJECT, body });
        window.location.href = mailtoUrl;
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
                    Email associated with your Snote account *
                </label>
                <input
                    id="account-email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    aria-invalid={errors.email ? 'true' : 'false'}
                    aria-describedby={
                        errors.email ? 'account-email-error' : undefined
                    }
                    className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-950 transition outline-none focus:border-violet-500 focus:ring-3 focus:ring-violet-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-violet-300"
                />
                {errors.email ? (
                    <p
                        id="account-email-error"
                        className="text-sm font-medium text-red-600 dark:text-red-400"
                    >
                        {errors.email}
                    </p>
                ) : null}
            </div>

            <div className="space-y-2">
                <label
                    htmlFor="request-type"
                    className="block text-sm font-semibold text-slate-900 dark:text-zinc-100"
                >
                    Request type *
                </label>
                <select
                    id="request-type"
                    required
                    value={requestType}
                    onChange={(event) => {
                        setRequestType(event.target.value);
                        if (event.target.value === fullAccountRequest) {
                            setSelectedDataTypes([]);
                        }
                    }}
                    aria-invalid={errors.requestType ? 'true' : 'false'}
                    aria-describedby={
                        errors.requestType ? 'request-type-error' : undefined
                    }
                    className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-950 transition outline-none focus:border-violet-500 focus:ring-3 focus:ring-violet-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-violet-300"
                >
                    <option value="">Select a request type</option>
                    {requestTypes.map((type) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
                {errors.requestType ? (
                    <p
                        id="request-type-error"
                        className="text-sm font-medium text-red-600 dark:text-red-400"
                    >
                        {errors.requestType}
                    </p>
                ) : null}
            </div>

            {isPartialDeletion ? (
                <fieldset
                    className="space-y-3"
                    aria-describedby={
                        errors.dataTypes ? 'data-types-error' : undefined
                    }
                >
                    <legend className="text-sm font-semibold text-slate-900 dark:text-zinc-100">
                        Data types to delete *
                    </legend>
                    <div className="grid gap-3 sm:grid-cols-2">
                        {dataTypeOptions.map((dataType) => (
                            <label
                                key={dataType}
                                className="flex min-h-11 items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedDataTypes.includes(
                                        dataType,
                                    )}
                                    onChange={(event) =>
                                        updateSelectedDataTypes(
                                            dataType,
                                            event.target.checked,
                                        )
                                    }
                                    className="h-4 w-4 rounded border-slate-300 text-violet-700 focus:ring-2 focus:ring-violet-500/30 dark:border-zinc-700"
                                />
                                <span>{dataType}</span>
                            </label>
                        ))}
                    </div>
                    {errors.dataTypes ? (
                        <p
                            id="data-types-error"
                            className="text-sm font-medium text-red-600 dark:text-red-400"
                        >
                            {errors.dataTypes}
                        </p>
                    ) : null}
                </fieldset>
            ) : null}

            <div className="rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm leading-6 text-slate-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                For security, please submit the request using the email address
                associated with your Snote account. We may contact you to verify
                account ownership before deleting any account or data.
            </div>

            <div className="space-y-2">
                <label
                    htmlFor="additional-note"
                    className="block text-sm font-semibold text-slate-900 dark:text-zinc-100"
                >
                    Additional details / note
                </label>
                <textarea
                    id="additional-note"
                    placeholder="Tell us what you would like deleted or add any details that may help us process your request."
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    rows={5}
                    className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm leading-6 text-slate-950 transition outline-none focus:border-violet-500 focus:ring-3 focus:ring-violet-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-violet-300"
                />
            </div>

            <div className="space-y-2">
                <label className="flex items-start gap-3 text-sm leading-6 text-slate-800 dark:text-zinc-200">
                    <input
                        type="checkbox"
                        required
                        checked={consent}
                        onChange={(event) => setConsent(event.target.checked)}
                        aria-invalid={errors.consent ? 'true' : 'false'}
                        aria-describedby={
                            errors.consent ? 'consent-error' : undefined
                        }
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-violet-700 focus:ring-2 focus:ring-violet-500/30 dark:border-zinc-700"
                    />
                    <span>
                        I understand that Snote may contact me to verify account
                        ownership before processing this request.
                    </span>
                </label>
                {errors.consent ? (
                    <p
                        id="consent-error"
                        className="text-sm font-medium text-red-600 dark:text-red-400"
                    >
                        {errors.consent}
                    </p>
                ) : null}
            </div>

            <button
                type="submit"
                className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-violet-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-800 focus:ring-3 focus:ring-violet-500/30 focus:outline-none sm:w-auto dark:bg-violet-500 dark:hover:bg-violet-400"
            >
                Send deletion request
            </button>

            {fallbackMessage ? (
                <section className="space-y-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-100">
                    <div>
                        <h3 className="text-base font-semibold">
                            Email request prepared
                        </h3>
                        <p className="mt-1">
                            If your email app did not open, please copy the
                            message below and send it to {SUPPORT_EMAIL}.
                        </p>
                    </div>
                    <dl className="space-y-1">
                        <div>
                            <dt className="inline font-semibold">To: </dt>
                            <dd className="inline">{SUPPORT_EMAIL}</dd>
                        </div>
                        <div>
                            <dt className="inline font-semibold">Subject: </dt>
                            <dd className="inline">
                                {fallbackMessage.subject}
                            </dd>
                        </div>
                    </dl>
                    <textarea
                        readOnly
                        value={fallbackMessage.body}
                        rows={12}
                        className="w-full resize-y rounded-lg border border-emerald-200 bg-white px-3 py-2 font-mono text-xs leading-5 text-slate-900 outline-none focus:ring-3 focus:ring-emerald-500/20 dark:border-emerald-900/70 dark:bg-zinc-950 dark:text-zinc-100"
                    />
                    <button
                        type="button"
                        onClick={copyFallbackMessage}
                        className="inline-flex min-h-10 items-center justify-center rounded-lg border border-emerald-300 bg-white px-4 py-2 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-100 focus:ring-3 focus:ring-emerald-500/20 focus:outline-none dark:border-emerald-800 dark:bg-zinc-950 dark:text-emerald-100 dark:hover:bg-emerald-950"
                    >
                        {copied ? 'Copied' : 'Copy message'}
                    </button>
                </section>
            ) : null}
        </form>
    );
}
