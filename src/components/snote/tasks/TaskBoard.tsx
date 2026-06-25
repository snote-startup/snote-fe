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
    ListTodo,
    Loader2,
    MoreHorizontal,
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { useI18n } from '@/features/i18n/use-i18n';
import { ScrollArea } from '@/components/ui/scroll-area';

type TaskFilter = 'all' | `priority:${TaskPriority}`;

function matchesFilter(task: AggregatedTask, filter: TaskFilter) {
    if (filter === 'all') return true;
    if (filter.startsWith('priority:')) {
        return task.priority === filter.replace('priority:', '');
    }
    return true;
}

function sortTasks(a: AggregatedTask, b: AggregatedTask) {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
}

export function TaskBoard() {
    const router = useRouter();
    const { t } = useI18n();
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

    const statusConfig: Record<
        TaskStatus,
        { label: string; icon: typeof Circle; className: string }
    > = {
        todo: {
            label: t('tasks.status.todo'),
            icon: Circle,
            className: 'text-muted-foreground',
        },
        in_progress: {
            label: t('tasks.status.inProgress'),
            icon: CircleDashed,
            className: 'text-indigo-600 dark:text-indigo-400',
        },
        done: {
            label: t('tasks.status.done'),
            icon: CheckCircle2,
            className: 'text-emerald-600 dark:text-emerald-500',
        },
    };

    const priorityConfig: Record<
        TaskPriority,
        {
            label: string;
            className: string;
            bgClass: string;
            colorClass: string;
        }
    > = {
        low: {
            label: t('tasks.priority.low'),
            className: 'bg-muted text-muted-foreground',
            bgClass: 'bg-muted',
            colorClass: 'text-muted-foreground',
        },
        medium: {
            label: t('tasks.priority.medium'),
            className: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
            bgClass: 'bg-amber-500/10',
            colorClass: 'text-amber-700 dark:text-amber-400',
        },
        high: {
            label: t('tasks.priority.high'),
            className: 'bg-red-500/10 text-red-700 dark:text-red-400',
            bgClass: 'bg-red-500/10',
            colorClass: 'text-red-700 dark:text-red-400',
        },
    };

    const filters: Array<{ value: TaskFilter; label: string }> = [
        { value: 'all', label: t('tasks.filter.all') },
        { value: 'priority:low', label: t('tasks.filter.lowPriority') },
        { value: 'priority:medium', label: t('tasks.filter.medPriority') },
        { value: 'priority:high', label: t('tasks.filter.highPriority') },
    ];

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

    const handleStatusChange = (
        taskId: string,
        projectId: string,
        status: TaskStatus,
    ) => {
        updateMutation.mutate({
            taskId,
            projectId,
            body: { status },
        });
    };

    const handlePriorityChange = (
        taskId: string,
        projectId: string,
        priority: TaskPriority,
    ) => {
        updateMutation.mutate({
            taskId,
            projectId,
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
                title={t('tasks.loadError')}
                error={error}
                onRetry={() => refetch()}
            />
        );
    }

    const columns: TaskStatus[] = ['todo', 'in_progress', 'done'];

    return (
        <div className="animate-fade-in-up mx-auto flex h-[calc(100vh-theme(spacing.16))] max-w-[1600px] flex-col p-6 md:p-8">
            <div className="mb-6 flex shrink-0 flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-foreground mb-2 text-3xl font-semibold">
                        {t('tasks.title')}
                    </h1>
                    <p className="text-muted-foreground">
                        {t('tasks.subtitle')}
                    </p>
                </div>
                <Button
                    variant="outline"
                    onClick={() => router.push('/meetings')}
                    className="self-start md:self-auto"
                >
                    {t('tasks.openMeetings')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>

            {failedProjects.length > 0 && (
                <div className="mb-5 flex shrink-0 items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-900 dark:border-amber-700/50 dark:bg-amber-950/20 dark:text-amber-300">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                    <div className="text-sm">
                        <p className="font-medium">
                            {t('tasks.failedProjects')}
                        </p>
                        <p className="mt-1">
                            {t('tasks.failedProjectsDesc').replace(
                                '{count}',
                                String(failedProjects.length),
                            )}
                        </p>
                    </div>
                </div>
            )}

            <div className="border-border bg-card mb-6 flex shrink-0 flex-col items-start gap-4 rounded-xl border p-4 sm:flex-row sm:items-center">
                <div className="relative w-full sm:max-w-md">
                    <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                    <Input
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        placeholder={t('tasks.searchPlaceholder')}
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
                <div className="border-border bg-card mt-4 rounded-xl border p-12 text-center">
                    <CheckCircle2 className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                    <h2 className="text-foreground mb-2 text-lg font-semibold">
                        {t('tasks.noTasks')}
                    </h2>
                    <p className="text-muted-foreground mx-auto mb-6 max-w-md text-sm">
                        {t('tasks.kanban.emptyBoard')}
                    </p>
                    <Button onClick={() => router.push('/meetings')}>
                        {t('tasks.openMeetings')}
                    </Button>
                </div>
            ) : (
                <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-x-auto pb-4 lg:flex-row">
                    {columns.map((status) => {
                        const columnTasks = filteredTasks.filter(
                            (task) => task.status === status,
                        );
                        const {
                            label,
                            icon: StatusIcon,
                            className,
                        } = statusConfig[status];

                        return (
                            <div
                                key={status}
                                className="bg-muted/30 border-border flex min-w-[320px] flex-1 flex-col rounded-xl border"
                            >
                                <div className="border-border/50 bg-muted/50 flex shrink-0 items-center justify-between rounded-t-xl border-b p-4">
                                    <div className="flex items-center gap-2">
                                        <StatusIcon
                                            className={`h-4 w-4 ${className}`}
                                        />
                                        <h3 className="text-foreground text-sm font-semibold">
                                            {label}
                                        </h3>
                                    </div>
                                    <span className="bg-muted-foreground/10 text-muted-foreground rounded-full px-2.5 py-0.5 text-xs font-medium">
                                        {columnTasks.length}
                                    </span>
                                </div>
                                <ScrollArea className="flex-1">
                                    <div className="flex min-h-[150px] flex-col gap-3 p-3">
                                        {columnTasks.length === 0 ? (
                                            <div className="text-muted-foreground flex flex-col items-center justify-center p-8 text-center opacity-60">
                                                <StatusIcon className="mb-2 h-8 w-8 opacity-20" />
                                                <span className="text-sm">
                                                    {t(
                                                        'tasks.kanban.emptyColumn',
                                                    )}
                                                </span>
                                            </div>
                                        ) : (
                                            columnTasks.map((task) => {
                                                const priority =
                                                    priorityConfig[
                                                        task.priority
                                                    ];

                                                return (
                                                    <article
                                                        key={task.id}
                                                        className={`bg-card group relative flex flex-col rounded-xl border p-3.5 shadow-sm transition-all hover:shadow-md ${
                                                            task.status ===
                                                            'done'
                                                                ? 'border-border/40 grayscale-[0.2]'
                                                                : 'border-border/60 hover:border-primary/30'
                                                        }`}
                                                    >
                                                        <div className="mb-2.5 flex items-start justify-between gap-3">
                                                            <span
                                                                className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wider uppercase ${priority.bgClass} ${priority.colorClass}`}
                                                            >
                                                                {task.priority ===
                                                                    'high' && (
                                                                    <Flag className="h-2.5 w-2.5" />
                                                                )}
                                                                {priority.label}
                                                            </span>

                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger
                                                                    asChild
                                                                >
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="text-muted-foreground hover:bg-muted -mt-1 -mr-1.5 h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100"
                                                                        aria-label={t(
                                                                            'tasks.kanban.actionMenu',
                                                                        )}
                                                                    >
                                                                        <MoreHorizontal className="h-4 w-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent
                                                                    align="end"
                                                                    className="w-48"
                                                                >
                                                                    <DropdownMenuItem
                                                                        onClick={() =>
                                                                            router.push(
                                                                                `/meetings/${task.projectId}`,
                                                                            )
                                                                        }
                                                                    >
                                                                        <ArrowRight className="mr-2 h-4 w-4" />
                                                                        {t(
                                                                            'tasks.kanban.actionOpen',
                                                                        )}
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                        onClick={() => {
                                                                            setEditingTask(
                                                                                task,
                                                                            );
                                                                            setEditContent(
                                                                                task.content,
                                                                            );
                                                                        }}
                                                                    >
                                                                        <Pencil className="mr-2 h-4 w-4" />
                                                                        {t(
                                                                            'tasks.kanban.actionEdit',
                                                                        )}
                                                                    </DropdownMenuItem>

                                                                    <DropdownMenuSeparator />

                                                                    <DropdownMenuSub>
                                                                        <DropdownMenuSubTrigger>
                                                                            <ListTodo className="mr-2 h-4 w-4" />
                                                                            {t(
                                                                                'projectTasks.changeStatus',
                                                                            )}
                                                                        </DropdownMenuSubTrigger>
                                                                        <DropdownMenuSubContent>
                                                                            <DropdownMenuRadioGroup
                                                                                value={
                                                                                    task.status
                                                                                }
                                                                                onValueChange={(
                                                                                    v,
                                                                                ) =>
                                                                                    handleStatusChange(
                                                                                        task.id,
                                                                                        task.projectId,
                                                                                        v as TaskStatus,
                                                                                    )
                                                                                }
                                                                            >
                                                                                <DropdownMenuRadioItem value="todo">
                                                                                    {t(
                                                                                        'tasks.status.todo',
                                                                                    )}
                                                                                </DropdownMenuRadioItem>
                                                                                <DropdownMenuRadioItem value="in_progress">
                                                                                    {t(
                                                                                        'tasks.status.inProgress',
                                                                                    )}
                                                                                </DropdownMenuRadioItem>
                                                                                <DropdownMenuRadioItem value="done">
                                                                                    {t(
                                                                                        'tasks.status.done',
                                                                                    )}
                                                                                </DropdownMenuRadioItem>
                                                                            </DropdownMenuRadioGroup>
                                                                        </DropdownMenuSubContent>
                                                                    </DropdownMenuSub>

                                                                    <DropdownMenuSub>
                                                                        <DropdownMenuSubTrigger>
                                                                            <Flag className="mr-2 h-4 w-4" />
                                                                            {t(
                                                                                'projectTasks.changePriority',
                                                                            )}
                                                                        </DropdownMenuSubTrigger>
                                                                        <DropdownMenuSubContent>
                                                                            <DropdownMenuRadioGroup
                                                                                value={
                                                                                    task.priority
                                                                                }
                                                                                onValueChange={(
                                                                                    v,
                                                                                ) =>
                                                                                    handlePriorityChange(
                                                                                        task.id,
                                                                                        task.projectId,
                                                                                        v as TaskPriority,
                                                                                    )
                                                                                }
                                                                            >
                                                                                <DropdownMenuRadioItem value="low">
                                                                                    {t(
                                                                                        'tasks.priority.low',
                                                                                    )}
                                                                                </DropdownMenuRadioItem>
                                                                                <DropdownMenuRadioItem value="medium">
                                                                                    {t(
                                                                                        'tasks.priority.medium',
                                                                                    )}
                                                                                </DropdownMenuRadioItem>
                                                                                <DropdownMenuRadioItem value="high">
                                                                                    {t(
                                                                                        'tasks.priority.high',
                                                                                    )}
                                                                                </DropdownMenuRadioItem>
                                                                            </DropdownMenuRadioGroup>
                                                                        </DropdownMenuSubContent>
                                                                    </DropdownMenuSub>

                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem
                                                                        className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                                                                        onClick={() =>
                                                                            setDeletingTask(
                                                                                task,
                                                                            )
                                                                        }
                                                                    >
                                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                                        {t(
                                                                            'tasks.deleteDialog.confirm',
                                                                        )}
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>

                                                        <p
                                                            className={`mb-4 text-sm leading-relaxed ${
                                                                task.status ===
                                                                'done'
                                                                    ? 'text-muted-foreground decoration-muted-foreground/30 line-through opacity-80'
                                                                    : 'text-foreground'
                                                            }`}
                                                        >
                                                            {task.content}
                                                        </p>

                                                        <div className="text-muted-foreground flex flex-wrap items-center gap-1.5 text-[11px] font-medium">
                                                            <span
                                                                className="bg-muted/30 max-w-[140px] truncate rounded-sm border px-1.5 py-0.5"
                                                                title={
                                                                    task.projectTitle
                                                                }
                                                            >
                                                                {
                                                                    task.projectTitle
                                                                }
                                                            </span>
                                                            <span className="opacity-50">
                                                                •
                                                            </span>
                                                            <span className="opacity-80">
                                                                {format(
                                                                    new Date(
                                                                        task.created_at,
                                                                    ),
                                                                    'dd/MM',
                                                                )}
                                                            </span>
                                                        </div>
                                                    </article>
                                                );
                                            })
                                        )}
                                    </div>
                                </ScrollArea>
                            </div>
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
                        <DialogTitle>{t('tasks.editDialog.title')}</DialogTitle>
                        <DialogDescription>
                            {t('tasks.editDialog.desc')}
                        </DialogDescription>
                    </DialogHeader>
                    <Textarea
                        value={editContent}
                        onChange={(event) => setEditContent(event.target.value)}
                        rows={5}
                        className="resize-none"
                        placeholder={t('tasks.editDialog.placeholder')}
                    />
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setEditingTask(null)}
                        >
                            {t('common.cancel')}
                        </Button>
                        <Button
                            onClick={handleEditSave}
                            disabled={
                                !editContent.trim() || updateMutation.isPending
                            }
                        >
                            {updateMutation.isPending && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {t('tasks.editDialog.save')}
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
                        <DialogTitle>
                            {t('tasks.deleteDialog.title')}
                        </DialogTitle>
                        <DialogDescription>
                            {t('tasks.deleteDialog.desc')}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeletingTask(null)}
                        >
                            {t('tasks.deleteDialog.cancel')}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {t('tasks.deleteDialog.confirm')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
