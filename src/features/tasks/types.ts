export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface ProjectTask {
    id: string;
    status: TaskStatus;
    priority: TaskPriority;
    content: string;
    created_at: string;
}

export type AggregatedTask = ProjectTask & {
    projectId: string;
    projectTitle: string;
};

export interface ProjectTaskFetchFailure {
    projectId: string;
    projectTitle: string;
    message: string;
}

export interface AllProjectTasksResult {
    tasks: AggregatedTask[];
    failedProjects: ProjectTaskFetchFailure[];
    projectCount: number;
}

export interface UpdateTaskRequest {
    content?: string | null;
    status?: TaskStatus | null;
    priority?: TaskPriority | null;
}
