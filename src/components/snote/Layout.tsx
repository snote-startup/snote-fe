'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
    ChevronsUpDown,
    Crown,
    LayoutDashboard,
    Mic,
    FolderOpen,
    CheckSquare,
    Calendar,
    CreditCard,
    User,
    LogOut,
    Clock,
    ShieldCheck,
    UserRound,
} from 'lucide-react';
import { useApp, type MockAuthRole } from '@/providers/snote-app-provider';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface LayoutProps {
    children: ReactNode;
}

const roleIcons = {
    free: UserRound,
    pro: Crown,
    admin: ShieldCheck,
} satisfies Record<MockAuthRole, typeof UserRound>;

export function Layout({ children }: LayoutProps) {
    const pathname = usePathname();
    const router = useRouter();
    const {
        authRole,
        isAdmin,
        roleProfile,
        roleProfiles,
        setAuthRole,
        user,
        logout,
    } = useApp();
    const ActiveRoleIcon = roleIcons[authRole];

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: Mic, label: 'Live Assistant', path: '/live-assistant/setup' },
        { icon: FolderOpen, label: 'Meetings', path: '/meetings' },
        { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
        { icon: Calendar, label: 'Calendar', path: '/calendar' },
        { icon: CreditCard, label: 'Billing', path: '/billing' },
        { icon: User, label: 'Profile', path: '/profile' },
        ...(isAdmin
            ? [{ icon: ShieldCheck, label: 'Admin', path: '/admin' }]
            : []),
    ];

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    if (!user) {
        return <>{children}</>;
    }

    const minutesRemaining =
        user.subscription.minutesLimit - user.subscription.minutesUsed;
    const meetingLimit = roleProfile.meetingLimit;
    const meetingsRemaining =
        meetingLimit === null
            ? null
            : Math.max(meetingLimit - roleProfile.meetingsUsed, 0);

    return (
        <div className="bg-background text-foreground flex h-screen">
            {/* Sidebar */}
            <div className="bg-card border-border flex w-64 flex-col border-r">
                {/* Logo */}
                <div className="border-border border-b p-6">
                    <Image
                        src="/snote-logo.png"
                        alt="SNOTE"
                        width={112}
                        height={32}
                        priority
                        style={{ width: 'auto', height: 'auto' }}
                    />
                </div>

                <div className="border-border border-b p-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                type="button"
                                className="bg-glass border-border hover:bg-muted/60 flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition-colors"
                            >
                                <span
                                    className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                                        authRole === 'pro'
                                            ? 'bg-gradient-to-br from-[#490aad] to-[#a171ff] text-white'
                                            : authRole === 'admin'
                                              ? 'bg-foreground text-background'
                                              : 'bg-brand-soft text-purple-primary dark:bg-accent'
                                    }`}
                                >
                                    <ActiveRoleIcon className="h-4 w-4" />
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className="text-foreground block truncate text-sm font-medium">
                                        {roleProfile.label}
                                    </span>
                                    <span className="text-muted-foreground block truncate text-xs">
                                        {roleProfile.description}
                                    </span>
                                </span>
                                <ChevronsUpDown className="text-muted-foreground h-4 w-4" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-60">
                            <DropdownMenuLabel>Test role</DropdownMenuLabel>
                            <DropdownMenuRadioGroup
                                value={authRole}
                                onValueChange={(value) =>
                                    setAuthRole(value as MockAuthRole)
                                }
                            >
                                {(
                                    Object.keys(roleProfiles) as MockAuthRole[]
                                ).map((role) => {
                                    const RoleIcon = roleIcons[role];
                                    const profile = roleProfiles[role];

                                    return (
                                        <DropdownMenuRadioItem
                                            key={role}
                                            value={role}
                                        >
                                            <RoleIcon className="h-4 w-4" />
                                            <span className="flex flex-col">
                                                <span>{profile.label}</span>
                                                <span className="text-muted-foreground text-xs">
                                                    {profile.badge}
                                                </span>
                                            </span>
                                        </DropdownMenuRadioItem>
                                    );
                                })}
                            </DropdownMenuRadioGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel className="text-[11px] leading-4 font-normal">
                                Switch roles to preview limits, Pro insights,
                                and Admin access.
                            </DropdownMenuLabel>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 p-4">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive =
                            pathname === item.path ||
                            (item.path !== '/dashboard' &&
                                pathname.startsWith(item.path));

                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${
                                    isActive
                                        ? 'active-brand-link'
                                        : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground'
                                }`}
                            >
                                <Icon className="h-5 w-5" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Minutes Remaining */}
                <div className="border-border border-t p-4">
                    <div className="bg-brand-soft dark:bg-accent border-border rounded-xl border p-3">
                        <div className="text-muted-foreground mb-1 flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4" />
                            <span>
                                {meetingLimit === null
                                    ? 'Meeting Capacity'
                                    : 'Meetings Remaining'}
                            </span>
                        </div>
                        <div className="text-foreground text-2xl font-semibold">
                            {meetingLimit === null
                                ? 'Unlimited'
                                : `${meetingsRemaining}/${meetingLimit}`}
                        </div>
                        <div className="text-muted-foreground mt-1 text-xs">
                            {meetingLimit === null
                                ? 'Pro-grade meeting capacity'
                                : `${minutesRemaining} minutes still available`}
                        </div>
                    </div>
                </div>

                {/* User Profile */}
                <div className="border-border border-t p-4">
                    <div className="flex items-center gap-3">
                        <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full ${
                                authRole === 'pro'
                                    ? 'bg-gradient-to-br from-[#f6c453] via-[#a171ff] to-[#490aad] text-white shadow-lg shadow-[#490aad]/20'
                                    : authRole === 'admin'
                                      ? 'bg-foreground text-background'
                                      : 'bg-brand-soft dark:bg-accent'
                            }`}
                        >
                            <span
                                className={`font-medium ${
                                    authRole === 'free'
                                        ? 'text-purple-primary'
                                        : 'text-white'
                                }`}
                            >
                                {user.name
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')}
                            </span>
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="text-foreground truncate text-sm font-medium">
                                {user.name}
                            </div>
                            <div className="text-muted-foreground flex items-center gap-2 truncate text-xs">
                                <span className="truncate">{user.email}</span>
                                {authRole === 'pro' && (
                                    <span className="rounded-full bg-gradient-to-r from-[#f6c453] via-[#a171ff] to-[#490aad] px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm">
                                        PRO
                                    </span>
                                )}
                                {authRole === 'admin' && (
                                    <ShieldCheck className="text-purple-primary h-3.5 w-3.5 shrink-0" />
                                )}
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleLogout}
                            className="p-2"
                        >
                            <LogOut className="text-muted-foreground h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">{children}</div>
        </div>
    );
}
