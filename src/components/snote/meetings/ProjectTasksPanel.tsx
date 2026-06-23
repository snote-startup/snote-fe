'use client';

import { useState } from 'react';
import {
    useProjectTasks,
    useGenerateProjectTasks,
    useUpdateTask,
    useDeleteTask,
} from '@/features/tasks/hooks';
import { ProjectTask, TaskStatus, TaskPriority } from '@/features/tasks/types';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Loader2,
    Wand2,
    ListTodo,
    Trash2,
    Pencil,
    Flag,
    CheckCircle2,
    CircleDashed,
    Circle,
    MoreVertical,
    Clock3,
    type LucideIcon,
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';

interface ProjectTasksPanelProps {
    projectId: string;
    hasSegments: boolean;
}

const statusConfig: Record<
    TaskStatus,
    { label: string; icon: LucideIcon; colorClass: string }
> = {
    todo: {
        label: 'To Do',
        icon: Circle,
        colorClass: 'text-muted-foreground',
    },
    in_progress: {
        label: 'In Progress',
        icon: CircleDashed,
        colorClass: 'text-indigo-500 dark:text-indigo-400',
    },
    done: {
        label: 'Done',
        icon: CheckCircle2,
        colorClass: 'text-emerald-600 dark:text-emerald-500',
    },
};

const priorityConfig: Record<
    TaskPriority,
    { label: string; colorClass: string; bgClass: string }
> = {
    low: {
        label: 'Low',
        colorClass: 'text-muted-foreground',
        bgClass: 'bg-muted',
    },
    medium: {
        label: 'Medium',
        colorClass: 'text-amber-600 dark:text-amber-400',
        bgClass: 'bg-amber-500/10 dark:bg-amber-900/20',
    },
    high: {
        label: 'High',
        colorClass: 'text-red-600 dark:text-red-400',
        bgClass: 'bg-red-500/10 dark:bg-red-900/20',
    },
};

