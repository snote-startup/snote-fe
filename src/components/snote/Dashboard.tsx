'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/providers/snote-app-provider';
import { Button } from '@/components/ui/button';
import {
    Mic,
    CheckCircle,
    ArrowRight,
    FolderOpen,
    ClipboardList,
    Users,
    Plus,
    Upload,
    Circle,
    AlertCircle,
    Sparkles,
} from 'lucide-react';
import { useProjects } from '@/features/projects/hooks';
import { useProductTour } from '@/features/onboarding/use-product-tour';
import { format } from 'date-fns';

// ─── Sub-components ───────────────────────────────────────────────────────────

function EmptyState({
    icon: Icon,
    title,
    description,
    actionLabel,
    onAction,
}: {
    icon: React.ElementType;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
}) {
    return (
        <div className="flex flex-col items-center py-10 text-center">
            <div className="bg-muted mb-3 flex h-12 w-12 items-center justify-center rounded-full">
                <Icon className="text-muted-foreground h-5 w-5" />
            </div>
            <p className="text-foreground mb-1 text-sm font-medium">{title}</p>
            <p className="text-muted-foreground mb-4 text-sm">{description}</p>
            {actionLabel && onAction && (
                <Button size="sm" onClick={onAction}>
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function Dashboard() {
    const router = useRouter();
    const { authRole, isFree, roleProfile, user, tasks } = useApp();

    const {
        data: projects,
        isLoading: isProjectsLoading,
        error: projectsError,
    } = useProjects();
    const { startDashboardTour } = useProductTour();
    const [showTourBanner, setShowTourBanner] = useState(false);

    useEffect(() => {
        const completed = localStorage.getItem(
            'snote.onboarding.dashboard.completed',
        );
        const dismissed = localStorage.getItem(
            'snote.onboarding.dashboard.dismissed',
        );
        if (!completed && !dismissed) {
            const timer = setTimeout(() => {
                setShowTourBanner(true);
            }, 0);
            return () => clearTimeout(timer);
        }
    }, []);

    if (!user) return null;

    const firstName = user.name.split(' ')[0];
    const recentProjects = (projects || []).slice(0, 3);
    const pendingTasks = tasks.filter((t) => t.status !== 'done').slice(0, 3);

    const meetingLimit = roleProfile.meetingLimit;
    const meetingsUsed = roleProfile.meetingsUsed;
    const meetingsRemaining =
        meetingLimit === null ? null : Math.max(meetingLimit - meetingsUsed, 0);
    const quotaPercent =
        meetingLimit === null
            ? 100
            : Math.min((meetingsUsed / meetingLimit) * 100, 100);

    const showUsageBanner = isFree && meetingLimit !== null;

    // Getting started — show when workspace is effectively empty
    const showGettingStarted =
        projects !== undefined && projects.length === 0 && tasks.length === 0;

    const gettingStartedItems = [
        {
            id: 'project',
            label: 'Create your first project',
            done: projects !== undefined && projects.length > 0,
            path: '/meetings',
        },
        {
            id: 'upload',
            label: 'Upload meeting audio',
            done: false,
            path: '/live-assistant/setup',
        },
        {
            id: 'transcript',
            label: 'Review a transcript',
            done: false,
            path: '/meetings',
        },
        {
            id: 'ai',
            label: 'Ask AI about a meeting',
            done: false,
            path: '/meetings',
        },
    ];

    return (
        <div className="animate-fade-in-up mx-auto max-w-6xl px-6 py-8">
            {/* ── Page Header ─────────────────────────────────────────── */}
            <div
                data-tour="dashboard-header"
                className="animate-fade-in-up mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
            >
                <div>
                    <h1 className="text-foreground mb-1 text-2xl font-semibold tracking-tight">
                        Welcome back, {firstName}
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Manage your projects, meetings, and AI transcript
                        workspace.
                    </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push('/meetings')}
                    >
                        <FolderOpen className="h-4 w-4" />
                        All meetings
                    </Button>
                    <Button
                        size="sm"
                        onClick={() => router.push('/live-assistant/setup')}
                    >
                        <Plus className="h-4 w-4" />
                        New session
                    </Button>
                </div>
            </div>

            {/* Onboarding Tour Banner */}
            {showTourBanner && (
                <div className="border-primary/20 bg-primary/5 animate-fade-in-up mb-6 flex flex-col justify-between gap-4 rounded-xl border p-4 sm:flex-row sm:items-center">
                    <div className="flex items-start gap-3">
                        <Sparkles className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                        <div>
                            <h4 className="text-foreground text-sm font-semibold">
                                New to Snote?
                            </h4>
                            <p className="text-muted-foreground mt-0.5 text-xs">
                                Take a 60-second interactive tour to understand
                                projects, transcripts, and AI chat.
                            </p>
                        </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2 self-end sm:self-center">
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                                if (typeof window !== 'undefined') {
                                    localStorage.setItem(
                                        'snote.onboarding.dashboard.dismissed',
                                        'true',
                                    );
                                }
                                setShowTourBanner(false);
                            }}
                        >
                            Dismiss
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => {
                                setShowTourBanner(false);
                                startDashboardTour();
                            }}
                        >
                            Start tour
                        </Button>
                    </div>
                </div>
            )}

            {/* ── Usage Banner (free plan only) ────────────────────────── */}
            {showUsageBanner && (
                <div className="border-border bg-card animate-fade-in-up-delay-1 mb-6 flex items-center justify-between gap-4 rounded-xl border px-4 py-3">
                    <div className="min-w-0 flex-1">
                        <div className="mb-1.5 flex items-center justify-between">
                            <span className="text-foreground text-sm font-medium">
                                Free workspace
                            </span>
                            <span className="text-muted-foreground text-xs">
                                {meetingsUsed} of {meetingLimit} meetings used
                            </span>
                        </div>
                        <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
                            <div
                                className="bg-primary h-1.5 rounded-full transition-all duration-500"
                                style={{ width: `${quotaPercent}%` }}
                            />
                        </div>
                        <p className="text-muted-foreground mt-1.5 text-xs">
                            {meetingsRemaining} meetings remaining · upgrade
                            when you need more transcripts and AI review.
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="shrink-0"
                        onClick={() => router.push('/billing')}
                    >
                        Upgrade
                    </Button>
                </div>
            )}

            {/* ── Primary Action Card ──────────────────────────────────── */}
            <div
                data-tour="dashboard-create-project"
                className="border-border bg-card animate-fade-in-up-delay-1 mb-6 rounded-xl border p-6"
            >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-4">
                        <div className="bg-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                            <Mic className="text-primary h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-foreground mb-0.5 text-base font-semibold">
                                Start a new transcript
                            </h2>
                            <p className="text-muted-foreground text-sm">
                                Create a project, upload meeting audio, and
                                review speaker transcripts with AI.
                            </p>
                        </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push('/live-assistant/setup')}
                        >
                            <Upload className="h-4 w-4" />
                            Upload audio
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => router.push('/meetings')}
                        >
                            Create project
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* ── Metrics Grid ─────────────────────────────────────────── */}
            <div className="animate-fade-in-up-delay-2 mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {/* Meetings */}
                <div className="border-border bg-card rounded-xl border p-5">
                    <div className="mb-1 flex items-center gap-2">
                        <Mic className="text-muted-foreground h-4 w-4" />
                        <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                            Meetings
                        </span>
                    </div>
                    <p className="text-foreground text-2xl font-semibold">
                        {meetingLimit === null
                            ? 'Unlimited'
                            : `${meetingsRemaining}/${meetingLimit}`}
                    </p>
                    <p className="text-muted-foreground mt-0.5 text-xs">
                        {meetingLimit === null
                            ? `${meetingsUsed} meetings completed`
                            : 'remaining this period'}
                    </p>
                </div>

                {/* Transcripts */}
                <div
                    data-tour="dashboard-project-stats"
                    className="border-border bg-card rounded-xl border p-5"
                >
                    <div className="mb-1 flex items-center gap-2">
                        <FolderOpen className="text-muted-foreground h-4 w-4" />
                        <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                            Projects
                        </span>
                    </div>
                    <p className="text-foreground text-2xl font-semibold">
                        {projects?.length ?? 0}
                    </p>
                    <p className="text-muted-foreground mt-0.5 text-xs">
                        total meetings recorded
                    </p>
                </div>

                {/* Tasks */}
                <div className="border-border bg-card rounded-xl border p-5">
                    <div className="mb-1 flex items-center gap-2">
                        <ClipboardList className="text-muted-foreground h-4 w-4" />
                        <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                            Tasks
                        </span>
                    </div>
                    <p className="text-foreground text-2xl font-semibold">
                        {pendingTasks.length}
                    </p>
                    <p className="text-muted-foreground mt-0.5 text-xs">
                        pending action items
                    </p>
                </div>
            </div>

            {/* ── Main Grid: Recent Work + Tasks ──────────────────────── */}
            <div className="animate-fade-in-up-delay-3 mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Recent Work — 2/3 */}
                <div
                    data-tour="dashboard-recent-work"
                    className="border-border bg-card rounded-xl border lg:col-span-2"
                >
                    <div className="border-border flex items-center justify-between border-b px-5 py-4">
                        <h2 className="text-foreground text-sm font-semibold">
                            Recent work
                        </h2>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push('/meetings')}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            View all
                            <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                    </div>

                    <div className="px-5 py-4">
                        {isProjectsLoading ? (
                            <div className="space-y-3 py-4">
                                <div className="bg-muted/60 h-10 animate-pulse rounded" />
                                <div className="bg-muted/60 h-10 animate-pulse rounded" />
                                <div className="bg-muted/60 h-10 animate-pulse rounded" />
                            </div>
                        ) : projectsError ? (
                            <div className="text-destructive flex flex-col items-center gap-2 py-6 text-center text-sm">
                                <AlertCircle className="h-8 w-8" />
                                <p>Failed to load recent projects</p>
                            </div>
                        ) : recentProjects.length === 0 ? (
                            <EmptyState
                                icon={Mic}
                                title="No projects yet"
                                description="Create a meeting project to upload audio and review transcripts."
                                actionLabel="Create project"
                                onAction={() => router.push('/meetings')}
                            />
                        ) : (
                            <div className="divide-border divide-y">
                                {recentProjects.map((project) => (
                                    <div
                                        key={project.id}
                                        onClick={() =>
                                            router.push(
                                                `/meetings/${project.id}`,
                                            )
                                        }
                                        className="hover:bg-muted/40 -mx-1 cursor-pointer rounded-lg px-3 py-3 transition-colors"
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (
                                                e.key === 'Enter' ||
                                                e.key === ' '
                                            ) {
                                                router.push(
                                                    `/meetings/${project.id}`,
                                                );
                                            }
                                        }}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0 flex-1">
                                                <p className="text-foreground truncate text-sm font-medium">
                                                    {project.title}
                                                </p>
                                                <p className="text-muted-foreground mt-0.5 truncate text-xs">
                                                    {project.description ||
                                                        'No description'}
                                                </p>
                                            </div>
                                            <span
                                                className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                                    project.audio_url
                                                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                        : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                                                }`}
                                            >
                                                {project.audio_url
                                                    ? 'Audio'
                                                    : 'Waiting'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Pending Tasks — 1/3 */}
                <div className="border-border bg-card rounded-xl border">
                    <div className="border-border flex items-center justify-between border-b px-5 py-4">
                        <h2 className="text-foreground text-sm font-semibold">
                            Pending tasks
                        </h2>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push('/tasks')}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            View all
                        </Button>
                    </div>

                    <div className="px-5 py-4">
                        {pendingTasks.length === 0 ? (
                            <EmptyState
                                icon={CheckCircle}
                                title="All caught up"
                                description="No pending tasks right now."
                            />
                        ) : (
                            <div className="space-y-3">
                                {pendingTasks.map((task) => (
                                    <div
                                        key={task.id}
                                        onClick={() => router.push('/tasks')}
                                        className="hover:bg-muted/40 -mx-1 cursor-pointer rounded-lg px-2 py-2 transition-colors"
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (
                                                e.key === 'Enter' ||
                                                e.key === ' '
                                            ) {
                                                router.push('/tasks');
                                            }
                                        }}
                                    >
                                        <div className="flex items-start gap-2.5">
                                            <Circle
                                                className={`mt-0.5 h-4 w-4 shrink-0 ${
                                                    task.priority === 'high'
                                                        ? 'text-red-500'
                                                        : task.priority ===
                                                            'medium'
                                                          ? 'text-yellow-500'
                                                          : 'text-muted-foreground'
                                                }`}
                                            />
                                            <div className="min-w-0 flex-1">
                                                <p className="text-foreground truncate text-sm">
                                                    {task.title}
                                                </p>
                                                {task.dueDate && (
                                                    <p className="text-muted-foreground mt-0.5 text-xs">
                                                        Due{' '}
                                                        {format(
                                                            task.dueDate,
                                                            'MMM d',
                                                        )}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Getting Started (only if workspace is empty) ─────────── */}
            {showGettingStarted && (
                <div
                    data-tour="dashboard-getting-started"
                    className="border-border bg-card animate-fade-in-up-delay-4 rounded-xl border"
                >
                    <div className="border-border border-b px-5 py-4">
                        <h2 className="text-foreground text-sm font-semibold">
                            Getting started
                        </h2>
                        <p className="text-muted-foreground mt-0.5 text-xs">
                            Complete these steps to set up your workspace.
                        </p>
                    </div>
                    <div className="divide-border divide-y">
                        {gettingStartedItems.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => router.push(item.path)}
                                className={`hover:bg-muted/40 flex cursor-pointer items-center gap-3 px-5 py-3.5 transition-colors ${
                                    item.done ? 'opacity-50' : ''
                                }`}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        router.push(item.path);
                                    }
                                }}
                            >
                                <div
                                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border ${
                                        item.done
                                            ? 'bg-primary border-primary'
                                            : 'border-border'
                                    }`}
                                >
                                    {item.done && (
                                        <CheckCircle className="h-3 w-3 text-white" />
                                    )}
                                </div>
                                <span
                                    className={`text-sm ${
                                        item.done
                                            ? 'text-muted-foreground line-through'
                                            : 'text-foreground'
                                    }`}
                                >
                                    {item.label}
                                </span>
                                {!item.done && (
                                    <ArrowRight className="text-muted-foreground ml-auto h-3.5 w-3.5" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Workspace role info (subtle, bottom) ─────────────────── */}
            <div className="animate-fade-in-up-delay-4 mt-6 flex items-center gap-2">
                <Users className="text-muted-foreground h-3.5 w-3.5" />
                <p className="text-muted-foreground text-xs">
                    {authRole === 'admin'
                        ? 'Admin workspace · global access enabled'
                        : authRole === 'pro'
                          ? 'Pro workspace · unlimited meetings and AI review'
                          : 'Free workspace · 5 meeting limit · upgrade anytime'}
                </p>
            </div>
        </div>
    );
}
