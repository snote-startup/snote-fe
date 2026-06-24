'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import {
    AlertCircle,
    ArrowRight,
    CheckCircle2,
    Circle,
    CircleDashed,
    Flag,
    Loader2,
    Pencil,
    Search,
    Trash2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
    useAllProjectTasks,
    useDeleteAggregatedTask,
    useUpdateAggregatedTask,
} from '@/features/tasks/hooks';
import type {
    AggregatedTask,
    TaskPriority,
    TaskStatus,
} from '@/features/tasks/types';
import { AppLoadingState } from '@/components/snote/shared/AppLoadingState';
import { AppErrorState } from '@/components/snote/shared/AppErrorState';

type TaskFilter = 'all' | TaskStatus | `priority:${TaskPriority}`;

const statusConfig: Record<
    TaskStatus,
    { label: string; icon: typeof Circle; className: string }
> = {
    todo: {
        label: 'Cần làm',
        icon: Circle,
        className: 'text-muted-foreground',
    },
    in_progress: {
        label: 'Đang làm',
        icon: CircleDashed,
        className: 'text-indigo-600 dark:text-indigo-400',
    },
    done: {
        label: 'Hoàn tất',
        icon: CheckCircle2,
        className: 'text-emerald-600 dark:text-emerald-500',
    },
};

const priorityConfig: Record<
    TaskPriority,
    { label: string; className: string }
> = {
    low: {
        label: 'Thấp',
        className: 'bg-muted text-muted-foreground',
    },
    medium: {
        label: 'Vừa',
        className: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
    },
    high: {
        label: 'Cao',
        className: 'bg-red-500/10 text-red-700 dark:text-red-400',
    },
};

const filters: Array<{ value: TaskFilter; label: string }> = [
    { value: 'all', label: 'Tất cả' },
    { value: 'todo', label: 'Cần làm' },
    { value: 'in_progress', label: 'Đang làm' },
    { value: 'done', label: 'Hoàn tất' },
    { value: 'priority:low', label: 'Ưu tiên thấp' },
    { value: 'priority:medium', label: 'Ưu tiên vừa' },
    { value: 'priority:high', label: 'Ưu tiên cao' },
];

function matchesFilter(task: AggregatedTask, filter: TaskFilter) {
    if (filter === 'all') return true;
    if (filter.startsWith('priority:')) {
        return task.priority === filter.replace('priority:', '');
    }
    return task.status === filter;
}

function sortTasks(a: AggregatedTask, b: AggregatedTask) {
    const statusOrder: Record<TaskStatus, number> = {
        todo: 0,
        in_progress: 1,
        done: 2,
    };
    if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status];
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
}

