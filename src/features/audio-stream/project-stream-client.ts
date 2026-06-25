import { getApiUrl } from '@/lib/api/api-url';
import type {
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
}: {
    projectId: string;
    apiBaseUrl?: string;
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

    return url.toString();
}

function eventErrorMessage(event: Event) {
    if (event instanceof ErrorEvent && event.message) {
        return event.message;
    }
    return 'stream.errorGeneric';
}

export function createProjectAudioStreamClient({
    projectId,
    apiBaseUrl,
    onEvent,
}: CreateProjectAudioStreamClientOptions): ProjectAudioStreamClient {
    if (!projectId) {
        throw new Error('stream.errorGeneric');
    }

    const url = buildProjectAudioStreamUrl({
        projectId,
        apiBaseUrl,
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
                return Promise.reject(new Error('stream.errorGeneric'));
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
                            new Error(event.reason || 'stream.errorGeneric'),
                        );
                    }
                };
            });
        },
        async sendAudioChunk(chunk) {
            if (!ws || ws.readyState !== WebSocket.OPEN) {
                throw new Error('stream.errorGeneric');
            }

            const payload =
                chunk instanceof Blob ? await chunk.arrayBuffer() : chunk;

            ws.send(payload);
            emit({ type: 'chunk-sent', bytes: payload.byteLength });
            return payload.byteLength;
        },
        close(code = 1000, reason = 'recording stopped') {
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
