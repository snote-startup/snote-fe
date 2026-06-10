'use client';

import { Toaster } from '@/components/ui/sonner';
import { AuthRouteGuard } from '@/providers/auth-route-guard';
import { QueryProvider } from '@/providers/query-provider';
import { AppProvider } from '@/providers/snote-app-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import { CustomCursor } from '@/components/snote/shared/CustomCursor';
import type { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider
            attribute="class"
            themes={['light', 'dark']}
            defaultTheme="system"
            enableSystem
            enableColorScheme
            disableTransitionOnChange
            storageKey="snote-theme"
        >
            <QueryProvider>
                <AppProvider>
                    <AuthRouteGuard>{children}</AuthRouteGuard>
                </AppProvider>
            </QueryProvider>
            <Toaster richColors position="top-right" />
            {/* Custom cursor — client-only, returns null on server/touch */}
            <CustomCursor />
        </ThemeProvider>
    );
}

