'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    CalendarCheck,
    CheckCircle2,
    Languages,
    LockKeyhole,
    MessageSquareQuote,
    Mic,
    ShieldCheck,
    Sparkles,
    Star,
    Timer,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0 },
};

function Reveal({
    children,
    delay = 0,
    className,
}: {
    children: ReactNode;
    delay?: number;
    className?: string;
}) {
    return (
        <motion.div
            className={className}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.24 }}
            transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1], delay }}
        >
            {children}
        </motion.div>
    );
}

const features = [
    {
        icon: Mic,
        title: 'Live meeting capture',
        text: 'Capture every speaker turn while the meeting is still moving.',
    },
    {
        icon: Languages,
        title: 'Realtime translation',
        text: 'Keep source speech and translated text paired by speaker and intent.',
    },
    {
        icon: Sparkles,
        title: 'AI decisions and tasks',
        text: 'Extract decisions, blockers, owners, due dates, and follow-up context.',
    },
    {
        icon: CalendarCheck,
        title: 'Calendar-ready follow-up',
        text: 'Turn commitments into scheduled next steps with the meeting attached.',
    },
    {
        icon: ShieldCheck,
        title: 'Admin visibility',
        text: 'Review usage, system health, and global operations in one command layer.',
    },
    {
        icon: LockKeyhole,
        title: 'Plan-aware access',
        text: 'Preview Free, Pro, and Admin states with realistic interface limits.',
    },
];

const workflow = [
    {
        step: '01',
        title: 'Prepare the room',
        text: 'Choose language, audio input, and meeting context before anyone joins.',
    },
    {
        step: '02',
        title: 'Translate as people speak',
        text: 'Speaker highlights, source text, and translations stay locked together.',
    },
    {
        step: '03',
        title: 'Approve the outcome',
        text: 'Review summaries, decisions, tasks, and calendar suggestions in minutes.',
    },
];

const pricing = [
    {
        name: 'Free',
        price: '$0',
        description: 'For validating personal meeting workflows.',
        features: ['120 minutes', 'Basic summaries', 'Task extraction'],
        cta: 'Try Free',
        href: '/register',
    },
    {
        name: 'Pro',
        price: '$29',
        description: 'For operators who run meetings every day.',
        features: ['Unlimited minutes', 'Advanced insights', 'Priority review'],
        cta: 'Go Pro',
        href: '/pricing',
        featured: true,
    },
    {
        name: 'Admin',
        price: 'Command',
        description: 'For teams that need system-level visibility.',
        features: ['Global analytics', 'System health', 'Revenue dashboards'],
        cta: 'Open Admin',
        href: '/admin',
    },
];

const transcriptRows = [
    {
        speaker: 'Mina',
        source: 'Move the launch review to Friday morning.',
        translation: 'ローンチレビューを金曜午前に移動しましょう。',
        tone: 'border-l-brand-primary',
    },
    {
        speaker: 'Ken',
        source: 'I will own the customer notes and risk summary.',
        translation: '顧客メモとリスク要約は私が担当します。',
        tone: 'border-l-emerald-500',
    },
    {
        speaker: 'SNOTE',
        source: 'Decision detected with owner and due date.',
        translation: 'Owner assigned. Follow-up task prepared.',
        tone: 'border-l-pro-gold',
    },
];

const testimonials = [
    {
        quote: 'SNOTE made our multilingual product reviews feel calm. The team stopped chasing notes and started approving decisions.',
        name: 'Maya Chen',
        role: 'VP Product, Northstar Labs',
    },
    {
        quote: 'The live translation layer is the first tool our Japan and US teams both trust in the same room.',
        name: 'Evan Brooks',
        role: 'Operations Lead, RelayWorks',
    },
    {
        quote: 'Admin visibility matters. We can see usage, reliability, and Pro adoption without asking engineering for reports.',
        name: 'Ari Patel',
        role: 'Growth Systems, Studio 48',
    },
];

