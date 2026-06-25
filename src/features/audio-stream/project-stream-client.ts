import { getApiUrl } from '@/lib/api/api-url';
import { getStoredAuthTokens } from '@/lib/api/auth-token-storage';
import type {
    BrowserStreamAuthMode,
    CreateProjectAudioStreamClientOptions,
    ProjectAudioStreamClient,
    ProjectAudioStreamEvent,
} from './types';

function normalizeBaseUrl(baseUrl: string) {
    return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
}

export function buildProjectAudioStreamUrl({
    projectId,
    apiBaseUrl = getApiUrl(),
    authMode = 'cookie',
    accessToken,
}: {
    projectId: string;
    apiBaseUrl?: string;
    authMode?: BrowserStreamAuthMode;
    accessToken?: string | null;
}) {
    const cleanBaseUrl = normalizeBaseUrl(apiBaseUrl);
    const url = new URL(
        `${cleanBaseUrl}/project/${encodeURIComponent(projectId)}/stream`,
    );

    if (url.protocol === 'https:') {
        url.protocol = 'wss:';
    } else if (url.protocol === 'http:') {
        url.protocol = 'ws:';
    }

    if (authMode === 'query-token') {
        if (!accessToken) {
            throw new Error(
                'Không có access token để thử WebSocket query token.',
            );
        }
        url.searchParams.set('token', accessToken);
    }

    return url.toString();
}

function eventErrorMessage(event: Event) {
    if (event instanceof ErrorEvent && event.message) {
        return event.message;
    }
    return 'WebSocket audio stream gặp lỗi.';
}

export function createProjectAudioStreamClient({
    projectId,
    apiBaseUrl,
    authMode = 'cookie',
    accessToken = getStoredAuthTokens().accessToken,
    onEvent,
}: CreateProjectAudioStreamClientOptions): ProjectAudioStreamClient {
    if (!projectId) {
        throw new Error('Thiếu projectId cho audio stream.');
    }

    const url = buildProjectAudioStreamUrl({
        projectId,
        apiBaseUrl,
        authMode,
        accessToken,
    });

    let ws: WebSocket | null = null;

    const emit = (event: ProjectAudioStreamEvent) => {
        onEvent?.(event);
    };

    return {
        get url() {
            return url;
        },
        get isOpen() {
            return ws?.readyState === WebSocket.OPEN;
        },
        connect() {
            if (typeof WebSocket === 'undefined') {
                return Promise.reject(
                    new Error('Trình duyệt không hỗ trợ WebSocket.'),
                );
            }

            if (ws?.readyState === WebSocket.OPEN) {
                return Promise.resolve();
            }

            return new Promise<void>((resolve, reject) => {
                ws = new WebSocket(url);
                ws.binaryType = 'arraybuffer';
                let opened = false;
                let settled = false;

                ws.onopen = () => {
                    opened = true;
                    settled = true;
                    emit({ type: 'open' });
                    resolve();
                };

                ws.onmessage = (event) => {
                    const data =
                        typeof event.data === 'string'
                            ? event.data
                            : '[binary message]';
                    emit({ type: 'message', data });
                };

                ws.onerror = (event) => {
                    const message = eventErrorMessage(event);
                    emit({ type: 'error', message });
                    if (!settled && ws?.readyState !== WebSocket.OPEN) {
                        settled = true;
                        reject(new Error(message));
                    }
                };

                ws.onclose = (event) => {
                    emit({
                        type: 'close',
                        code: event.code,
                        reason: event.reason,
                    });
                    if (!opened && !settled) {
                        settled = true;
                        reject(
                            new Error(
                                `WebSocket đóng trước khi sẵn sàng (${event.code}).`,
                            ),
                        );
                    }
                };
            });
        },
        async sendAudioChunk(chunk) {
            if (!ws || ws.readyState !== WebSocket.OPEN) {
                throw new Error('WebSocket audio stream chưa mở.');
            }

            const payload =
                chunk instanceof Blob ? await chunk.arrayBuffer() : chunk;

            ws.send(payload);
            emit({ type: 'chunk-sent', bytes: payload.byteLength });
            return payload.byteLength;
        },
        close(code = 1000, reason = 'client stopped audio stream') {
            if (!ws) {
                return;
            }

            if (
                ws.readyState === WebSocket.OPEN ||
                ws.readyState === WebSocket.CONNECTING
            ) {
                ws.close(code, reason);
            }
        },
    };
}
