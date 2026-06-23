import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getProjectTasks,
    generateProjectTasks,
    updateTask,
    deleteTask,
} from './api';
import type { UpdateTaskRequest, ProjectTask } from './types';
import { toast } from 'sonner';

export const taskKeys = {
    all: ['tasks'] as const,
    byProject: (projectId: string) => ['project', projectId, 'tasks'] as const,
};

/**
 * Fetch all tasks for a project.
 */
export function useProjectTasks(projectId: string) {
    return useQuery({
        queryKey: taskKeys.byProject(projectId),
        queryFn: () => getProjectTasks(projectId),
        enabled: !!projectId,
    });
}

/**
 * Generate tasks from project content/transcript.
 * On success: invalidates the tasks query and shows a toast.
 */
export function useGenerateProjectTasks(projectId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => generateProjectTasks(projectId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: taskKeys.byProject(projectId),
            });
            toast.success('Tasks generated successfully');
        },
        onError: (err: Error) => {
            toast.error(err.message || 'Failed to generate tasks');
        },
    });
}

/**
 * Update a task (content, status, priority).
 * Optimistic update for instant UI feedback.
 */
export function useUpdateTask(projectId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            taskId,
            body,
        }: {
            taskId: string;
            body: UpdateTaskRequest;
        }) => updateTask(taskId, body),
        onMutate: async ({ taskId, body }) => {
            await queryClient.cancelQueries({
                queryKey: taskKeys.byProject(projectId),
            });

            const previous = queryClient.getQueryData<ProjectTask[]>(
                taskKeys.byProject(projectId),
            );

            queryClient.setQueryData<ProjectTask[]>(
                taskKeys.byProject(projectId),
                (old) =>
                    old?.map((t) =>
                        t.id === taskId
                            ? {
                                  ...t,
                                  ...(body.content !== undefined &&
                                  body.content !== null
                                      ? { content: body.content }
                                      : {}),
                                  ...(body.status !== undefined &&
                                  body.status !== null
                                      ? { status: body.status }
                                      : {}),
                                  ...(body.priority !== undefined &&
                                  body.priority !== null
                                      ? { priority: body.priority }
                                      : {}),
                              }
                            : t,
                    ) ?? [],
            );

            return { previous };
        },
        onError: (err: Error, _vars, context) => {
            if (context?.previous) {
                queryClient.setQueryData(
                    taskKeys.byProject(projectId),
                    context.previous,
                );
            }
            toast.error(err.message || 'Failed to update task');
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: taskKeys.byProject(projectId),
            });
        },
    });
}

/**
 * Delete a task.
 * Optimistic removal.
 */
export function useDeleteTask(projectId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (taskId: string) => deleteTask(taskId),
        onMutate: async (taskId) => {
            await queryClient.cancelQueries({
                queryKey: taskKeys.byProject(projectId),
            });

            const previous = queryClient.getQueryData<ProjectTask[]>(
                taskKeys.byProject(projectId),
            );

            queryClient.setQueryData<ProjectTask[]>(
                taskKeys.byProject(projectId),
                (old) => old?.filter((t) => t.id !== taskId) ?? [],
            );

            return { previous };
        },
        onError: (err: Error, _taskId, context) => {
            if (context?.previous) {
                queryClient.setQueryData(
                    taskKeys.byProject(projectId),
                    context.previous,
                );
            }
            toast.error(err.message || 'Failed to delete task');
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: taskKeys.byProject(projectId),
            });
        },
        onSuccess: () => {
            toast.success('Task deleted');
        },
    });
}
