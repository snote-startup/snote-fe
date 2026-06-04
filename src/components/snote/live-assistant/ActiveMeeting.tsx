'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
    Activity,
    AlertTriangle,
    AudioLines,
    Bookmark,
    Captions,
    CheckCircle,
    Clock,
    Languages,
    Lightbulb,
    Mic,
    Pause,
    Play,
    Radio,
    Sparkles,
    Square,
    Users,
    Video,
    Volume2,
    VolumeX,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

type TranscriptSegment = {
    id: string;
    timestamp: number;
    speaker: string;
    sourceLanguage: string;
    targetLanguage: string;
    original: string;
    translation: string;
    intent: 'context' | 'decision' | 'question' | 'task';
};

type LiveInsight = {
    id: string;
    type: 'task' | 'decision' | 'risk' | 'key-point';
    text: string;
    timestamp: number;
    assignee?: string;
};

const participants = [
    {
        name: 'Alex',
        role: 'Product Lead',
        initials: 'AL',
        language: 'EN',
        level: 78,
        color: 'from-[#490aad] to-[#a171ff]',
        border: 'border-[#490aad]',
        soft: 'bg-[#F7F6FF] text-[#490aad] dark:bg-[#211634] dark:text-[#c4a7ff]',
    },
    {
        name: 'Sarah',
        role: 'Design',
        initials: 'SA',
        language: 'EN',
        level: 64,
        color: 'from-emerald-500 to-teal-400',
        border: 'border-emerald-500',
        soft: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
    },
    {
        name: 'Mike',
        role: 'Engineering',
        initials: 'MI',
        language: 'EN',
        level: 52,
        color: 'from-sky-500 to-cyan-400',
        border: 'border-sky-500',
        soft: 'bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300',
    },
    {
        name: 'SNOTE',
        role: 'AI Interpreter',
        initials: 'AI',
        language: 'ES',
        level: 92,
        color: 'from-amber-500 to-orange-400',
        border: 'border-amber-500',
        soft: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300',
    },
];

const mockLiveTranscript: TranscriptSegment[] = [
    {
        id: '1',
        timestamp: 5,
        speaker: 'Alex',
        sourceLanguage: 'English',
        targetLanguage: 'Spanish',
        original: "Alright team, let's get started with today's launch sync.",
        translation:
            'Muy bien equipo, empecemos con la reunion de lanzamiento de hoy.',
        intent: 'context',
    },
    {
        id: '2',
        timestamp: 12,
        speaker: 'Sarah',
        sourceLanguage: 'English',
        targetLanguage: 'Spanish',
        original:
            'I finished the dashboard redesign yesterday and it is ready for review.',
        translation:
            'Termine el rediseno del panel ayer y esta listo para revision.',
        intent: 'task',
    },
    {
        id: '3',
        timestamp: 25,
        speaker: 'Mike',
        sourceLanguage: 'English',
        targetLanguage: 'Spanish',
        original:
            'Great. I can review it this afternoon and leave comments before 5.',
        translation:
            'Perfecto. Puedo revisarlo esta tarde y dejar comentarios antes de las 5.',
        intent: 'task',
    },
    {
        id: '4',
        timestamp: 35,
        speaker: 'Alex',
        sourceLanguage: 'English',
        targetLanguage: 'Spanish',
        original: 'Can we move the client presentation to Friday morning?',
        translation:
            'Podemos mover la presentacion del cliente al viernes por la manana?',
        intent: 'question',
    },
    {
        id: '5',
        timestamp: 45,
        speaker: 'Sarah',
        sourceLanguage: 'English',
        targetLanguage: 'Spanish',
        original:
            'Yes, Thursday gives me enough time to prepare the final deck.',
        translation:
            'Si, el jueves me da suficiente tiempo para preparar la presentacion final.',
        intent: 'decision',
    },
    {
        id: '6',
        timestamp: 58,
        speaker: 'SNOTE',
        sourceLanguage: 'English',
        targetLanguage: 'Spanish',
        original:
            'Decision detected: client presentation moves to Friday morning.',
        translation:
            'Decision detectada: la presentacion del cliente pasa al viernes por la manana.',
        intent: 'decision',
    },
    {
        id: '7',
        timestamp: 74,
        speaker: 'Mike',
        sourceLanguage: 'English',
        targetLanguage: 'Spanish',
        original:
            'One risk is the analytics export. The API contract changed this morning.',
        translation:
            'Un riesgo es la exportacion de analiticas. El contrato de API cambio esta manana.',
        intent: 'question',
    },
    {
        id: '8',
        timestamp: 88,
        speaker: 'Alex',
        sourceLanguage: 'English',
        targetLanguage: 'Spanish',
        original:
            "Let's park that as a launch blocker and assign it to engineering.",
        translation:
            'Dejemos eso como bloqueador de lanzamiento y asignemoslo a ingenieria.',
        intent: 'task',
    },
];

