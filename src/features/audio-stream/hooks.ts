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
    AudioCaptureMode,
    AudioStreamDiagnostics,
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

    return 'stream.errorGeneric';
}

function createInitialDiagnostics({
    captureMode,
    includeMicrophone,
    mimeType,
}: {
    captureMode: AudioCaptureMode;
    includeMicrophone: boolean;
    mimeType: string;
}): AudioStreamDiagnostics {
    return {
        browserUserAgent:
            typeof navigator === 'undefined' ? '' : navigator.userAgent,
        captureMode,
        displayAudioTrackCount: null,
        displayVideoTrackCount: null,
        audioTrackLabels: [],
        audioTrackSettings: [],
        videoTrackSettings: [],
        microphoneIncluded: includeMicrophone,
        mediaRecorderMimeSelected: mimeType,
        wsOpened: false,
        chunkCount: 0,
        totalBytes: 0,
        stopReason: null,
        audioUrlPollResult: null,
    };
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
    const [diagnostics, setDiagnostics] =
        useState<AudioStreamDiagnostics | null>(null);

    const updateDiagnostics = useCallback(
        (patch: Partial<AudioStreamDiagnostics>) => {
            setDiagnostics((current) =>
                current ? { ...current, ...patch } : current,
            );
        },
        [],
    );

    const cleanupCapture = useCallback(() => {
        stopMixedAudioCapture(captureRef.current);
        captureRef.current = null;
    }, []);

    const closeClient = useCallback(() => {
        clientRef.current?.close();
        clientRef.current = null;
    }, []);

    const cleanupAfterRecorderError = useCallback(
        (stopReason = 'recorder error') => {
            if (recorderRef.current?.state === 'recording') {
                recorderRef.current.stop();
            }
            recorderRef.current = null;
            pendingSendsRef.current = [];
            cleanupCapture();
            closeClient();
            updateDiagnostics({ stopReason });
            setEndedAt(new Date());
        },
        [cleanupCapture, closeClient, updateDiagnostics],
    );

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
        setDiagnostics(null);
    }, [cleanupCapture, closeClient]);

    const pollAudioUrlAfterClose = useCallback(async () => {
        updateDiagnostics({ audioUrlPollResult: 'pending' });
        const audioUrl = await pollProjectAudioUrl(projectId, {
            intervalMs: 2000,
            timeoutMs: PROJECT_AUDIO_URL_POLL_TIMEOUT_MS,
        });

        setAudioUrlAfterClose(audioUrl);
        updateDiagnostics({
            audioUrlPollResult: audioUrl ? 'found' : 'timeout',
        });
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
    }, [projectId, queryClient, updateDiagnostics]);

    const stopCapture = useCallback(async () => {
        if (isStoppingRef.current) {
            return;
        }

        isStoppingRef.current = true;
        setStatus('stopping');
        setEndedAt(new Date());
        updateDiagnostics({ stopReason: 'user stopped recording' });

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
    }, [
        cleanupCapture,
        closeClient,
        pollAudioUrlAfterClose,
        updateDiagnostics,
    ]);

    const startCapture = useCallback(
        async ({
            includeTabAudio,
            includeMicrophone,
            chunkMs = DEFAULT_CHUNK_MS,
        }: StartCaptureOptions) => {
            if (!projectId) {
                setError('stream.errorGeneric');
                setStatus('error');
                return;
            }

            if (
                status === 'streaming' ||
                status === 'capturing' ||
                status === 'connecting'
            ) {
                return;
            }

            if (typeof MediaRecorder === 'undefined') {
                setError('stream.errorGeneric');
                setStatus('error');
                return;
            }

            const mimeType = getSupportedWebmMimeType();
            if (!mimeType) {
                setError('stream.errorGeneric');
                setStatus('error');
                return;
            }

            reset();
            const captureMode: AudioCaptureMode = includeTabAudio
                ? 'meeting-tab'
                : 'microphone';
            setDiagnostics(
                createInitialDiagnostics({
                    captureMode,
                    includeMicrophone,
                    mimeType,
                }),
            );
            setStatus('capturing');
            setError(null);
            setStartedAt(new Date());

            try {
                const capture = await createMixedAudioCapture({
                    includeTabAudio,
                    includeMicrophone,
                    onDiagnosticsUpdate: updateDiagnostics,
                });
                captureRef.current = capture;

                setStatus('connecting');
                const client = createProjectAudioStreamClient({
                    projectId,
                    onEvent: (event) => {
                        if (event.type === 'message') {
                            setServerMessages((prev) => [...prev, event.data]);
                        }
                        if (event.type === 'open') {
                            updateDiagnostics({ wsOpened: true });
                        }
                        if (event.type === 'error') {
                            setError(event.message);
                            updateDiagnostics({ stopReason: event.message });
                        }
                    },
                });

                clientRef.current = client;
                await client.connect();
                setStatus('connected');

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
                            setDiagnostics((current) =>
                                current
                                    ? {
                                          ...current,
                                          chunkCount: current.chunkCount + 1,
                                          totalBytes:
                                              current.totalBytes + bytes,
                                      }
                                    : current,
                            );
                        })
                        .catch((sendError: unknown) => {
                            setError(toErrorMessage(sendError));
                            setStatus('error');
                            updateDiagnostics({
                                stopReason: toErrorMessage(sendError),
                            });
                            cleanupAfterRecorderError(
                                toErrorMessage(sendError),
                            );
                        });

                    pendingSendsRef.current.push(sendPromise);
                };

                recorder.onerror = () => {
                    setError('stream.errorGeneric');
                    setStatus('error');
                    updateDiagnostics({ stopReason: 'recorder error' });
                    cleanupAfterRecorderError('recorder error');
                };

                recorder.start(chunkMs);
                setStatus('streaming');
            } catch (startError) {
                setError(toErrorMessage(startError));
                setStatus('error');
                updateDiagnostics({ stopReason: toErrorMessage(startError) });
                cleanupAfterRecorderError(toErrorMessage(startError));
            }
        },
        [
            cleanupAfterRecorderError,
            projectId,
            reset,
            status,
            updateDiagnostics,
        ],
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
        diagnostics,
        startCapture,
        stopCapture,
        reset,
    };
}
