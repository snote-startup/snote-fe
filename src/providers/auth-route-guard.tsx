'use client';

import { useEffect, useRef, useSyncExternalStore, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/use-auth-store';
import { AuthLoadingScreen } from '@/components/snote/shared/AuthLoadingScreen';

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
    // useSyncExternalStore is the canonical SSR-safe mount detection pattern.
    // Server snapshot returns false, client snapshot returns true — no hydration mismatch.
    const mounted = useSyncExternalStore(
        () => () => undefined,
        () => true,
        () => false,
    );

    const bootstrapSession = useAuthStore((state) => state.bootstrapSession);
    const logout = useAuthStore((state) => state.logout);
    const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const user = useAuthStore((state) => state.user);

    // Bootstrap session exactly once.
    useEffect(() => {
        if (hasBootstrapped.current) {
            return;
        }

        hasBootstrapped.current = true;
        void bootstrapSession();
    }, [bootstrapSession]);

    // Listen for 401 unauthorized events from API interceptors.
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

    // Route guard: redirect after auth check completes.
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
            // Redirect to ?next or default dashboard
            const nextParam =
                typeof window !== 'undefined'
                    ? new URLSearchParams(window.location.search).get('next')
                    : null;
            const safeNext =
                nextParam &&
                nextParam.startsWith('/') &&
                !nextParam.startsWith('//')
                    ? nextParam
                    : '/dashboard';
            router.replace(safeNext);
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

    // CRITICAL: On the server and on the very first client render (before
    // `mounted` is true), always render children directly. This ensures the
    // server HTML and the first client render are identical — no hydration
    // mismatch between a guard <div> and the page's <main>.
    //
    // The loading screen is shown only after client mount, when we know we're
    // actually checking auth and the route needs protection.
    if (!mounted) {
        return <>{children}</>;
    }

    if (
        isCheckingAuth &&
        (isProtectedRoute(pathname) || isAuthRoute(pathname))
    ) {
        return <AuthLoadingScreen />;
    }

    return <>{children}</>;
}
