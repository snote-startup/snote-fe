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
        throw new Error('Trình duyệt không hỗ trợ media capture.');
    }

    if (!includeTabAudio && !includeMicrophone) {
        throw new Error('Chọn ít nhất tab audio hoặc microphone để ghi âm.');
    }

    const sourceStreams: MediaStream[] = [];
    let audioContext: AudioContext | null = null;

    try {
        if (includeTabAudio) {
            const displayStream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: true,
            });

            if (displayStream.getAudioTracks().length === 0) {
                stopStreamTracks(displayStream);
                throw new Error(
                    'Tab/window được chọn không có audio. Hãy chọn đúng tab và bật share audio.',
                );
            }

            sourceStreams.push(displayStream);
        }

        if (includeMicrophone) {
            const micStream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });
            sourceStreams.push(micStream);
        }

        const AudioContextConstructor =
            window.AudioContext || window.webkitAudioContext;

        if (!AudioContextConstructor) {
            throw new Error('Trình duyệt không hỗ trợ Web Audio API.');
        }

        audioContext = new AudioContextConstructor();
        const destination = audioContext.createMediaStreamDestination();
        const sourceNodes = sourceStreams.map((stream) => {
            const source = audioContext!.createMediaStreamSource(stream);
            source.connect(destination);
            return source;
        });

        if (destination.stream.getAudioTracks().length === 0) {
            throw new Error('Không tạo được mixed audio stream.');
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
