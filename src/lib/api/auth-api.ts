import { apiClient } from '@/lib/api/axios-config';
import { parseAuthTokens, type ParsedAuthTokens } from '@/lib/api/token-parser';
import type { User } from '@/stores/use-auth-store';

interface LoginPayload {
    email: string;
    password: string;
}

interface RegisterPayload {
    email: string;
    name: string;
    password: string;
}

type AuthResponse = unknown;

export async function login(payload: LoginPayload): Promise<ParsedAuthTokens> {
    const body = await apiClient.post<AuthResponse, AuthResponse>(
        '/auth/login',
        payload,
        {
            headers: {
                Accept: 'text/plain, application/json',
            },
            responseType: 'text',
        },
    );

    return parseAuthTokens(body);
}

export async function register(
    payload: RegisterPayload,
): Promise<ParsedAuthTokens> {
    const body = await apiClient.post<AuthResponse, AuthResponse>(
        '/auth/register',
        payload,
        {
            headers: {
                Accept: 'text/plain, application/json',
            },
            responseType: 'text',
        },
    );

    return parseAuthTokens(body);
}

export async function me(): Promise<User> {
    return apiClient.get<User, User>('/auth/me');
}

export async function refresh(
    refreshTokenOrAccessToken: string,
): Promise<ParsedAuthTokens> {
    const body = await apiClient.post<AuthResponse, AuthResponse>(
        '/auth/refresh',
        undefined,
        {
            headers: {
                Accept: 'text/plain, application/json',
                Authorization: `Bearer ${refreshTokenOrAccessToken}`,
            },
            responseType: 'text',
        },
    );

    return parseAuthTokens(body);
}
