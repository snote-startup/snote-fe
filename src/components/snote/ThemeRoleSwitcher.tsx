'use client';

import { useSyncExternalStore } from 'react';
import {
    Monitor,
    Moon,
    ShieldCheck,
    Sparkles,
    Sun,
    UserRound,
} from 'lucide-react';
import { useTheme } from 'next-themes';

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
import { cn } from '@/lib/utils';
import { useApp, type MockAuthRole } from '@/providers/snote-app-provider';

const themeOptions = [
    { value: 'system', label: 'Theo hệ thống', icon: Monitor },
    { value: 'light', label: 'Sáng', icon: Sun },
    { value: 'dark', label: 'Tối', icon: Moon },
];

const roleIcons = {
    free: UserRound,
    pro: Sparkles,
    admin: ShieldCheck,
} satisfies Record<MockAuthRole, typeof UserRound>;

const subscribeToClientReady = () => () => undefined;
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function ThemeRoleSwitcher() {
    const mounted = useSyncExternalStore(
        subscribeToClientReady,
        getClientSnapshot,
        getServerSnapshot,
    );
    const { account, authRole, roleProfile, roleProfiles, setAuthRole } =
        useApp();
    const { theme = 'system', setTheme } = useTheme();
    const ActiveRoleIcon = roleIcons[authRole];
    const previewRoles = (
        account?.role === 'admin' ? Object.keys(roleProfiles) : ['free', 'pro']
    ) as MockAuthRole[];

    if (!mounted) {
        return null;
    }

    return (
        <div className="fixed right-4 bottom-4 z-50">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className="glass-panel h-10 gap-2 rounded-full px-3 shadow-2xl"
                    >
                        <ActiveRoleIcon className="text-purple-primary h-4 w-4" />
                        <span className="hidden text-xs font-semibold sm:inline">
                            Vai trò: {roleProfile.badge}
                        </span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                    <DropdownMenuLabel>Vai trò xem thử</DropdownMenuLabel>
                    <DropdownMenuRadioGroup
                        value={authRole}
                        onValueChange={(value) =>
                            setAuthRole(value as MockAuthRole)
                        }
                    >
                        {previewRoles.map((role) => {
                            const RoleIcon = roleIcons[role];
                            const profile = roleProfiles[role];

                            return (
                                <DropdownMenuRadioItem key={role} value={role}>
                                    <RoleIcon
                                        className={cn(
                                            'h-4 w-4',
                                            role === 'pro' && 'text-pro-gold',
                                            role === 'admin' &&
                                                'text-admin-cyan',
                                        )}
                                    />
                                    <span className="flex flex-col">
                                        <span>{profile.label}</span>
                                        <span className="text-muted-foreground text-xs">
                                            {profile.description}
                                        </span>
                                    </span>
                                </DropdownMenuRadioItem>
                            );
                        })}
                    </DropdownMenuRadioGroup>

                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Giao diện</DropdownMenuLabel>
                    <DropdownMenuRadioGroup
                        value={theme}
                        onValueChange={setTheme}
                    >
                        {themeOptions.map((option) => {
                            const ThemeIcon = option.icon;

                            return (
                                <DropdownMenuRadioItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    <ThemeIcon className="h-4 w-4" />
                                    {option.label}
                                </DropdownMenuRadioItem>
                            );
                        })}
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
