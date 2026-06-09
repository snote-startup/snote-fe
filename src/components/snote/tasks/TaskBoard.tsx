'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Plus,
    Calendar,
    ExternalLink,
    Trash2,
    GripVertical,
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { useApp } from '@/providers/snote-app-provider';
import type { Task, Meeting } from '@/lib/snote/mock-data';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// --- Constants ---
const ItemTypes = {
    TASK: 'task',
};

// --- Helper Functions ---
const getPriorityColor = (priority: string) => {
    switch (priority) {
        case 'high':
            return 'text-destructive bg-destructive/10';
        case 'medium':
            return 'text-amber-600 bg-amber-500/10 dark:text-amber-400 dark:bg-amber-900/20';
        case 'low':
            return 'text-muted-foreground bg-muted';
        default:
            return 'text-muted-foreground bg-muted';
    }
};

// --- Components ---

function DraggableTask({
    task,
    meetings,
    onDelete,
    onGoToMeeting,
}: {
    task: Task;
    meetings: Pick<Meeting, 'id' | 'title'>[];
    onDelete: (id: string) => void;
    onGoToMeeting: (id: string) => void;
}) {
    const [{ isDragging }, dragRef, previewRef] = useDrag(() => ({
        type: ItemTypes.TASK,
        item: { id: task.id },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    const taskMeeting = task.meetingId
        ? meetings.find((m) => m.id === task.meetingId)
        : null;

    return (
        <div
            ref={previewRef as unknown as React.Ref<HTMLDivElement>}
            className={`group border-border bg-card hover:border-primary/40 relative rounded-lg border p-3 shadow-sm transition-all hover:shadow-md ${
                isDragging ? 'opacity-40 shadow-none' : 'opacity-100'
            }`}
        >
            <div
                ref={dragRef as unknown as React.Ref<HTMLDivElement>}
                className="hover:bg-muted/50 absolute top-0 left-0 flex h-full w-6 cursor-grab items-center justify-center opacity-0 group-hover:opacity-100 active:cursor-grabbing"
            >
                <GripVertical className="text-muted-foreground h-4 w-4" />
            </div>

            <div className="pl-4">
                {/* Priority Badge & Actions */}
                <div className="mb-2 flex items-start justify-between">
                    <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase ${getPriorityColor(task.priority)}`}
                    >
                        {task.priority}
                    </span>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(task.id)}
                        className="hover:text-destructive h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                </div>

                {/* Task Title */}
                <h4 className="text-foreground mb-1 text-sm leading-tight font-medium">
                    {task.title}
                </h4>

                {/* Task Description */}
                {task.description && (
                    <p className="text-muted-foreground mb-3 line-clamp-2 text-xs">
                        {task.description}
                    </p>
                )}

                {/* Metadata */}
                <div className="text-muted-foreground mt-2 space-y-1.5 text-xs">
                    {task.assignee && (
                        <div className="flex items-center gap-1.5">
                            <div className="bg-primary/10 text-primary flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold">
                                {task.assignee.charAt(0).toUpperCase()}
                            </div>
                            <span>{task.assignee}</span>
                        </div>
                    )}
                    {(task.dueDate || taskMeeting) && (
                        <div className="flex items-center gap-3">
                            {task.dueDate && (
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {format(task.dueDate, 'MMM d')}
                                </div>
                            )}
                            {taskMeeting && (
                                <button
                                    onClick={() =>
                                        onGoToMeeting(task.meetingId!)
                                    }
                                    className="text-primary flex items-center gap-1 hover:underline"
                                >
                                    <ExternalLink className="h-3 w-3" />
                                    <span className="max-w-[100px] truncate">
                                        {taskMeeting.title}
                                    </span>
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function DroppableColumn({
    column,
    tasks,
    meetings,
    onMoveTask,
    onDeleteTask,
    onGoToMeeting,
    onNewTask,
}: {
    column: { id: string; title: string };
    tasks: Task[];
    meetings: Pick<Meeting, 'id' | 'title'>[];
    onMoveTask: (taskId: string, newStatus: Task['status']) => void;
    onDeleteTask: (id: string) => void;
    onGoToMeeting: (id: string) => void;
    onNewTask: (status: Task['status']) => void;
}) {
    const [{ isOver }, dropRef] = useDrop(() => ({
        accept: ItemTypes.TASK,
        drop: (item: { id: string }) => {
            onMoveTask(item.id, column.id as Task['status']);
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    return (
        <div
            className={`bg-muted/40 flex h-full max-w-[360px] min-w-[320px] flex-col rounded-xl transition-colors ${
                isOver ? 'bg-muted/70 ring-primary/20 ring-1' : ''
            }`}
        >
            {/* Column Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-3 pb-2">
                <div className="flex items-center gap-2">
                    <h3 className="text-foreground text-sm font-semibold">
                        {column.title}
                    </h3>
                    <span className="bg-background/60 text-muted-foreground flex h-5 items-center justify-center rounded-full px-2 text-xs font-medium shadow-sm">
                        {tasks.length}
                    </span>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-background/60 h-6 w-6"
                    onClick={() => onNewTask(column.id as Task['status'])}
                >
                    <Plus className="text-muted-foreground h-4 w-4" />
                </Button>
            </div>

            {/* Tasks Container */}
            <div
                ref={dropRef as unknown as React.Ref<HTMLDivElement>}
                className="flex-1 space-y-2.5 overflow-y-auto p-3 pt-1"
            >
                {tasks.length === 0 ? (
                    <div className="border-border/50 text-muted-foreground rounded-lg border-2 border-dashed py-6 text-center text-xs">
                        Drop tasks here
                    </div>
                ) : (
                    tasks.map((task) => (
                        <DraggableTask
                            key={task.id}
                            task={task}
                            meetings={meetings}
                            onDelete={onDeleteTask}
                            onGoToMeeting={onGoToMeeting}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

// --- Main Board Component ---

export function TaskBoard() {
    const router = useRouter();
    const { tasks, setTasks, meetings } = useApp();
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [newTaskPriority, setNewTaskPriority] = useState<
        'low' | 'medium' | 'high'
    >('medium');
    const [newTaskAssignee, setNewTaskAssignee] = useState('');
    const [newTaskStatus, setNewTaskStatus] = useState<Task['status']>('todo');

    const columns = [
        { id: 'todo', title: 'To Do' },
        { id: 'in-progress', title: 'In Progress' },
        { id: 'done', title: 'Done' },
    ];

    const getTasksByStatus = (status: string) => {
        return tasks.filter((task) => task.status === status);
    };

    const handleCreateTask = () => {
        if (!newTaskTitle.trim()) {
            toast.error('Please enter a task title', {
                position: 'bottom-right',
            });
            return;
        }

        const newTask: Task = {
            id: Date.now().toString(),
            title: newTaskTitle,
            description: newTaskDescription || undefined,
            status: newTaskStatus,
            priority: newTaskPriority,
            assignee: newTaskAssignee || undefined,
            createdAt: new Date(),
        };

        setTasks([...tasks, newTask]);
        setShowCreateDialog(false);
        setNewTaskTitle('');
        setNewTaskDescription('');
        setNewTaskPriority('medium');
        setNewTaskAssignee('');
        setNewTaskStatus('todo');
        toast.success('Task created', { position: 'bottom-right' });
    };

    const handleMoveTask = (taskId: string, newStatus: Task['status']) => {
        const task = tasks.find((t) => t.id === taskId);
        if (task && task.status === newStatus) return; // No change

        setTasks(
            tasks.map((t) =>
                t.id === taskId ? { ...t, status: newStatus } : t,
            ),
        );
        const statusTitles: Record<string, string> = {
            todo: 'To Do',
            'in-progress': 'In Progress',
            done: 'Done',
        };
        toast.success(`Task moved to ${statusTitles[newStatus]}`, {
            position: 'bottom-right',
        });
    };

    const handleDeleteTask = (taskId: string) => {
        setTasks(tasks.filter((t) => t.id !== taskId));
        toast.success('Task deleted', { position: 'bottom-right' });
    };

    const handleGoToMeeting = (meetingId: string) => {
        router.push(`/meetings/${meetingId}`);
    };

    const openNewTaskDialog = (status: Task['status'] = 'todo') => {
        setNewTaskStatus(status);
        setShowCreateDialog(true);
    };

    const promptDeleteTask = (taskId: string) => {
        setTaskToDelete(taskId);
        setShowDeleteDialog(true);
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="animate-fade-in-up flex h-full flex-col p-6">
                {/* Header */}
                <div className="mb-6 flex shrink-0 items-center justify-between">
                    <div>
                        <h1 className="text-foreground mb-1 text-2xl font-semibold tracking-tight">
                            Task Board
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Manage your meeting action items and custom tasks
                        </p>
                    </div>
                    <Button onClick={() => openNewTaskDialog('todo')} size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        New Task
                    </Button>
                </div>

                {/* Kanban Board */}
                <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
                    <div className="flex h-full gap-4 px-1">
                        {columns.map((column) => (
                            <DroppableColumn
                                key={column.id}
                                column={column}
                                tasks={getTasksByStatus(column.id)}
                                meetings={meetings}
                                onMoveTask={handleMoveTask}
                                onDeleteTask={promptDeleteTask}
                                onGoToMeeting={handleGoToMeeting}
                                onNewTask={openNewTaskDialog}
                            />
                        ))}
                    </div>
                </div>

                {/* Create Task Dialog */}
                <Dialog
                    open={showCreateDialog}
                    onOpenChange={setShowCreateDialog}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Task</DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4 py-2">
                            <div className="space-y-1.5">
                                <label className="text-foreground text-sm font-medium">
                                    Title *
                                </label>
                                <Input
                                    placeholder="e.g. Review the final design assets"
                                    value={newTaskTitle}
                                    onChange={(e) =>
                                        setNewTaskTitle(e.target.value)
                                    }
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-foreground text-sm font-medium">
                                    Description
                                </label>
                                <Textarea
                                    placeholder="Add any extra details here..."
                                    value={newTaskDescription}
                                    onChange={(e) =>
                                        setNewTaskDescription(e.target.value)
                                    }
                                    rows={3}
                                    className="resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-foreground text-sm font-medium">
                                        Status
                                    </label>
                                    <Select
                                        value={newTaskStatus}
                                        onValueChange={(v) =>
                                            setNewTaskStatus(
                                                v as Task['status'],
                                            )
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="todo">
                                                To Do
                                            </SelectItem>
                                            <SelectItem value="in-progress">
                                                In Progress
                                            </SelectItem>
                                            <SelectItem value="done">
                                                Done
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-foreground text-sm font-medium">
                                        Priority
                                    </label>
                                    <Select
                                        value={newTaskPriority}
                                        onValueChange={(v) =>
                                            setNewTaskPriority(
                                                v as Task['priority'],
                                            )
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">
                                                Low
                                            </SelectItem>
                                            <SelectItem value="medium">
                                                Medium
                                            </SelectItem>
                                            <SelectItem value="high">
                                                High
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-foreground text-sm font-medium">
                                    Assignee
                                </label>
                                <Input
                                    placeholder="e.g. Alex"
                                    value={newTaskAssignee}
                                    onChange={(e) =>
                                        setNewTaskAssignee(e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setShowCreateDialog(false)}
                            >
                                Cancel
                            </Button>
                            <Button onClick={handleCreateTask}>
                                Create Task
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Delete Task Dialog */}
                <Dialog
                    open={showDeleteDialog}
                    onOpenChange={setShowDeleteDialog}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Task</DialogTitle>
                        </DialogHeader>
                        <div className="text-muted-foreground py-2 text-sm">
                            Are you sure you want to delete this task? This
                            action cannot be undone.
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setShowDeleteDialog(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => {
                                    if (taskToDelete) {
                                        handleDeleteTask(taskToDelete);
                                    }
                                    setShowDeleteDialog(false);
                                }}
                            >
                                Delete
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </DndProvider>
    );
}
