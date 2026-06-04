import {
    clearStoredAuthTokens,
    getStoredAuthTokens,
    persistAuthTokens,
} from '@/lib/api/auth-token-storage';
import * as authApi from '@/lib/api/auth-api';
import { create } from 'zustand';

export type Role = 'admin' | 'user';

export interface User {
    id: string;
    name: string;
    email: string;
    image: string | null;
    role?: Role | null;
}

interface LoginInput {
    email: string;
    password: string;
}

interface RegisterInput {
    email: string;
    name: string;
    password: string;
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isCheckingAuth: boolean;
    authError: string | null;
    setAuth: (user: User | null) => void;
    setTokens: (tokens: {
        accessToken: string;
        refreshToken?: string | null;
    }) => void;
    clearAuthError: () => void;
    login: (input: LoginInput) => Promise<void>;
    register: (input: RegisterInput) => Promise<void>;
    refresh: () => Promise<boolean>;
    bootstrapSession: () => Promise<void>;
    logout: () => void;
}

function toErrorMessage(error: unknown) {
    if (error instanceof Error && error.message.trim() !== '') {
        return error.message;
    }

    return 'Authentication request failed. Please try again.';
}

function normalizeUser(user: User): User {
    return {
        id: String(user.id ?? user.email),
        name: user.name || user.email,
        email: user.email,
        image: user.image ?? null,
        role: user.role ?? null,
    };
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isCheckingAuth: true,
    authError: null,
    setAuth: (user) =>
        set({
            user,
            isAuthenticated: !!user,
            isCheckingAuth: false,
        }),
    setTokens: ({ accessToken, refreshToken }) => {
        persistAuthTokens({ accessToken, refreshToken });
        set({
            accessToken,
            refreshToken: refreshToken ?? get().refreshToken,
        });
    },
    clearAuthError: () => set({ authError: null }),
    login: async (input) => {
        set({ authError: null, isCheckingAuth: true });

        try {
            const tokens = await authApi.login(input);
            get().setTokens(tokens);
            const user = await authApi.me();
            const latestTokens = getStoredAuthTokens();

            set({
                user: normalizeUser(user),
                accessToken: latestTokens.accessToken,
                refreshToken: latestTokens.refreshToken,
                isAuthenticated: true,
                isCheckingAuth: false,
                authError: null,
            });
        } catch (error) {
            clearStoredAuthTokens();
            set({
                user: null,
                accessToken: null,
                refreshToken: null,
                isAuthenticated: false,
                isCheckingAuth: false,
                authError: toErrorMessage(error),
            });
            throw error;
        }
    },
    register: async (input) => {
        set({ authError: null, isCheckingAuth: true });

        try {
            const tokens = await authApi.register(input);
            get().setTokens(tokens);
            const user = await authApi.me();
            const latestTokens = getStoredAuthTokens();

            set({
                user: normalizeUser(user),
                accessToken: latestTokens.accessToken,
                refreshToken: latestTokens.refreshToken,
                isAuthenticated: true,
                isCheckingAuth: false,
                authError: null,
            });
        } catch (error) {
            clearStoredAuthTokens();
            set({
                user: null,
                accessToken: null,
                refreshToken: null,
                isAuthenticated: false,
                isCheckingAuth: false,
                authError: toErrorMessage(error),
            });
            throw error;
        }
    },
    refresh: async () => {
        const { accessToken, refreshToken } = get();
        const tokenForRefresh = refreshToken ?? accessToken;

        if (!tokenForRefresh) {
            return false;
        }

        try {
            const tokens = await authApi.refresh(tokenForRefresh);
            get().setTokens(tokens);
            return true;
        } catch {
            get().logout();
            return false;
        }
    },
    bootstrapSession: async () => {
        const storedTokens = getStoredAuthTokens();

        if (!storedTokens.accessToken) {
            set({
                user: null,
                accessToken: null,
                refreshToken: null,
                isAuthenticated: false,
                isCheckingAuth: false,
            });
            return;
        }

        set({
            accessToken: storedTokens.accessToken,
            refreshToken: storedTokens.refreshToken,
            isCheckingAuth: true,
        });

        try {
            const user = await authApi.me();
            const latestTokens = getStoredAuthTokens();
            set({
                user: normalizeUser(user),
                accessToken: latestTokens.accessToken,
                refreshToken: latestTokens.refreshToken,
                isAuthenticated: true,
                isCheckingAuth: false,
                authError: null,
            });
        } catch {
            const refreshed = await get().refresh();

            if (!refreshed) {
                return;
            }

            try {
                const user = await authApi.me();
                const latestTokens = getStoredAuthTokens();
                set({
                    user: normalizeUser(user),
                    accessToken: latestTokens.accessToken,
                    refreshToken: latestTokens.refreshToken,
                    isAuthenticated: true,
                    isCheckingAuth: false,
                    authError: null,
                });
            } catch {
                get().logout();
            }
        }
    },
    logout: () => {
        clearStoredAuthTokens();
        set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isCheckingAuth: false,
            authError: null,
        });
    },
}));
