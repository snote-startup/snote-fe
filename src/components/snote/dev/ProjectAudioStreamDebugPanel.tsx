'use client';

import { useRef, useState } from 'react';
import {
    AlertTriangle,
    ChevronDown,
    ExternalLink,
    FileAudio,
    Loader2,
    Mic,
    PlugZap,
    Square,
    UploadCloud,
} from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { projectKeys } from '@/features/projects/hooks';
import { useProjectAudioWebSocketStream } from '@/features/audio-stream/hooks';
import { createProjectAudioStreamClient } from '@/features/audio-stream/project-stream-client';
import { streamAudioFileToProject } from '@/features/audio-stream/test-utils';
import type {
    BrowserStreamAuthMode,
    ProjectAudioStreamStatus,
} from '@/features/audio-stream/types';
import { useI18n } from '@/features/i18n/use-i18n';

interface ProjectAudioStreamDebugPanelProps {
    projectId: string;
}

function formatBytes(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function useStatusLabel() {
    const { t } = useI18n();
    return (status: ProjectAudioStreamStatus) => {
        const key = `stream.status.${status}` as const;
        return t(key as Parameters<typeof t>[0]);
    };
}

/** Detect browser WS auth error patterns */
function isWsAuthError(message: string | null): boolean {
    if (!message) return false;
    const lower = message.toLowerCase();
    return (
        lower.includes('401') ||
        lower.includes('403') ||
        lower.includes('authorization') ||
        lower.includes('not authenticated') ||
        lower.includes('websocket connection failed')
    );
}

export function ProjectAudioStreamDebugPanel({
    projectId,
}: ProjectAudioStreamDebugPanelProps) {
    const queryClient = useQueryClient();
    const { t } = useI18n();
    const statusLabel = useStatusLabel();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState(false);
    const [authMode, setAuthMode] =
        useState<BrowserStreamAuthMode>('cookie');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileStatus, setFileStatus] = useState<ProjectAudioStreamStatus>(
        'idle',
    );
    const [fileBytesSent, setFileBytesSent] = useState(0);
    const [fileChunksSent, setFileChunksSent] = useState(0);
    const [testMessage, setTestMessage] = useState<string | null>(null);
    const [fileAudioUrl, setFileAudioUrl] = useState<string | null>(null);

    const stream = useProjectAudioWebSocketStream(projectId);

    const invalidateProject = async () => {
        await queryClient.invalidateQueries({
            queryKey: projectKeys.detail(projectId),
        });
        await queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    };

    const handleTestConnect = async () => {
        setTestMessage(null);
        setFileStatus('connecting');

        const client = createProjectAudioStreamClient({
            projectId,
            authMode,
            onEvent: (event) => {
                if (event.type === 'message') {
                    setTestMessage(`Server: ${event.data}`);
                }
                if (event.type === 'close') {
                    setTestMessage(
                        `WebSocket closed (${event.code}${
                            event.reason ? `: ${event.reason}` : ''
                        }).`,
                    );
                }
            },
        });

        try {
            await client.connect();
            setFileStatus('connected');
            setTestMessage('WebSocket opened. Closing cleanly.');
            client.close();
            setFileStatus('closed');
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Could not connect to WebSocket.';
            setFileStatus('error');
            setTestMessage(message);
            toast.error(message);
        }
    };

    const handleStreamFile = async () => {
        if (!selectedFile) {
            fileInputRef.current?.click();
            return;
        }

        setFileStatus('connecting');
        setFileBytesSent(0);
        setFileChunksSent(0);
        setFileAudioUrl(null);
        setTestMessage(null);

        try {
            const result = await streamAudioFileToProject({
                projectId,
                file: selectedFile,
                authMode,
                onEvent: (event) => {
                    if (event.type === 'open') setFileStatus('streaming');
                    if (event.type === 'message') {
                        setTestMessage(`Server: ${event.data}`);
                    }
                    if (event.type === 'error') {
                        setTestMessage(event.message);
                    }
                },
                onProgress: ({ bytesSent, chunksSent }) => {
                    setFileBytesSent(bytesSent);
                    setFileChunksSent(chunksSent);
                },
            });

            setFileStatus('closed');
            setFileAudioUrl(result.audioUrl);
            await invalidateProject();

            if (result.audioUrl) {
                toast.success(t('stream.audioSaved'));
            } else {
                toast.warning(t('stream.processing'));
            }
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Could not stream audio file.';
            setFileStatus('error');
            setTestMessage(message);
            toast.error(message);
        }
    };

    const handleStartCapture = async () => {
        await stream.startCapture({
            includeTabAudio: true,
            includeMicrophone: true,
            chunkMs: 1000,
            authMode,
        });
    };

    const handleStopCapture = async () => {
        await stream.stopCapture();
        await invalidateProject();
        if (stream.audioUrlAfterClose) {
            toast.success(t('stream.audioSaved'));
        }
    };

    const activeAudioUrl = stream.audioUrlAfterClose ?? fileAudioUrl;
    const isCaptureActive =
        stream.status === 'streaming' ||
        stream.status === 'capturing' ||
        stream.status === 'connecting';
    const isFileBusy =
        fileStatus === 'connecting' ||
        fileStatus === 'connected' ||
        fileStatus === 'streaming';
    const currentError = stream.error ?? testMessage;
    const showWsAuthWarning = isWsAuthError(currentError);

    return (
        <Collapsible
            open={open}
            onOpenChange={setOpen}
            className="border-border bg-card mb-4 rounded-xl border shadow-sm"
        >
            <CollapsibleTrigger asChild>
                <button className="hover:bg-muted/40 flex w-full items-center justify-between gap-3 rounded-xl px-5 py-3 text-left transition-colors">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="from-violet-500/20 to-indigo-500/20 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br">
                            <FileAudio className="text-primary h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-foreground flex items-center gap-2 text-sm font-semibold">
                                {t('stream.title')}
                                <span className="shrink-0 rounded-full bg-violet-500/15 px-2 py-0.5 text-[10px] font-bold tracking-wider text-violet-400 uppercase">
                                    {t('stream.beta')}
                                </span>
                            </p>
                            <p className="text-muted-foreground text-xs">
                                {t('stream.subtitle')}
                            </p>
                        </div>
                    </div>
                    <ChevronDown
                        className={`text-muted-foreground h-4 w-4 shrink-0 transition-transform ${
                            open ? 'rotate-180' : ''
                        }`}
                    />
                </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
                <div className="border-border/60 grid gap-4 border-t px-5 py-4 md:grid-cols-[minmax(0,1fr)_220px]">
                    <div className="space-y-3">
                        {/* Warning banner */}
                        <div className="flex items-start gap-2 rounded-lg border border-amber-300/30 bg-amber-50/50 px-3 py-2 text-xs text-amber-800 dark:border-amber-700/30 dark:bg-amber-950/20 dark:text-amber-300">
                            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                            <span>{t('stream.warning')}</span>
                        </div>

                        {/* Auth mode + test connect */}
                        <div className="flex flex-wrap items-center gap-2">
                            <Select
                                value={authMode}
                                onValueChange={(value) =>
                                    setAuthMode(value as BrowserStreamAuthMode)
                                }
                            >
                                <SelectTrigger
                                    size="sm"
                                    className="min-w-36"
                                >
                                    <SelectValue placeholder="Auth mode" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cookie">
                                        Cookie/session
                                    </SelectItem>
                                    <SelectItem value="query-token">
                                        Query token
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleTestConnect}
                                disabled={isFileBusy || isCaptureActive}
                            >
                                {fileStatus === 'connecting' ? (
                                    <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                                ) : (
                                    <PlugZap className="mr-2 h-3.5 w-3.5" />
                                )}
                                {t('stream.testConnect')}
                            </Button>
                        </div>

                        {/* File stream */}
                        <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
                            <Input
                                ref={fileInputRef}
                                type="file"
                                accept="audio/webm,.webm"
                                onChange={(event) => {
                                    setSelectedFile(
                                        event.target.files?.[0] ?? null,
                                    );
                                    setFileAudioUrl(null);
                                }}
                            />
                            <Button
                                variant="outline"
                                onClick={handleStreamFile}
                                disabled={isFileBusy || isCaptureActive}
                            >
                                {isFileBusy ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <UploadCloud className="mr-2 h-4 w-4" />
                                )}
                                {t('stream.streamFile')}
                            </Button>
                        </div>

                        {/* Capture buttons */}
                        <div className="flex flex-wrap gap-2">
                            <Button
                                onClick={handleStartCapture}
                                disabled={isCaptureActive || isFileBusy}
                            >
                                {isCaptureActive ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Mic className="mr-2 h-4 w-4" />
                                )}
                                {t('stream.startCapture')}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleStopCapture}
                                disabled={!isCaptureActive}
                                className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400"
                            >
                                <Square className="mr-2 h-3.5 w-3.5" />
                                {t('stream.stopCapture')}
                            </Button>
                        </div>

                        {/* WS auth error — special warning */}
                        {showWsAuthWarning && (
                            <div className="flex items-start gap-2 rounded-lg border border-red-300/30 bg-red-50/50 px-3 py-2 text-xs text-red-700 dark:border-red-800/40 dark:bg-red-950/20 dark:text-red-300">
                                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                                <span>{t('stream.wsError')}</span>
                            </div>
                        )}

                        {/* General status / error messages */}
                        {currentError && !showWsAuthWarning && (
                            <p className="text-muted-foreground text-xs">
                                {currentError}
                            </p>
                        )}

                        {(stream.status === 'stopping' ||
                            fileStatus === 'streaming') && (
                            <p className="text-muted-foreground text-xs">
                                {t('stream.processing')}
                            </p>
                        )}

                        {activeAudioUrl && (
                            <div className="flex flex-wrap items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-300">
                                <span className="font-medium">
                                    {t('stream.audioSaved')}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7 bg-transparent"
                                    onClick={() =>
                                        window.open(
                                            activeAudioUrl,
                                            '_blank',
                                            'noopener,noreferrer',
                                        )
                                    }
                                >
                                    <ExternalLink className="mr-1 h-3 w-3" />
                                    {t('stream.openAudio')}
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Status sidebar */}
                    <div className="bg-muted/40 grid content-start gap-2 rounded-lg p-3 text-xs">
                        <div className="flex justify-between gap-2">
                            <span className="text-muted-foreground">
                                Capture
                            </span>
                            <span className="text-foreground font-medium">
                                {statusLabel(stream.status)}
                            </span>
                        </div>
                        <div className="flex justify-between gap-2">
                            <span className="text-muted-foreground">File</span>
                            <span className="text-foreground font-medium">
                                {statusLabel(fileStatus)}
                            </span>
                        </div>
                        <div className="flex justify-between gap-2">
                            <span className="text-muted-foreground">
                                Chunks
                            </span>
                            <span className="font-mono">
                                {stream.chunksSent || fileChunksSent}
                            </span>
                        </div>
                        <div className="flex justify-between gap-2">
                            <span className="text-muted-foreground">
                                Bytes
                            </span>
                            <span className="font-mono">
                                {formatBytes(
                                    stream.bytesSent || fileBytesSent,
                                )}
                            </span>
                        </div>
                        {stream.serverMessages.length > 0 && (
                            <div className="border-border mt-1 border-t pt-2">
                                <p className="text-muted-foreground mb-1">
                                    Server messages
                                </p>
                                <p className="line-clamp-3 font-mono break-all">
                                    {stream.serverMessages.at(-1)}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
}