export function LandingPage() {
    return (
        <main className="bg-background text-foreground min-h-screen overflow-hidden">
            <header className="border-border bg-background/72 fixed inset-x-0 top-0 z-40 border-b backdrop-blur-xl">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link href="/" className="flex items-center">
                        <Image
                            src="/snote-logo.png"
                            alt="SNOTE"
                            width={118}
                            height={34}
                            priority
                            className="h-auto w-[118px]"
                        />
                    </Link>
                    <nav className="text-muted-foreground hidden items-center gap-7 text-sm md:flex">
                        <Link
                            href="#features"
                            className="hover:text-foreground"
                        >
                            Features
                        </Link>
                        <Link
                            href="#workflow"
                            className="hover:text-foreground"
                        >
                            Workflow
                        </Link>
                        <Link
                            href="#testimonials"
                            className="hover:text-foreground"
                        >
                            Customers
                        </Link>
                        <Link href="#pricing" className="hover:text-foreground">
                            Pricing
                        </Link>
                    </nav>
                    <div className="flex items-center gap-2">
                        <Button
                            asChild
                            variant="ghost"
                            className="hidden sm:inline-flex"
                        >
                            <Link href="/login">Sign in</Link>
                        </Button>
                        <Button asChild>
                            <Link href="/dashboard">
                                Open app
                                <ArrowRight className="size-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </header>

            <section className="relative isolate min-h-[92svh] overflow-hidden pt-16">
                <div className="absolute inset-0 -z-20 bg-[linear-gradient(135deg,#f8fafc_0%,#f7f6ff_45%,#e8f0ff_100%)] dark:bg-[linear-gradient(135deg,#09090b_0%,#111113_48%,#151022_100%)]" />
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_70%_28%,rgb(73_10_173_/_0.22),transparent_34%),radial-gradient(circle_at_18%_76%,rgb(37_99_235_/_0.15),transparent_30%)]" />

                <div className="border-border bg-glass/70 absolute inset-x-0 bottom-0 h-[46svh] border-y backdrop-blur-md" />

                <div className="pointer-events-none absolute inset-x-3 top-[46%] bottom-8 hidden lg:block">
                    <motion.div
                        className="border-glass-border mx-auto h-full max-w-6xl overflow-hidden rounded-[28px] border bg-black/70 shadow-2xl shadow-[#490aad]/20 backdrop-blur"
                        initial={{ opacity: 0, y: 36, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                            duration: 0.72,
                            delay: 0.18,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                    >
                        <div className="flex h-14 items-center justify-between border-b border-white/10 bg-white/8 px-5 text-white">
                            <div>
                                <p className="text-xs text-white/55">
                                    SNOTE Live Assistant
                                </p>
                                <h2 className="text-lg font-semibold">
                                    Launch Review Room
                                </h2>
                            </div>
                            <span className="rounded-full bg-white/12 px-3 py-1 text-xs font-semibold">
                                Recording live
                            </span>
                        </div>
                        <div className="grid h-[calc(100%-3.5rem)] grid-cols-[minmax(0,1fr)_360px]">
                            <div className="relative overflow-hidden bg-[linear-gradient(135deg,#121217,#27272a)]">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgb(124_58_237_/_0.28),transparent_28%)]" />
                                <div className="relative flex h-full items-center justify-center">
                                    <div className="bg-brand-gradient flex h-36 w-36 items-center justify-center rounded-full text-4xl font-semibold text-white shadow-2xl ring-8 shadow-[#490aad]/35 ring-white/10">
                                        MI
                                    </div>
                                </div>
                                <div className="absolute inset-x-5 bottom-5 grid grid-cols-3 gap-3">
                                    {['Mina', 'Ken', 'Ari'].map(
                                        (name, index) => (
                                            <div
                                                key={name}
                                                className="rounded-2xl border border-white/10 bg-white/10 p-3 text-white backdrop-blur"
                                            >
                                                <p className="text-sm font-medium">
                                                    {name}
                                                </p>
                                                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/15">
                                                    <div
                                                        className="h-full rounded-full bg-white transition-all"
                                                        style={{
                                                            width: `${[88, 54, 72][index]}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>
                            <div className="border-l border-white/10 bg-black/24 p-5 text-white backdrop-blur-xl">
                                <div className="mb-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-white/50">
                                            Live translation
                                        </p>
                                        <p className="text-sm font-semibold">
                                            English to Japanese
                                        </p>
                                    </div>
                                    <Timer className="h-5 w-5 text-white/60" />
                                </div>
                                <div className="space-y-3">
                                    {transcriptRows.map((row) => (
                                        <div
                                            key={row.source}
                                            className={`rounded-r-2xl border-l-4 ${row.tone} bg-white/10 p-4 backdrop-blur`}
                                        >
                                            <div className="mb-2 text-xs font-semibold text-white">
                                                {row.speaker}
                                            </div>
                                            <p className="text-sm leading-6 text-white">
                                                {row.source}
                                            </p>
                                            <p className="mt-2 text-sm leading-6 text-white/68">
                                                {row.translation}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="relative mx-auto flex min-h-[calc(92svh-4rem)] max-w-7xl flex-col justify-center px-4 pt-12 pb-[34svh] sm:px-6 lg:px-8 lg:pb-[36svh]">
                    <motion.div
                        className="max-w-4xl"
                        initial={{ opacity: 0, y: 28 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.65,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                    >
                        <div className="border-purple-light bg-glass text-purple-primary mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium shadow-sm backdrop-blur">
                            <Sparkles className="size-4" />
                            AI-powered meeting assistant
                        </div>
                        <h1 className="text-foreground max-w-4xl text-5xl leading-[1.02] font-semibold tracking-normal sm:text-6xl lg:text-7xl">
                            SNOTE turns every meeting into finished work.
                        </h1>
                        <p className="text-muted-foreground mt-7 max-w-2xl text-lg leading-8 sm:text-xl sm:leading-9">
                            Capture live audio, translate the conversation,
                            extract decisions, and ship follow-up tasks from one
                            focused workspace.
                        </p>
                        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                            <Button asChild size="lg">
                                <Link href="/dashboard">
                                    Launch dashboard
                                    <ArrowRight className="size-4" />
                                </Link>
                            </Button>
                            <Button
                                asChild
                                size="lg"
                                variant="outline"
                                className="bg-glass"
                            >
                                <Link href="#pricing">Compare plans</Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            <section className="border-border bg-card border-y">
                <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 md:grid-cols-3 lg:px-8">
                    {[
                        ['99.4%', 'transcription uptime'],
                        ['3.8x', 'faster meeting review'],
                        ['22k+', 'minutes processed monthly'],
                    ].map(([value, label]) => (
                        <Reveal key={label}>
                            <p className="text-foreground text-4xl font-semibold">
                                {value}
                            </p>
                            <p className="text-muted-foreground mt-2 text-sm">
                                {label}
                            </p>
                        </Reveal>
                    ))}
                </div>
            </section>

            <section
                id="features"
                className="mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8"
            >
                <Reveal className="max-w-3xl">
                    <p className="text-purple-primary text-sm font-semibold uppercase">
                        Features
                    </p>
                    <h2 className="text-foreground mt-4 text-4xl leading-tight font-semibold sm:text-5xl">
                        Built for multilingual meeting operations.
                    </h2>
                    <p className="text-muted-foreground mt-5 max-w-2xl text-lg leading-8">
                        SNOTE keeps the room, transcript, translation, and
                        post-meeting review in a single operational flow.
                    </p>
                </Reveal>
                <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;

                        return (
                            <Reveal key={feature.title} delay={index * 0.04}>
                                <div className="glass-card hover:border-purple-light h-full rounded-2xl p-6 transition-colors">
                                    <div className="bg-brand-soft text-purple-primary dark:bg-accent mb-6 flex size-12 items-center justify-center rounded-2xl dark:text-[#c4a7ff]">
                                        <Icon className="size-5" />
                                    </div>
                                    <h3 className="text-foreground text-xl font-semibold">
                                        {feature.title}
                                    </h3>
                                    <p className="text-muted-foreground mt-3 text-sm leading-6">
                                        {feature.text}
                                    </p>
                                </div>
                            </Reveal>
                        );
                    })}
                </div>
            </section>

            <section
                id="workflow"
                className="border-border bg-muted/35 border-y"
            >
                <div className="mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8">
                    <Reveal className="max-w-3xl">
                        <p className="text-purple-primary text-sm font-semibold uppercase">
                            Workflow
                        </p>
                        <h2 className="text-foreground mt-4 text-4xl leading-tight font-semibold sm:text-5xl">
                            From live conversation to reviewed output.
                        </h2>
                    </Reveal>
                    <div className="mt-14 grid gap-5 lg:grid-cols-3">
                        {workflow.map((item, index) => (
                            <Reveal key={item.step} delay={index * 0.08}>
                                <div className="border-border bg-background/72 h-full rounded-2xl border p-7 backdrop-blur">
                                    <span className="text-purple-primary text-sm font-semibold">
                                        {item.step}
                                    </span>
                                    <h3 className="text-foreground mt-7 text-2xl font-semibold">
                                        {item.title}
                                    </h3>
                                    <p className="text-muted-foreground mt-4 text-sm leading-6">
                                        {item.text}
                                    </p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            <section
                id="testimonials"
                className="mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8"
            >
                <Reveal className="mx-auto max-w-3xl text-center">
                    <p className="text-purple-primary text-sm font-semibold uppercase">
                        Testimonials
                    </p>
                    <h2 className="text-foreground mt-4 text-4xl leading-tight font-semibold sm:text-5xl">
                        Trusted by teams that cannot afford messy handoffs.
                    </h2>
                </Reveal>
                <div className="mt-14 grid gap-5 lg:grid-cols-3">
                    {testimonials.map((testimonial, index) => (
                        <Reveal key={testimonial.name} delay={index * 0.06}>
                            <article className="glass-card h-full rounded-2xl p-7">
                                <div className="mb-6 flex items-center justify-between">
                                    <MessageSquareQuote className="text-purple-primary h-6 w-6" />
                                    <div className="text-pro-gold flex gap-1">
                                        {[0, 1, 2, 3, 4].map((star) => (
                                            <Star
                                                key={star}
                                                className="h-4 w-4 fill-current"
                                            />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-foreground text-base leading-7">
                                    {testimonial.quote}
                                </p>
                                <div className="border-border mt-8 border-t pt-5">
                                    <p className="text-foreground font-semibold">
                                        {testimonial.name}
                                    </p>
                                    <p className="text-muted-foreground mt-1 text-sm">
                                        {testimonial.role}
                                    </p>
                                </div>
                            </article>
                        </Reveal>
                    ))}
                </div>
            </section>

            <section id="pricing" className="border-border bg-card/72 border-y">
                <div className="mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8">
                    <Reveal className="mx-auto max-w-3xl text-center">
                        <p className="text-purple-primary text-sm font-semibold uppercase">
                            Pricing
                        </p>
                        <h2 className="text-foreground mt-4 text-4xl leading-tight font-semibold sm:text-5xl">
                            Pick the access level you need.
                        </h2>
                        <p className="text-muted-foreground mt-5 text-lg leading-8">
                            The app already supports Free, Pro, and Admin states
                            for realistic UI testing.
                        </p>
                    </Reveal>
                    <div className="mt-14 grid gap-5 lg:grid-cols-3">
                        {pricing.map((tier, index) => (
                            <Reveal key={tier.name} delay={index * 0.06}>
                                <div
                                    className={`h-full rounded-2xl border p-7 shadow-sm ${
                                        tier.featured
                                            ? 'bg-brand-gradient border-[#a171ff] text-white shadow-[#490aad]/20'
                                            : 'border-border bg-background/72 text-card-foreground backdrop-blur'
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h3 className="text-2xl font-semibold">
                                                {tier.name}
                                            </h3>
                                            <p
                                                className={`mt-3 text-sm leading-6 ${
                                                    tier.featured
                                                        ? 'text-white/78'
                                                        : 'text-muted-foreground'
                                                }`}
                                            >
                                                {tier.description}
                                            </p>
                                        </div>
                                        {tier.featured && (
                                            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                                                Popular
                                            </span>
                                        )}
                                    </div>
                                    <div className="mt-9 flex items-end gap-2">
                                        <span className="text-5xl font-semibold">
                                            {tier.price}
                                        </span>
                                        {tier.price.startsWith('$') && (
                                            <span
                                                className={
                                                    tier.featured
                                                        ? 'text-white/70'
                                                        : 'text-muted-foreground'
                                                }
                                            >
                                                /mo
                                            </span>
                                        )}
                                    </div>
                                    <ul className="mt-9 space-y-4">
                                        {tier.features.map((feature) => (
                                            <li
                                                key={feature}
                                                className="flex items-center gap-3 text-sm"
                                            >
                                                <CheckCircle2 className="size-4 shrink-0" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                    <Button
                                        asChild
                                        className="mt-9 w-full"
                                        variant={
                                            tier.featured
                                                ? 'secondary'
                                                : 'default'
                                        }
                                    >
                                        <Link href={tier.href}>{tier.cta}</Link>
                                    </Button>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            <footer className="bg-background">
                <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
                    <div>
                        <Image
                            src="/snote-logo.png"
                            alt="SNOTE"
                            width={118}
                            height={34}
                            className="h-auto w-[118px]"
                        />
                        <p className="text-muted-foreground mt-4 max-w-md text-sm leading-6">
                            AI meeting notes, realtime translation, and
                            operational follow-up for modern teams.
                        </p>
                    </div>
                    <div className="text-muted-foreground flex flex-wrap gap-5 text-sm">
                        <Link
                            href="/dashboard"
                            className="hover:text-foreground"
                        >
                            Dashboard
                        </Link>
                        <Link href="/pricing" className="hover:text-foreground">
                            Pricing
                        </Link>
                        <Link href="/login" className="hover:text-foreground">
                            Login
                        </Link>
                    </div>
                </div>
            </footer>
        </main>
    );
}
