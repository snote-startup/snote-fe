import { apiClient } from '@/lib/api/axios-config';
import type { ProjectTask, UpdateTaskRequest } from './types';

/**
 * GET /project/{projectId}/task
 * Returns list of tasks for a project.
 */
export async function getProjectTasks(
    projectId: string,
): Promise<ProjectTask[]> {
    return apiClient.get(`/project/${projectId}/task`);
}

/**
 * POST /project/{projectId}/task
 * Generate tasks from project content/transcript.
 * No body. Expected response: 204 No Content.
 */
export async function generateProjectTasks(projectId: string): Promise<void> {
    await apiClient.post(`/project/${projectId}/task`);
}

/**
 * PATCH /task/{taskId}
 * Update specific fields of a task.
 */
export async function updateTask(
    taskId: string,
    body: UpdateTaskRequest,
): Promise<void> {
    await apiClient.patch(`/task/${taskId}`, body);
}

/**
 * DELETE /task/{taskId}
 * Permanently delete a task.
 */
export async function deleteTask(taskId: string): Promise<void> {
    await apiClient.delete(`/task/${taskId}`);
}
