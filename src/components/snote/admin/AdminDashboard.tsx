'use client';

import { useRouter } from 'next/navigation';
import {
    Activity,
    AlertTriangle,
    ArrowLeft,
    ArrowUpRight,
    Clock,
    Database,
    DollarSign,
    Gauge,
    Globe2,
    Radio,
    ShieldCheck,
    Users,
    Zap,
} from 'lucide-react';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Line,
    LineChart,
    RadialBar,
    RadialBarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useApp } from '@/providers/snote-app-provider';

const userGrowthData = [
    { month: 'Jan', total: 8420, pro: 3180, enterprise: 840 },
    { month: 'Feb', total: 9360, pro: 3820, enterprise: 1020 },
    { month: 'Mar', total: 10480, pro: 4560, enterprise: 1180 },
    { month: 'Apr', total: 11640, pro: 5380, enterprise: 1410 },
    { month: 'May', total: 12920, pro: 6260, enterprise: 1680 },
    { month: 'Jun', total: 14380, pro: 7420, enterprise: 1960 },
];

const transcribedMinutesData = [
    { month: 'Jan', minutes: 184200, meetings: 6120 },
    { month: 'Feb', minutes: 215800, meetings: 7210 },
    { month: 'Mar', minutes: 268400, meetings: 8420 },
    { month: 'Apr', minutes: 314900, meetings: 9860 },
    { month: 'May', minutes: 372600, meetings: 11340 },
    { month: 'Jun', minutes: 428300, meetings: 12980 },
];

const revenueData = [
    { month: 'Jan', mrr: 84200, expansion: 6200 },
    { month: 'Feb', mrr: 98200, expansion: 8400 },
    { month: 'Mar', mrr: 119400, expansion: 11200 },
    { month: 'Apr', mrr: 143800, expansion: 13900 },
    { month: 'May', mrr: 169600, expansion: 17600 },
    { month: 'Jun', mrr: 198400, expansion: 22400 },
];

const serviceHealthData = [
    { service: 'API', score: 99.97, latency: 84, fill: '#22c55e' },
    { service: 'Transcribe', score: 99.82, latency: 142, fill: '#38bdf8' },
    { service: 'Translate', score: 99.74, latency: 118, fill: '#a171ff' },
    { service: 'Insights', score: 99.41, latency: 176, fill: '#f59e0b' },
];

const systemRadialData = [{ name: 'health', value: 99.7, fill: '#a171ff' }];

const regionalLoad = [
    { region: 'US', load: 68 },
    { region: 'EU', load: 54 },
    { region: 'APAC', load: 73 },
    { region: 'LATAM', load: 41 },
];

const commandEvents = [
    {
        title: 'Enterprise workspace sync completed',
        detail: '2,840 users reconciled across billing and auth.',
        status: 'Operational',
    },
    {
        title: 'Realtime translation queue elevated',
        detail: 'APAC load is 18% above trailing average.',
        status: 'Watch',
    },
    {
        title: 'Revenue forecast refreshed',
        detail: 'Estimated MRR increased after Pro conversion batch.',
        status: 'Updated',
    },
];

const managedUsers = [
    {
        name: 'Alex Free',
        email: 'free.user@snote.ai',
        plan: 'Free',
        status: 'Limit risk',
        usage: '3/5 meetings',
        minutes: '96/120 min',
    },
    {
        name: 'Priya Pro',
        email: 'pro.user@snote.ai',
        plan: 'Pro',
        status: 'Healthy',
        usage: '18 meetings',
        minutes: '1.2k min',
    },
    {
        name: 'Morgan Admin',
        email: 'admin@snote.ai',
        plan: 'Admin',
        status: 'Privileged',
        usage: '128 meetings',
        minutes: '28.4k min',
    },
    {
        name: 'Taylor Ops',
        email: 'ops@snote.ai',
        plan: 'Enterprise',
        status: 'Review',
        usage: '64 meetings',
        minutes: '8.1k min',
    },
];

function formatCompact(value: number) {
    return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: 1,
    }).format(value);
}

function formatCurrency(value: number) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    }).format(value);
}

function tooltipNumber(value: unknown) {
    return typeof value === 'number' ? value.toLocaleString() : String(value);
}

function tooltipCurrency(value: unknown) {
    return typeof value === 'number' ? formatCurrency(value) : String(value);
}

