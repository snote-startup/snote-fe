'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Search,
    FolderOpen,
    Mic,
    Plus,
    Loader2,
    AlertCircle,
    FileAudio,
    ArrowRight,
} from 'lucide-react';
import { useProjects, useCreateProject } from '@/features/projects/hooks';
import { toast } from 'sonner';

function SkeletonCard() {
    return (
        <div className="border-border bg-card animate-pulse space-y-4 rounded-xl border p-6">
            <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                    <div className="bg-muted h-5 w-1/3 rounded" />
                    <div className="bg-muted h-4 w-1/4 rounded" />
                    <div className="bg-muted h-4 w-3/4 rounded" />
                </div>
                <div className="bg-muted h-6 w-16 rounded" />
            </div>
        </div>
    );
}

export function MeetingsList() {
    const router = useRouter();
    const { data: projects, isLoading, error, refetch } = useProjects();
    const createMutation = useCreateProject();

    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [createError, setCreateError] = useState<string | null>(null);

    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim()) {
            toast.error('Project title is required');
            return;
        }

        setCreateError(null);
        createMutation.mutate(
            {
                title: newTitle,
                description: newDescription || null,
            },
            {
                onSuccess: (projectId) => {
                    setIsCreateOpen(false);
                    setNewTitle('');
                    setNewDescription('');
                    toast.success('Project created successfully');
                    router.push(`/meetings/${projectId}`);
                },
                onError: (err) => {
                    setCreateError(err.message || 'Failed to create project');
                },
            },
        );
    };

    // Filter projects client-side by title or description
    const filteredProjects = (projects || []).filter((project) => {
        const titleMatch = project.title
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        const descMatch = (project.description || '')
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        return titleMatch || descMatch;
    });

    return (
        <div className="mx-auto max-w-7xl p-8">
            {/* Header */}
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div data-tour="projects-header">
                    <h1 className="text-foreground mb-2 text-3xl font-semibold">
                        Meeting Projects
                    </h1>
                    <p className="text-muted-foreground">
                        Each project represents one meeting or translation
                        session.
                    </p>
                </div>
                <Button
                    data-tour="create-project-button"
                    onClick={() => setIsCreateOpen(true)}
                    className="self-start sm:w-auto"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Create project
                </Button>
            </div>

            {/* Filters / Actions */}
            <div
                data-tour="project-search"
                className="border-border bg-card mb-6 rounded-xl border p-4"
            >
                <div className="relative">
                    <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                    <Input
                        placeholder="Search projects by title or description..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10"
                    />
                </div>
            </div>

            {/* Content States */}
            {isLoading ? (
                <div className="space-y-3">
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
            ) : error ? (
                <div className="border-destructive/20 bg-destructive/5 text-destructive rounded-xl border p-8 text-center">
                    <AlertCircle className="mx-auto mb-3 h-12 w-12" />
                    <h2 className="mb-2 text-lg font-semibold">
                        Failed to load projects
                    </h2>
                    <p className="mb-4 text-sm opacity-90">
                        {error?.message || 'An error occurred'}
                    </p>
                    <Button
                        variant="outline"
                        onClick={() => refetch()}
                        className="border-destructive/30 hover:bg-destructive/10 text-destructive-foreground"
                    >
                        Retry Loading
                    </Button>
                </div>
            ) : filteredProjects.length === 0 ? (
                <div className="border-border bg-card rounded-xl border p-12 text-center">
                    <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                        {searchQuery ? (
                            <FolderOpen className="text-muted-foreground h-8 w-8" />
                        ) : (
                            <Mic className="text-muted-foreground h-8 w-8" />
                        )}
                    </div>
                    <h2 className="text-foreground mb-2 text-xl font-semibold">
                        {searchQuery
                            ? 'No matching projects'
                            : 'No projects yet'}
                    </h2>
                    <p className="text-muted-foreground mb-6">
                        {searchQuery
                            ? 'Try adjusting your search query'
                            : 'Create a meeting project to upload audio and review transcripts.'}
                    </p>
                    {!searchQuery && (
                        <Button onClick={() => setIsCreateOpen(true)}>
                            Create project
                        </Button>
                    )}
                </div>
            ) : (
                <div data-tour="project-list" className="space-y-3">
                    {filteredProjects.map((project, index) => (
                        <div
                            key={project.id}
                            onClick={() =>
                                router.push(`/meetings/${project.id}`)
                            }
                            data-tour={index === 0 ? 'project-card' : undefined}
                            className="border-border hover:border-primary/50 hover:bg-accent/40 bg-card cursor-pointer rounded-xl border p-6 transition-all duration-150"
                        >
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-foreground mb-1 truncate text-lg font-semibold">
                                        {project.title}
                                    </h3>
                                    <p className="text-muted-foreground mb-3 line-clamp-2 text-sm">
                                        {project.description ||
                                            'No description'}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs font-medium">
                                        <span
                                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 ${
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
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="shrink-0 self-end sm:self-center"
                                >
                                    Open
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                    <div className="text-muted-foreground mt-6 text-center text-sm">
                        Showing {filteredProjects.length} of{' '}
                        {projects?.length ?? 0} projects
                    </div>
                </div>
            )}

            {/* Create Project Dialog */}
            <Dialog
                open={isCreateOpen}
                onOpenChange={(open) => {
                    setIsCreateOpen(open);
                    if (!open) {
                        setNewTitle('');
                        setNewDescription('');
                        setCreateError(null);
                    }
                }}
            >
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Create Meeting Project</DialogTitle>
                        <DialogDescription>
                            Create a project for your meeting. You can upload
                            the audio file and get transcripts once backend
                            upload capability is ready.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="title"
                                    className="text-foreground"
                                >
                                    Title{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="title"
                                    placeholder="e.g. Sales Sync - Q2 Planning"
                                    value={newTitle}
                                    onChange={(e) =>
                                        setNewTitle(e.target.value)
                                    }
                                    required
                                    disabled={createMutation.isPending}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="description"
                                    className="text-foreground"
                                >
                                    Description
                                </Label>
                                <Textarea
                                    id="description"
                                    placeholder="Brief details about the meeting session..."
                                    value={newDescription}
                                    onChange={(e) =>
                                        setNewDescription(e.target.value)
                                    }
                                    disabled={createMutation.isPending}
                                />
                            </div>
                            {createError && (
                                <div className="text-destructive bg-destructive/10 flex items-start gap-2 rounded-lg p-3 text-sm">
                                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                                    <span>{createError}</span>
                                </div>
                            )}
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsCreateOpen(false)}
                                disabled={createMutation.isPending}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={createMutation.isPending}
                            >
                                {createMutation.isPending && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Create Project
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
