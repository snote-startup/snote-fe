import axios, {
    AxiosError,
    AxiosInstance,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from 'axios';
import { getApiUrl } from './api-url';
import {
    clearStoredAuthTokens,
    getStoredAuthTokens,
    notifyAuthUnauthorized,
    persistAccessToken,
} from '@/lib/api/auth-token-storage';
import { parseAccessToken } from '@/lib/api/token-parser';
const apiUrl = getApiUrl();

export class ApiError extends Error {
    status?: number;
    constructor(message: string, status?: number) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

export const apiClient: AxiosInstance = axios.create({
    baseURL: apiUrl,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

let refreshAccessTokenPromise: Promise<string> | null = null;

function normalizeUrl(url?: string) {
    if (!url) {
        return '';
    }

    try {
        return new URL(url, apiUrl).pathname;
    } catch {
        return url;
    }
}

function isAuthEndpoint(url?: string) {
    const pathname = normalizeUrl(url);
    return (
        pathname === '/auth/login' ||
        pathname === '/auth/register' ||
        pathname === '/auth/refresh'
    );
}

function getErrorMessage(error: AxiosError) {
    const errorData = error.response?.data;

    if (typeof errorData === 'string' && errorData.trim() !== '') {
        return errorData;
    }

    if (errorData && typeof errorData === 'object' && 'message' in errorData) {
        return String((errorData as Record<string, unknown>).message);
    }

    if (errorData && typeof errorData === 'object' && 'detail' in errorData) {
        const detail = (errorData as Record<string, unknown>).detail;
        if (typeof detail === 'string' && detail.trim() !== '') {
            return detail;
        }
    }

    return error.message || 'Internal Server Error';
}

apiClient.interceptors.request.use((config) => {
    const { accessToken } = getStoredAuthTokens();

    if (
        accessToken &&
        !config.headers.Authorization &&
        !isAuthEndpoint(config.url)
    ) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
});

async function refreshAccessToken() {
    if (!refreshAccessTokenPromise) {
        refreshAccessTokenPromise = axios
            .post<unknown>(`${apiUrl}/auth/refresh`, undefined, {
                headers: {
                    Accept: 'text/plain, application/json',
                },
                responseType: 'text',
                withCredentials: true,
            })
            .then((response) => {
                const accessToken = parseAccessToken(response.data);
                persistAccessToken(accessToken);
                return accessToken;
            })
            .finally(() => {
                refreshAccessTokenPromise = null;
            });
    }

    return refreshAccessTokenPromise;
}

apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        return response.data;
    },
    async (error: AxiosError) => {
        const status = error.response?.status;
        const originalRequest = error.config as
            | RetryableRequestConfig
            | undefined;

        if (
            status === 401 &&
            originalRequest &&
            !originalRequest._retry &&
            !isAuthEndpoint(originalRequest.url)
        ) {
            originalRequest._retry = true;

            try {
                const accessToken = await refreshAccessToken();
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                return apiClient(originalRequest);
            } catch {
                clearStoredAuthTokens();
                notifyAuthUnauthorized();
            }
        }

        return Promise.reject(new ApiError(getErrorMessage(error), status));
    },
);
