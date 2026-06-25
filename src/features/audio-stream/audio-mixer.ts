import type { AudioCaptureOptions, MixedAudioCapture } from './types';

export const PREFERRED_AUDIO_MIME_TYPE = 'audio/webm;codecs=opus';
export const FALLBACK_AUDIO_MIME_TYPE = 'audio/webm';

export function getSupportedWebmMimeType() {
    if (typeof MediaRecorder === 'undefined') {
        return FALLBACK_AUDIO_MIME_TYPE;
    }

    if (MediaRecorder.isTypeSupported(PREFERRED_AUDIO_MIME_TYPE)) {
        return PREFERRED_AUDIO_MIME_TYPE;
    }

    if (MediaRecorder.isTypeSupported(FALLBACK_AUDIO_MIME_TYPE)) {
        return FALLBACK_AUDIO_MIME_TYPE;
    }

    return '';
}

function stopStreamTracks(stream?: MediaStream | null) {
    stream?.getTracks().forEach((track) => track.stop());
}

export function stopMixedAudioCapture(capture?: MixedAudioCapture | null) {
    capture?.stop();
}

export async function createMixedAudioCapture({
    includeTabAudio,
    includeMicrophone,
}: AudioCaptureOptions): Promise<MixedAudioCapture> {
    if (typeof window === 'undefined' || !navigator.mediaDevices) {
        throw new Error('stream.errorGeneric');
    }

    if (!includeTabAudio && !includeMicrophone) {
        throw new Error('stream.errorGeneric');
    }

    const sourceStreams: MediaStream[] = [];
    let audioContext: AudioContext | null = null;

    try {
        if (includeTabAudio) {
            let displayStream: MediaStream;

            try {
                displayStream = await navigator.mediaDevices.getDisplayMedia({
                    video: true,
                    audio: true,
                });
            } catch (error) {
                if (
                    error instanceof DOMException &&
                    (error.name === 'NotAllowedError' ||
                        error.name === 'AbortError')
                ) {
                    throw new Error('stream.errorScreenCancelled');
                }
                throw error;
            }

            if (displayStream.getAudioTracks().length === 0) {
                stopStreamTracks(displayStream);
                throw new Error('stream.errorNoTabAudio');
            }

            sourceStreams.push(displayStream);
        }

        if (includeMicrophone) {
            let micStream: MediaStream;

            try {
                micStream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                });
            } catch (error) {
                if (
                    error instanceof DOMException &&
                    error.name === 'NotAllowedError'
                ) {
                    throw new Error('stream.errorMicDenied');
                }
                throw error;
            }
            sourceStreams.push(micStream);
        }

        const AudioContextConstructor =
            window.AudioContext || window.webkitAudioContext;

        if (!AudioContextConstructor) {
            throw new Error('stream.errorGeneric');
        }

        audioContext = new AudioContextConstructor();
        const destination = audioContext.createMediaStreamDestination();
        const sourceNodes = sourceStreams.map((stream) => {
            const source = audioContext!.createMediaStreamSource(stream);
            source.connect(destination);
            return source;
        });

        if (destination.stream.getAudioTracks().length === 0) {
            throw new Error('stream.errorGeneric');
        }

        return {
            stream: destination.stream,
            audioContext,
            sourceStreams,
            stop: () => {
                sourceNodes.forEach((source) => source.disconnect());
                stopStreamTracks(destination.stream);
                sourceStreams.forEach(stopStreamTracks);
                void audioContext?.close().catch(() => undefined);
            },
        };
    } catch (error) {
        sourceStreams.forEach(stopStreamTracks);
        if (audioContext) {
            void audioContext.close().catch(() => undefined);
        }
        throw error;
    }
}

declare global {
    interface Window {
        webkitAudioContext?: typeof AudioContext;
    }
}
