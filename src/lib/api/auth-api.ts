import { apiClient } from '@/lib/api/axios-config';
import { parseAccessToken } from '@/lib/api/token-parser';

interface LoginPayload {
    email: string;
    password: string;
}

interface RegisterPayload {
    email: string;
    name: string;
    password: string;
}

export type AuthRole = 'admin' | 'member';

export interface MinimalAccount {
    email: string;
    name: string;
    role: AuthRole;
}

type AuthResponse = unknown;

export async function login(payload: LoginPayload): Promise<string> {
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

    return parseAccessToken(body);
}

export async function register(payload: RegisterPayload): Promise<string> {
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

    return parseAccessToken(body);
}

export async function me(): Promise<MinimalAccount> {
    return apiClient.get<MinimalAccount, MinimalAccount>('/auth/me');
}

export async function refresh(): Promise<string> {
    const body = await apiClient.post<AuthResponse, AuthResponse>(
        '/auth/refresh',
        undefined,
        {
            headers: {
                Accept: 'text/plain, application/json',
            },
            responseType: 'text',
        },
    );

    return parseAccessToken(body);
}
