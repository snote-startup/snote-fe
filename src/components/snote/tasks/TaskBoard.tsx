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
import { Plus, Calendar, ExternalLink, Trash2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { useApp } from '@/providers/snote-app-provider';
import type { Task } from '@/lib/snote/mock-data';
import { toast } from 'sonner';
import { format } from 'date-fns';

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

    const columns = [
        { id: 'todo', title: 'To Do', color: 'purple' },
        { id: 'in-progress', title: 'In Progress', color: 'yellow' },
        { id: 'done', title: 'Done', color: 'green' },
    ];

    const getTasksByStatus = (status: string) => {
        return tasks.filter((task) => task.status === status);
    };

    const handleCreateTask = () => {
        if (!newTaskTitle.trim()) {
            toast.error('Please enter a task title');
            return;
        }

        const newTask: Task = {
            id: Date.now().toString(),
            title: newTaskTitle,
            description: newTaskDescription || undefined,
            status: 'todo',
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
        toast.success('Task created');
    };

    const handleMoveTask = (taskId: string, newStatus: Task['status']) => {
        setTasks(
            tasks.map((t) =>
                t.id === taskId ? { ...t, status: newStatus } : t,
            ),
        );
        toast.success('Task moved');
    };

    const handleDeleteTask = (taskId: string) => {
        setTasks(tasks.filter((t) => t.id !== taskId));
        toast.success('Task deleted');
    };

    const handleGoToMeeting = (meetingId: string) => {
        router.push(`/meetings/${meetingId}`);
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'text-red-600 bg-red-100';
            case 'medium':
                return 'text-yellow-600 bg-yellow-100';
            case 'low':
                return 'text-gray-600 bg-gray-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <>
            <div className="mx-auto flex h-full max-w-7xl flex-col p-8">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="mb-2 text-3xl font-semibold text-gray-900">
                                Task Board
                            </h1>
                            <p className="text-gray-600">
                                Manage tasks from meetings and custom action
                                items
                            </p>
                        </div>
                        <Button onClick={() => setShowCreateDialog(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            New Task
                        </Button>
                    </div>
                </div>

                {/* Kanban Board */}
                <div className="flex-1 overflow-hidden">
                    <div className="grid h-full grid-cols-3 gap-4">
                        {columns.map((column) => {
                            const columnTasks = getTasksByStatus(column.id);

                            return (
                                <div
                                    key={column.id}
                                    className="flex flex-col rounded-xl bg-gray-50 p-4"
                                >
                                    {/* Column Header */}
                                    <div className="mb-4 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-gray-900">
                                                {column.title}
                                            </h3>
                                            <span className="rounded-full bg-white px-2 py-0.5 text-sm text-gray-500">
                                                {columnTasks.length}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Tasks */}
                                    <div className="flex-1 space-y-3 overflow-y-auto">
                                        {columnTasks.length === 0 ? (
                                            <div className="py-8 text-center text-sm text-gray-500">
                                                No tasks
                                            </div>
                                        ) : (
                                            columnTasks.map((task) => {
                                                const taskMeeting =
                                                    task.meetingId
                                                        ? meetings.find(
                                                              (m) =>
                                                                  m.id ===
                                                                  task.meetingId,
                                                          )
                                                        : null;

                                                return (
                                                    <div
                                                        key={task.id}
                                                        className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                                                    >
                                                        {/* Priority Badge */}
                                                        <div className="mb-2 flex items-start justify-between">
                                                            <span
                                                                className={`rounded px-2 py-0.5 text-xs font-medium ${getPriorityColor(task.priority)}`}
                                                            >
                                                                {task.priority}
                                                            </span>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setTaskToDelete(
                                                                        task.id,
                                                                    );
                                                                    setShowDeleteDialog(
                                                                        true,
                                                                    );
                                                                }}
                                                                className="h-6 w-6 p-0"
                                                            >
                                                                <Trash2 className="h-3 w-3 text-gray-400 hover:text-red-600" />
                                                            </Button>
                                                        </div>

                                                        {/* Task Title */}
                                                        <h4 className="mb-2 font-medium text-gray-900">
                                                            {task.title}
                                                        </h4>

                                                        {/* Task Description */}
                                                        {task.description && (
                                                            <p className="mb-3 line-clamp-2 text-sm text-gray-600">
                                                                {
                                                                    task.description
                                                                }
                                                            </p>
                                                        )}

                                                        {/* Metadata */}
                                                        <div className="space-y-2 text-xs text-gray-500">
                                                            {task.assignee && (
                                                                <div>
                                                                    Assignee:{' '}
                                                                    {
                                                                        task.assignee
                                                                    }
                                                                </div>
                                                            )}
                                                            {task.dueDate && (
                                                                <div className="flex items-center gap-1">
                                                                    <Calendar className="h-3 w-3" />
                                                                    Due{' '}
                                                                    {format(
                                                                        task.dueDate,
                                                                        'MMM d',
                                                                    )}
                                                                </div>
                                                            )}
                                                            {taskMeeting && (
                                                                <button
                                                                    onClick={() =>
                                                                        handleGoToMeeting(
                                                                            task.meetingId!,
                                                                        )
                                                                    }
                                                                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                                                                >
                                                                    <ExternalLink className="h-3 w-3" />
                                                                    {
                                                                        taskMeeting.title
                                                                    }
                                                                </button>
                                                            )}
                                                        </div>

                                                        {/* Move Actions */}
                                                        <div className="mt-3 flex gap-2 border-t border-gray-100 pt-3">
                                                            {column.id ===
                                                                'todo' && (
                                                                <>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="flex-1 text-xs"
                                                                        onClick={() =>
                                                                            handleMoveTask(
                                                                                task.id,
                                                                                'in-progress',
                                                                            )
                                                                        }
                                                                    >
                                                                        In
                                                                        Progress
                                                                    </Button>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="flex-1 text-xs"
                                                                        onClick={() =>
                                                                            handleMoveTask(
                                                                                task.id,
                                                                                'done',
                                                                            )
                                                                        }
                                                                    >
                                                                        Done
                                                                    </Button>
                                                                </>
                                                            )}
                                                            {column.id ===
                                                                'in-progress' && (
                                                                <>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="flex-1 text-xs"
                                                                        onClick={() =>
                                                                            handleMoveTask(
                                                                                task.id,
                                                                                'todo',
                                                                            )
                                                                        }
                                                                    >
                                                                        To Do
                                                                    </Button>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="flex-1 text-xs"
                                                                        onClick={() =>
                                                                            handleMoveTask(
                                                                                task.id,
                                                                                'done',
                                                                            )
                                                                        }
                                                                    >
                                                                        Done
                                                                    </Button>
                                                                </>
                                                            )}
                                                            {column.id ===
                                                                'done' && (
                                                                <>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="flex-1 text-xs"
                                                                        onClick={() =>
                                                                            handleMoveTask(
                                                                                task.id,
                                                                                'todo',
                                                                            )
                                                                        }
                                                                    >
                                                                        To Do
                                                                    </Button>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="flex-1 text-xs"
                                                                        onClick={() =>
                                                                            handleMoveTask(
                                                                                task.id,
                                                                                'in-progress',
                                                                            )
                                                                        }
                                                                    >
                                                                        In
                                                                        Progress
                                                                    </Button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Create Task Dialog */}
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Task</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-900">
                                Title *
                            </label>
                            <Input
                                placeholder="Enter task title"
                                value={newTaskTitle}
                                onChange={(e) =>
                                    setNewTaskTitle(e.target.value)
                                }
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-900">
                                Description
                            </label>
                            <Textarea
                                placeholder="Enter task description"
                                value={newTaskDescription}
                                onChange={(e) =>
                                    setNewTaskDescription(e.target.value)
                                }
                                rows={3}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-900">
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
                                        <SelectItem value="low">Low</SelectItem>
                                        <SelectItem value="medium">
                                            Medium
                                        </SelectItem>
                                        <SelectItem value="high">
                                            High
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-900">
                                    Assignee
                                </label>
                                <Input
                                    placeholder="Enter assignee name"
                                    value={newTaskAssignee}
                                    onChange={(e) =>
                                        setNewTaskAssignee(e.target.value)
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowCreateDialog(false)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleCreateTask}>Create Task</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Task Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Are you sure you want to delete this task?
                        </DialogTitle>
                    </DialogHeader>

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
                            Delete Task
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
