import { createReadStream, statSync } from 'node:fs';
import WebSocket from 'ws';

const DEFAULT_API_BASE_URL = 'https://snote-api.akagiyuu.dev';
const CHUNK_SIZE = 64 * 1024;
const POLL_INTERVAL_MS = 2000;
const POLL_TIMEOUT_MS = 90_000;

function maskToken(token: string) {
    if (token.length <= 12) {
        return '[redacted]';
    }

    return `${token.slice(0, 6)}...${token.slice(-4)}`;
}

function buildUrls(projectId: string) {
    const apiBaseUrl = process.env.SNOTE_API_BASE_URL ?? DEFAULT_API_BASE_URL;
    const cleanBaseUrl = apiBaseUrl.endsWith('/')
        ? apiBaseUrl.slice(0, -1)
        : apiBaseUrl;
    const httpUrl = `${cleanBaseUrl}/project/${encodeURIComponent(projectId)}`;
    const wsUrl = new URL(`${httpUrl}/stream`);

    if (wsUrl.protocol === 'https:') {
        wsUrl.protocol = 'wss:';
    } else if (wsUrl.protocol === 'http:') {
        wsUrl.protocol = 'ws:';
    }

    return { httpUrl, wsUrl: wsUrl.toString() };
}

async function pollProjectAudioUrl(httpUrl: string, accessToken: string) {
    const startedAt = Date.now();
    let lastStatus = 0;

    while (Date.now() - startedAt <= POLL_TIMEOUT_MS) {
        const response = await fetch(httpUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                accept: 'application/json',
            },
        });
        lastStatus = response.status;

        if (response.ok) {
            const data = (await response.json()) as {
                audio_url?: string | null;
            };
            if (data.audio_url) {
                return { audioUrl: data.audio_url, lastStatus };
            }
        }

        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
    }

    return { audioUrl: null, lastStatus };
}

function shortUrl(url: string) {
    try {
        const parsed = new URL(url);
        return `${parsed.origin}${parsed.pathname}`;
    } catch {
        return url;
    }
}

async function streamFile({
    accessToken,
    projectId,
    filePath,
}: {
    accessToken: string;
    projectId: string;
    filePath: string;
}) {
    const { httpUrl, wsUrl } = buildUrls(projectId);
    const fileSize = statSync(filePath).size;
    let bytesSent = 0;
    let chunksSent = 0;
    let closeCode: number | null = null;
    let closeReason = '';

    console.log(`WS URL: ${wsUrl}`);
    console.log(`Token: ${maskToken(accessToken)}`);
    console.log(`WEBM_FILE: ${filePath}`);
    console.log(`file_size=${fileSize}`);
    await new Promise<void>((resolve, reject) => {
        const isDirectStream = process.env.SNOTE_STREAM_NO_AUTH === 'true';
        const headers: Record<string, string> = {};
        if (!isDirectStream) {
            headers.Authorization = `Bearer ${accessToken}`;
            console.log('Connecting with authorization header...');
        } else {
            console.log('Connecting directly...');
        }

        const ws = new WebSocket(wsUrl, { headers });

        let streamStarted = false;
        let settled = false;

        function settle(error?: Error) {
            if (settled) return;
            settled = true;
            if (error) reject(error);
            else resolve();
        }

        ws.on('open', () => {
            console.log('open');
            streamStarted = true;

            const stream = createReadStream(filePath, {
                highWaterMark: CHUNK_SIZE,
            });

            stream.on('data', (chunk) => {
                stream.pause();
                ws.send(chunk, (error) => {
                    if (error) {
                        stream.destroy(error);
                        return;
                    }

                    bytesSent += chunk.length;
                    chunksSent += 1;
                    stream.resume();
                });
            });

            stream.on('error', (error) => {
                console.log(`file_error: ${error.message}`);
                ws.close(1011, 'file read error');
                settle(error);
            });

            stream.on('end', () => {
                console.log(`bytes_sent=${bytesSent}`);
                console.log(`chunks_sent=${chunksSent}`);
                ws.close(1000, 'file streaming complete');
            });
        });

        ws.on('message', (data) => {
            const message =
                typeof data === 'string'
                    ? data
                    : Buffer.isBuffer(data)
                      ? data.toString('utf8')
                      : '[binary message]';
            console.log(`message: ${message}`);
        });

        ws.on('error', (error) => {
            console.log(`error: ${error.message}`);
            if (!streamStarted) {
                settle(error);
            }
        });

        ws.on('close', (code, reason) => {
            closeCode = code;
            closeReason = reason.toString();
            console.log(
                `close: ${code}${closeReason ? ` ${closeReason}` : ''}`,
            );
            settle();
        });
    });

    const { audioUrl, lastStatus } = await pollProjectAudioUrl(
        httpUrl,
        accessToken,
    );

    console.log(`project_poll_last_status=${lastStatus}`);
    console.log(`audio_url_after=${audioUrl ? shortUrl(audioUrl) : 'null'}`);

    if (audioUrl) {
        try {
            const headResponse = await fetch(audioUrl, { method: 'HEAD' });
            console.log(`audio_head_status=${headResponse.status}`);
        } catch (error) {
            const message =
                error instanceof Error ? error.message : 'unknown HEAD error';
            console.log(`audio_head_error=${message}`);
        }
    }

    return {
        bytesSent,
        chunksSent,
        closeCode,
        closeReason,
        audioUrl,
    };
}

async function main() {
    const accessToken = process.env.SNOTE_ACCESS_TOKEN;
    const projectId = process.env.SNOTE_PROJECT_ID;
    const filePath = process.env.WEBM_FILE;

    if (!accessToken || !projectId || !filePath) {
        console.error(
            'Missing SNOTE_ACCESS_TOKEN, SNOTE_PROJECT_ID, or WEBM_FILE.',
        );
        process.exitCode = 1;
        return;
    }

    await streamFile({ accessToken, projectId, filePath });
}

void main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
});