export function AdminDashboard() {
    const router = useRouter();
    const { isAdmin, meetings } = useApp();

    const latestUsers = userGrowthData[userGrowthData.length - 1];
    const previousUsers = userGrowthData[userGrowthData.length - 2];
    const latestMinutes =
        transcribedMinutesData[transcribedMinutesData.length - 1];
    const latestRevenue = revenueData[revenueData.length - 1];
    const previousRevenue = revenueData[revenueData.length - 2];
    const userGrowth =
        ((latestUsers.total - previousUsers.total) / previousUsers.total) * 100;
    const revenueGrowth =
        ((latestRevenue.mrr - previousRevenue.mrr) / previousRevenue.mrr) * 100;
    const totalMinutes = transcribedMinutesData.reduce(
        (sum, item) => sum + item.minutes,
        0,
    );
    const averageHealth =
        serviceHealthData.reduce((sum, service) => sum + service.score, 0) /
        serviceHealthData.length;

    if (!isAdmin) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#09090b] p-6 text-white">
                <div className="w-full max-w-md rounded-lg border border-white/10 bg-[#111113] p-8 text-center shadow-2xl">
                    <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-[#490aad] to-[#a171ff]">
                        <ShieldCheck className="h-7 w-7" />
                    </div>
                    <h1 className="text-2xl font-semibold">
                        Admin role required
                    </h1>
                    <p className="mt-2 text-sm text-zinc-400">
                        Your authenticated account does not have admin access.
                    </p>
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <Button
                            className="flex-1"
                            variant="outline"
                            onClick={() => router.push('/dashboard')}
                        >
                            Back to app
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#07070a] text-zinc-100">
            <div className="border-b border-white/10 bg-[#0f0f12]/95 px-6 py-4 backdrop-blur">
                <div className="mx-auto flex max-w-[1600px] flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-[#490aad] to-[#a171ff] shadow-lg shadow-[#490aad]/25">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="text-2xl font-semibold tracking-normal">
                                    SNOTE Command Center
                                </h1>
                                <Badge className="bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/15">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                    Global systems online
                                </Badge>
                            </div>
                            <p className="mt-1 text-sm text-zinc-400">
                                System-wide usage, revenue, and reliability
                                telemetry for admin operators.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            variant="outline"
                            className="border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
                            onClick={() => router.push('/dashboard')}
                        >
                            <ArrowLeft className="h-4 w-4" />
                            User app
                        </Button>
                        <Button
                            className="bg-gradient-to-r from-[#490aad] to-[#a171ff] text-white hover:opacity-90"
                            onClick={() => router.push('/dashboard')}
                        >
                            User app
                        </Button>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-[1600px] space-y-5 px-6 py-6">
                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-lg border border-white/10 bg-[#111113] p-5 shadow-xl shadow-black/20">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-zinc-400">
                                Total users
                            </span>
                            <Users className="h-5 w-5 text-[#a171ff]" />
                        </div>
                        <div className="mt-4 text-3xl font-semibold">
                            {latestUsers.total.toLocaleString()}
                        </div>
                        <div className="mt-2 flex items-center gap-1 text-sm text-emerald-300">
                            <ArrowUpRight className="h-4 w-4" />
                            {userGrowth.toFixed(1)}% monthly growth
                        </div>
                    </div>

                    <div className="rounded-lg border border-white/10 bg-[#111113] p-5 shadow-xl shadow-black/20">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-zinc-400">
                                Transcribed minutes
                            </span>
                            <Clock className="h-5 w-5 text-sky-300" />
                        </div>
                        <div className="mt-4 text-3xl font-semibold">
                            {formatCompact(totalMinutes)}
                        </div>
                        <p className="mt-2 text-sm text-zinc-400">
                            {latestMinutes.minutes.toLocaleString()} minutes
                            this month
                        </p>
                    </div>

                    <div className="rounded-lg border border-white/10 bg-[#111113] p-5 shadow-xl shadow-black/20">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-zinc-400">
                                Estimated MRR
                            </span>
                            <DollarSign className="h-5 w-5 text-emerald-300" />
                        </div>
                        <div className="mt-4 text-3xl font-semibold">
                            {formatCurrency(latestRevenue.mrr)}
                        </div>
                        <div className="mt-2 flex items-center gap-1 text-sm text-emerald-300">
                            <ArrowUpRight className="h-4 w-4" />
                            {revenueGrowth.toFixed(1)}% from prior month
                        </div>
                    </div>

                    <div className="rounded-lg border border-white/10 bg-[#111113] p-5 shadow-xl shadow-black/20">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-zinc-400">
                                System health
                            </span>
                            <Activity className="h-5 w-5 text-emerald-300" />
                        </div>
                        <div className="mt-4 text-3xl font-semibold">
                            {averageHealth.toFixed(2)}%
                        </div>
                        <p className="mt-2 text-sm text-zinc-400">
                            {meetings.length} local meeting records tracked
                        </p>
                    </div>
                </section>

                <section className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(420px,0.9fr)]">
                    <div className="rounded-lg border border-white/10 bg-[#111113] p-5 shadow-xl shadow-black/20">
                        <div className="mb-5 flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-semibold">
                                    User growth trajectory
                                </h2>
                                <p className="text-sm text-zinc-400">
                                    Total, Pro, and Enterprise accounts.
                                </p>
                            </div>
                            <Badge className="bg-[#490aad]/30 text-[#d7c4ff] hover:bg-[#490aad]/30">
                                Growth
                            </Badge>
                        </div>
                        <div className="h-[360px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={userGrowthData}>
                                    <defs>
                                        <linearGradient
                                            id="usersTotal"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="5%"
                                                stopColor="#a171ff"
                                                stopOpacity={0.45}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="#a171ff"
                                                stopOpacity={0.02}
                                            />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid
                                        stroke="rgba(255,255,255,0.08)"
                                        vertical={false}
                                    />
                                    <XAxis
                                        dataKey="month"
                                        stroke="#a1a1aa"
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#a1a1aa"
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value: number) =>
                                            formatCompact(value)
                                        }
                                    />
                                    <Tooltip
                                        formatter={(value: unknown) =>
                                            tooltipNumber(value)
                                        }
                                        contentStyle={{
                                            background: '#111113',
                                            border: '1px solid rgba(255,255,255,0.12)',
                                            borderRadius: 8,
                                            color: '#f4f4f5',
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="total"
                                        stroke="#a171ff"
                                        strokeWidth={3}
                                        fill="url(#usersTotal)"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="pro"
                                        stroke="#22c55e"
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="enterprise"
                                        stroke="#38bdf8"
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="grid gap-5">
                        <div className="rounded-lg border border-white/10 bg-[#111113] p-5 shadow-xl shadow-black/20">
                            <div className="mb-5 flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-lg font-semibold">
                                        System health
                                    </h2>
                                    <p className="text-sm text-zinc-400">
                                        Realtime service reliability score.
                                    </p>
                                </div>
                                <Gauge className="h-5 w-5 text-emerald-300" />
                            </div>
                            <div className="grid gap-5 md:grid-cols-[180px_1fr] xl:grid-cols-[160px_1fr]">
                                <div className="h-44">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <RadialBarChart
                                            innerRadius="72%"
                                            outerRadius="100%"
                                            data={systemRadialData}
                                            startAngle={90}
                                            endAngle={-270}
                                        >
                                            <RadialBar
                                                dataKey="value"
                                                cornerRadius={8}
                                                background
                                            />
                                        </RadialBarChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="space-y-3">
                                    {serviceHealthData.map((service) => (
                                        <div key={service.service}>
                                            <div className="mb-1 flex items-center justify-between text-sm">
                                                <span className="text-zinc-300">
                                                    {service.service}
                                                </span>
                                                <span className="font-mono text-zinc-100">
                                                    {service.score}%
                                                </span>
                                            </div>
                                            <Progress
                                                value={service.score}
                                                className="h-1.5 bg-white/10"
                                            />
                                            <p className="mt-1 text-xs text-zinc-500">
                                                {service.latency} ms p95 latency
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-white/10 bg-[#111113] p-5 shadow-xl shadow-black/20">
                            <div className="mb-5 flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-lg font-semibold">
                                        Regional load
                                    </h2>
                                    <p className="text-sm text-zinc-400">
                                        Transcribe cluster utilization.
                                    </p>
                                </div>
                                <Globe2 className="h-5 w-5 text-sky-300" />
                            </div>
                            <div className="h-56">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={regionalLoad}
                                        layout="vertical"
                                    >
                                        <CartesianGrid
                                            stroke="rgba(255,255,255,0.08)"
                                            horizontal={false}
                                        />
                                        <XAxis
                                            type="number"
                                            hide
                                            domain={[0, 100]}
                                        />
                                        <YAxis
                                            type="category"
                                            dataKey="region"
                                            stroke="#a1a1aa"
                                            tickLine={false}
                                            axisLine={false}
                                            width={54}
                                        />
                                        <Tooltip
                                            formatter={(value: unknown) =>
                                                `${tooltipNumber(value)}%`
                                            }
                                            contentStyle={{
                                                background: '#111113',
                                                border: '1px solid rgba(255,255,255,0.12)',
                                                borderRadius: 8,
                                                color: '#f4f4f5',
                                            }}
                                        />
                                        <Bar
                                            dataKey="load"
                                            radius={[0, 8, 8, 0]}
                                        >
                                            {regionalLoad.map((item) => (
                                                <Cell
                                                    key={item.region}
                                                    fill={
                                                        item.load > 70
                                                            ? '#f59e0b'
                                                            : '#a171ff'
                                                    }
                                                />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="grid gap-5 xl:grid-cols-2">
                    <div className="rounded-lg border border-white/10 bg-[#111113] p-5 shadow-xl shadow-black/20">
                        <div className="mb-5 flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-semibold">
                                    Transcribed minutes
                                </h2>
                                <p className="text-sm text-zinc-400">
                                    Global monthly minutes and meeting volume.
                                </p>
                            </div>
                            <Radio className="h-5 w-5 text-sky-300" />
                        </div>
                        <div className="h-[320px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={transcribedMinutesData}>
                                    <CartesianGrid
                                        stroke="rgba(255,255,255,0.08)"
                                        vertical={false}
                                    />
                                    <XAxis
                                        dataKey="month"
                                        stroke="#a1a1aa"
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#a1a1aa"
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value: number) =>
                                            formatCompact(value)
                                        }
                                    />
                                    <Tooltip
                                        formatter={(value: unknown) =>
                                            tooltipNumber(value)
                                        }
                                        contentStyle={{
                                            background: '#111113',
                                            border: '1px solid rgba(255,255,255,0.12)',
                                            borderRadius: 8,
                                            color: '#f4f4f5',
                                        }}
                                    />
                                    <Bar
                                        dataKey="minutes"
                                        radius={[8, 8, 0, 0]}
                                        fill="#38bdf8"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="meetings"
                                        stroke="#22c55e"
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="rounded-lg border border-white/10 bg-[#111113] p-5 shadow-xl shadow-black/20">
                        <div className="mb-5 flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-semibold">
                                    Estimated revenue
                                </h2>
                                <p className="text-sm text-zinc-400">
                                    MRR trend with expansion contribution.
                                </p>
                            </div>
                            <DollarSign className="h-5 w-5 text-emerald-300" />
                        </div>
                        <div className="h-[320px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={revenueData}>
                                    <CartesianGrid
                                        stroke="rgba(255,255,255,0.08)"
                                        vertical={false}
                                    />
                                    <XAxis
                                        dataKey="month"
                                        stroke="#a1a1aa"
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#a1a1aa"
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value: number) =>
                                            formatCompact(value)
                                        }
                                    />
                                    <Tooltip
                                        formatter={(value: unknown) =>
                                            tooltipCurrency(value)
                                        }
                                        contentStyle={{
                                            background: '#111113',
                                            border: '1px solid rgba(255,255,255,0.12)',
                                            borderRadius: 8,
                                            color: '#f4f4f5',
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="mrr"
                                        stroke="#a171ff"
                                        strokeWidth={3}
                                        dot={{ fill: '#a171ff', r: 4 }}
                                        activeDot={{ r: 6 }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="expansion"
                                        stroke="#22c55e"
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </section>

                <section className="rounded-lg border border-white/10 bg-[#111113] p-5 shadow-xl shadow-black/20">
                    <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                            <h2 className="text-lg font-semibold">
                                User management
                            </h2>
                            <p className="text-sm text-zinc-400">
                                Mock account controls for plan, usage, and
                                access verification.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                variant="outline"
                                className="border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
                            >
                                Export users
                            </Button>
                            <Button className="bg-gradient-to-r from-[#490aad] to-[#a171ff] text-white">
                                Invite user
                            </Button>
                        </div>
                    </div>

                    <div className="grid gap-3">
                        {managedUsers.map((managedUser) => (
                            <div
                                key={managedUser.email}
                                className="grid gap-4 rounded-lg border border-white/10 bg-white/[0.03] p-4 lg:grid-cols-[minmax(220px,1fr)_120px_130px_130px_auto]"
                            >
                                <div className="min-w-0">
                                    <p className="truncate font-medium text-zinc-100">
                                        {managedUser.name}
                                    </p>
                                    <p className="mt-1 truncate text-sm text-zinc-500">
                                        {managedUser.email}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-500 uppercase">
                                        Plan
                                    </p>
                                    <Badge
                                        className={
                                            managedUser.plan === 'Pro'
                                                ? 'mt-2 bg-gradient-to-r from-[#f6c453] via-[#a171ff] to-[#490aad] text-white'
                                                : managedUser.plan === 'Admin'
                                                  ? 'mt-2 bg-sky-500/15 text-sky-300 hover:bg-sky-500/15'
                                                  : 'mt-2 bg-white/10 text-zinc-200 hover:bg-white/10'
                                        }
                                    >
                                        {managedUser.plan}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-500 uppercase">
                                        Usage
                                    </p>
                                    <p className="mt-2 text-sm text-zinc-200">
                                        {managedUser.usage}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-500 uppercase">
                                        Minutes
                                    </p>
                                    <p className="mt-2 text-sm text-zinc-200">
                                        {managedUser.minutes}
                                    </p>
                                </div>
                                <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                                    <Badge
                                        className={
                                            managedUser.status === 'Limit risk'
                                                ? 'bg-amber-500/15 text-amber-300 hover:bg-amber-500/15'
                                                : managedUser.status ===
                                                    'Review'
                                                  ? 'bg-rose-500/15 text-rose-300 hover:bg-rose-500/15'
                                                  : 'bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/15'
                                        }
                                    >
                                        {managedUser.status}
                                    </Badge>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
                                    >
                                        Manage
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="grid gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(460px,1.05fr)]">
                    <div className="rounded-lg border border-white/10 bg-[#111113] p-5 shadow-xl shadow-black/20">
                        <div className="mb-5 flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-semibold">
                                    Infrastructure signals
                                </h2>
                                <p className="text-sm text-zinc-400">
                                    Capacity indicators for the current window.
                                </p>
                            </div>
                            <Database className="h-5 w-5 text-[#a171ff]" />
                        </div>
                        <div className="grid gap-3 sm:grid-cols-3">
                            {[
                                ['Queue depth', '124', 'Stable'],
                                ['Error budget', '92%', 'Healthy'],
                                ['AI workers', '38/42', 'Scaled'],
                            ].map(([label, value, status]) => (
                                <div
                                    key={label}
                                    className="rounded-lg border border-white/10 bg-white/[0.03] p-4"
                                >
                                    <p className="text-xs text-zinc-500 uppercase">
                                        {label}
                                    </p>
                                    <p className="mt-3 text-2xl font-semibold">
                                        {value}
                                    </p>
                                    <p className="mt-1 text-sm text-emerald-300">
                                        {status}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-lg border border-white/10 bg-[#111113] p-5 shadow-xl shadow-black/20">
                        <div className="mb-5 flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-semibold">
                                    Command feed
                                </h2>
                                <p className="text-sm text-zinc-400">
                                    Latest global admin events.
                                </p>
                            </div>
                            <Zap className="h-5 w-5 text-amber-300" />
                        </div>
                        <div className="space-y-3">
                            {commandEvents.map((event) => (
                                <div
                                    key={event.title}
                                    className="grid gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-4 md:grid-cols-[1fr_auto]"
                                >
                                    <div>
                                        <p className="font-medium text-zinc-100">
                                            {event.title}
                                        </p>
                                        <p className="mt-1 text-sm text-zinc-400">
                                            {event.detail}
                                        </p>
                                    </div>
                                    <Badge
                                        className={
                                            event.status === 'Watch'
                                                ? 'bg-amber-500/15 text-amber-300 hover:bg-amber-500/15'
                                                : 'bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/15'
                                        }
                                    >
                                        {event.status === 'Watch' && (
                                            <AlertTriangle className="h-3 w-3" />
                                        )}
                                        {event.status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
