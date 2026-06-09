export interface StoredAuthTokens {
    accessToken: string | null;
}

const ACCESS_TOKEN_KEY = 'snote.access_token';
// Legacy key from the earlier bearer-refresh prototype. Backend now stores the
// refresh token in an HttpOnly cookie, but logout still clears old sessions.
const REFRESH_TOKEN_KEY = 'snote.refresh_token';

function canUseLocalStorage() {
    return typeof window !== 'undefined' && Boolean(window.localStorage);
}

export function getStoredAuthTokens(): StoredAuthTokens {
    if (!canUseLocalStorage()) {
        return { accessToken: null };
    }

    return {
        accessToken: window.localStorage.getItem(ACCESS_TOKEN_KEY),
    };
}

export function persistAccessToken(accessToken: string) {
    if (!canUseLocalStorage()) {
        return;
    }

    window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
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
