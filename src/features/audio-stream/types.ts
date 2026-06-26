export type ProjectAudioStreamStatus =
    | 'idle'
    | 'connecting'
    | 'connected'
    | 'capturing'
    | 'streaming'
    | 'stopping'
    | 'closed'
    | 'error';

export type ProjectAudioStreamEvent =
    | { type: 'open' }
    | { type: 'chunk-sent'; bytes: number }
    | { type: 'message'; data: string }
    | { type: 'close'; code: number; reason: string }
    | { type: 'error'; message: string };

export interface CreateProjectAudioStreamClientOptions {
    projectId: string;
    apiBaseUrl?: string;
    onEvent?: (event: ProjectAudioStreamEvent) => void;
}

export interface ProjectAudioStreamClient {
    readonly url: string;
    readonly isOpen: boolean;
    connect: () => Promise<void>;
    sendAudioChunk: (chunk: ArrayBuffer | Blob) => Promise<number>;
    close: (code?: number, reason?: string) => void;
}

export interface AudioCaptureOptions {
    includeTabAudio: boolean;
    includeMicrophone: boolean;
    onDiagnosticsUpdate?: (
        diagnostics: Partial<AudioStreamDiagnostics>,
    ) => void;
}

export interface MixedAudioCapture {
    stream: MediaStream;
    audioContext: AudioContext;
    sourceStreams: MediaStream[];
    stop: () => void;
}

export type StartCaptureOptions = {
    includeTabAudio: boolean;
    includeMicrophone: boolean;
    chunkMs?: number;
};

export type AudioCaptureMode = 'microphone' | 'meeting-tab';

export interface AudioStreamDiagnostics {
    browserUserAgent: string;
    captureMode: AudioCaptureMode;
    displayAudioTrackCount: number | null;
    displayVideoTrackCount: number | null;
    audioTrackLabels: string[];
    audioTrackSettings: MediaTrackSettings[];
    videoTrackSettings: MediaTrackSettings[];
    microphoneIncluded: boolean;
    mediaRecorderMimeSelected: string | null;
    wsOpened: boolean;
    chunkCount: number;
    totalBytes: number;
    stopReason: string | null;
    audioUrlPollResult: string | null;
}

export interface StreamAudioFileOptions {
    projectId: string;
    file: File | Blob;
    chunkSize?: number;
    pollIntervalMs?: number;
    pollTimeoutMs?: number;
    onEvent?: (event: ProjectAudioStreamEvent) => void;
    onProgress?: (progress: {
        bytesSent: number;
        chunksSent: number;
        totalBytes?: number;
    }) => void;
}

export interface StreamAudioFileResult {
    bytesSent: number;
    chunksSent: number;
    audioUrl: string | null;
}
