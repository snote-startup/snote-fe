'use client';

import { useSyncExternalStore } from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const themeOptions = [
    { value: 'light', label: 'Sáng', icon: Sun },
    { value: 'dark', label: 'Tối', icon: Moon },
    { value: 'system', label: 'Theo hệ thống', icon: Monitor },
] as const;

const subscribeToNothing = () => () => undefined;
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

interface ThemeToggleProps {
    /** Additional className for the trigger button */
    className?: string;
    /** Button variant */
    variant?: 'ghost' | 'outline';
    /** Button size */
    size?: 'sm' | 'icon';
}

export function ThemeToggle({
    className,
    variant = 'ghost',
    size = 'icon',
}: ThemeToggleProps) {
    const mounted = useSyncExternalStore(
        subscribeToNothing,
        getClientSnapshot,
        getServerSnapshot,
    );
    const { theme = 'system', setTheme } = useTheme();

    if (!mounted) {
        return (
            <Button
                variant={variant}
                size={size}
                aria-label="Đổi giao diện"
                className={className}
                disabled
            >
                <Sun className="h-4 w-4 opacity-50" />
            </Button>
        );
    }

    const ActiveIcon =
        theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant={variant}
                    size={size}
                    aria-label="Đổi giao diện"
                    className={className}
                >
                    <ActiveIcon className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                    {themeOptions.map(({ value, label, icon: Icon }) => (
                        <DropdownMenuRadioItem key={value} value={value}>
                            <Icon className="h-4 w-4" />
                            {label}
                        </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
