import WebSocket from 'ws';

const DEFAULT_API_BASE_URL = 'https://snote-api.akagiyuu.dev';

function maskToken(token: string) {
    if (token.length <= 12) {
        return '[redacted]';
    }

    return `${token.slice(0, 6)}...${token.slice(-4)}`;
}

function buildWsUrl(projectId: string) {
    const apiBaseUrl =
        process.env.SNOTE_API_BASE_URL ?? DEFAULT_API_BASE_URL;
    const cleanBaseUrl = apiBaseUrl.endsWith('/')
        ? apiBaseUrl.slice(0, -1)
        : apiBaseUrl;
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

async function main() {
    const accessToken = process.env.SNOTE_ACCESS_TOKEN;
    const projectId = process.env.SNOTE_PROJECT_ID;

    if (!accessToken || !projectId) {
        console.error(
            'Missing SNOTE_ACCESS_TOKEN or SNOTE_PROJECT_ID. Example: SNOTE_ACCESS_TOKEN=... SNOTE_PROJECT_ID=... bun scripts/discover-project-stream-ws.ts',
        );
        process.exitCode = 1;
        return;
    }

    const wsUrl = buildWsUrl(projectId);
    console.log(`WS URL: ${wsUrl}`);
    console.log(`Token: ${maskToken(accessToken)}`);

    await new Promise<void>((resolve) => {
        const ws = new WebSocket(wsUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const timeout = setTimeout(() => {
            console.log('timeout: closing WebSocket discovery after 10s');
            ws.close(1000, 'discovery timeout');
        }, 10_000);

        ws.on('open', () => {
            console.log('open');
            ws.send(Buffer.from([0x1a, 0x45, 0xdf, 0xa3]));
            ws.close(1000, 'discovery complete');
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
        });

        ws.on('close', (code, reason) => {
            clearTimeout(timeout);
            console.log(`close: ${code} ${reason.toString()}`.trim());
            resolve();
        });
    });
}

void main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
});
