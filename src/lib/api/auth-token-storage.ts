export interface StoredAuthTokens {
    accessToken: string | null;
    refreshToken: string | null;
}

const ACCESS_TOKEN_KEY = 'snote.access_token';
const REFRESH_TOKEN_KEY = 'snote.refresh_token';

function canUseLocalStorage() {
    return typeof window !== 'undefined' && Boolean(window.localStorage);
}

export function getStoredAuthTokens(): StoredAuthTokens {
    if (!canUseLocalStorage()) {
        return { accessToken: null, refreshToken: null };
    }

    return {
        accessToken: window.localStorage.getItem(ACCESS_TOKEN_KEY),
        refreshToken: window.localStorage.getItem(REFRESH_TOKEN_KEY),
    };
}

export function persistAuthTokens(tokens: {
    accessToken: string;
    refreshToken?: string | null;
}) {
    if (!canUseLocalStorage()) {
        return;
    }

    window.localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);

    if (tokens.refreshToken) {
        window.localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
    }
}

export function clearStoredAuthTokens() {
    if (!canUseLocalStorage()) {
        return;
    }

    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function notifyAuthUnauthorized() {
    if (typeof window === 'undefined') {
        return;
    }

    window.dispatchEvent(new Event('snote-auth-unauthorized'));
}
