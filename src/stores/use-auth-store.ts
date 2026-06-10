import {
    clearStoredAuthTokens,
    getStoredAuthTokens,
    persistAccessToken,
} from '@/lib/api/auth-token-storage';
import * as authApi from '@/lib/api/auth-api';
import type { MinimalAccount } from '@/lib/api/auth-api';
import { create } from 'zustand';

export type Role = MinimalAccount['role'];
export type User = MinimalAccount;

interface AuthState {
    user: MinimalAccount | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    isCheckingAuth: boolean;
    isSubmitting: boolean;
    authError: string | null;
    setAuth: (user: MinimalAccount | null) => void;
    setAccessToken: (accessToken: string) => void;
    clearAuthError: () => void;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    refreshSession: () => Promise<boolean>;
    bootstrapSession: () => Promise<void>;
    logout: () => void;
}

function toErrorMessage(error: unknown) {
    if (error instanceof Error && error.message.trim() !== '') {
        return error.message;
    }

    return 'Authentication request failed. Please try again.';
}

function clearSessionState(set: (state: Partial<AuthState>) => void) {
    clearStoredAuthTokens();
    set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isCheckingAuth: false,
        isSubmitting: false,
    });
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isCheckingAuth: true,
    isSubmitting: false,
    authError: null,
    setAuth: (user) =>
        set({
            user,
            isAuthenticated: !!user,
            isCheckingAuth: false,
        }),
    setAccessToken: (accessToken) => {
        persistAccessToken(accessToken);
        set({ accessToken });
    },
    clearAuthError: () => set({ authError: null }),
    login: async (email, password) => {
        set({ authError: null, isSubmitting: true });

        try {
            const accessToken = await authApi.login({ email, password });
            get().setAccessToken(accessToken);
            const user = await authApi.me();

            set({
                user,
                accessToken,
                isAuthenticated: true,
                isCheckingAuth: false,
                isSubmitting: false,
                authError: null,
            });
        } catch (error) {
            clearStoredAuthTokens();
            set({
                user: null,
                accessToken: null,
                isAuthenticated: false,
                isCheckingAuth: false,
                isSubmitting: false,
                authError: toErrorMessage(error),
            });
            throw error;
        }
    },
    register: async (name, email, password) => {
        set({ authError: null, isSubmitting: true });

        try {
            const accessToken = await authApi.register({
                name,
                email,
                password,
            });
            get().setAccessToken(accessToken);
            const user = await authApi.me();

            set({
                user,
                accessToken,
                isAuthenticated: true,
                isCheckingAuth: false,
                isSubmitting: false,
                authError: null,
            });
        } catch (error) {
            clearStoredAuthTokens();
            set({
                user: null,
                accessToken: null,
                isAuthenticated: false,
                isCheckingAuth: false,
                isSubmitting: false,
                authError: toErrorMessage(error),
            });
            throw error;
        }
    },
    refreshSession: async () => {
        try {
            const accessToken = await authApi.refresh();
            get().setAccessToken(accessToken);
            const user = await authApi.me();

            set({
                user,
                accessToken,
                isAuthenticated: true,
                isCheckingAuth: false,
                isSubmitting: false,
                authError: null,
            });

            return true;
        } catch {
            clearSessionState(set);
            return false;
        }
    },
    bootstrapSession: async () => {
        const { accessToken } = getStoredAuthTokens();

        set({
            accessToken,
            isCheckingAuth: true,
            authError: null,
        });

        try {
            if (!accessToken) {
                await get().refreshSession();
                return;
            }

            try {
                const user = await authApi.me();
                const latestTokens = getStoredAuthTokens();

                set({
                    user,
                    accessToken: latestTokens.accessToken,
                    isAuthenticated: true,
                    isSubmitting: false,
                    authError: null,
                });
            } catch {
                clearSessionState(set);
            }
        } finally {
            set({ isCheckingAuth: false });
        }
    },
    logout: () => {
        // TODO: call backend logout/revoke endpoint when OpenAPI exposes it.
        clearStoredAuthTokens();
        set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isCheckingAuth: false,
            isSubmitting: false,
            authError: null,
        });
    },
}));
