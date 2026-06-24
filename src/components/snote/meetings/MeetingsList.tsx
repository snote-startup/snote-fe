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
    Mic,
    Plus,
    FileAudio,
    ArrowRight,
    AlertCircle,
    Loader2,
} from 'lucide-react';
import { useProjects, useCreateProject } from '@/features/projects/hooks';
import { toast } from 'sonner';
import { AppLoadingState } from '@/components/snote/shared/AppLoadingState';
import { AppErrorState } from '@/components/snote/shared/AppErrorState';
import { AppEmptyState } from '@/components/snote/shared/AppEmptyState';

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
            toast.error('Vui lòng nhập tiêu đề cuộc họp.');
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
                    toast.success('Đã tạo cuộc họp.');
                    router.push(`/meetings/${projectId}`);
                },
                onError: (err) => {
                    setCreateError(err.message || 'Không thể tạo cuộc họp.');
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
                        Cuộc họp
                    </h1>
                    <p className="text-muted-foreground">
                        Mỗi dự án tương ứng với một cuộc họp và transcript.
                    </p>
                </div>
                <Button
                    data-tour="create-project-button"
                    onClick={() => setIsCreateOpen(true)}
                    className="self-start sm:w-auto"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Tạo cuộc họp
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
                        placeholder="Tìm theo tiêu đề hoặc mô tả..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10"
                    />
                </div>
            </div>

            {/* Content States */}
            {isLoading ? (
                <AppLoadingState variant="list" />
            ) : error ? (
                <AppErrorState
                    title="Không tải được danh sách cuộc họp"
                    error={error}
                    onRetry={() => refetch()}
                />
            ) : filteredProjects.length === 0 ? (
                <AppEmptyState
                    title={
                        searchQuery
                            ? 'Không tìm thấy cuộc họp phù hợp'
                            : 'Chưa có cuộc họp'
                    }
                    description={
                        searchQuery
                            ? 'Thử đổi từ khóa tìm kiếm.'
                            : 'Tạo cuộc họp để tải audio và xem transcript.'
                    }
                    icon={searchQuery ? Search : Mic}
                    action={
                        !searchQuery
                            ? {
                                  label: 'Tạo cuộc họp',
                                  onClick: () => setIsCreateOpen(true),
                              }
                            : undefined
                    }
                />
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
                                        {project.description || 'Chưa có mô tả'}
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
                                                ? 'Đã có audio'
                                                : 'Chờ audio'}
                                        </span>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="shrink-0 self-end sm:self-center"
                                >
                                    Mở
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                    <div className="text-muted-foreground mt-6 text-center text-sm">
                        Đang hiển thị {filteredProjects.length} /{' '}
                        {projects?.length ?? 0} cuộc họp
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
                        <DialogTitle>Tạo cuộc họp</DialogTitle>
                        <DialogDescription>
                            Tạo dự án cho cuộc họp. Sau đó tải audio để tạo
                            transcript và dùng trợ lý AI để phân tích nội dung.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="title"
                                    className="text-foreground"
                                >
                                    Tiêu đề{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="title"
                                    placeholder="Ví dụ: Họp sales - Kế hoạch Q2"
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
                                    Mô tả
                                </Label>
                                <Textarea
                                    id="description"
                                    placeholder="Ghi chú ngắn về cuộc họp..."
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
                                Hủy
                            </Button>
                            <Button
                                type="submit"
                                disabled={createMutation.isPending}
                            >
                                {createMutation.isPending && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Tạo cuộc họp
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
