import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getProjects,
    createProject,
    getProject,
    updateProject,
    getProjectTranscript,
    getProjectChatMessages,
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

export function useProjectTranscript(id: string) {
    return useQuery({
        queryKey: projectKeys.transcript(id),
        queryFn: () => getProjectTranscript(id),
        enabled: !!id,
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