export function TaskBoard() {
    const router = useRouter();
    const { data, isLoading, error, refetch } = useAllProjectTasks();
    const updateMutation = useUpdateAggregatedTask();
    const deleteMutation = useDeleteAggregatedTask();

    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<TaskFilter>('all');
    const [editingTask, setEditingTask] = useState<AggregatedTask | null>(null);
    const [editContent, setEditContent] = useState('');
    const [deletingTask, setDeletingTask] = useState<AggregatedTask | null>(
        null,
    );

    const tasks = useMemo(() => data?.tasks ?? [], [data?.tasks]);
    const failedProjects = data?.failedProjects ?? [];

    const filteredTasks = useMemo(() => {
        const normalizedQuery = searchQuery.trim().toLowerCase();

        return tasks
            .filter((task) => matchesFilter(task, activeFilter))
            .filter((task) => {
                if (!normalizedQuery) return true;
                return (
                    task.content.toLowerCase().includes(normalizedQuery) ||
                    task.projectTitle.toLowerCase().includes(normalizedQuery)
                );
            })
            .sort(sortTasks);
    }, [activeFilter, searchQuery, tasks]);

    const handleStatusChange = (task: AggregatedTask, status: TaskStatus) => {
        updateMutation.mutate({
            taskId: task.id,
            projectId: task.projectId,
            body: { status },
        });
    };

    const handlePriorityChange = (
        task: AggregatedTask,
        priority: TaskPriority,
    ) => {
        updateMutation.mutate({
            taskId: task.id,
            projectId: task.projectId,
            body: { priority },
        });
    };

    const handleEditSave = () => {
        if (!editingTask || !editContent.trim()) return;
        updateMutation.mutate(
            {
                taskId: editingTask.id,
                projectId: editingTask.projectId,
                body: { content: editContent.trim() },
            },
            {
                onSuccess: () => {
                    setEditingTask(null);
                    setEditContent('');
                },
            },
        );
    };

    const handleDelete = () => {
        if (!deletingTask) return;
        deleteMutation.mutate(
            {
                taskId: deletingTask.id,
                projectId: deletingTask.projectId,
            },
            {
                onSuccess: () => {
                    setDeletingTask(null);
                },
            },
        );
    };

    if (isLoading) {
        return <AppLoadingState variant="list" />;
    }

    if (error) {
        return (
            <AppErrorState
                title="Không tải được công việc"
                error={error}
                onRetry={() => refetch()}
            />
        );
    }

    return (
        <div className="animate-fade-in-up mx-auto max-w-7xl p-6 md:p-8">
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-foreground mb-2 text-3xl font-semibold">
                        Tất cả công việc
                    </h1>
                    <p className="text-muted-foreground">
                        Công việc được tạo từ transcript của từng cuộc họp.
                    </p>
                </div>
                <Button
                    variant="outline"
                    onClick={() => router.push('/meetings')}
                    className="self-start md:self-auto"
                >
                    Mở danh sách cuộc họp
                    <ArrowRight className="h-4 w-4" />
                </Button>
            </div>

            {failedProjects.length > 0 && (
                <div className="mb-5 flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-900 dark:border-amber-700/50 dark:bg-amber-950/20 dark:text-amber-300">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                    <div className="text-sm">
                        <p className="font-medium">
                            Một số dự án chưa tải được công việc.
                        </p>
                        <p className="mt-1">
                            Đã bỏ qua {failedProjects.length} dự án trong lần
                            tải này. Bạn có thể thử tải lại sau.
                        </p>
                    </div>
                </div>
            )}

            <div className="border-border bg-card mb-6 space-y-4 rounded-xl border p-4">
                <div className="relative">
                    <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                    <Input
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        placeholder="Tìm theo nội dung công việc hoặc tên cuộc họp..."
                        className="pl-10"
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    {filters.map((filter) => (
                        <Button
                            key={filter.value}
                            type="button"
                            variant={
                                activeFilter === filter.value
                                    ? 'default'
                                    : 'outline'
                            }
                            size="sm"
                            onClick={() => setActiveFilter(filter.value)}
                        >
                            {filter.label}
                        </Button>
                    ))}
                </div>
            </div>

            {tasks.length === 0 ? (
                <div className="border-border bg-card rounded-xl border p-10 text-center">
                    <CheckCircle2 className="text-muted-foreground mx-auto mb-3 h-12 w-12" />
                    <h2 className="text-foreground mb-2 text-lg font-semibold">
                        Chưa có công việc nào
                    </h2>
                    <p className="text-muted-foreground mx-auto mb-5 max-w-md text-sm">
                        Mở một cuộc họp đã có transcript rồi dùng nút tạo công
                        việc để sinh danh sách việc cần làm.
                    </p>
                    <Button onClick={() => router.push('/meetings')}>
                        Chọn cuộc họp
                    </Button>
                </div>
            ) : filteredTasks.length === 0 ? (
                <div className="border-border bg-card rounded-xl border p-10 text-center">
                    <Search className="text-muted-foreground mx-auto mb-3 h-12 w-12" />
                    <h2 className="text-foreground mb-2 text-lg font-semibold">
                        Không tìm thấy công việc phù hợp
                    </h2>
                    <p className="text-muted-foreground text-sm">
                        Thử đổi từ khóa tìm kiếm hoặc bộ lọc.
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredTasks.map((task) => {
                        const StatusIcon = statusConfig[task.status].icon;
                        return (
                            <article
                                key={task.id}
                                className="border-border bg-card hover:border-primary/40 rounded-xl border p-4 transition-colors"
                            >
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                    <div className="min-w-0 flex-1">
                                        <div className="mb-2 flex flex-wrap items-center gap-2">
                                            <span
                                                className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${statusConfig[task.status].className}`}
                                            >
                                                <StatusIcon className="h-3.5 w-3.5" />
                                                {
                                                    statusConfig[task.status]
                                                        .label
                                                }
                                            </span>
                                            <span
                                                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${priorityConfig[task.priority].className}`}
                                            >
                                                {task.priority === 'high' && (
                                                    <Flag className="h-3 w-3" />
                                                )}
                                                {
                                                    priorityConfig[
                                                        task.priority
                                                    ].label
                                                }
                                            </span>
                                        </div>
                                        <p
                                            className={`text-sm leading-relaxed ${
                                                task.status === 'done'
                                                    ? 'text-muted-foreground line-through'
                                                    : 'text-foreground'
                                            }`}
                                        >
                                            {task.content}
                                        </p>
                                        <div className="text-muted-foreground mt-3 flex flex-wrap gap-2 text-xs">
                                            <span>{task.projectTitle}</span>
                                            <span>•</span>
                                            <span>
                                                {format(
                                                    new Date(task.created_at),
                                                    'dd/MM/yyyy HH:mm',
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid gap-2 sm:grid-cols-2 lg:w-[360px]">
                                        <Select
                                            value={task.status}
                                            disabled={updateMutation.isPending}
                                            onValueChange={(value) =>
                                                handleStatusChange(
                                                    task,
                                                    value as TaskStatus,
                                                )
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="todo">
                                                    Cần làm
                                                </SelectItem>
                                                <SelectItem value="in_progress">
                                                    Đang làm
                                                </SelectItem>
                                                <SelectItem value="done">
                                                    Hoàn tất
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <Select
                                            value={task.priority}
                                            disabled={updateMutation.isPending}
                                            onValueChange={(value) =>
                                                handlePriorityChange(
                                                    task,
                                                    value as TaskPriority,
                                                )
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="low">
                                                    Thấp
                                                </SelectItem>
                                                <SelectItem value="medium">
                                                    Vừa
                                                </SelectItem>
                                                <SelectItem value="high">
                                                    Cao
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setEditingTask(task);
                                                setEditContent(task.content);
                                            }}
                                        >
                                            <Pencil className="h-4 w-4" />
                                            Chỉnh sửa
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                router.push(
                                                    `/meetings/${task.projectId}`,
                                                )
                                            }
                                        >
                                            Mở cuộc họp
                                            <ArrowRight className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            onClick={() =>
                                                setDeletingTask(task)
                                            }
                                            className="sm:col-span-2"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            Xóa công việc
                                        </Button>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}

            <Dialog
                open={!!editingTask}
                onOpenChange={(open) => {
                    if (!open) {
                        setEditingTask(null);
                        setEditContent('');
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Chỉnh sửa công việc</DialogTitle>
                        <DialogDescription>
                            Cập nhật nội dung công việc đã tạo từ transcript.
                        </DialogDescription>
                    </DialogHeader>
                    <Textarea
                        value={editContent}
                        onChange={(event) => setEditContent(event.target.value)}
                        rows={5}
                        className="resize-none"
                        placeholder="Nội dung công việc..."
                    />
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setEditingTask(null)}
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={handleEditSave}
                            disabled={
                                !editContent.trim() || updateMutation.isPending
                            }
                        >
                            {updateMutation.isPending && (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            )}
                            Lưu thay đổi
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog
                open={!!deletingTask}
                onOpenChange={(open) => {
                    if (!open) setDeletingTask(null);
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Xóa công việc</DialogTitle>
                        <DialogDescription>
                            Công việc này sẽ bị xóa vĩnh viễn. Thao tác này
                            không thể hoàn tác.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeletingTask(null)}
                        >
                            Hủy
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending && (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            )}
                            Xóa
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
