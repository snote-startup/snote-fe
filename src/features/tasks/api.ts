import { apiClient } from '@/lib/api/axios-config';
import { getProjects } from '@/features/projects/api';
import type {
    AllProjectTasksResult,
    AggregatedTask,
    ProjectTask,
    UpdateTaskRequest,
} from './types';

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
 * Aggregate project-scoped tasks for the global /tasks route.
 * Backend does not expose GET /task yet, so this intentionally fans out:
 * GET /project -> GET /project/{id}/task for each project.
 */
export async function getAllProjectTasks(): Promise<AllProjectTasksResult> {
    const projects = await getProjects();

    if (projects.length === 0) {
        return {
            tasks: [],
            failedProjects: [],
            projectCount: 0,
        };
    }

    const settled = await Promise.allSettled(
        projects.map(async (project) => {
            const tasks = await getProjectTasks(project.id);
            return tasks.map<AggregatedTask>((task) => ({
                ...task,
                projectId: project.id,
                projectTitle: project.title,
            }));
        }),
    );

    const tasks: AggregatedTask[] = [];
    const failedProjects: AllProjectTasksResult['failedProjects'] = [];

    settled.forEach((result, index) => {
        const project = projects[index];
        if (result.status === 'fulfilled') {
            tasks.push(...result.value);
            return;
        }

        failedProjects.push({
            projectId: project.id,
            projectTitle: project.title,
            message:
                result.reason instanceof Error
                    ? result.reason.message
                    : 'Không tải được công việc của dự án này.',
        });
    });

    if (tasks.length === 0 && failedProjects.length === projects.length) {
        throw new Error('Không tải được công việc từ các dự án.');
    }

    return {
        tasks,
        failedProjects,
        projectCount: projects.length,
    };
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
