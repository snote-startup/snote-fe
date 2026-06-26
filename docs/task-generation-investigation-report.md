## Summary

Live task generation could not be reproduced end-to-end in this run because the local `.env.local` access token is expired and every protected project/task request returned `401`.

FE inspection did find a concrete issue: meeting detail task generation only polled for about 15 seconds after `POST /project/{id}/task`. That is too short for the expected async backend window of 10-90 seconds, and can make the Tasks tab stay empty while `/tasks` later shows data.

Owner from this run: **Unknown for backend generation**, with a **FE polling/cache UX fix applied**.

## Direct API Reproduction

Environment:

- API base: `https://snote-api.akagiyuu.dev`
- Project id: loaded from `.env.local`
- Token handling: token value was not printed or written to docs
- Token expiry: `2026-06-25T06:16:14Z`, which is expired for this run on `2026-06-26`

Results:

| Step | Result |
| --- | --- |
| `GET /project/{id}` | `401`, JSON object with `detail,message` |
| `GET /project/{id}/transcript` | `401`, JSON object with `detail,message` |
| `GET /project/{id}/task` before generate | `401`, JSON object with `detail,message` |
| `POST /project/{id}/task` | `401`, JSON object with `detail,message` |

Because the POST was rejected, no valid backend generation job was started in this run.

## Polling Timeline

The poll loop was started but stopped early after repeated auth failures:

| Poll | Status | Shape |
| --- | --- | --- |
| 1-13 | `401` | JSON object, not task array |

Task counts after 15s/30s/60s/90s could not be measured with this expired token.

## FE Cache/Query Inspection

Files inspected:

- `src/features/tasks/api.ts`
- `src/features/tasks/hooks.ts`
- `src/components/snote/meetings/ProjectTasksPanel.tsx`
- `src/components/snote/meetings/MeetingDetail.tsx`
- `src/app/(dashboard)/tasks/page.tsx`
- `src/components/snote/tasks/TaskBoard.tsx`

Findings:

- `useProjectTasks(projectId)` uses query key `['tasks', 'project', projectId]`.
- Aggregate `/tasks` uses key `['tasks', 'aggregate']`.
- Generate mutation invalidates both the project task query and aggregate query.
- Meeting detail renders `ProjectTasksPanel` with the route/project id for both desktop and mobile tabs.
- Display dedupes by task id in `ProjectTasksPanel`.
- Previous polling was `1500ms` with max `pollCount > 10`, effectively about 15 seconds.
- Generate/regenerate buttons were only disabled while the POST mutation was pending, not for the full polling window.

## Root Cause

Live backend ownership is inconclusive because auth failed before generation.

Confirmed FE issue:

- The UI stopped polling too early for an async backend flow.
- A `204` response was previously treated as user-visible success even though tasks might not exist yet.
- Users could click generate again while FE was still waiting for generated tasks after the POST returned.

This matches Case 3 from the task brief when backend creates tasks slowly, and can present like Case 4 if `/tasks` loads after backend generation finishes.

## Fix Applied or Backend Blocker

FE fix applied:

- Polling extended to 30 attempts at 3 seconds each, up to 90 seconds.
- Generate/regenerate controls stay disabled while polling.
- Loading text now uses:
  - VI: `Đang tạo task từ transcript...`
  - EN: `Generating tasks from transcript...`
- If no tasks are visible by the end of polling, the UI shows:
  - VI: `Task chưa sẵn sàng. Vui lòng thử lại sau ít phút.`
  - EN: `Tasks are not ready yet. Please try again in a few minutes.`
- Removed the premature success toast from `POST /project/{id}/task`.

Backend blocker:

- Need a fresh non-expired token and a project with transcript to classify backend behavior as Case 1, 2, 3, or 4.
- `GET /auth/me` returned `500` with the expired token; backend should return a clean `401` instead.

## Evidence

Commands run:

- `bun install`
- direct curl smoke against project/transcript/task endpoints
- JWT expiry decode without printing token
- `rg`/source inspection for task hooks, API clients, query keys, invalidation, polling, and render paths
- `bun run lint`

Relevant code changes:

- `src/components/snote/meetings/ProjectTasksPanel.tsx`
- `src/features/tasks/hooks.ts`
- `src/features/i18n/dictionaries.ts`
