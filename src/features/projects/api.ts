import { apiClient } from '@/lib/api/axios-config';
import {
    Project,
    CreateProjectRequest,
    UpdateProjectRequest,
    TranscriptSegment,
    PaginatedChatMessages,
} from './types';

export async function getProjects(): Promise<Project[]> {
    return apiClient.get('/project');
}

export async function createProject(
    payload: CreateProjectRequest,
): Promise<string> {
    const responseData = (await apiClient.post('/project', payload)) as unknown;

    // Safe parsing for string UUID (raw, JSON string, or object fallback)
    let id = '';
    if (typeof responseData === 'string') {
        id = responseData.trim();
        if (id.startsWith('"') && id.endsWith('"')) {
            id = id.slice(1, -1);
        }
    } else if (responseData && typeof responseData === 'object') {
        const obj = responseData as Record<string, unknown>;
        if (typeof obj.id === 'string') {
            id = obj.id;
        } else {
            id = JSON.stringify(responseData);
        }
    }

    if (!id) {
        throw new Error('Invalid project ID response from server');
    }

    return id;
}

export async function getProject(id: string): Promise<Project> {
    return apiClient.get(`/project/${id}`);
}

export async function updateProject(
    id: string,
    payload: UpdateProjectRequest,
): Promise<void> {
    return apiClient.patch(`/project/${id}`, payload);
}

export async function getProjectTranscript(
    id: string,
): Promise<TranscriptSegment[]> {
    return apiClient.get(`/project/${id}/transcript`);
}

export async function getProjectChatMessages(
    id: string,
    params?: { limit?: number; cursor?: string | null },
): Promise<PaginatedChatMessages> {
    const queryParams: Record<string, string | number | null | undefined> = {
        limit: params?.limit ?? 20,
    };
    if (params?.cursor) {
        queryParams.cursor = params.cursor;
    }
    return apiClient.get(`/project/${id}/chat`, { params: queryParams });
}
