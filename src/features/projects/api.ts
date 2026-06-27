import { apiClient } from '@/lib/api/axios-config';
import { getApiUrl } from '@/lib/api/api-url';
import { getStoredAuthTokens } from '@/lib/api/auth-token-storage';
import { parseChatResponse } from './chat-parser';
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
        throw new Error('Backend trả về ID dự án không hợp lệ.');
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

export async function triggerProjectTranscript(id: string): Promise<void> {
    await apiClient.post(`/project/${id}/transcript`);
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
    return apiClient.get(`/project/${id}/chat/history`, {
        params: queryParams,
    });
}

/**
 * Upload audio file for transcript generation.
 * Uses multipart/form-data with field name "audio".
 * Expected response: 204 No Content.
 */
export async function uploadProjectAudio(
    id: string,
    file: File,
): Promise<void> {
    const formData = new FormData();
    formData.append('audio', file);

    // Do NOT set Content-Type manually — browser must set multipart boundary.
    await apiClient.post(`/project/${id}/upload`, formData, {
        headers: {
            // Override default application/json; let axios set multipart correctly
            'Content-Type': undefined,
            Accept: 'application/json',
        },
    });
}

export interface SendChatOptions {
    onChunk?: (chunk: string) => void;
    signal?: AbortSignal;
}

export interface ChatResponse {
    raw: string;
    answer: string;
    references: string[];
}

/**
 * Send a chat message and stream the response.
 * Uses fetch() for streaming support (axios does not stream in browser).
 * Parses <<<REFERENCES>>> delimiter at end of stream.
 */
export async function sendProjectChatMessage(
    id: string,
    prompt: string,
    options?: SendChatOptions,
): Promise<ChatResponse> {
    const apiUrl = getApiUrl();
    const { accessToken } = getStoredAuthTokens();

    if (!accessToken) {
        throw new Error(
            'Phiên đăng nhập không còn hiệu lực. Vui lòng đăng nhập lại.',
        );
    }

    const cleanApiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;

    const response = await fetch(`${cleanApiUrl}/project/${id}/chat`, {
        method: 'POST',
        headers: {
            Authorization: accessToken ? `Bearer ${accessToken}` : '',
            Accept: 'text/plain',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
        signal: options?.signal,
    });

    if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        throw new Error(
            errorText || `Không gửi được câu hỏi (${response.status})`,
        );
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let raw = '';

    if (!reader) {
        raw = await response.text();
    } else {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            raw += chunk;
            options?.onChunk?.(chunk);
        }
        // Flush remaining bytes
        raw += decoder.decode();
    }

    return {
        raw,
        ...parseChatResponse(raw),
    };
}
