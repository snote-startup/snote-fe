import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getProjectTasks,
    getAllProjectTasks,
    generateProjectTasks,
    updateTask,
    deleteTask,
} from './api';
import type { UpdateTaskRequest, ProjectTask } from './types';
import { toast } from 'sonner';

export const taskKeys = {
    all: ['tasks'] as const,
    aggregate: () => ['tasks', 'aggregate'] as const,
    byProject: (projectId: string) => ['tasks', 'project', projectId] as const,
};

/**
 * Fetch all tasks for a project.
 */
export function useProjectTasks(
    projectId: string,
    options?: { refetchInterval?: number | false },
) {
    return useQuery({
        queryKey: taskKeys.byProject(projectId),
        queryFn: () => getProjectTasks(projectId),
        enabled: !!projectId,
        ...options,
    });
}

/**
 * Fetch tasks across all projects for the global tasks page.
 */
export function useAllProjectTasks() {
    return useQuery({
        queryKey: taskKeys.aggregate(),
        queryFn: getAllProjectTasks,
    });
}

/**
 * Generate tasks from project content/transcript.
 * On success: invalidates project and aggregate task queries.
 */
export function useGenerateProjectTasks(
    projectId: string,
    options?: { invalidateOnSuccess?: boolean },
) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => generateProjectTasks(projectId),
        onSuccess: () => {
            if (options?.invalidateOnSuccess === false) return;
            queryClient.invalidateQueries({
                queryKey: taskKeys.byProject(projectId),
            });
            queryClient.invalidateQueries({ queryKey: taskKeys.all });
            queryClient.invalidateQueries({ queryKey: taskKeys.aggregate() });
        },
    });
}

/**
 * Update a task (content, status, priority).
 * Unified hook supporting both project-scoped and global tasks list.
 */
export function useUpdateTask(projectId?: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            taskId,
            body,
        }: {
            taskId: string;
            body: UpdateTaskRequest;
            projectId?: string;
        }) => updateTask(taskId, body),
        onMutate: async ({ taskId, body, projectId: varProjectId }) => {
            const pId = projectId || varProjectId;
            if (pId) {
                await queryClient.cancelQueries({
                    queryKey: taskKeys.byProject(pId),
                });

                const previous = queryClient.getQueryData<ProjectTask[]>(
                    taskKeys.byProject(pId),
                );

                queryClient.setQueryData<ProjectTask[]>(
                    taskKeys.byProject(pId),
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

                return { previous, projectId: pId };
            }
            return {};
        },
        onError: (err: Error, _vars, context) => {
            if (context?.previous && context?.projectId) {
                queryClient.setQueryData(
                    taskKeys.byProject(context.projectId),
                    context.previous,
                );
            }
            toast.error(err.message || 'Không thể cập nhật công việc.');
        },
        onSuccess: () => {
            toast.success('Đã cập nhật công việc.');
        },
        onSettled: (_data, _err, vars) => {
            const pId = projectId || vars.projectId;
            if (pId) {
                queryClient.invalidateQueries({
                    queryKey: taskKeys.byProject(pId),
                });
            }
            queryClient.invalidateQueries({ queryKey: taskKeys.aggregate() });
        },
    });
}

/**
 * Delete a task.
 * Unified hook supporting both project-scoped and global tasks list.
 */
export function useDeleteTask(projectId?: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (args: string | { taskId: string; projectId?: string }) => {
            const taskId = typeof args === 'string' ? args : args.taskId;
            return deleteTask(taskId);
        },
        onMutate: async (args) => {
            const taskId = typeof args === 'string' ? args : args.taskId;
            const pId =
                projectId ||
                (typeof args === 'string' ? undefined : args.projectId);

            if (pId) {
                await queryClient.cancelQueries({
                    queryKey: taskKeys.byProject(pId),
                });

                const previous = queryClient.getQueryData<ProjectTask[]>(
                    taskKeys.byProject(pId),
                );

                queryClient.setQueryData<ProjectTask[]>(
                    taskKeys.byProject(pId),
                    (old) => old?.filter((t) => t.id !== taskId) ?? [],
                );

                return { previous, projectId: pId };
            }
            return {};
        },
        onError: (err: Error, _vars, context) => {
            if (context?.previous && context?.projectId) {
                queryClient.setQueryData(
                    taskKeys.byProject(context.projectId),
                    context.previous,
                );
            }
            toast.error(err.message || 'Không thể xóa công việc.');
        },
        onSettled: (_data, _err, args) => {
            const pId =
                projectId ||
                (typeof args === 'string' ? undefined : args.projectId);
            if (pId) {
                queryClient.invalidateQueries({
                    queryKey: taskKeys.byProject(pId),
                });
            }
            queryClient.invalidateQueries({ queryKey: taskKeys.aggregate() });
        },
        onSuccess: () => {
            toast.success('Đã xóa công việc.');
        },
    });
}

/**
 * Backward-compatible wrapper for the global tasks board updates.
 */
export function useUpdateAggregatedTask() {
    const updateMutation = useUpdateTask();
    return {
        ...updateMutation,
        mutate: (
            vars: {
                taskId: string;
                projectId: string;
                body: UpdateTaskRequest;
            },
            options?: Parameters<typeof updateMutation.mutate>[1],
        ) =>
            updateMutation.mutate(
                {
                    taskId: vars.taskId,
                    projectId: vars.projectId,
                    body: vars.body,
                },
                options,
            ),
        mutateAsync: (
            vars: {
                taskId: string;
                projectId: string;
                body: UpdateTaskRequest;
            },
            options?: Parameters<typeof updateMutation.mutateAsync>[1],
        ) =>
            updateMutation.mutateAsync(
                {
                    taskId: vars.taskId,
                    projectId: vars.projectId,
                    body: vars.body,
                },
                options,
            ),
    };
}

/**
 * Backward-compatible wrapper for the global tasks board deletions.
 */
export function useDeleteAggregatedTask() {
    const deleteMutation = useDeleteTask();
    return {
        ...deleteMutation,
        mutate: (
            vars: { taskId: string; projectId: string },
            options?: Parameters<typeof deleteMutation.mutate>[1],
        ) =>
            deleteMutation.mutate(
                { taskId: vars.taskId, projectId: vars.projectId },
                options,
            ),
        mutateAsync: (
            vars: { taskId: string; projectId: string },
            options?: Parameters<typeof deleteMutation.mutateAsync>[1],
        ) =>
            deleteMutation.mutateAsync(
                { taskId: vars.taskId, projectId: vars.projectId },
                options,
            ),
    };
}
