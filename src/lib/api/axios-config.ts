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
    persistAuthTokens,
} from '@/lib/api/auth-token-storage';
import { parseAuthTokens } from '@/lib/api/token-parser';
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

function getErrorMessage(error: AxiosError) {
    const errorData = error.response?.data;

    if (typeof errorData === 'string' && errorData.trim() !== '') {
        return errorData;
    }

    if (errorData && typeof errorData === 'object' && 'message' in errorData) {
        return String((errorData as Record<string, unknown>).message);
    }

    return error.message || 'Internal Server Error';
}

apiClient.interceptors.request.use((config) => {
    const { accessToken } = getStoredAuthTokens();

    if (accessToken && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
});

apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        return response.data;
    },
    async (error: AxiosError) => {
        const status = error.response?.status;
        const originalRequest = error.config as
            | RetryableRequestConfig
            | undefined;

        if (status === 401 && originalRequest && !originalRequest._retry) {
            const { accessToken, refreshToken } = getStoredAuthTokens();
            const tokenForRefresh = refreshToken ?? accessToken;

            if (tokenForRefresh) {
                originalRequest._retry = true;

                try {
                    const refreshResponse = await axios.post(
                        `${apiUrl}/auth/refresh`,
                        undefined,
                        {
                            headers: {
                                Accept: 'text/plain, application/json',
                                Authorization: `Bearer ${tokenForRefresh}`,
                            },
                            responseType: 'text',
                            withCredentials: true,
                        },
                    );
                    const tokens = parseAuthTokens(refreshResponse.data);
                    persistAuthTokens(tokens);
                    originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;

                    return apiClient(originalRequest);
                } catch {
                    clearStoredAuthTokens();
                    notifyAuthUnauthorized();
                }
            } else {
                clearStoredAuthTokens();
                notifyAuthUnauthorized();
            }
        }

        return Promise.reject(new ApiError(getErrorMessage(error), status));
    },
);
