import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getProjects,
    createProject,
    getProject,
    updateProject,
    getProjectTranscript,
    getProjectChatMessages,
    uploadProjectAudio,
    triggerProjectTranscript,
} from './api';
import { CreateProjectRequest, UpdateProjectRequest } from './types';

export const projectKeys = {
    all: ['projects'] as const,
    lists: () => [...projectKeys.all, 'list'] as const,
    detail: (id: string) => [...projectKeys.all, 'detail', id] as const,
    transcript: (id: string) =>
        [...projectKeys.detail(id), 'transcript'] as const,
    chat: (id: string, cursor?: string | null) =>
        [...projectKeys.detail(id), 'chat', cursor ?? null] as const,
};

export function useProjects() {
    return useQuery({
        queryKey: projectKeys.lists(),
        queryFn: getProjects,
    });
}

export function useProject(id: string) {
    return useQuery({
        queryKey: projectKeys.detail(id),
        queryFn: () => getProject(id),
        enabled: !!id,
    });
}

export function useCreateProject() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: CreateProjectRequest) => createProject(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
        },
    });
}

export function useUpdateProject(id: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: UpdateProjectRequest) =>
            updateProject(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
            queryClient.invalidateQueries({ queryKey: projectKeys.detail(id) });
        },
    });
}

export interface UseProjectTranscriptOptions {
    /** Polling interval in ms. Set to a number to enable polling. Pass false or undefined to disable. */
    refetchInterval?: number | false;
    enabled?: boolean;
}

export function useProjectTranscript(
    id: string,
    options?: UseProjectTranscriptOptions,
) {
    return useQuery({
        queryKey: projectKeys.transcript(id),
        queryFn: () => getProjectTranscript(id),
        enabled:
            options?.enabled !== undefined ? options.enabled && !!id : !!id,
        refetchInterval: options?.refetchInterval,
    });
}

export function useTriggerProjectTranscript(
    id: string,
    options?: { invalidateOnSuccess?: boolean },
) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => triggerProjectTranscript(id),
        onSuccess: () => {
            if (options?.invalidateOnSuccess === false) return;
            queryClient.invalidateQueries({
                queryKey: projectKeys.transcript(id),
            });
        },
    });
}

export function useProjectChatMessages(
    id: string,
    params?: { limit?: number; cursor?: string | null },
) {
    return useQuery({
        queryKey: projectKeys.chat(id, params?.cursor),
        queryFn: () => getProjectChatMessages(id, params),
        enabled: !!id,
    });
}

/**
 * Upload audio mutation.
 * On success: invalidates project detail, transcript list, and project list.
 */
export function useUploadProjectAudio(id: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (file: File) => uploadProjectAudio(id, file),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: projectKeys.detail(id),
            });
            queryClient.invalidateQueries({
                queryKey: projectKeys.transcript(id),
            });
            queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
        },
    });
}
