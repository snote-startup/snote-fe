'use client';

import { useState } from 'react';
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
    Clock,
    User,
    Upload,
    Info,
} from 'lucide-react';
import {
    useProject,
    useProjectTranscript,
    useProjectChatMessages,
    useUpdateProject,
} from '@/features/projects/hooks';
import { toast } from 'sonner';

export function MeetingDetail() {
    const router = useRouter();
    const { id } = useParams<{ id: string }>();

    // API Hooks
    const { data: project, isLoading, error } = useProject(id);
    const {
        data: transcript,
        isLoading: isTranscriptLoading,
        error: transcriptError,
    } = useProjectTranscript(id);
    const {
        data: chatMessages,
        isLoading: isChatLoading,
        error: chatError,
    } = useProjectChatMessages(id);
    const updateMutation = useUpdateProject(id);

    // Dialog & Edit States
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editError, setEditError] = useState<string | null>(null);

    // Copy UI feedback
    const [copiedId, setCopiedId] = useState(false);

    if (isLoading) {
        return (
            <div className="mx-auto flex min-h-[50vh] max-w-4xl flex-col items-center justify-center p-8">
                <Loader2 className="text-primary mb-4 h-8 w-8 animate-spin" />
                <p className="text-muted-foreground text-sm">
                    Loading project details...
                </p>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="mx-auto flex min-h-[50vh] max-w-4xl flex-col items-center justify-center p-8 text-center">
                <div className="bg-destructive/10 text-destructive mb-4 flex h-16 w-16 items-center justify-center rounded-full p-4">
                    <AlertCircle className="h-8 w-8" />
                </div>
                <h1 className="text-foreground mb-2 text-2xl font-semibold">
                    Project not found
                </h1>
                <p className="text-muted-foreground mb-6 max-w-md text-sm">
                    {error
                        ? error.message
                        : 'The project you are looking for does not exist or has been removed.'}
                </p>
                <Button onClick={() => router.push('/meetings')}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Projects
                </Button>
            </div>
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

    const formatTimestamp = (seconds: number) => {
        if (seconds === undefined || seconds === null || isNaN(seconds)) {
            return '0.00s';
        }
        return `${seconds.toFixed(2)}s`;
    };

    return (
        <>
            <div className="bg-background text-foreground min-h-screen">
                <div className="mx-auto max-w-6xl p-8">
                    {/* Back Button */}
                    <Button
                        variant="ghost"
                        onClick={() => router.push('/meetings')}
                        className="hover:bg-muted text-muted-foreground hover:text-foreground mb-6"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Projects
                    </Button>

                    {/* Header Card */}
                    <div
                        data-tour="project-detail-header"
                        className="border-border bg-card mb-6 rounded-xl border p-6 shadow-sm"
                    >
                        <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <div className="min-w-0 flex-1">
                                <h1 className="text-foreground mb-3 truncate text-3xl font-semibold tracking-tight">
                                    {project.title}
                                </h1>
                                <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-sm">
                                    <span className="bg-muted inline-flex items-center gap-1 rounded px-2.5 py-0.5 font-mono text-xs select-all">
                                        ID: {project.id}
                                    </span>
                                    <span>•</span>
                                    <span
                                        className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium ${
                                            project.audio_url
                                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                                        }`}
                                    >
                                        {project.audio_url
                                            ? 'Audio uploaded'
                                            : 'Waiting for audio'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleEditOpen}
                                    data-tour="project-edit-button"
                                    className="border-border hover:bg-accent hover:text-accent-foreground"
                                >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Details
                                </Button>
                            </div>
                        </div>

                        <p className="text-muted-foreground border-border/60 mt-4 border-t pt-4 text-sm whitespace-pre-wrap">
                            {project.description || 'No description provided.'}
                        </p>
                    </div>

                    {/* Tabs Workspace */}
                    <Tabs defaultValue="overview" className="space-y-6">
                        <TabsList
                            data-tour="project-tabs"
                            className="bg-muted border-border/40 rounded-lg border p-1"
                        >
                            <TabsTrigger
                                value="overview"
                                data-tour="project-overview-tab"
                                className="data-[state=active]:bg-card data-[state=active]:text-foreground"
                            >
                                <Info className="mr-2 h-4 w-4" />
                                Overview
                            </TabsTrigger>
                            <TabsTrigger
                                value="transcript"
                                data-tour="project-transcript-tab"
                                className="data-[state=active]:bg-card data-[state=active]:text-foreground"
                            >
                                <FileText className="mr-2 h-4 w-4" />
                                Transcript ({transcript?.length ?? 0})
                            </TabsTrigger>
                            <TabsTrigger
                                value="chat"
                                data-tour="project-chat-tab"
                                className="data-[state=active]:bg-card data-[state=active]:text-foreground"
                            >
                                <MessageSquare className="mr-2 h-4 w-4" />
                                AI Chat
                            </TabsTrigger>
                        </TabsList>

                        {/* Overview Tab Content */}
                        <TabsContent value="overview" className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                {/* Details Card */}
                                <div className="border-border bg-card space-y-4 rounded-xl border p-6 shadow-sm md:col-span-2">
                                    <h2 className="text-foreground text-lg font-semibold">
                                        Project Overview
                                    </h2>

                                    <div className="border-border/60 grid grid-cols-3 gap-2 border-b pb-3">
                                        <span className="text-muted-foreground col-span-1 text-sm font-medium">
                                            Project ID
                                        </span>
                                        <div className="text-foreground bg-muted/60 col-span-2 flex items-center gap-2 truncate rounded px-2 py-1 font-mono text-xs select-all">
                                            <span className="truncate">
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

                                    <div className="border-border/60 grid grid-cols-3 gap-2 border-b pb-3">
                                        <span className="text-muted-foreground col-span-1 text-sm font-medium">
                                            Title
                                        </span>
                                        <span className="text-foreground col-span-2 text-sm font-medium">
                                            {project.title}
                                        </span>
                                    </div>

                                    <div className="border-border/60 grid grid-cols-3 gap-2 border-b pb-3">
                                        <span className="text-muted-foreground col-span-1 text-sm font-medium">
                                            Audio Status
                                        </span>
                                        <span className="text-foreground col-span-2 text-sm">
                                            {project.audio_url ? (
                                                <span className="font-medium text-emerald-600 dark:text-emerald-400">
                                                    Uploaded (
                                                    {project.audio_url})
                                                </span>
                                            ) : (
                                                <span className="font-medium text-amber-600 dark:text-amber-400">
                                                    No audio uploaded yet
                                                </span>
                                            )}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 pb-1">
                                        <span className="text-muted-foreground col-span-1 text-sm font-medium">
                                            Description
                                        </span>
                                        <span className="text-muted-foreground col-span-2 text-sm whitespace-pre-wrap">
                                            {project.description || 'N/A'}
                                        </span>
                                    </div>
                                </div>

                                {/* Quick Info & Next Steps */}
                                <div className="space-y-6">
                                    {/* Quick Info Counts */}
                                    <div className="border-border bg-card space-y-3 rounded-xl border p-5 shadow-sm">
                                        <h3 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
                                            Quick Info
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-muted/50 rounded-lg p-4 text-center">
                                                <span className="text-foreground block text-2xl font-bold">
                                                    {transcript?.length ?? 0}
                                                </span>
                                                <span className="text-muted-foreground text-xs">
                                                    Segments
                                                </span>
                                            </div>
                                            <div className="bg-muted/50 rounded-lg p-4 text-center">
                                                <span className="text-foreground block text-2xl font-bold">
                                                    {chatMessages?.data
                                                        ?.length ?? 0}
                                                </span>
                                                <span className="text-muted-foreground text-xs">
                                                    AI Messages
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Upload Trigger (Disabled) */}
                                    <div
                                        data-tour="upload-blocker-card"
                                        className="border-border bg-card space-y-4 rounded-xl border p-5 shadow-sm"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="shrink-0 rounded-lg bg-amber-100 p-2.5 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                                                <FileAudio className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h4 className="text-foreground text-sm font-semibold">
                                                    Upload Audio
                                                </h4>
                                                <p className="text-muted-foreground mt-1 text-xs">
                                                    Transcribe and translate
                                                    your recording using AI
                                                    audio engines.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="border-border/60 border-t pt-3">
                                            <p className="text-muted-foreground bg-muted/70 rounded-md p-2.5 text-xs leading-relaxed">
                                                🔒{' '}
                                                <strong>
                                                    Backend upload status:
                                                </strong>{' '}
                                                No audio uploaded yet. Audio
                                                upload is temporarily
                                                unavailable while backend
                                                processing is being fixed.
                                            </p>
                                        </div>
                                        <Button disabled className="w-full">
                                            <Upload className="mr-2 h-4 w-4" />
                                            Coming soon
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Transcript Tab Content */}
                        <TabsContent value="transcript">
                            <div className="border-border bg-card rounded-xl border p-6 shadow-sm">
                                <div className="mb-4 flex items-center justify-between">
                                    <h2 className="text-foreground text-lg font-semibold">
                                        Full Transcript
                                    </h2>
                                </div>

                                {isTranscriptLoading ? (
                                    <div className="py-12 text-center">
                                        <Loader2 className="text-primary mx-auto mb-3 h-8 w-8 animate-spin" />
                                        <p className="text-muted-foreground text-sm">
                                            Loading transcript segments...
                                        </p>
                                    </div>
                                ) : transcriptError ? (
                                    <div className="border-destructive/20 bg-destructive/5 text-destructive rounded-lg border p-6 text-center">
                                        <AlertCircle className="mx-auto mb-2 h-8 w-8" />
                                        <h3 className="mb-1 text-sm font-semibold">
                                            Failed to load transcript
                                        </h3>
                                        <p className="text-xs opacity-90">
                                            {transcriptError?.message ||
                                                'Server error occurred'}
                                        </p>
                                    </div>
                                ) : !transcript || transcript.length === 0 ? (
                                    <div className="border-border bg-muted/20 rounded-lg border border-dashed py-12 text-center">
                                        <FileText className="text-muted-foreground mx-auto mb-3 h-12 w-12 opacity-60" />
                                        <h3 className="text-foreground mb-1 text-base font-semibold">
                                            No transcript yet
                                        </h3>
                                        <p className="text-muted-foreground mx-auto max-w-md px-4 text-sm leading-relaxed">
                                            Once audio upload is available,
                                            transcript segments will appear here
                                            with speaker and timestamp
                                            information.
                                        </p>
                                    </div>
                                ) : (
                                    <ScrollArea className="h-[450px] pr-4">
                                        <div className="space-y-6">
                                            {transcript.map(
                                                (segment, index) => (
                                                    <div
                                                        key={
                                                            segment.id || index
                                                        }
                                                        className="border-border/60 border-b pb-4 last:border-0"
                                                    >
                                                        <div className="mb-1.5 flex items-center gap-3">
                                                            <span className="text-foreground bg-muted/50 flex items-center gap-1.5 rounded px-2 py-0.5 text-sm font-semibold">
                                                                <User className="text-muted-foreground h-3.5 w-3.5" />
                                                                {segment.speaker ||
                                                                    'Unknown'}
                                                            </span>
                                                            <span className="text-muted-foreground flex items-center gap-1 text-xs">
                                                                <Clock className="h-3 w-3" />
                                                                {formatTimestamp(
                                                                    segment.start,
                                                                )}{' '}
                                                                -{' '}
                                                                {formatTimestamp(
                                                                    segment.end,
                                                                )}
                                                            </span>
                                                        </div>
                                                        <p className="text-foreground pl-2 text-sm leading-relaxed">
                                                            {segment.text}
                                                        </p>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </ScrollArea>
                                )}
                            </div>
                        </TabsContent>

                        {/* AI Chat Tab Content */}
                        <TabsContent value="chat">
                            <div className="border-border bg-card space-y-4 rounded-xl border p-6 shadow-sm">
                                <h2 className="text-foreground text-lg font-semibold">
                                    AI Translation & Meeting Assistant
                                </h2>

                                {isChatLoading ? (
                                    <div className="py-12 text-center">
                                        <Loader2 className="text-primary mx-auto mb-3 h-8 w-8 animate-spin" />
                                        <p className="text-muted-foreground text-sm">
                                            Retrieving chat messages...
                                        </p>
                                    </div>
                                ) : chatError ? (
                                    <div className="border-destructive/20 bg-destructive/5 text-destructive rounded-lg border p-6 text-center">
                                        <AlertCircle className="mx-auto mb-2 h-8 w-8" />
                                        <h3 className="mb-1 text-sm font-semibold">
                                            Failed to load chat history
                                        </h3>
                                        <p className="text-xs opacity-90">
                                            {chatError?.message ||
                                                'Server error occurred'}
                                        </p>
                                    </div>
                                ) : !chatMessages ||
                                  chatMessages.data.length === 0 ? (
                                    <div className="border-border bg-muted/20 rounded-lg border border-dashed py-12 text-center">
                                        <MessageSquare className="text-muted-foreground mx-auto mb-3 h-12 w-12 opacity-60" />
                                        <h3 className="text-foreground mb-1 text-base font-semibold">
                                            No chat messages yet
                                        </h3>
                                        <p className="text-muted-foreground text-sm">
                                            AI analysis output will appear here.
                                        </p>
                                    </div>
                                ) : (
                                    <ScrollArea className="border-border/60 bg-muted/20 h-[350px] rounded-lg border p-4">
                                        <div className="space-y-4">
                                            {chatMessages.data.map((msg) => (
                                                <div
                                                    key={msg.id}
                                                    className={`flex max-w-[85%] flex-col rounded-xl p-4 shadow-sm ${
                                                        msg.role === 'user'
                                                            ? 'bg-primary text-primary-foreground ml-auto rounded-tr-none'
                                                            : 'bg-card border-border text-foreground mr-auto rounded-tl-none border'
                                                    }`}
                                                >
                                                    <span
                                                        className={`mb-1 text-[10px] font-bold tracking-wider uppercase ${
                                                            msg.role === 'user'
                                                                ? 'text-primary-foreground/85'
                                                                : 'text-muted-foreground'
                                                        }`}
                                                    >
                                                        {msg.role === 'user'
                                                            ? 'You'
                                                            : 'AI Assistant'}
                                                    </span>
                                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                                        {msg.content}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                )}

                                <div
                                    data-tour="chat-blocker-card"
                                    className="border-border/80 bg-muted/40 space-y-3 rounded-xl border p-4"
                                >
                                    <div className="text-muted-foreground flex items-start gap-2 text-xs leading-relaxed">
                                        <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                                        <span>
                                            🔒 <strong>AI Chat Status:</strong>{' '}
                                            AI chat is waiting for transcript
                                            processing. When backend streaming
                                            is available, answers may include
                                            references to transcript segments.
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Ask AI about this project..."
                                            disabled
                                            className="bg-muted border-border flex-grow cursor-not-allowed"
                                        />
                                        <Button
                                            disabled
                                            className="cursor-not-allowed"
                                        >
                                            Send
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
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
