'use client';

import { useRef, useState } from 'react';
import {
    AlertTriangle,
    ChevronDown,
    ExternalLink,
    FileAudio,
    Loader2,
    Mic,
    MonitorUp,
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
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

import { projectKeys } from '@/features/projects/hooks';
import { useProjectAudioWebSocketStream } from '@/features/audio-stream/hooks';
import { streamAudioFileToProject } from '@/features/audio-stream/test-utils';
import type { ProjectAudioStreamStatus } from '@/features/audio-stream/types';
import { useI18n } from '@/features/i18n/use-i18n';

interface ProjectAudioStreamDebugPanelProps {
    projectId: string;
}

function useStatusLabel() {
    const { t } = useI18n();
    return (status: ProjectAudioStreamStatus) => {
        const key = `stream.status.${status}` as const;
        return t(key as Parameters<typeof t>[0]);
    };
}

function getFriendlyStreamError(
    error: string | null,
    t: ReturnType<typeof useI18n>['t'],
) {
    switch (error) {
        case 'stream.errorScreenCancelled':
        case 'stream.errorNoTabAudio':
        case 'stream.errorMicDenied':
        case 'stream.errorGeneric':
            return t(error);
        default:
            return t('stream.errorGeneric');
    }
}

export function ProjectAudioStreamDebugPanel({
    projectId,
}: ProjectAudioStreamDebugPanelProps) {
    const queryClient = useQueryClient();
    const { t } = useI18n();
    const statusLabel = useStatusLabel();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState(true);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileStatus, setFileStatus] =
        useState<ProjectAudioStreamStatus>('idle');
    const [fileError, setFileError] = useState<string | null>(null);
    const [fileAudioUrl, setFileAudioUrl] = useState<string | null>(null);
    const [includeMicrophoneWithTab, setIncludeMicrophoneWithTab] =
        useState(false);

    const stream = useProjectAudioWebSocketStream(projectId);

    const invalidateProject = async () => {
        await queryClient.invalidateQueries({
            queryKey: projectKeys.detail(projectId),
        });
        await queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    };

    const handleStreamFile = async () => {
        if (!selectedFile) {
            fileInputRef.current?.click();
            return;
        }

        setFileStatus('connecting');
        setFileAudioUrl(null);
        setFileError(null);

        try {
            const result = await streamAudioFileToProject({
                projectId,
                file: selectedFile,
                onEvent: (event) => {
                    if (event.type === 'open') setFileStatus('streaming');
                    if (event.type === 'error') {
                        setFileError(event.message);
                    }
                },
            });

            setFileStatus('closed');
            setFileAudioUrl(result.audioUrl);
            setSelectedFile(null);
            await invalidateProject();

            if (result.audioUrl) {
                toast.success(t('stream.audioSaved'));
            } else {
                toast.warning(t('stream.processing'));
            }
        } catch (error) {
            setFileStatus('error');
            setFileError(
                error instanceof Error ? error.message : 'stream.errorGeneric',
            );
            toast.error(t('stream.errorGeneric'));
        }
    };

    const handleStartTabCapture = async () => {
        await stream.startCapture({
            includeTabAudio: true,
            includeMicrophone: includeMicrophoneWithTab,
            chunkMs: 1000,
        });
    };

    const handleStartMicrophoneCapture = async () => {
        await stream.startCapture({
            includeTabAudio: false,
            includeMicrophone: true,
            chunkMs: 1000,
        });
    };

    const handleStopCapture = async () => {
        await stream.stopCapture();
        await invalidateProject();
    };

    const activeAudioUrl = stream.audioUrlAfterClose ?? fileAudioUrl;
    const isCaptureActive =
        stream.status === 'streaming' ||
        stream.status === 'capturing' ||
        stream.status === 'connecting' ||
        stream.status === 'connected' ||
        stream.status === 'stopping';
    const isFileBusy =
        fileStatus === 'connecting' ||
        fileStatus === 'connected' ||
        fileStatus === 'streaming';
    const hasError = stream.status === 'error' || fileStatus === 'error';
    const errorMessage = getFriendlyStreamError(stream.error ?? fileError, t);

    return (
        <Collapsible
            open={open}
            onOpenChange={setOpen}
            className="border-border bg-card mb-4 rounded-xl border shadow-sm"
        >
            <CollapsibleTrigger asChild>
                <button className="hover:bg-muted/40 flex w-full items-center justify-between gap-3 rounded-xl px-5 py-3 text-left transition-colors">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="bg-primary/10 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
                            <FileAudio className="text-primary h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-foreground text-sm font-semibold">
                                {t('stream.title')}
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
                <div className="border-border/60 space-y-4 border-t px-5 py-4">
                    <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
                        <div>
                            <p className="text-foreground text-sm font-medium">
                                {isCaptureActive
                                    ? statusLabel(stream.status)
                                    : t('stream.ready')}
                            </p>
                            <p className="text-muted-foreground text-xs">
                                {t('stream.readyDesc')}
                            </p>
                            <p className="text-muted-foreground mt-1 text-xs">
                                {t('stream.tabAudioTip')}
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <Input
                                ref={fileInputRef}
                                type="file"
                                accept="audio/*,.webm"
                                className="hidden"
                                onChange={(event) => {
                                    setSelectedFile(
                                        event.target.files?.[0] ?? null,
                                    );
                                    setFileAudioUrl(null);
                                    setFileError(null);
                                }}
                            />
                            <Button
                                onClick={handleStartMicrophoneCapture}
                                disabled={isCaptureActive || isFileBusy}
                            >
                                {isCaptureActive ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Mic className="mr-2 h-4 w-4" />
                                )}
                                {t('stream.recordMicrophone')}
                            </Button>
                            <Button
                                onClick={handleStartTabCapture}
                                disabled={isCaptureActive || isFileBusy}
                                variant="outline"
                            >
                                {isCaptureActive ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <MonitorUp className="mr-2 h-4 w-4" />
                                )}
                                {t('stream.recordMeetingTab')}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleStopCapture}
                                disabled={
                                    stream.status !== 'streaming' &&
                                    stream.status !== 'capturing' &&
                                    stream.status !== 'connected'
                                }
                                className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400"
                            >
                                <Square className="mr-2 h-3.5 w-3.5" />
                                {t('stream.stopCapture')}
                            </Button>
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
                    </div>

                    <div className="flex items-center gap-2">
                        <Switch
                            id="include-microphone-with-tab"
                            checked={includeMicrophoneWithTab}
                            onCheckedChange={setIncludeMicrophoneWithTab}
                            disabled={isCaptureActive || isFileBusy}
                        />
                        <Label
                            htmlFor="include-microphone-with-tab"
                            className="text-muted-foreground text-xs"
                        >
                            {t('stream.includeMicrophone')}
                        </Label>
                    </div>

                    {selectedFile && !isFileBusy && (
                        <div className="bg-muted/40 flex flex-wrap items-center justify-between gap-2 rounded-lg px-3 py-2">
                            <p className="text-foreground min-w-0 truncate text-sm font-medium">
                                {selectedFile.name}
                            </p>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleStreamFile}
                            >
                                <UploadCloud className="mr-2 h-3.5 w-3.5" />
                                {t('stream.streamFile')}
                            </Button>
                        </div>
                    )}

                    {hasError && (
                        <div className="flex items-start gap-2 rounded-lg border border-red-300/30 bg-red-50/50 px-3 py-2 text-sm text-red-700 dark:border-red-800/40 dark:bg-red-950/20 dark:text-red-300">
                            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    {(stream.status === 'stopping' || isFileBusy) && (
                        <p className="text-muted-foreground flex items-center gap-2 text-sm">
                            <Loader2 className="h-4 w-4 animate-spin" />
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

                    {process.env.NODE_ENV === 'development' &&
                        stream.diagnostics && (
                            <details className="rounded-lg border border-dashed p-3 text-xs">
                                <summary className="cursor-pointer font-medium">
                                    {t('stream.devDiagnostics')}
                                </summary>
                                <pre className="mt-3 max-h-72 overflow-auto break-words whitespace-pre-wrap">
                                    {JSON.stringify(
                                        stream.diagnostics,
                                        null,
                                        2,
                                    )}
                                </pre>
                            </details>
                        )}
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
}
