export interface Project {
    id: string;
    title: string;
    description: string | null;
    audio_url: string | null;
}

export interface CreateProjectRequest {
    title: string;
    description?: string | null;
}

export interface UpdateProjectRequest {
    title?: string | null;
    description?: string | null;
}

export interface TranscriptSegment {
    id?: string;
    speaker: string;
    text: string;
    start: number;
    end: number;
}

export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
    id: string;
    role: ChatRole;
    content: string;
    created_at: string;
}

export interface PaginatedChatMessages {
    data: ChatMessage[];
    next_cursor?: string | null;
}
