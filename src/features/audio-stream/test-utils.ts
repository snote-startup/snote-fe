import { getProject } from '@/features/projects/api';
import { createProjectAudioStreamClient } from './project-stream-client';
import type { StreamAudioFileOptions, StreamAudioFileResult } from './types';

const DEFAULT_CHUNK_SIZE = 64 * 1024;
const DEFAULT_POLL_INTERVAL_MS = 2000;
export const PROJECT_AUDIO_URL_POLL_TIMEOUT_MS = 90_000;
const DEFAULT_POLL_TIMEOUT_MS = PROJECT_AUDIO_URL_POLL_TIMEOUT_MS;
type StreamAudioFileControlOptions = Omit<
    StreamAudioFileOptions,
    'projectId' | 'file'
>;

function wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function pollProjectAudioUrl(
    projectId: string,
    {
        intervalMs = DEFAULT_POLL_INTERVAL_MS,
        timeoutMs = DEFAULT_POLL_TIMEOUT_MS,
    }: { intervalMs?: number; timeoutMs?: number } = {},
) {
    const startedAt = Date.now();

    while (Date.now() - startedAt <= timeoutMs) {
        const project = await getProject(projectId);
        if (project.audio_url) {
            return project.audio_url;
        }
        await wait(intervalMs);
    }

    return null;
}

function blobSize(file: File | Blob) {
    return typeof file.size === 'number' ? file.size : undefined;
}

export function streamAudioFileToProject(
    projectId: string,
    file: File | Blob,
    options?: StreamAudioFileControlOptions,
): Promise<StreamAudioFileResult>;
export function streamAudioFileToProject(
    options: StreamAudioFileOptions,
): Promise<StreamAudioFileResult>;
export async function streamAudioFileToProject(
    projectIdOrOptions: string | StreamAudioFileOptions,
    fileArg?: File | Blob,
    optionsArg?: StreamAudioFileControlOptions,
): Promise<StreamAudioFileResult> {
    const options =
        typeof projectIdOrOptions === 'string'
            ? {
                  ...optionsArg,
                  projectId: projectIdOrOptions,
                  file: fileArg,
              }
            : projectIdOrOptions;

    const {
        projectId,
        file,
        chunkSize = DEFAULT_CHUNK_SIZE,
        pollIntervalMs = DEFAULT_POLL_INTERVAL_MS,
        pollTimeoutMs = DEFAULT_POLL_TIMEOUT_MS,
        onEvent,
        onProgress,
    } = options;

    if (!projectId) {
        throw new Error('stream.errorGeneric');
    }

    if (!file) {
        throw new Error('stream.errorGeneric');
    }

    if (!file.type.includes('webm') && file.type !== '') {
        throw new Error('stream.errorGeneric');
    }

    const client = createProjectAudioStreamClient({
        projectId,
        onEvent,
    });

    let bytesSent = 0;
    let chunksSent = 0;

    try {
        await client.connect();

        for (let offset = 0; offset < file.size; offset += chunkSize) {
            const chunk = file.slice(offset, offset + chunkSize);
            const sent = await client.sendAudioChunk(chunk);
            bytesSent += sent;
            chunksSent += 1;
            onProgress?.({
                bytesSent,
                chunksSent,
                totalBytes: blobSize(file),
            });
        }
    } finally {
        client.close();
    }

    const audioUrl = await pollProjectAudioUrl(projectId, {
        intervalMs: pollIntervalMs,
        timeoutMs: pollTimeoutMs,
    });

    return {
        bytesSent,
        chunksSent,
        audioUrl,
    };
}
