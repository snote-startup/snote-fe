'use client';

import { useRouter } from 'next/navigation';
import { useApp } from '@/providers/snote-app-provider';
import { Button } from '@/components/ui/button';
import {
    BarChart3,
    Crown,
    Mic,
    Clock,
    CheckCircle,
    ArrowRight,
    AlertCircle,
    Lock,
    ShieldCheck,
    Sparkles,
    Zap,
} from 'lucide-react';
import { format } from 'date-fns';

const DASHBOARD_REFERENCE_TIME = Date.now();
const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function Dashboard() {
    const router = useRouter();
    const {
        authRole,
        isAdmin,
        isFree,
        isPro,
        roleProfile,
        user,
        meetings,
        tasks,
    } = useApp();

    if (!user) return null;

    const recentMeetings = meetings.slice(0, 3);
    const pendingTasks = tasks.filter((t) => t.status !== 'done').slice(0, 4);
    const minutesRemaining =
        user.subscription.minutesLimit - user.subscription.minutesUsed;
    const hasUnlimitedMinutes = roleProfile.hasUnlimitedMinutes;
    const meetingLimit = roleProfile.meetingLimit;
    const meetingsUsed = roleProfile.meetingsUsed;
    const meetingsRemaining =
        meetingLimit === null ? null : Math.max(meetingLimit - meetingsUsed, 0);
    const meetingQuotaLabel =
        meetingLimit === null
            ? 'Unlimited meetings'
            : `${meetingsRemaining}/${meetingLimit} meetings left`;
    const usagePercentage = hasUnlimitedMinutes
        ? 100
        : Math.min(
              (minutesRemaining / user.subscription.minutesLimit) * 100,
              100,
          );

    // Calculate trial days remaining
    const trialDaysRemaining = user.subscription.trialEndsAt
        ? Math.ceil(
              (user.subscription.trialEndsAt.getTime() -
                  DASHBOARD_REFERENCE_TIME) /
                  MS_PER_DAY,
          )
        : 0;

    const showTrialBanner =
        user.subscription.plan === 'trial' &&
        user.subscription.status === 'active';
    const showFreeLimitBanner = isFree && minutesRemaining <= 30;

    const roleHero = {
        free: {
            title: meetingQuotaLabel,
            copy: 'Free workspaces include 5 meetings. Upgrade to Pro to remove limits and unlock advanced AI insights.',
            icon: Lock,
            action: 'Upgrade',
            path: '/pricing',
        },
        pro: {
            title: 'Pro workspace active',
            copy: 'Unlimited meetings, advanced insights, and faster post-meeting review are enabled with no upgrade prompts.',
            icon: Crown,
            action: 'Start meeting',
            path: '/live-assistant/setup',
        },
        admin: {
            title: 'Admin command mode',
            copy: 'You can preview the user app and jump into global system analytics from this workspace.',
            icon: ShieldCheck,
            action: 'Open admin',
            path: '/admin',
        },
    }[authRole];
    const RoleHeroIcon = roleHero.icon;
    const roleBadgeClass = isPro
        ? 'bg-gradient-to-r from-[#f6c453] via-[#a171ff] to-[#490aad] text-white shadow-sm'
        : 'bg-card text-purple-primary ring-1 ring-purple-light';

    return (
        <div className="mx-auto max-w-7xl p-8">
            <div className="border-purple-light from-brand-soft to-card dark:from-accent dark:to-card mb-6 flex flex-col gap-3 rounded-2xl border bg-gradient-to-r p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                    <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                            isPro
                                ? 'bg-gradient-to-br from-[#490aad] to-[#a171ff] text-white'
                                : 'bg-brand-soft text-purple-primary dark:bg-accent'
                        }`}
                    >
                        <RoleHeroIcon className="h-5 w-5" />
                    </div>
                    <div>
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                            <h2 className="text-foreground text-lg font-semibold">
                                {roleHero.title}
                            </h2>
                            <span
                                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${roleBadgeClass}`}
                            >
                                {roleProfile.badge}
                            </span>
                        </div>
                        <p className="text-muted-foreground text-sm">
                            {roleHero.copy}
                        </p>
                    </div>
                </div>
                <Button
                    onClick={() => router.push(roleHero.path)}
                    className={`shrink-0 ${isFree ? 'animate-pulse shadow-lg shadow-[#490aad]/25' : ''}`}
                >
                    {roleHero.action}
                    <ArrowRight className="h-4 w-4" />
                </Button>
            </div>

            {/* Trial Banner */}
            {showTrialBanner && (
                <div className="border-purple-light from-brand-soft to-card dark:from-accent dark:to-card mb-6 flex items-center justify-between rounded-2xl border bg-gradient-to-r p-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-brand-soft dark:bg-accent flex h-10 w-10 items-center justify-center rounded-xl">
                            <Sparkles className="text-purple-primary h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-foreground font-medium">
                                Free trial - {trialDaysRemaining} days remaining
                            </p>
                            <p className="text-muted-foreground text-sm">
                                Upgrade to Pro to get unlimited meeting minutes
                                and premium features
                            </p>
                        </div>
                    </div>
                    <Button
                        onClick={() => router.push('/pricing')}
                        className="border-0 bg-gradient-to-r from-[#490aad] to-[#a171ff] text-white hover:from-[#5a1bc0] hover:to-[#b185ff]"
                    >
                        Upgrade Now
                    </Button>
                </div>
            )}

            {showFreeLimitBanner && (
                <div className="border-purple-light bg-brand-soft dark:bg-accent mb-6 flex items-center justify-between rounded-2xl border p-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-card flex h-10 w-10 items-center justify-center rounded-xl">
                            <AlertCircle className="text-purple-primary h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-foreground font-medium">
                                {meetingQuotaLabel}
                            </p>
                            <p className="text-foreground/80 text-sm">
                                Free users lose live transcription access when
                                meeting or minute limits run out.
                            </p>
                        </div>
                    </div>
                    <Button
                        onClick={() => router.push('/pricing')}
                        size="sm"
                        className="animate-pulse shadow-lg shadow-[#490aad]/25"
                    >
                        Upgrade
                    </Button>
                </div>
            )}

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-foreground mb-2 text-3xl font-semibold">
                    Welcome back, {user.name.split(' ')[0]}
                </h1>
                <p className="text-muted-foreground">
                    Here&apos;s what&apos;s happening with your{' '}
                    {roleProfile.label.toLowerCase()} workspace today
                </p>
            </div>

            {/* Quick Actions */}
            <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Start Meeting Card */}
                <div className="rounded-2xl bg-gradient-to-br from-[#490aad] to-[#a171ff] p-6 text-white lg:col-span-2">
                    <div className="mb-4 flex items-start justify-between">
                        <div>
                            <h2 className="mb-2 text-xl font-semibold">
                                Ready to start a meeting?
                            </h2>
                            <p className="text-purple-100">
                                Record, transcribe, and get AI-powered insights
                                in real-time
                            </p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                            <Mic className="h-6 w-6" />
                        </div>
                    </div>
                    <Button
                        onClick={() => router.push('/live-assistant/setup')}
                        className="text-purple-primary hover:bg-brand-soft bg-white"
                    >
                        Start Live Assistant
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>

                {/* Stats Card */}
                <div className="border-border bg-card rounded-2xl border p-6">
                    <div className="mb-4 flex items-center gap-3">
                        <div className="bg-brand-soft dark:bg-accent flex h-10 w-10 items-center justify-center rounded-xl">
                            <Clock className="text-purple-primary h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-muted-foreground text-sm">
                                {meetingLimit === null
                                    ? 'Meetings'
                                    : 'Free Meetings'}
                            </p>
                            <p className="text-foreground text-2xl font-semibold">
                                {meetingQuotaLabel}
                            </p>
                        </div>
                    </div>
                    <div className="bg-muted h-2 w-full rounded-full">
                        <div
                            className="h-2 rounded-full bg-gradient-to-r from-[#490aad] to-[#a171ff] transition-all"
                            style={{ width: `${usagePercentage}%` }}
                        />
                    </div>
                    <p className="text-muted-foreground mt-2 text-xs">
                        {hasUnlimitedMinutes
                            ? `${user.subscription.minutesUsed.toLocaleString()} minutes used with no cap`
                            : `${minutesRemaining} minutes remaining in Free`}
                    </p>
                </div>
            </div>

            <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="border-border bg-card rounded-xl border p-5">
                    <div className="text-muted-foreground mb-3 flex items-center gap-2 text-sm font-medium">
                        <Zap className="text-purple-primary h-4 w-4" />
                        AI Insight Access
                    </div>
                    <p className="text-foreground text-xl font-semibold">
                        {isFree
                            ? 'Standard'
                            : roleProfile.insightLevel === 'global'
                              ? 'Global'
                              : 'Advanced'}
                    </p>
                    <p className="text-muted-foreground mt-2 text-sm">
                        {isFree
                            ? 'Free users get summaries and basic action items. Sentiment, risk, and decision scoring stay locked.'
                            : 'Sentiment, risk, decision scoring, and follow-up intelligence are unlocked.'}
                    </p>
                    {isFree && (
                        <Button
                            onClick={() => router.push('/pricing')}
                            size="sm"
                            className="mt-4 animate-pulse"
                        >
                            Upgrade insights
                        </Button>
                    )}
                </div>
                <div className="border-border bg-card rounded-xl border p-5">
                    <div className="text-muted-foreground mb-3 flex items-center gap-2 text-sm font-medium">
                        <BarChart3 className="text-purple-primary h-4 w-4" />
                        Review Speed
                    </div>
                    <p className="text-foreground text-xl font-semibold">
                        {isFree ? 'Manual review' : 'Priority AI review'}
                    </p>
                    <p className="text-muted-foreground mt-2 text-sm">
                        {isFree
                            ? 'Export and post-processing are available after meeting review.'
                            : 'Advanced processing prepares follow-ups immediately after meetings.'}
                    </p>
                </div>
                <div className="border-border bg-card rounded-xl border p-5">
                    <div className="text-muted-foreground mb-3 flex items-center gap-2 text-sm font-medium">
                        <ShieldCheck className="text-purple-primary h-4 w-4" />
                        Access Scope
                    </div>
                    <p className="text-foreground text-xl font-semibold">
                        {isAdmin
                            ? 'Global admin'
                            : isPro
                              ? 'Team workspace'
                              : 'Personal workspace'}
                    </p>
                    <p className="text-muted-foreground mt-2 text-sm">
                        {isAdmin
                            ? 'Admin can open command center analytics and oversee system-wide usage.'
                            : isPro
                              ? 'Pro unlocks team-ready unlimited meeting workflows.'
                              : 'Free mode keeps the experience focused on personal trial usage.'}
                    </p>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Recent Meetings */}
                <div className="border-border bg-card rounded-xl border p-6 lg:col-span-2">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-foreground text-lg font-semibold">
                            Recent Meetings
                        </h2>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push('/meetings')}
                        >
                            View all
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>

                    {recentMeetings.length === 0 ? (
                        <div className="py-12 text-center">
                            <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                                <Mic className="text-muted-foreground h-8 w-8" />
                            </div>
                            <p className="text-muted-foreground mb-4">
                                No meetings yet
                            </p>
                            <Button
                                onClick={() =>
                                    router.push('/live-assistant/setup')
                                }
                            >
                                Start your first meeting
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentMeetings.map((meeting) => (
                                <div
                                    key={meeting.id}
                                    onClick={() =>
                                        router.push(`/meetings/${meeting.id}`)
                                    }
                                    className="border-border hover:border-purple-light hover:bg-brand-soft/60 dark:hover:bg-accent/60 cursor-pointer rounded-xl border p-4 transition-colors"
                                >
                                    <div className="mb-2 flex items-start justify-between">
                                        <h3 className="text-foreground font-medium">
                                            {meeting.title}
                                        </h3>
                                        <span className="text-muted-foreground text-xs">
                                            {meeting.duration} min
                                        </span>
                                    </div>
                                    <div className="text-muted-foreground flex items-center gap-4 text-sm">
                                        <span>
                                            {format(
                                                meeting.date,
                                                'MMM d, yyyy',
                                            )}
                                        </span>
                                        <span>
                                            {format(meeting.date, 'h:mm a')}
                                        </span>
                                        {meeting.tasks.length > 0 && (
                                            <span className="flex items-center gap-1">
                                                <CheckCircle className="h-4 w-4" />
                                                {meeting.tasks.length} tasks
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Tasks Overview */}
                <div className="border-border bg-card rounded-xl border p-6">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-foreground text-lg font-semibold">
                            Pending Tasks
                        </h2>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push('/tasks')}
                        >
                            View all
                        </Button>
                    </div>

                    {pendingTasks.length === 0 ? (
                        <div className="py-8 text-center">
                            <CheckCircle className="text-muted-foreground mx-auto mb-3 h-12 w-12" />
                            <p className="text-muted-foreground text-sm">
                                All caught up!
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {pendingTasks.map((task) => (
                                <div
                                    key={task.id}
                                    onClick={() => router.push('/tasks')}
                                    className="border-border hover:border-purple-light hover:bg-brand-soft/60 dark:hover:bg-accent/60 cursor-pointer rounded-xl border p-3 transition-colors"
                                >
                                    <div className="flex items-start gap-3">
                                        <div
                                            className={`mt-0.5 h-5 w-5 rounded border-2 ${
                                                task.priority === 'high'
                                                    ? 'border-red-500'
                                                    : task.priority === 'medium'
                                                      ? 'border-yellow-500'
                                                      : 'border-border'
                                            }`}
                                        />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-foreground truncate text-sm font-medium">
                                                {task.title}
                                            </p>
                                            {task.dueDate && (
                                                <p className="text-muted-foreground mt-1 text-xs">
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

            {/* Tips Section */}
            <div className="border-purple-light from-brand-soft to-card dark:from-accent dark:to-card mt-6 rounded-2xl border bg-gradient-to-r p-6">
                <div className="flex items-start gap-4">
                    <div className="bg-brand-soft dark:bg-accent flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl">
                        <AlertCircle className="text-purple-primary h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-foreground mb-1 font-medium">
                            Pro Tip
                        </h3>
                        <p className="text-muted-foreground text-sm">
                            {isFree
                                ? 'Free users can still capture action items and summaries. Pro unlocks advanced insight scoring and unlimited meeting minutes.'
                                : 'Advanced insights are enabled for this role: action items, key decisions, risk signals, and review-ready notes are generated as the meeting wraps.'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
