export interface ParsedAuthTokens {
    accessToken: string;
    refreshToken?: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
}

function readString(value: unknown) {
    return typeof value === 'string' && value.trim() !== ''
        ? value.trim()
        : undefined;
}

function parseJsonString(value: string): unknown {
    try {
        return JSON.parse(value);
    } catch {
        return undefined;
    }
}

function readTokenShape(body: unknown): ParsedAuthTokens | null {
    if (!isRecord(body)) {
        return null;
    }

    const accessToken =
        readString(body.accessToken) ??
        readString(body.access_token) ??
        readString(body.token) ??
        readString(body.jwt);
    const refreshToken =
        readString(body.refreshToken) ?? readString(body.refresh_token);

    if (accessToken) {
        return { accessToken, refreshToken };
    }

    if (isRecord(body.data)) {
        return readTokenShape(body.data);
    }

    return null;
}

export function parseAuthTokens(body: unknown): ParsedAuthTokens {
    if (typeof body === 'string') {
        const raw = body.trim();
        if (raw === '') {
            throw new Error('Auth response did not include a token.');
        }

        const parsedJson = parseJsonString(raw);
        if (parsedJson !== undefined) {
            const parsedTokens = readTokenShape(parsedJson);
            if (parsedTokens) {
                return parsedTokens;
            }
        }

        return { accessToken: raw };
    }

    const parsedTokens = readTokenShape(body);
    if (parsedTokens) {
        return parsedTokens;
    }

    throw new Error('Auth response did not include a supported token shape.');
}
