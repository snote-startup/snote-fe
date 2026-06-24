# Task API Integration Report

## Overview

Project-scoped task APIs remain the source of truth. The global `/tasks` page now aggregates from those real project-scoped endpoints instead of showing a placeholder or mock task board.

## API Layer

- `src/features/tasks/types.ts`
    - `ProjectTask`, `TaskStatus`, `TaskPriority`, `UpdateTaskRequest`.
    - `AggregatedTask` adds `projectId` and `projectTitle` for `/tasks`.
    - `AllProjectTasksResult` tracks flattened tasks and partial project fetch failures.
- `src/features/tasks/api.ts`
    - `getProjectTasks(projectId)` -> `GET /project/{id}/task`.
    - `generateProjectTasks(projectId)` -> `POST /project/{id}/task`.
    - `updateTask(taskId, body)` -> `PATCH /task/{id}`.
    - `deleteTask(taskId)` -> `DELETE /task/{id}`.
    - `getAllProjectTasks()` -> `GET /project`, then fan-out `GET /project/{id}/task`.
- `src/features/tasks/hooks.ts`
    - Project task hooks remain intact.
    - Aggregate hooks were added for `/tasks`.
    - Mutations invalidate both project-scoped task query and aggregate task query.

## `/tasks` Route

- Implemented as `Tất cả công việc`.
- Supports:
    - Search by task content and project title.
    - Filters: all, todo, in progress, done, low/medium/high priority.
    - Project link to `/meetings/{projectId}`.
    - Status update via `PATCH /task/{id}`.
    - Priority update via `PATCH /task/{id}`.
    - Content edit via `PATCH /task/{id}`.
    - Delete via `DELETE /task/{id}`.
- Partial failures are shown as a warning while still rendering successful project tasks.
- If all task fetches fail, the page enters an error state.

## Project Detail Task Panel

- Existing project-scoped task UI remains backed by:
    - `GET /project/{id}/task`.
    - `POST /project/{id}/task`.
    - `PATCH /task/{id}`.
    - `DELETE /task/{id}`.
- Vietnamese labels and toasts were applied.
- No global mock task data is used for visible task flows.

## Performance Note

The aggregate `/tasks` route intentionally fans out task requests per project because backend does not expose global `GET /task` yet. This is acceptable for demo scale, but backend should add a global task endpoint before large workspaces.

## Verification

- `bun run lint`: pass.
- `bun run build`: pass.
- Dev route smoke: `/tasks` returned `200 OK`.
- Authenticated network mutation smoke was not run because `SNOTE_ACCESS_TOKEN` was not available.
