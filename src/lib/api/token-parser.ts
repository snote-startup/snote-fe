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

function readTokenShape(body: unknown): string | null {
    if (!isRecord(body)) {
        return null;
    }

    const accessToken =
        readString(body.accessToken) ??
        readString(body.access_token) ??
        readString(body.token) ??
        readString(body.jwt);

    if (accessToken) {
        return accessToken;
    }

    if (isRecord(body.data)) {
        return readTokenShape(body.data);
    }

    return null;
}

export function parseAccessToken(body: unknown): string {
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

        return raw;
    }

    const parsedTokens = readTokenShape(body);
    if (parsedTokens) {
        return parsedTokens;
    }

    throw new Error('Auth response did not include a supported token shape.');
}
