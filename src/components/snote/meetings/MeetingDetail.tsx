'use client';

import {
    useState,
    useRef,
    useCallback,
    useEffect,
    useMemo,
    KeyboardEvent,
} from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    ArrowLeft,
    Edit,
    FileText,
    MessageSquare,
    AlertCircle,
    Loader2,
    Copy,
    Check,
    FileAudio,
    Download,
    Clock,
    User,
    UploadCloud,
    Send,
    Info,
    Mic,
    StopCircle,
    Search,
    X,
} from 'lucide-react';
import {
    useProject,
    useProjectTranscript,
    useProjectChatMessages,
    useUpdateProject,
    useUploadProjectAudio,
} from '@/features/projects/hooks';
import { sendProjectChatMessage } from '@/features/projects/api';
import { parseChatResponse } from '@/features/projects/chat-parser';
import { toast } from 'sonner';
import { AppLoadingState } from '@/components/snote/shared/AppLoadingState';
import { AppErrorState } from '@/components/snote/shared/AppErrorState';

// ─── Timestamp formatter ──────────────────────────────────────────────────────

/**
 * Formats a transcript timestamp to MM:SS format.
 * Heuristic: if value > 60000, treat as milliseconds; otherwise treat as seconds.
 */
function formatTimestamp(value: number): string {
    if (value === undefined || value === null || isNaN(value)) return '0:00';
    const totalSeconds =
        value > 60000 ? Math.floor(value / 1000) : Math.floor(value);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// ─── Upload Section ───────────────────────────────────────────────────────────

interface UploadSectionProps {
    projectId: string;
    onUploadSuccess: () => void;
}

function UploadSection({
    projectId,
    onUploadSuccess,
}: UploadSectionProps) {
    const uploadMutation = useUploadProjectAudio(projectId);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (file: File) => {
        if (!file.type.startsWith('audio/')) {
            toast.error('Please select an audio file');
            return;
        }
        setSelectedFile(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFileSelect(file);
    };

    const handleUpload = () => {
        if (!selectedFile) return;
        uploadMutation.mutate(selectedFile, {
            onSuccess: () => {
                toast.success('Audio uploaded. Generating transcript...');
                setSelectedFile(null);
                onUploadSuccess();
            },
            onError: (err) => {
                toast.error(err.message || 'Failed to upload audio');
            },
        });
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <div>
            <div className="mb-3 flex items-center gap-2">
                <FileAudio className="text-muted-foreground h-4 w-4" />
                <div>
                    <p className="text-foreground text-sm font-medium">
                        Upload audio to generate transcript
                    </p>
                    <p className="text-muted-foreground text-xs">
                        The transcript will appear here after processing.
                    </p>
                </div>
            </div>
            {/* Drop zone */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !selectedFile && fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 transition-all duration-150 cursor-pointer
          ${
              isDragging
                  ? 'border-primary/60 bg-primary/5'
                  : selectedFile
                    ? 'border-border bg-muted/30 cursor-default'
                    : 'border-border hover:border-primary/40 hover:bg-muted/20'
          }`}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileSelect(file);
                        e.target.value = '';
                    }}
                />

                {selectedFile ? (
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                            <Mic className="text-primary h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-foreground truncate text-sm font-medium">
                                {selectedFile.name}
                            </p>
                            <p className="text-muted-foreground text-xs">
                                {formatFileSize(selectedFile.size)}
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedFile(null);
                            }}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2 text-center">
                        <div className="bg-muted flex h-12 w-12 items-center justify-center rounded-full">
                            <UploadCloud className="text-muted-foreground h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-foreground text-sm font-medium">
                                Drop audio here or{' '}
                                <span className="text-primary">browse</span>
                            </p>
                            <p className="text-muted-foreground mt-0.5 text-xs">
                                MP3, WAV, M4A, WebM, OGG supported
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Upload button */}
            {selectedFile && (
                <Button
                    className="mt-3 w-full"
                    onClick={handleUpload}
                    disabled={uploadMutation.isPending}
                >
                    {uploadMutation.isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Uploading…
                        </>
                    ) : (
                        <>
                            <UploadCloud className="mr-2 h-4 w-4" />
                            Generate transcript
                        </>
                    )}
                </Button>
            )}
        </div>
    );
}

// ─── Transcript Panel ─────────────────────────────────────────────────────────

interface TranscriptPanelProps {
    projectId: string;
    hasAudioUrl: boolean;
    activeReferences: string[];
    isPolling: boolean;
    onPollingStarted: () => void;
    segmentRefs: React.MutableRefObject<Map<string, HTMLDivElement>>;
}

function TranscriptPanel({
    projectId,
    hasAudioUrl,
    activeReferences,
    isPolling,
    onPollingStarted,
    segmentRefs,
}: TranscriptPanelProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [pollTimeout, setPollTimeout] = useState(false);

    const {
        data: transcript,
        isLoading: isTranscriptLoading,
        error: transcriptError,
        refetch: refetchTranscript,
    } = useProjectTranscript(projectId, {
        refetchInterval: isPolling && !pollTimeout ? 3000 : false,
    });

    // Stop polling after 60 seconds — only ever set to true inside the timer
    useEffect(() => {
        if (!isPolling) return;
        const timer = setTimeout(() => setPollTimeout(true), 60_000);
        return () => clearTimeout(timer);
    }, [isPolling]);

    const hasSegments = transcript && transcript.length > 0;

    const filteredSegments = hasSegments
        ? searchQuery
            ? transcript.filter(
                  (s) =>
                      s.text
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase()) ||
                      s.speaker.toLowerCase().includes(searchQuery.toLowerCase()),
              )
            : transcript
        : [];

    return (
        <div className="flex h-full flex-col">
            {/* Panel Header */}
            <div className="border-border/60 flex shrink-0 items-center justify-between border-b px-4 py-3">
                <div className="flex items-center gap-2">
                    <FileText className="text-muted-foreground h-4 w-4" />
                    <h2 className="text-foreground text-sm font-semibold">
                        Transcript
                        {hasSegments && (
                            <span className="text-muted-foreground ml-1.5 font-normal">
                                ({transcript.length} segments)
                            </span>
                        )}
                    </h2>
                </div>
                {hasSegments && (
                    <div className="relative w-40">
                        <Search className="text-muted-foreground absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2" />
                        <Input
                            placeholder="Search…"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-7 py-1 pl-7 pr-2 text-xs"
                        />
                    </div>
                )}
            </div>

            {/* Panel Body */}
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                {!hasAudioUrl && !isPolling ? (
                    <div className="flex flex-1 items-center justify-center p-4">
                        <div className="w-full max-w-md">
                            <UploadSection
                                projectId={projectId}
                                onUploadSuccess={onPollingStarted}
                            />
                        </div>
                    </div>
                ) : isTranscriptLoading ? (
                    <div className="flex flex-1 flex-col items-center justify-center py-10">
                        <Loader2 className="text-primary mb-3 h-7 w-7 animate-spin" />
                        <p className="text-muted-foreground text-sm">
                            Loading transcript…
                        </p>
                    </div>
                ) : transcriptError ? (
                    <div className="mx-4 flex flex-col items-center rounded-lg border border-red-200 bg-red-50 p-6 text-center dark:border-red-900/40 dark:bg-red-950/20">
                        <AlertCircle className="mb-2 h-8 w-8 text-red-500" />
                        <p className="text-sm font-medium text-red-700 dark:text-red-400">
                            {transcriptError.message || 'Failed to load transcript'}
                        </p>
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-3"
                            onClick={() => refetchTranscript()}
                        >
                            Retry
                        </Button>
                    </div>
                ) : !hasSegments ? (
                    <div className="flex flex-1 flex-col items-center justify-center px-4 py-8 text-center">
                        {isPolling && !pollTimeout ? (
                            <>
                                <Loader2 className="text-primary mb-3 h-8 w-8 animate-spin" />
                                <p className="text-foreground mb-1 text-sm font-medium">
                                    Generating transcript...
                                </p>
                                <p className="text-muted-foreground text-xs">
                                    This may take a moment. Checking every 3
                                    seconds.
                                </p>
                            </>
                        ) : isPolling && pollTimeout ? (
                            <>
                                <FileText className="text-muted-foreground mb-3 h-10 w-10 opacity-50" />
                                <p className="text-foreground mb-1 text-sm font-medium">
                                    Still processing…
                                </p>
                                <p className="text-muted-foreground mb-3 text-xs">
                                    Audio uploaded. Transcript is still
                                    processing. Try refreshing in a moment.
                                </p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => refetchTranscript()}
                                >
                                    Check again
                                </Button>
                            </>
                        ) : (
                            <>
                                <FileText className="text-muted-foreground mb-3 h-10 w-10 opacity-50" />
                                <p className="text-foreground mb-1 text-sm font-medium">
                                    No transcript yet
                                </p>
                                <p className="text-muted-foreground text-xs">
                                    Upload audio to generate a transcript.
                                </p>
                            </>
                        )}
                    </div>
                ) : (
                    <ScrollArea className="flex-1 px-4 pb-4">
                        <div className="space-y-3 pt-1">
                            {filteredSegments.length === 0 ? (
                                <p className="text-muted-foreground py-6 text-center text-sm">
                                    No segments match your search.
                                </p>
                            ) : (
                                filteredSegments.map((segment) => {
                                    const isHighlighted =
                                        activeReferences.includes(segment.id);
                                    return (
                                        <div
                                            key={segment.id}
                                            ref={(el) => {
                                                if (el) {
                                                    segmentRefs.current.set(
                                                        segment.id,
                                                        el,
                                                    );
                                                } else {
                                                    segmentRefs.current.delete(
                                                        segment.id,
                                                    );
                                                }
                                            }}
                                            className={`rounded-lg border p-3 transition-all duration-200 ${
                                                isHighlighted
                                                    ? 'border-violet-400 bg-violet-50 dark:border-violet-600 dark:bg-violet-950/30'
                                                    : 'border-border/50 hover:border-border bg-card'
                                            }`}
                                        >
                                            <div className="mb-1.5 flex items-center gap-2">
                                                <span className="bg-muted inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-xs font-semibold">
                                                    <User className="text-muted-foreground h-3 w-3" />
                                                    {segment.speaker ||
                                                        'Unknown'}
                                                </span>
                                                <span className="text-muted-foreground inline-flex items-center gap-1 text-xs">
                                                    <Clock className="h-3 w-3" />
                                                    {formatTimestamp(
                                                        segment.start,
                                                    )}{' '}
                                                    –{' '}
                                                    {formatTimestamp(
                                                        segment.end,
                                                    )}
                                                </span>
                                                {isHighlighted && (
                                                    <span className="ml-auto rounded-full bg-violet-100 px-1.5 py-0.5 text-[10px] font-semibold text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
                                                        cited
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-foreground pl-1 text-sm leading-relaxed">
                                                {segment.text}
                                            </p>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </ScrollArea>
                )}
            </div>
        </div>
    );
}

// ─── Chat Panel ───────────────────────────────────────────────────────────────

interface DisplayMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    references?: string[];
    isStreaming?: boolean;
}

interface ChatPanelProps {
    projectId: string;
    hasSegments: boolean;
    transcriptSegmentIds: Set<string>;
    onReferenceClick: (segmentId: string) => void;
}

function ChatPanel({
    projectId,
    hasSegments,
    transcriptSegmentIds,
    onReferenceClick,
}: ChatPanelProps) {
    // Live streaming messages (user + streaming assistant) layered on top of history
    const [liveMessages, setLiveMessages] = useState<DisplayMessage[]>([]);
    const [input, setInput] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);
    const [streamError, setStreamError] = useState<string | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const {
        data: chatHistory,
        isLoading: isChatLoading,
        refetch: refetchChat,
    } = useProjectChatMessages(projectId);

    // Derive display messages: history (parsed) + live streaming messages appended
    const historyMessages: DisplayMessage[] = (chatHistory?.data ?? []).map(
        (msg) => {
            if (msg.role === 'assistant') {
                const parsed = parseChatResponse(msg.content);
                return {
                    id: msg.id,
                    role: 'assistant' as const,
                    content: parsed.answer,
                    references: parsed.references,
                };
            }
            return {
                id: msg.id,
                role: msg.role,
                content: msg.content,
            };
        },
    );

    // Merge: hide history items that are already present in liveMessages
    const messages = useMemo(() => {
        const historyUserPrompts = new Set(
            historyMessages.filter((m) => m.role === 'user').map((m) => m.content),
        );

        const filteredLive: DisplayMessage[] = [];
        for (let i = 0; i < liveMessages.length; i++) {
            const msg = liveMessages[i];
            if (msg.role === 'user') {
                if (historyUserPrompts.has(msg.content)) {
                    // Skip this user message and the subsequent assistant message in liveMessages
                    if (
                        i + 1 < liveMessages.length &&
                        liveMessages[i + 1].role === 'assistant'
                    ) {
                        i++; // skip assistant response
                    }
                    continue;
                }
            }
            filteredLive.push(msg);
        }

        return [...historyMessages, ...filteredLive];
    }, [historyMessages, liveMessages]);

    // Clear liveMessages if their prompts have successfully made it to history
    useEffect(() => {
        if (liveMessages.length === 0) return;

        const historyUserPrompts = new Set(
            historyMessages.filter((m) => m.role === 'user').map((m) => m.content),
        );

        const allSaved = liveMessages
            .filter((m) => m.role === 'user')
            .every((m) => historyUserPrompts.has(m.content));

        if (allSaved) {
            const timer = setTimeout(() => {
                setLiveMessages([]);
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [historyMessages, liveMessages]);

    const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
        const container = scrollRef.current;
        if (container) {
            container.scrollTo({
                top: container.scrollHeight,
                behavior,
            });
        }
    }, []);

    // Auto-scroll logic (smart scrolling: only if user is already near bottom or just sent a message)
    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        const threshold = 180; // px from bottom
        const isNearBottom =
            container.scrollHeight - container.scrollTop - container.clientHeight < threshold;

        const lastMessage = messages[messages.length - 1];
        const isUserMsg = lastMessage?.role === 'user';

        if (isNearBottom || isUserMsg) {
            scrollToBottom('smooth');
        }
    }, [messages, scrollToBottom]);

    const handleSend = useCallback(async () => {
        const prompt = input.trim();
        if (!prompt || isStreaming) return;

        setInput('');
        setStreamError(null);

        const userMsg: DisplayMessage = {
            id: `user-${Date.now()}`,
            role: 'user',
            content: prompt,
        };

        const streamingAssistantId = `assistant-${Date.now()}`;
        const streamingMsg: DisplayMessage = {
            id: streamingAssistantId,
            role: 'assistant',
            content: '',
            isStreaming: true,
        };

        setLiveMessages((prev) => [...prev, userMsg, streamingMsg]);
        setIsStreaming(true);

        const controller = new AbortController();
        abortControllerRef.current = controller;

        // Accumulate raw text for live display (before delimiter)
        let rawAccumulated = '';

        try {
            const result = await sendProjectChatMessage(
                projectId,
                prompt,
                {
                    signal: controller.signal,
                    onChunk: (chunk) => {
                        rawAccumulated += chunk;
                        // During streaming: show text before the delimiter only
                        const delimiterIdx = rawAccumulated.indexOf('<<<REFERENCES>>>');
                        const liveDisplay =
                            delimiterIdx !== -1
                                ? rawAccumulated.slice(0, delimiterIdx).trim()
                                : rawAccumulated;

                        setLiveMessages((prev) =>
                            prev.map((m) =>
                                m.id === streamingAssistantId
                                    ? { ...m, content: liveDisplay }
                                    : m,
                            ),
                        );
                    },
                },
            );

            // Replace streaming message with final parsed result
            setLiveMessages((prev) =>
                prev.map((m) =>
                    m.id === streamingAssistantId
                        ? {
                              ...m,
                              content: result.answer,
                              references:
                                  result.references.length > 0
                                      ? result.references
                                      : undefined,
                              isStreaming: false,
                          }
                        : m,
                ),
            );

            // After refetch, history will contain the new message; the useEffect handles clearing liveMessages
            await refetchChat();
        } catch (err: unknown) {
            if (
                err instanceof Error &&
                err.name === 'AbortError'
            ) {
                // User cancelled — finalize current content with Stopped tag
                setLiveMessages((prev) =>
                    prev.map((m) =>
                        m.id === streamingAssistantId
                            ? { ...m, content: m.content ? `${m.content}\n\n[Stopped]` : '[Stopped]', isStreaming: false }
                            : m,
                    ),
                );
            } else {
                const message =
                    err instanceof Error ? err.message : 'Chat failed';
                setStreamError(message);
                toast.error(message);
                setLiveMessages((prev) =>
                    prev.filter((m) => m.id !== streamingAssistantId),
                );
            }
        } finally {
            setIsStreaming(false);
            abortControllerRef.current = null;
        }
    }, [input, isStreaming, projectId, refetchChat]);

    const handleStop = () => {
        abortControllerRef.current?.abort();
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex h-full flex-col">
            {/* Panel Header */}
            <div className="border-border/60 flex shrink-0 items-center justify-between border-b px-4 py-3">
                <div className="flex items-center gap-2">
                    <MessageSquare className="text-muted-foreground h-4 w-4" />
                    <h2 className="text-foreground text-sm font-semibold">
                        AI Chat
                    </h2>
                </div>
                {isChatLoading && (
                    <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
                )}
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 pb-2">
                <div className="space-y-3 pt-3">
                    {messages.length === 0 && !isChatLoading && (
                        <div className="flex flex-col items-center py-8 text-center">
                            <MessageSquare className="text-muted-foreground mb-3 h-10 w-10 opacity-40" />
                            <p className="text-foreground text-sm font-medium">
                                No messages yet
                            </p>
                            <p className="text-muted-foreground mt-1 text-xs">
                                {hasSegments
                                    ? 'Ask anything about this meeting.'
                                    : 'Upload audio and wait for transcript first.'}
                            </p>
                        </div>
                    )}

                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex flex-col ${
                                msg.role === 'user'
                                    ? 'items-end'
                                    : 'items-start'
                            }`}
                        >
                            <span className="text-muted-foreground mb-1 px-1 text-[10px] font-semibold uppercase tracking-wider">
                                {msg.role === 'user' ? 'You' : 'AI Assistant'}
                            </span>
                            <div
                                className={`max-w-[90%] rounded-xl p-3 text-sm leading-relaxed whitespace-pre-wrap ${
                                    msg.role === 'user'
                                        ? 'bg-primary text-primary-foreground rounded-tr-none'
                                        : 'bg-card border-border text-foreground rounded-tl-none border'
                                }`}
                            >
                                {msg.role === 'assistant' && msg.isStreaming && !msg.content ? (
                                    <span className="text-muted-foreground flex items-center gap-1.5 italic">
                                        Thinking
                                        <span className="inline-flex gap-0.5">
                                            <span className="animate-pulse" style={{ animationDelay: '0ms' }}>.</span>
                                            <span className="animate-pulse" style={{ animationDelay: '150ms' }}>.</span>
                                            <span className="animate-pulse" style={{ animationDelay: '300ms' }}>.</span>
                                        </span>
                                    </span>
                                ) : (
                                    msg.content
                                )}
                                {msg.isStreaming && msg.content && (
                                    <span className="text-primary ml-1 inline-block animate-pulse">
                                        ▋
                                    </span>
                                )}
                            </div>

                            {/* References chips */}
                            {msg.role === 'assistant' &&
                                !msg.isStreaming &&
                                msg.references &&
                                msg.references.length > 0 && (
                                    <div className="mt-2 flex max-w-[90%] flex-wrap gap-1.5">
                                        <span className="text-muted-foreground self-center text-xs">
                                            Sources:
                                        </span>
                                        {msg.references.map((ref) => {
                                            const isKnown =
                                                transcriptSegmentIds.size ===
                                                    0 ||
                                                transcriptSegmentIds.has(ref);
                                            return (
                                                <button
                                                    key={ref}
                                                    onClick={() => {
                                                        if (isKnown) {
                                                            onReferenceClick(ref);
                                                        } else {
                                                            toast.info('Reference segment not found in current transcript.');
                                                        }
                                                    }}
                                                    title={
                                                        isKnown
                                                            ? `Jump to segment ${ref}`
                                                            : 'Reference not found in current transcript'
                                                    }
                                                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium transition-colors ${
                                                        isKnown
                                                            ? 'border-violet-300 bg-violet-50 text-violet-700 hover:bg-violet-100 dark:border-violet-700 dark:bg-violet-950/30 dark:text-violet-300 dark:hover:bg-violet-900/40'
                                                            : 'border-dashed border-amber-300 bg-amber-50/50 text-amber-700 hover:bg-amber-100 dark:border-amber-700/50 dark:bg-amber-950/20 dark:text-amber-400'
                                                    }`}
                                                >
                                                    <FileText className="h-3 w-3" />
                                                    {ref.slice(0, 8)}…
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                        </div>
                    ))}

                    {streamError && (
                        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400">
                            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>{streamError}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Input */}
            <div className="border-border/60 shrink-0 border-t px-4 py-3">
                {!hasSegments && (
                    <p className="text-muted-foreground mb-2 flex items-center gap-1.5 text-xs">
                        <Info className="h-3.5 w-3.5" />
                        Upload audio and wait for transcript to enable chat.
                    </p>
                )}
                <div className="flex gap-2">
                    <Textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={
                            hasSegments
                                ? 'Ask about this meeting… (Ctrl+Enter to send)'
                                : 'Upload audio and wait for transcript first.'
                        }
                        disabled={!hasSegments || isStreaming}
                        rows={2}
                        className="flex-1 resize-none text-sm"
                    />
                    {isStreaming ? (
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleStop}
                            className="h-auto self-end border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400"
                        >
                            <StopCircle className="h-4 w-4" />
                        </Button>
                    ) : (
                        <Button
                            size="icon"
                            onClick={handleSend}
                            disabled={!hasSegments || !input.trim()}
                            className="h-auto self-end"
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function MeetingDetail() {
    const router = useRouter();
    const { id } = useParams<{ id: string }>();

    // API Hooks
    const { data: project, isLoading, error } = useProject(id);
    const { data: transcript } = useProjectTranscript(id);
    const updateMutation = useUpdateProject(id);

    // Split workspace state
    const [activeReferences, setActiveReferences] = useState<string[]>([]);
    const [isTranscriptPolling, setIsTranscriptPolling] = useState(false);
    const segmentRefs = useRef<Map<string, HTMLDivElement>>(new Map());

    // Dialog & Edit States
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editError, setEditError] = useState<string | null>(null);

    // Copy UI feedback
    const [copiedId, setCopiedId] = useState(false);

    const hasSegments = !!(transcript && transcript.length > 0);
    const transcriptSegmentIds = new Set(
        (transcript ?? []).map((s) => s.id),
    );

    const handleReferenceClick = useCallback(
        (segmentId: string) => {
            setActiveReferences((prev) =>
                prev.includes(segmentId) ? prev : [...prev, segmentId],
            );
            // Scroll to segment in transcript panel
            setTimeout(() => {
                const el = segmentRefs.current.get(segmentId);
                if (el) {
                    el.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                    });
                } else {
                    toast.info(
                        'Segment not found in current transcript.',
                    );
                }
            }, 50);
        },
        [],
    );

    // Clear highlights after 5 seconds
    useEffect(() => {
        if (activeReferences.length === 0) return;
        const timer = setTimeout(() => setActiveReferences([]), 5000);
        return () => clearTimeout(timer);
    }, [activeReferences]);

    if (isLoading) {
        return <AppLoadingState variant="detail" />;
    }

    if (error || !project) {
        return (
            <AppErrorState
                title={!project ? 'Project not found' : 'Failed to load project'}
                error={error}
                onBack={() => router.push('/meetings')}
                backText="Back to Projects"
            />
        );
    }

    const handleCopyId = () => {
        navigator.clipboard.writeText(project.id);
        setCopiedId(true);
        toast.success('Project ID copied to clipboard');
        setTimeout(() => setCopiedId(false), 2000);
    };

    const handleEditOpen = () => {
        setEditTitle(project.title);
        setEditDescription(project.description || '');
        setEditError(null);
        setIsEditing(true);
    };

    const handleDownloadAudio = () => {
        if (!project.audio_url) return;
        window.open(project.audio_url, '_blank', 'noopener,noreferrer');
    };

    const handleEditSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editTitle.trim()) {
            toast.error('Project title is required');
            return;
        }

        setEditError(null);
        updateMutation.mutate(
            {
                title: editTitle,
                description: editDescription || null,
            },
            {
                onSuccess: () => {
                    setIsEditing(false);
                    toast.success('Project details updated successfully');
                },
                onError: (err) => {
                    setEditError(
                        err.message || 'Failed to update project details',
                    );
                },
            },
        );
    };

    return (
        <>
            <div className="bg-background text-foreground flex min-h-screen flex-col">
                <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col p-4 md:p-6">
                    {/* Back Button */}
                    <Button
                        variant="ghost"
                        onClick={() => router.push('/meetings')}
                        className="hover:bg-muted text-muted-foreground hover:text-foreground mb-4 self-start"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Projects
                    </Button>

                    {/* Header Card */}
                    <div
                        data-tour="project-detail-header"
                        className="border-border bg-card mb-4 rounded-xl border px-5 py-4 shadow-sm"
                    >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="min-w-0 flex-1">
                                <h1 className="text-foreground mb-1 truncate text-xl font-semibold tracking-tight">
                                    {project.title}
                                </h1>
                                <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
                                    <button
                                        onClick={handleCopyId}
                                        className="bg-muted hover:bg-muted/80 inline-flex items-center gap-1.5 rounded px-2 py-0.5 font-mono transition-colors"
                                        title="Click to copy ID"
                                    >
                                        {copiedId ? (
                                            <Check className="h-3 w-3 text-emerald-500" />
                                        ) : (
                                            <Copy className="h-3 w-3" />
                                        )}
                                        {project.id.slice(0, 8)}…
                                    </button>
                                    <span className="text-border">•</span>
                                    <span
                                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                                            project.audio_url
                                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                                        }`}
                                    >
                                        <FileAudio className="h-3 w-3" />
                                        {project.audio_url
                                            ? 'Audio uploaded'
                                            : 'Waiting for audio'}
                                    </span>
                                    {hasSegments && (
                                        <>
                                            <span className="text-border">•</span>
                                            <span className="text-muted-foreground">
                                                {transcript!.length} segments
                                            </span>
                                        </>
                                    )}
                                    {project.description && (
                                        <>
                                            <span className="text-border">•</span>
                                            <span className="hidden truncate sm:inline max-w-[30ch]">
                                                {project.description}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="flex shrink-0 items-center gap-2">
                                {project.audio_url && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleDownloadAudio}
                                        className="shrink-0"
                                    >
                                        <Download className="mr-2 h-3.5 w-3.5" />
                                        Download audio
                                    </Button>
                                )}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleEditOpen}
                                    data-tour="project-edit-button"
                                    className="shrink-0"
                                >
                                    <Edit className="mr-2 h-3.5 w-3.5" />
                                    Edit
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* ── Desktop: Split Workspace ──────────────────────────── */}
                    <div className="hidden flex-1 gap-4 lg:grid lg:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)]">
                        {/* Left: Transcript */}
                        <div
                            data-tour="project-transcript-tab"
                            className="border-border bg-card flex min-h-0 flex-col rounded-xl border shadow-sm"
                            style={{ height: 'calc(100vh - 14rem)' }}
                        >
                            <TranscriptPanel
                                projectId={id}
                                hasAudioUrl={!!project.audio_url}
                                activeReferences={activeReferences}
                                isPolling={isTranscriptPolling}
                                onPollingStarted={() =>
                                    setIsTranscriptPolling(true)
                                }
                                segmentRefs={segmentRefs}
                            />
                        </div>

                        {/* Right: Chat */}
                        <div
                            data-tour="project-chat-tab"
                            className="border-border bg-card flex min-h-0 flex-col rounded-xl border shadow-sm"
                            style={{ height: 'calc(100vh - 14rem)' }}
                        >
                            <ChatPanel
                                projectId={id}
                                hasSegments={hasSegments}
                                transcriptSegmentIds={transcriptSegmentIds}
                                onReferenceClick={handleReferenceClick}
                            />
                        </div>
                    </div>

                    {/* ── Mobile: Tabs ──────────────────────────────────────── */}
                    <div className="flex flex-1 flex-col lg:hidden">
                        <Tabs
                            defaultValue="transcript"
                            className="flex flex-1 flex-col"
                        >
                            <TabsList
                                data-tour="project-tabs"
                                className="bg-muted border-border/40 mb-3 shrink-0 rounded-lg border p-1"
                            >
                                <TabsTrigger
                                    value="overview"
                                    data-tour="project-overview-tab"
                                    className="data-[state=active]:bg-card data-[state=active]:text-foreground flex-1"
                                >
                                    <Info className="mr-1.5 h-3.5 w-3.5" />
                                    Overview
                                </TabsTrigger>
                                <TabsTrigger
                                    value="transcript"
                                    className="data-[state=active]:bg-card data-[state=active]:text-foreground flex-1"
                                >
                                    <FileText className="mr-1.5 h-3.5 w-3.5" />
                                    Transcript
                                </TabsTrigger>
                                <TabsTrigger
                                    value="chat"
                                    data-tour="project-chat-tab"
                                    className="data-[state=active]:bg-card data-[state=active]:text-foreground flex-1"
                                >
                                    <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
                                    Chat
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview" className="mt-0">
                                <div className="border-border bg-card rounded-xl border p-5 shadow-sm">
                                    <h2 className="text-foreground mb-4 text-base font-semibold">
                                        Project Overview
                                    </h2>
                                    <div className="space-y-3">
                                        <div className="border-border/60 flex items-start gap-4 border-b pb-3">
                                            <span className="text-muted-foreground w-28 shrink-0 text-sm">
                                                Project ID
                                            </span>
                                            <div className="bg-muted/60 flex flex-1 items-center gap-2 rounded px-2 py-1 font-mono text-xs">
                                                <span className="min-w-0 flex-1 truncate select-all">
                                                    {project.id}
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={handleCopyId}
                                                    className="hover:bg-accent h-5 w-5 shrink-0"
                                                >
                                                    {copiedId ? (
                                                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                                                    ) : (
                                                        <Copy className="h-3.5 w-3.5" />
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="border-border/60 flex items-start gap-4 border-b pb-3">
                                            <span className="text-muted-foreground w-28 shrink-0 text-sm">
                                                Audio status
                                            </span>
                                            <div className="flex flex-1 flex-wrap items-center gap-2">
                                                {project.audio_url ? (
                                                    <span className="font-medium text-emerald-600 dark:text-emerald-400">
                                                        Uploaded
                                                    </span>
                                                ) : (
                                                    <span className="font-medium text-amber-600 dark:text-amber-400">
                                                        Not uploaded yet
                                                    </span>
                                                )}
                                                {project.audio_url && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={handleDownloadAudio}
                                                        className="h-8"
                                                    >
                                                        <Download className="mr-2 h-3.5 w-3.5" />
                                                        Download audio
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                        <div className="border-border/60 flex items-start gap-4 border-b pb-3">
                                            <span className="text-muted-foreground w-28 shrink-0 text-sm">
                                                Segments
                                            </span>
                                            <span className="text-foreground text-sm font-medium">
                                                {transcript?.length ?? 0}
                                            </span>
                                        </div>
                                        {project.description && (
                                            <div className="flex items-start gap-4">
                                                <span className="text-muted-foreground w-28 shrink-0 text-sm">
                                                    Description
                                                </span>
                                                <span className="text-muted-foreground text-sm whitespace-pre-wrap">
                                                    {project.description}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent
                                value="transcript"
                                className="mt-0 flex-1"
                            >
                                <div
                                    className="border-border bg-card flex flex-col rounded-xl border shadow-sm"
                                    style={{ minHeight: '60vh' }}
                                >
                                    <TranscriptPanel
                                        projectId={id}
                                        hasAudioUrl={!!project.audio_url}
                                        activeReferences={activeReferences}
                                        isPolling={isTranscriptPolling}
                                        onPollingStarted={() =>
                                            setIsTranscriptPolling(true)
                                        }
                                        segmentRefs={segmentRefs}
                                    />
                                </div>
                            </TabsContent>

                            <TabsContent value="chat" className="mt-0 flex-1">
                                <div
                                    className="border-border bg-card flex flex-col rounded-xl border shadow-sm"
                                    style={{ minHeight: '60vh' }}
                                >
                                    <ChatPanel
                                        projectId={id}
                                        hasSegments={hasSegments}
                                        transcriptSegmentIds={transcriptSegmentIds}
                                        onReferenceClick={handleReferenceClick}
                                    />
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>

            {/* Edit Project Dialog */}
            <Dialog
                open={isEditing}
                onOpenChange={(open) => {
                    setIsEditing(open);
                    if (!open) setEditError(null);
                }}
            >
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Project Details</DialogTitle>
                        <DialogDescription>
                            Modify the title and description for this meeting
                            project. Other properties are preserved.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEditSave}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="edit-title"
                                    className="text-foreground"
                                >
                                    Title{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="edit-title"
                                    value={editTitle}
                                    onChange={(e) =>
                                        setEditTitle(e.target.value)
                                    }
                                    required
                                    disabled={updateMutation.isPending}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="edit-description"
                                    className="text-foreground"
                                >
                                    Description
                                </Label>
                                <Textarea
                                    id="edit-description"
                                    value={editDescription}
                                    onChange={(e) =>
                                        setEditDescription(e.target.value)
                                    }
                                    rows={4}
                                    disabled={updateMutation.isPending}
                                />
                            </div>
                            {editError && (
                                <div className="text-destructive bg-destructive/10 flex items-start gap-2 rounded-lg p-3 text-sm">
                                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                                    <span>{editError}</span>
                                </div>
                            )}
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsEditing(false)}
                                disabled={updateMutation.isPending}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={updateMutation.isPending}
                            >
                                {updateMutation.isPending && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