const mockInsights: LiveInsight[] = [
    {
        id: 'i1',
        type: 'task',
        text: 'Review dashboard redesign before 5 PM.',
        timestamp: 25,
        assignee: 'Mike',
    },
    {
        id: 'i2',
        type: 'decision',
        text: 'Client presentation moved to Friday morning.',
        timestamp: 58,
    },
    {
        id: 'i3',
        type: 'risk',
        text: 'Analytics export may block launch because the API contract changed.',
        timestamp: 74,
        assignee: 'Engineering',
    },
];

function formatTime(seconds: number) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return hrs > 0
        ? `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
        : `${mins}:${secs.toString().padStart(2, '0')}`;
}

function getParticipant(speaker: string) {
    return (
        participants.find((participant) => participant.name === speaker) ??
        participants[0]
    );
}

function getInsightIcon(type: LiveInsight['type']) {
    switch (type) {
        case 'task':
            return <CheckCircle className="h-4 w-4 text-sky-600" />;
        case 'decision':
            return <AlertTriangle className="h-4 w-4 text-amber-600" />;
        case 'risk':
            return <Activity className="h-4 w-4 text-rose-600" />;
        case 'key-point':
            return <Lightbulb className="h-4 w-4 text-yellow-600" />;
    }
}

function getIntentLabel(intent: TranscriptSegment['intent']) {
    switch (intent) {
        case 'task':
            return 'Task';
        case 'decision':
            return 'Decision';
        case 'question':
            return 'Question';
        case 'context':
            return 'Context';
    }
}

export function ActiveMeeting() {
    const router = useRouter();
    const [isPaused, setIsPaused] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [autoScroll, setAutoScroll] = useState(true);
    const [duration, setDuration] = useState(0);
    const [transcript, setTranscript] = useState<TranscriptSegment[]>([]);
    const [insights, setInsights] = useState<LiveInsight[]>([]);
    const [showEndDialog, setShowEndDialog] = useState(false);
    const [bookmarkedSegments, setBookmarkedSegments] = useState<Set<string>>(
        new Set(),
    );
    const transcriptEndRef = useRef<HTMLDivElement>(null);

    const latestSegment = transcript.at(-1);
    const activeSpeaker = !isPaused ? latestSegment?.speaker : undefined;
    const activeParticipant = latestSegment
        ? getParticipant(latestSegment.speaker)
        : participants[0];
    const overlaySegments = transcript.slice(-3);

    useEffect(() => {
        if (isPaused) {
            return;
        }

        const transcriptInterval = window.setInterval(() => {
            setTranscript((previous) => {
                if (previous.length < mockLiveTranscript.length) {
                    return mockLiveTranscript.slice(0, previous.length + 1);
                }

                return previous;
            });
        }, 2600);

        const insightInterval = window.setInterval(() => {
            setInsights((previous) => {
                if (previous.length < mockInsights.length) {
                    return mockInsights.slice(0, previous.length + 1);
                }

                return previous;
            });
        }, 4800);

        return () => {
            window.clearInterval(transcriptInterval);
            window.clearInterval(insightInterval);
        };
    }, [isPaused]);

    useEffect(() => {
        if (isPaused) {
            return;
        }

        const timer = window.setInterval(() => {
            setDuration((current) => current + 1);
        }, 1000);

        return () => window.clearInterval(timer);
    }, [isPaused]);

    useEffect(() => {
        if (autoScroll) {
            transcriptEndRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'end',
            });
        }
    }, [transcript.length, autoScroll]);

    const confirmEnd = () => {
        const newMeetingId = Date.now().toString();
        router.push(`/live-assistant/review/${newMeetingId}`);
    };

    const toggleBookmark = (segmentId: string) => {
        setBookmarkedSegments((previous) => {
            const next = new Set(previous);

            if (next.has(segmentId)) {
                next.delete(segmentId);
            } else {
                next.add(segmentId);
            }

            return next;
        });
    };

    return (
        <>
            <div className="bg-background text-foreground min-h-full">
                <div className="border-border bg-card/95 border-b px-4 py-4 backdrop-blur sm:px-6">
                    <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex min-w-0 items-center gap-4">
                            <div
                                className={cn(
                                    'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-lg',
                                    isPaused
                                        ? 'bg-amber-500'
                                        : 'bg-gradient-to-br from-[#490aad] to-[#a171ff]',
                                )}
                            >
                                {isPaused ? (
                                    <Pause className="h-5 w-5" />
                                ) : (
                                    <Radio className="h-5 w-5" />
                                )}
                            </div>
                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="text-foreground truncate text-xl font-semibold">
                                        Launch Review Room
                                    </h1>
                                    <Badge
                                        className={cn(
                                            'gap-1',
                                            isPaused
                                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                                : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                'h-1.5 w-1.5 rounded-full',
                                                isPaused
                                                    ? 'bg-amber-500'
                                                    : 'animate-pulse bg-rose-500',
                                            )}
                                        />
                                        {isPaused ? 'Paused' : 'Recording live'}
                                    </Badge>
                                </div>
                                <div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-3 text-sm">
                                    <span className="inline-flex items-center gap-1.5">
                                        <Clock className="h-4 w-4" />
                                        <span className="font-mono">
                                            {formatTime(duration)}
                                        </span>
                                    </span>
                                    <span className="inline-flex items-center gap-1.5">
                                        <Languages className="h-4 w-4" />
                                        English to Spanish
                                    </span>
                                    <span className="inline-flex items-center gap-1.5">
                                        <Users className="h-4 w-4" />4
                                        participants
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsPaused((value) => !value)}
                            >
                                {isPaused ? (
                                    <>
                                        <Play className="h-4 w-4" />
                                        Resume
                                    </>
                                ) : (
                                    <>
                                        <Pause className="h-4 w-4" />
                                        Pause
                                    </>
                                )}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsMuted((value) => !value)}
                            >
                                {isMuted ? (
                                    <VolumeX className="h-4 w-4" />
                                ) : (
                                    <Volume2 className="h-4 w-4" />
                                )}
                                {isMuted ? 'Muted' : 'Mic on'}
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setShowEndDialog(true)}
                            >
                                <Square className="h-4 w-4 fill-current" />
                                End
                            </Button>
                        </div>
                    </div>
                </div>

                <main className="mx-auto grid max-w-7xl gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
                    <section className="space-y-5">
                        <div className="glass-panel overflow-hidden rounded-[28px]">
                            <div className="border-glass-border flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4">
                                <div>
                                    <h2 className="flex items-center gap-2 text-base font-semibold">
                                        <Video className="text-purple-primary h-4 w-4" />
                                        Realtime interpreter stage
                                    </h2>
                                    <p className="text-muted-foreground text-sm">
                                        Glass translation overlays stay pinned
                                        to the live video.
                                    </p>
                                </div>
                                <Badge variant="outline" className="gap-1.5">
                                    <AudioLines className="h-3.5 w-3.5 text-emerald-500" />
                                    48 kHz input
                                </Badge>
                            </div>

                            <div className="p-4">
                                <div className="relative min-h-[560px] overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(135deg,#101015,#262630)] text-white shadow-2xl shadow-black/30">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_48%_36%,rgb(124_58_237_/_0.32),transparent_28%),radial-gradient(circle_at_80%_74%,rgb(37_99_235_/_0.2),transparent_30%)]" />
                                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(255_255_255_/_0.08),transparent_36%,rgb(0_0_0_/_0.48))]" />

                                    <div className="relative z-10 flex min-h-[560px] flex-col justify-between p-4 sm:p-5">
                                        <div className="flex flex-wrap items-center justify-between gap-3">
                                            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/24 px-3 py-1.5 text-xs backdrop-blur-xl">
                                                <span
                                                    className={cn(
                                                        'h-2 w-2 rounded-full',
                                                        isPaused
                                                            ? 'bg-amber-400'
                                                            : 'animate-pulse bg-rose-400',
                                                    )}
                                                />
                                                {isPaused
                                                    ? 'Paused'
                                                    : 'Live translation'}
                                            </div>
                                            <span className="rounded-full border border-white/10 bg-black/24 px-3 py-1.5 text-xs backdrop-blur-xl">
                                                {activeSpeaker
                                                    ? `${activeSpeaker} speaking`
                                                    : 'Awaiting speech'}
                                            </span>
                                        </div>

                                        <div className="flex flex-1 items-center justify-center py-16">
                                            <motion.div
                                                className={cn(
                                                    'relative flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br text-5xl font-semibold shadow-2xl transition-colors',
                                                    activeParticipant.color,
                                                )}
                                                animate={{
                                                    scale: activeSpeaker
                                                        ? [1, 1.05, 1]
                                                        : 1,
                                                    boxShadow: activeSpeaker
                                                        ? [
                                                              '0 24px 80px rgb(73 10 173 / 0.22)',
                                                              '0 24px 110px rgb(73 10 173 / 0.36)',
                                                              '0 24px 80px rgb(73 10 173 / 0.22)',
                                                          ]
                                                        : '0 24px 80px rgb(0 0 0 / 0.28)',
                                                }}
                                                transition={{
                                                    duration: 1.2,
                                                    repeat: activeSpeaker
                                                        ? Infinity
                                                        : 0,
                                                }}
                                            >
                                                {activeSpeaker && (
                                                    <span className="absolute inset-0 animate-ping rounded-full border border-white/45" />
                                                )}
                                                {activeParticipant.initials}
                                            </motion.div>
                                        </div>

                                        <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_220px]">
                                            <div className="rounded-[22px] border border-white/12 bg-black/24 p-3 shadow-2xl backdrop-blur-2xl sm:p-4">
                                                <div className="mb-3 flex items-center justify-between gap-3">
                                                    <div>
                                                        <p className="text-xs text-white/55">
                                                            Overlay captions
                                                        </p>
                                                        <p className="text-sm font-semibold text-white">
                                                            English to Spanish
                                                        </p>
                                                    </div>
                                                    <Captions className="h-5 w-5 text-white/60" />
                                                </div>

                                                {overlaySegments.length ===
                                                0 ? (
                                                    <div className="flex min-h-[156px] items-center justify-center rounded-2xl border border-dashed border-white/12 bg-white/8 text-center text-sm text-white/62">
                                                        Listening for the first
                                                        speaker turn
                                                    </div>
                                                ) : (
                                                    <div className="space-y-2">
                                                        <AnimatePresence
                                                            initial={false}
                                                        >
                                                            {overlaySegments.map(
                                                                (segment) => {
                                                                    const participant =
                                                                        getParticipant(
                                                                            segment.speaker,
                                                                        );
                                                                    const isLatest =
                                                                        latestSegment?.id ===
                                                                            segment.id &&
                                                                        !isPaused;

                                                                    return (
                                                                        <motion.article
                                                                            key={
                                                                                segment.id
                                                                            }
                                                                            layout
                                                                            initial={{
                                                                                opacity: 0,
                                                                                y: 12,
                                                                                scale: 0.98,
                                                                            }}
                                                                            animate={{
                                                                                opacity: 1,
                                                                                y: 0,
                                                                                scale: 1,
                                                                            }}
                                                                            exit={{
                                                                                opacity: 0,
                                                                                y: -8,
                                                                            }}
                                                                            transition={{
                                                                                duration: 0.26,
                                                                                ease: 'easeOut',
                                                                            }}
                                                                            className={cn(
                                                                                'rounded-2xl border bg-white/10 p-3 backdrop-blur-xl',
                                                                                isLatest
                                                                                    ? `${participant.border} bg-white/16 shadow-lg shadow-black/20`
                                                                                    : 'border-white/10',
                                                                            )}
                                                                        >
                                                                            <div className="mb-2 flex flex-wrap items-center gap-2">
                                                                                <span
                                                                                    className={cn(
                                                                                        'rounded-full px-2.5 py-1 text-xs font-semibold',
                                                                                        participant.soft,
                                                                                    )}
                                                                                >
                                                                                    {
                                                                                        segment.speaker
                                                                                    }
                                                                                </span>
                                                                                {isLatest && (
                                                                                    <span className="rounded-full bg-emerald-400/15 px-2 py-1 text-[11px] font-medium text-emerald-200">
                                                                                        speaking
                                                                                    </span>
                                                                                )}
                                                                                <span className="text-[11px] text-white/48">
                                                                                    {formatTime(
                                                                                        segment.timestamp,
                                                                                    )}
                                                                                </span>
                                                                            </div>
                                                                            <p className="text-sm leading-6 text-white">
                                                                                {
                                                                                    segment.original
                                                                                }
                                                                            </p>
                                                                            <p className="mt-1 text-base leading-7 font-medium text-white">
                                                                                {
                                                                                    segment.translation
                                                                                }
                                                                            </p>
                                                                        </motion.article>
                                                                    );
                                                                },
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
                                                {participants.map(
                                                    (participant) => {
                                                        const isActive =
                                                            activeSpeaker ===
                                                            participant.name;

                                                        return (
                                                            <div
                                                                key={
                                                                    participant.name
                                                                }
                                                                className={cn(
                                                                    'rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur-xl transition-all',
                                                                    isActive &&
                                                                        'border-white/55 bg-white/18 shadow-lg',
                                                                )}
                                                            >
                                                                <div className="flex items-center justify-between gap-3">
                                                                    <div className="flex min-w-0 items-center gap-3">
                                                                        <span
                                                                            className={cn(
                                                                                'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-xs font-semibold text-white',
                                                                                participant.color,
                                                                            )}
                                                                        >
                                                                            {
                                                                                participant.initials
                                                                            }
                                                                        </span>
                                                                        <div className="min-w-0">
                                                                            <p className="truncate text-sm font-medium text-white">
                                                                                {
                                                                                    participant.name
                                                                                }
                                                                            </p>
                                                                            <p className="truncate text-xs text-white/55">
                                                                                {
                                                                                    participant.language
                                                                                }{' '}
                                                                                channel
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    {isActive && (
                                                                        <span className="h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-emerald-400" />
                                                                    )}
                                                                </div>
                                                                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/12">
                                                                    <div
                                                                        className={cn(
                                                                            'h-full rounded-full bg-gradient-to-r transition-all duration-500',
                                                                            participant.color,
                                                                        )}
                                                                        style={{
                                                                            width: isMuted
                                                                                ? '0%'
                                                                                : `${isActive ? 95 : participant.level}%`,
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        );
                                                    },
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            {insights.length === 0 ? (
                                <div className="glass-card rounded-2xl p-4 md:col-span-3">
                                    <div className="text-muted-foreground flex items-center gap-3">
                                        <Sparkles className="text-purple-primary h-5 w-5 animate-pulse" />
                                        <span className="text-sm">
                                            AI is listening for decisions,
                                            tasks, and risks.
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                insights.map((insight) => (
                                    <div
                                        key={insight.id}
                                        className="glass-card hover:border-purple-light rounded-2xl p-4 transition-colors"
                                    >
                                        <div className="mb-3 flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-2">
                                                {getInsightIcon(insight.type)}
                                                <span className="text-muted-foreground text-xs font-semibold uppercase">
                                                    {insight.type.replace(
                                                        '-',
                                                        ' ',
                                                    )}
                                                </span>
                                            </div>
                                            <span className="text-muted-foreground text-xs">
                                                {formatTime(insight.timestamp)}
                                            </span>
                                        </div>
                                        <p className="text-foreground text-sm font-medium">
                                            {insight.text}
                                        </p>
                                        {insight.assignee && (
                                            <p className="text-muted-foreground mt-2 text-xs">
                                                Owner: {insight.assignee}
                                            </p>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </section>

                    <section className="glass-panel flex min-h-[680px] flex-col overflow-hidden rounded-[28px] lg:max-h-[calc(100vh-8.5rem)]">
                        <div className="border-glass-border border-b p-4">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <h2 className="flex items-center gap-2 text-base font-semibold">
                                        <Captions className="text-purple-primary h-4 w-4" />
                                        Realtime transcript
                                    </h2>
                                    <p className="text-muted-foreground text-sm">
                                        Source speech and translated text stay
                                        paired by speaker.
                                    </p>
                                </div>
                                <label className="border-glass-border bg-glass text-muted-foreground flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs backdrop-blur">
                                    Auto-scroll
                                    <Switch
                                        checked={autoScroll}
                                        onCheckedChange={setAutoScroll}
                                        size="sm"
                                        aria-label="Toggle transcript auto-scroll"
                                    />
                                </label>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                                <div className="border-purple-light bg-brand-soft text-purple-primary rounded-xl border px-3 py-2 dark:bg-[#211634] dark:text-[#c4a7ff]">
                                    Original: English
                                </div>
                                <div className="rounded-xl border border-emerald-500/20 bg-emerald-50/80 px-3 py-2 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                                    Translation: Spanish
                                </div>
                            </div>
                        </div>

                        <ScrollArea className="min-h-0 flex-1">
                            <div className="space-y-4 p-4">
                                {transcript.length === 0 ? (
                                    <div className="border-border bg-muted/30 flex min-h-[360px] flex-col items-center justify-center rounded-xl border border-dashed text-center">
                                        <Mic className="text-muted-foreground mb-4 h-12 w-12" />
                                        <p className="text-foreground font-medium">
                                            Listening for speech
                                        </p>
                                        <p className="text-muted-foreground mt-2 max-w-xs text-sm">
                                            Transcript cards will appear here
                                            with source and translated language
                                            lanes.
                                        </p>
                                    </div>
                                ) : (
                                    transcript.map((segment) => {
                                        const participant = getParticipant(
                                            segment.speaker,
                                        );
                                        const isLatest =
                                            latestSegment?.id === segment.id &&
                                            !isPaused;
                                        const isBookmarked =
                                            bookmarkedSegments.has(segment.id);

                                        return (
                                            <motion.article
                                                key={segment.id}
                                                layout
                                                initial={{
                                                    opacity: 0,
                                                    y: 14,
                                                    scale: 0.98,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    y: 0,
                                                    scale: 1,
                                                }}
                                                transition={{
                                                    duration: 0.28,
                                                    ease: 'easeOut',
                                                }}
                                                className={cn(
                                                    'group bg-glass rounded-2xl border p-4 backdrop-blur-xl transition-all',
                                                    isLatest
                                                        ? `${participant.border} bg-glass-strong shadow-[0_0_0_3px_rgba(73,10,173,0.10)]`
                                                        : 'border-glass-border hover:border-purple-light',
                                                )}
                                            >
                                                <div className="mb-3 flex items-start justify-between gap-3">
                                                    <div className="flex min-w-0 items-center gap-3">
                                                        <span
                                                            className={cn(
                                                                'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-xs font-semibold text-white',
                                                                participant.color,
                                                            )}
                                                        >
                                                            {
                                                                participant.initials
                                                            }
                                                        </span>
                                                        <div className="min-w-0">
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <p className="text-foreground font-medium">
                                                                    {
                                                                        segment.speaker
                                                                    }
                                                                </p>
                                                                {isLatest && (
                                                                    <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                                                                        Speaking
                                                                    </Badge>
                                                                )}
                                                                <Badge variant="outline">
                                                                    {getIntentLabel(
                                                                        segment.intent,
                                                                    )}
                                                                </Badge>
                                                            </div>
                                                            <p className="text-muted-foreground text-xs">
                                                                {formatTime(
                                                                    segment.timestamp,
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 px-2 opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100"
                                                        onClick={() =>
                                                            toggleBookmark(
                                                                segment.id,
                                                            )
                                                        }
                                                        aria-label={
                                                            isBookmarked
                                                                ? 'Remove bookmark'
                                                                : 'Bookmark transcript segment'
                                                        }
                                                    >
                                                        <Bookmark
                                                            className={cn(
                                                                'h-4 w-4',
                                                                isBookmarked
                                                                    ? 'text-purple-primary fill-[#490aad]'
                                                                    : 'text-muted-foreground',
                                                            )}
                                                        />
                                                    </Button>
                                                </div>

                                                <div className="grid gap-3">
                                                    <div className="border-purple-light bg-brand-soft rounded-xl border p-3 dark:bg-[#211634]/70">
                                                        <div className="mb-1 flex items-center justify-between gap-2">
                                                            <span className="text-purple-primary text-xs font-semibold uppercase dark:text-[#c4a7ff]">
                                                                {
                                                                    segment.sourceLanguage
                                                                }
                                                            </span>
                                                            <span className="text-purple-primary/70 text-[11px] dark:text-[#c4a7ff]/70">
                                                                original
                                                            </span>
                                                        </div>
                                                        <p className="text-foreground text-sm leading-6">
                                                            {segment.original}
                                                        </p>
                                                    </div>

                                                    <div className="rounded-xl border border-emerald-500/15 bg-emerald-50/80 p-3 dark:bg-emerald-950/35">
                                                        <div className="mb-1 flex items-center justify-between gap-2">
                                                            <span className="text-xs font-semibold text-emerald-700 uppercase dark:text-emerald-300">
                                                                {
                                                                    segment.targetLanguage
                                                                }
                                                            </span>
                                                            <span className="text-[11px] text-emerald-700/70 dark:text-emerald-300/70">
                                                                translated
                                                            </span>
                                                        </div>
                                                        <p className="text-foreground text-sm leading-6">
                                                            {
                                                                segment.translation
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.article>
                                        );
                                    })
                                )}

                                {!isPaused &&
                                    transcript.length > 0 &&
                                    transcript.length <
                                        mockLiveTranscript.length && (
                                        <div className="flex items-center justify-center py-2">
                                            <span className="bg-muted text-muted-foreground inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs">
                                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#490aad]" />
                                                Listening for next speaker turn
                                            </span>
                                        </div>
                                    )}

                                {isPaused && (
                                    <div className="flex items-center justify-center py-2">
                                        <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1.5 text-xs text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                                            <Pause className="h-3.5 w-3.5" />
                                            Transcription paused
                                        </span>
                                    </div>
                                )}

                                <div ref={transcriptEndRef} />
                            </div>
                        </ScrollArea>
                    </section>
                </main>
            </div>

            <Dialog open={showEndDialog} onOpenChange={setShowEndDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>End Meeting?</DialogTitle>
                        <DialogDescription>
                            Your meeting will be saved and AI will generate a
                            summary, meeting minutes, and action items.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowEndDialog(false)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={confirmEnd}>
                            End & Review Meeting
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
