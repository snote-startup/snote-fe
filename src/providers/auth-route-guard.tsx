'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/use-auth-store';

const protectedPrefixes = [
    '/dashboard',
    '/live-assistant',
    '/meetings',
    '/tasks',
    '/calendar',
    '/billing',
    '/profile',
    '/admin',
];

const authRoutes = ['/login', '/register'];

function isProtectedRoute(pathname: string) {
    return protectedPrefixes.some(
        (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    );
}

function isAuthRoute(pathname: string) {
    return authRoutes.includes(pathname);
}

function getLoginUrl(nextPath: string) {
    return `/login?next=${encodeURIComponent(nextPath)}`;
}

function getCurrentPath(pathname: string) {
    if (typeof window === 'undefined') {
        return pathname;
    }

    return `${pathname}${window.location.search}`;
}

export function AuthRouteGuard({ children }: { children: ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const hasBootstrapped = useRef(false);
    const { bootstrapSession, isAuthenticated, isCheckingAuth, logout, user } =
        useAuthStore();

    useEffect(() => {
        if (hasBootstrapped.current) {
            return;
        }

        hasBootstrapped.current = true;
        void bootstrapSession();
    }, [bootstrapSession]);

    useEffect(() => {
        const handleUnauthorized = () => {
            const currentPath = getCurrentPath(pathname);
            logout();
            router.replace(
                isProtectedRoute(pathname)
                    ? getLoginUrl(currentPath)
                    : '/login',
            );
        };

        window.addEventListener('snote-auth-unauthorized', handleUnauthorized);

        return () => {
            window.removeEventListener(
                'snote-auth-unauthorized',
                handleUnauthorized,
            );
        };
    }, [logout, pathname, router]);

    useEffect(() => {
        if (isCheckingAuth) {
            return;
        }

        if (!isAuthenticated && isProtectedRoute(pathname)) {
            const currentPath = getCurrentPath(pathname);
            router.replace(getLoginUrl(currentPath));
            return;
        }

        if (isAuthenticated && isAuthRoute(pathname)) {
            router.replace('/dashboard');
            return;
        }

        if (
            isAuthenticated &&
            (pathname === '/admin' || pathname.startsWith('/admin/')) &&
            user?.role !== 'admin'
        ) {
            router.replace('/dashboard');
        }
    }, [isAuthenticated, isCheckingAuth, pathname, router, user?.role]);

    if (
        isCheckingAuth &&
        (isProtectedRoute(pathname) || isAuthRoute(pathname))
    ) {
        return (
            <div className="bg-background text-foreground flex min-h-screen items-center justify-center">
                <div className="text-muted-foreground text-sm">
                    Checking session...
                </div>
            </div>
        );
    }

    return children;
}