export function ProjectTasksPanel({
    projectId,
    hasSegments,
}: ProjectTasksPanelProps) {
    const { data: tasks, isLoading: isTasksLoading } =
        useProjectTasks(projectId);
    const generateMutation = useGenerateProjectTasks(projectId);
    const updateMutation = useUpdateTask(projectId);
    const deleteMutation = useDeleteTask(projectId);

    const [editingTask, setEditingTask] = useState<ProjectTask | null>(null);
    const [editContent, setEditContent] = useState('');
    const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

    const handleGenerate = () => {
        generateMutation.mutate();
    };

    const handleStatusChange = (taskId: string, status: TaskStatus) => {
        updateMutation.mutate({ taskId, body: { status } });
    };

    const handlePriorityChange = (taskId: string, priority: TaskPriority) => {
        updateMutation.mutate({ taskId, body: { priority } });
    };

    const handleEditSave = () => {
        if (!editingTask || !editContent.trim()) return;
        updateMutation.mutate(
            { taskId: editingTask.id, body: { content: editContent.trim() } },
            {
                onSuccess: () => {
                    setEditingTask(null);
                },
            },
        );
    };

    const handleDelete = () => {
        if (!deletingTaskId) return;
        deleteMutation.mutate(deletingTaskId, {
            onSuccess: () => {
                setDeletingTaskId(null);
            },
        });
    };

    const sortedTasks = [...(tasks || [])].sort((a, b) => {
        // Sort by status first (todo -> in_progress -> done), then by creation date
        const statusOrder = { todo: 0, in_progress: 1, done: 2 };
        if (statusOrder[a.status] !== statusOrder[b.status]) {
            return statusOrder[a.status] - statusOrder[b.status];
        }
        return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    });

    return (
        <div className="flex h-full flex-col">
            {/* Panel Header */}
            <div className="border-border/60 flex shrink-0 items-center justify-between border-b px-4 py-3">
                <div className="flex items-center gap-2">
                    <ListTodo className="text-muted-foreground h-4 w-4" />
                    <h2 className="text-foreground text-sm font-semibold">
                        Action Items
                        {tasks && tasks.length > 0 && (
                            <span className="text-muted-foreground ml-1.5 font-normal">
                                ({tasks.length})
                            </span>
                        )}
                    </h2>
                </div>
                {isTasksLoading && (
                    <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
                )}
            </div>

            {/* Panel Body */}
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                {isTasksLoading ? (
                    <div className="flex flex-1 flex-col items-center justify-center py-10">
                        <Loader2 className="text-primary mb-3 h-7 w-7 animate-spin" />
                        <p className="text-muted-foreground text-sm">
                            Loading tasks…
                        </p>
                    </div>
                ) : !tasks || tasks.length === 0 ? (
                    <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
                        <ListTodo className="text-muted-foreground mb-4 h-12 w-12 opacity-40" />
                        <h3 className="text-foreground mb-1 text-base font-semibold">
                            No tasks generated yet
                        </h3>
                        <p className="text-muted-foreground mb-6 max-w-[250px] text-sm">
                            {hasSegments
                                ? 'Turn this transcript into actionable tasks.'
                                : 'Generate a transcript before creating tasks.'}
                        </p>
                        <Button
                            onClick={handleGenerate}
                            disabled={
                                !hasSegments || generateMutation.isPending
                            }
                            className="w-full max-w-[200px]"
                        >
                            {generateMutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Generating…
                                </>
                            ) : (
                                <>
                                    <Wand2 className="mr-2 h-4 w-4" />
                                    Generate tasks
                                </>
                            )}
                        </Button>
                    </div>
                ) : (
                    <>
                        <ScrollArea className="flex-1 px-4 pb-4">
                            <div className="space-y-3 pt-3">
                                {sortedTasks.map((task) => {
                                    const StatusIcon =
                                        statusConfig[task.status].icon;
                                    const priority =
                                        priorityConfig[task.priority];

                                    return (
                                        <div
                                            key={task.id}
                                            className={`bg-card group rounded-xl border p-3.5 transition-all hover:shadow-sm ${
                                                task.status === 'done'
                                                    ? 'border-border/40 opacity-75 grayscale-[0.2]'
                                                    : 'border-border/60 hover:border-primary/30'
                                            }`}
                                        >
                                            <div className="mb-2 flex items-start justify-between gap-3">
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${priority.bgClass} ${priority.colorClass}`}
                                                    >
                                                        {task.priority ===
                                                            'high' && (
                                                            <Flag className="h-3 w-3" />
                                                        )}
                                                        {priority.label}
                                                    </span>
                                                    <span
                                                        className={`inline-flex items-center gap-1.5 text-xs font-medium ${statusConfig[task.status].colorClass}`}
                                                    >
                                                        <StatusIcon className="h-3.5 w-3.5" />
                                                        {
                                                            statusConfig[
                                                                task.status
                                                            ].label
                                                        }
                                                    </span>
                                                </div>

                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-6 w-6 opacity-0 group-hover:opacity-100 focus:opacity-100"
                                                        >
                                                            <MoreVertical className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent
                                                        align="end"
                                                        className="w-48"
                                                    >
                                                        <DropdownMenuLabel>
                                                            Task Actions
                                                        </DropdownMenuLabel>
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
                                                            Edit content
                                                        </DropdownMenuItem>

                                                        <DropdownMenuSub>
                                                            <DropdownMenuSubTrigger>
                                                                <ListTodo className="mr-2 h-4 w-4" />
                                                                Set status
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
                                                                            v as TaskStatus,
                                                                        )
                                                                    }
                                                                >
                                                                    <DropdownMenuRadioItem value="todo">
                                                                        To Do
                                                                    </DropdownMenuRadioItem>
                                                                    <DropdownMenuRadioItem value="in_progress">
                                                                        In
                                                                        Progress
                                                                    </DropdownMenuRadioItem>
                                                                    <DropdownMenuRadioItem value="done">
                                                                        Done
                                                                    </DropdownMenuRadioItem>
                                                                </DropdownMenuRadioGroup>
                                                            </DropdownMenuSubContent>
                                                        </DropdownMenuSub>

                                                        <DropdownMenuSub>
                                                            <DropdownMenuSubTrigger>
                                                                <Flag className="mr-2 h-4 w-4" />
                                                                Set priority
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
                                                                            v as TaskPriority,
                                                                        )
                                                                    }
                                                                >
                                                                    <DropdownMenuRadioItem value="low">
                                                                        Low
                                                                    </DropdownMenuRadioItem>
                                                                    <DropdownMenuRadioItem value="medium">
                                                                        Medium
                                                                    </DropdownMenuRadioItem>
                                                                    <DropdownMenuRadioItem value="high">
                                                                        High
                                                                    </DropdownMenuRadioItem>
                                                                </DropdownMenuRadioGroup>
                                                            </DropdownMenuSubContent>
                                                        </DropdownMenuSub>

                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                                                            onClick={() =>
                                                                setDeletingTaskId(
                                                                    task.id,
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>

                                            <p
                                                className={`text-sm leading-relaxed ${task.status === 'done' ? 'text-muted-foreground decoration-muted-foreground/30 line-through' : 'text-foreground'}`}
                                            >
                                                {task.content}
                                            </p>

                                            <div className="text-muted-foreground mt-3 flex items-center gap-1.5 text-xs">
                                                <Clock3 className="h-3 w-3" />
                                                {format(
                                                    new Date(task.created_at),
                                                    'MMM d, yyyy',
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </ScrollArea>
                        <div className="border-border/60 shrink-0 border-t p-3">
                            <Button
                                variant="outline"
                                className="text-muted-foreground w-full"
                                onClick={handleGenerate}
                                disabled={generateMutation.isPending}
                            >
                                {generateMutation.isPending ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Wand2 className="mr-2 h-4 w-4" />
                                )}
                                Regenerate tasks
                            </Button>
                        </div>
                    </>
                )}
            </div>

            {/* Edit Task Dialog */}
            <Dialog
                open={!!editingTask}
                onOpenChange={(open) => !open && setEditingTask(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Task</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <Textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            rows={4}
                            className="resize-none"
                            placeholder="Task content..."
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setEditingTask(null)}
                        >
                            Cancel
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
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={!!deletingTaskId}
                onOpenChange={(open) => !open && setDeletingTaskId(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Task</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this task? This
                            action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeletingTaskId(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
