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
            logout();
            router.replace('/login');
        };

        window.addEventListener('snote-auth-unauthorized', handleUnauthorized);

        return () => {
            window.removeEventListener(
                'snote-auth-unauthorized',
                handleUnauthorized,
            );
        };
    }, [logout, router]);

    useEffect(() => {
        if (isCheckingAuth) {
            return;
        }

        if (!isAuthenticated && isProtectedRoute(pathname)) {
            router.replace('/login');
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
