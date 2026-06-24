'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    FolderOpen,
    CheckSquare,
    Calendar,
    CreditCard,
    User,
    LogOut,
    ShieldCheck,
    Menu,
    X,
    CircleHelp,
} from 'lucide-react';
import { useProductTour } from '@/features/onboarding/use-product-tour';
import { useApp } from '@/providers/snote-app-provider';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/snote/ThemeToggle';
import { PageTransition } from '@/components/snote/shared/PageTransition';

// ─── Nav Links ────────────────────────────────────────────────────────────────

interface NavLinksProps {
    navItems: Array<{ icon: React.ElementType; label: string; path: string }>;
    pathname: string;
    onNavigate?: () => void;
}

function NavLinks({ navItems, pathname, onNavigate }: NavLinksProps) {
    return (
        <>
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                    pathname === item.path ||
                    (item.path !== '/dashboard' &&
                        pathname.startsWith(item.path));

                const dataTour =
                    item.path === '/dashboard'
                        ? 'nav-dashboard'
                        : item.path === '/live-assistant/setup'
                          ? 'nav-live-assistant'
                          : item.path === '/meetings'
                            ? 'nav-meetings'
                            : undefined;

                return (
                    <Link
                        key={item.path}
                        href={item.path}
                        onClick={onNavigate}
                        data-tour={dataTour}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors duration-150 ${
                            isActive
                                ? 'active-brand-link font-medium'
                                : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                        }`}
                    >
                        <Icon
                            className={`h-[18px] w-[18px] shrink-0 ${isActive ? 'text-primary' : ''}`}
                        />
                        <span>{item.label}</span>
                    </Link>
                );
            })}
        </>
    );
}

// ─── Sidebar Bottom Content ───────────────────────────────────────────────────

interface SidebarBottomProps {
    initials: string;
    displayName: string;
    displayEmail: string;
    displayRole: string;
    onLogout: () => void;
}

function SidebarBottom({
    initials,
    displayName,
    displayEmail,
    displayRole,
    onLogout,
}: SidebarBottomProps) {
    return (
        <>
            {/* User footer */}
            <div
                data-tour="user-menu"
                className="border-border border-t px-3 py-3"
            >
                <div className="flex items-center gap-2.5">
                    {/* Avatar */}
                    <div className="bg-muted text-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                        {initials}
                    </div>
                    {/* Name / email */}
                    <div className="min-w-0 flex-1">
                        <div className="text-foreground flex items-center gap-1.5 truncate text-sm font-medium">
                            <span className="truncate">{displayName}</span>
                            <span className="text-muted-foreground bg-muted shrink-0 rounded-full px-1.5 py-0.5 text-[10px] leading-none font-medium">
                                {displayRole}
                            </span>
                        </div>
                        <div className="text-muted-foreground truncate text-xs">
                            {displayEmail}
                        </div>
                    </div>
                    {/* Actions */}
                    <div className="flex shrink-0 items-center">
                        <span data-tour="theme-toggle">
                            <ThemeToggle
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                            />
                        </span>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onLogout}
                            aria-label="Đăng xuất"
                            className="h-8 w-8"
                        >
                            <LogOut className="text-muted-foreground h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string) {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

// ─── Layout ───────────────────────────────────────────────────────────────────

interface LayoutProps {
    children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { account, authRole, isAdmin, user, logout } = useApp();
    const { startCurrentPageTour } = useProductTour();

    const navItems = [
        { icon: LayoutDashboard, label: 'Tổng quan', path: '/dashboard' },
        { icon: FolderOpen, label: 'Cuộc họp', path: '/meetings' },
        { icon: CheckSquare, label: 'Công việc', path: '/tasks' },
        { icon: Calendar, label: 'Lịch', path: '/calendar' },
        { icon: CreditCard, label: 'Gói dịch vụ', path: '/billing' },
        { icon: User, label: 'Hồ sơ', path: '/profile' },
        ...(isAdmin
            ? [{ icon: ShieldCheck, label: 'Quản trị', path: '/admin' }]
            : []),
    ];

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    if (!user) {
        return <>{children}</>;
    }

    const displayName = account?.name ?? user.name;
    const displayEmail = account?.email ?? user.email;
    const displayRole =
        authRole === 'admin'
            ? 'Quản trị'
            : authRole === 'pro'
              ? 'Thành viên'
              : 'Đang hoạt động';
    const initials = getInitials(displayName);

    const sidebarBottomProps: SidebarBottomProps = {
        initials,
        displayName,
        displayEmail,
        displayRole,
        onLogout: handleLogout,
    };

    return (
        <div className="bg-background text-foreground flex h-screen overflow-hidden">
            {/* Mobile overlay */}
            {mobileMenuOpen && (
                <div
                    className="bg-background/80 fixed inset-0 z-40 backdrop-blur lg:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Desktop Sidebar */}
            <aside
                data-tour="sidebar"
                className="border-border bg-card/70 hidden w-64 flex-col border-r backdrop-blur-sm lg:flex"
            >
                {/* Logo */}
                <div className="border-border border-b px-4 py-4">
                    <Image
                        src="/snote-logo.png"
                        alt="SNOTE"
                        width={100}
                        height={28}
                        priority
                        style={{ width: 'auto', height: 'auto' }}
                    />
                </div>

                {/* Navigation */}
                <nav className="flex flex-1 flex-col justify-between space-y-0.5 overflow-y-auto px-3 py-4">
                    <div className="space-y-0.5">
                        <NavLinks navItems={navItems} pathname={pathname} />
                    </div>
                    <div className="border-border/40 mt-auto border-t px-3 pt-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startCurrentPageTour()}
                            className="text-muted-foreground hover:bg-muted/60 hover:text-foreground flex w-full items-center justify-start gap-3 rounded-lg px-3 py-2 text-sm transition-colors"
                        >
                            <CircleHelp className="text-primary h-[18px] w-[18px] shrink-0" />
                            <span>Hướng dẫn nhanh</span>
                        </Button>
                    </div>
                </nav>

                <SidebarBottom {...sidebarBottomProps} />
            </aside>

            {/* Mobile Sidebar (slide-in) */}
            <aside
                className={`border-border bg-card fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r transition-transform duration-200 lg:hidden ${
                    mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="border-border flex items-center justify-between border-b px-4 py-4">
                    <Image
                        src="/snote-logo.png"
                        alt="SNOTE"
                        width={96}
                        height={28}
                        priority
                        style={{ width: 'auto', height: 'auto' }}
                    />
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setMobileMenuOpen(false)}
                        aria-label="Đóng menu"
                        className="h-8 w-8"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
                    <NavLinks
                        navItems={navItems}
                        pathname={pathname}
                        onNavigate={() => setMobileMenuOpen(false)}
                    />
                </nav>

                <SidebarBottom {...sidebarBottomProps} />
            </aside>

            {/* Main content area */}
            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                {/* Mobile top bar */}
                <header className="border-border bg-background/95 flex h-14 shrink-0 items-center justify-between border-b px-4 backdrop-blur lg:hidden">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setMobileMenuOpen(true)}
                        aria-label="Mở menu"
                        className="h-8 w-8"
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                    <Image
                        src="/snote-logo.png"
                        alt="SNOTE"
                        width={88}
                        height={24}
                        priority
                        style={{ width: 'auto', height: 'auto' }}
                    />
                    <ThemeToggle
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                    />
                </header>

                {/* Page content */}
                <div className="flex-1 overflow-auto">
                    <PageTransition key={pathname}>{children}</PageTransition>
                </div>
            </div>
        </div>
    );
}
