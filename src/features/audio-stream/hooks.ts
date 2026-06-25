'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { projectKeys } from '@/features/projects/hooks';
import {
    createMixedAudioCapture,
    getSupportedWebmMimeType,
    stopMixedAudioCapture,
} from './audio-mixer';
import { createProjectAudioStreamClient } from './project-stream-client';
import {
    PROJECT_AUDIO_URL_POLL_TIMEOUT_MS,
    pollProjectAudioUrl,
} from './test-utils';
import type {
    BrowserStreamAuthMode,
    MixedAudioCapture,
    ProjectAudioStreamClient,
    ProjectAudioStreamStatus,
    StartCaptureOptions,
} from './types';

const DEFAULT_CHUNK_MS = 1000;

function toErrorMessage(error: unknown) {
    if (error instanceof Error && error.message.trim() !== '') {
        return error.message;
    }

    return 'Không thể ghi âm qua WebSocket.';
}

export function useProjectAudioWebSocketStream(projectId: string) {
    const queryClient = useQueryClient();
    const clientRef = useRef<ProjectAudioStreamClient | null>(null);
    const recorderRef = useRef<MediaRecorder | null>(null);
    const captureRef = useRef<MixedAudioCapture | null>(null);
    const pendingSendsRef = useRef<Promise<unknown>[]>([]);
    const isStoppingRef = useRef(false);

    const [status, setStatus] = useState<ProjectAudioStreamStatus>('idle');
    const [error, setError] = useState<string | null>(null);
    const [bytesSent, setBytesSent] = useState(0);
    const [chunksSent, setChunksSent] = useState(0);
    const [serverMessages, setServerMessages] = useState<string[]>([]);
    const [startedAt, setStartedAt] = useState<Date | null>(null);
    const [endedAt, setEndedAt] = useState<Date | null>(null);
    const [audioUrlAfterClose, setAudioUrlAfterClose] = useState<string | null>(
        null,
    );

    const cleanupCapture = useCallback(() => {
        stopMixedAudioCapture(captureRef.current);
        captureRef.current = null;
    }, []);

    const closeClient = useCallback(() => {
        clientRef.current?.close();
        clientRef.current = null;
    }, []);

    const reset = useCallback(() => {
        if (recorderRef.current?.state === 'recording') {
            recorderRef.current.stop();
        }
        recorderRef.current = null;
        pendingSendsRef.current = [];
        cleanupCapture();
        closeClient();
        isStoppingRef.current = false;

        setStatus('idle');
        setError(null);
        setBytesSent(0);
        setChunksSent(0);
        setServerMessages([]);
        setStartedAt(null);
        setEndedAt(null);
        setAudioUrlAfterClose(null);
    }, [cleanupCapture, closeClient]);

    const pollAudioUrlAfterClose = useCallback(async () => {
        const audioUrl = await pollProjectAudioUrl(projectId, {
            intervalMs: 2000,
            timeoutMs: PROJECT_AUDIO_URL_POLL_TIMEOUT_MS,
        });

        setAudioUrlAfterClose(audioUrl);
        await queryClient.invalidateQueries({
            queryKey: projectKeys.detail(projectId),
        });
        await queryClient.invalidateQueries({ queryKey: projectKeys.lists() });

        if (!audioUrl) {
            setError(
                'Backend đang xử lý audio, quá trình này có thể mất khoảng 1 phút. audio_url chưa xuất hiện trong thời gian chờ.',
            );
        }

        return audioUrl;
    }, [projectId, queryClient]);

    const stopCapture = useCallback(async () => {
        if (isStoppingRef.current) {
            return;
        }

        isStoppingRef.current = true;
        setStatus('stopping');
        setEndedAt(new Date());

        const recorder = recorderRef.current;

        if (!recorder || recorder.state === 'inactive') {
            cleanupCapture();
            closeClient();
            setStatus('closed');
            await pollAudioUrlAfterClose();
            isStoppingRef.current = false;
            return;
        }

        await new Promise<void>((resolve) => {
            const previousStop = recorder.onstop;
            recorder.onstop = (event) => {
                previousStop?.call(recorder, event);
                resolve();
            };
            recorder.stop();
        });

        await Promise.allSettled(pendingSendsRef.current);
        pendingSendsRef.current = [];
        cleanupCapture();
        closeClient();
        setStatus('closed');
        await pollAudioUrlAfterClose();
        isStoppingRef.current = false;
    }, [cleanupCapture, closeClient, pollAudioUrlAfterClose]);

    const startCapture = useCallback(
        async ({
            includeTabAudio,
            includeMicrophone,
            chunkMs = DEFAULT_CHUNK_MS,
            authMode = 'cookie',
        }: StartCaptureOptions) => {
            if (!projectId) {
                setError('Thiếu projectId để ghi âm.');
                setStatus('error');
                return;
            }

            if (status === 'streaming' || status === 'capturing') {
                return;
            }

            if (typeof MediaRecorder === 'undefined') {
                setError('Trình duyệt không hỗ trợ MediaRecorder.');
                setStatus('error');
                return;
            }

            const mimeType = getSupportedWebmMimeType();
            if (!mimeType) {
                setError('Trình duyệt không hỗ trợ ghi âm audio/webm.');
                setStatus('error');
                return;
            }

            reset();
            setStatus('connecting');
            setError(null);
            setStartedAt(new Date());

            const authModeForClient: BrowserStreamAuthMode = authMode;
            const client = createProjectAudioStreamClient({
                projectId,
                authMode: authModeForClient,
                onEvent: (event) => {
                    if (event.type === 'message') {
                        setServerMessages((prev) => [...prev, event.data]);
                    }
                    if (event.type === 'error') {
                        setError(event.message);
                    }
                },
            });

            clientRef.current = client;

            try {
                await client.connect();
                setStatus('connected');
                setStatus('capturing');

                const capture = await createMixedAudioCapture({
                    includeTabAudio,
                    includeMicrophone,
                });
                captureRef.current = capture;

                const recorder = new MediaRecorder(capture.stream, {
                    mimeType,
                });
                recorderRef.current = recorder;

                recorder.ondataavailable = (event) => {
                    if (!event.data || event.data.size === 0) {
                        return;
                    }

                    const sendPromise = client
                        .sendAudioChunk(event.data)
                        .then((bytes) => {
                            setBytesSent((prev) => prev + bytes);
                            setChunksSent((prev) => prev + 1);
                        })
                        .catch((sendError: unknown) => {
                            setError(toErrorMessage(sendError));
                            setStatus('error');
                        });

                    pendingSendsRef.current.push(sendPromise);
                };

                recorder.onerror = () => {
                    setError('MediaRecorder gặp lỗi khi ghi âm.');
                    setStatus('error');
                };

                recorder.start(chunkMs);
                setStatus('streaming');
            } catch (startError) {
                setError(toErrorMessage(startError));
                setStatus('error');
                cleanupCapture();
                closeClient();
                setEndedAt(new Date());
            }
        },
        [cleanupCapture, closeClient, projectId, reset, status],
    );

    useEffect(() => {
        return () => {
            if (recorderRef.current?.state === 'recording') {
                recorderRef.current.stop();
            }
            cleanupCapture();
            closeClient();
        };
    }, [cleanupCapture, closeClient]);

    return {
        status,
        error,
        bytesSent,
        chunksSent,
        serverMessages,
        startedAt,
        endedAt,
        audioUrlAfterClose,
        startCapture,
        stopCapture,
        reset,
    };
}
