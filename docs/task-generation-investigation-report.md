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

## Retry With Env File Token

Environment retry:

- Env files loaded: `.env.local`, `.env`
- Token value: not printed and not written to docs/source
- Token expiry decoded: `2026-06-25T06:16:14Z`
- Project id source: env file

Auth sanity:

| Endpoint | Result |
| --- | --- |
| `GET /auth/me` | FAIL: `500`, response `{ "message": "Something went wrong", "detail": null }` |

Direct project/transcript/task retry:

- Not continued because auth sanity did not return `200`.
- Project GET status: not run after failed auth sanity.
- Transcript count: unknown.
- Task count before generation: unknown.

Task generation retry:

- Not triggered because the env-file token failed auth sanity.
- POST status: not run.
- Task count after 30s/60s/90s: unknown.

Classification:

- AI task issue owner remains **Unknown** from live backend evidence.
- The FE 90-second polling fix remains appropriate for the async case already identified by code inspection and prior repo evidence.

Backend bug:

- `GET /auth/me` returns `500` for the env-file token. Expired/invalid auth should return `401` so clients can clear session state deterministically.

Remaining blocker:

- A non-expired env-file token is still required to classify task generation as backend async success, backend worker failure, backend generation error, or FE cache/render issue.

### Resume Retry After Account Switch

Environment retry:

- Env files loaded: `.env.local`, `.env`
- Token value: not printed and not written to docs/source
- Token expiry decoded: `2026-06-25T06:16:14.000Z`
- Project id source: env file, `c1aa6eac-4c0d-4631-921b-a8ff20155603`

Auth sanity:

| Endpoint | Result |
| --- | --- |
| `GET /auth/me` | FAIL: `500`, response `{ "message": "Something went wrong", "detail": null }` |

Direct project/transcript/task retry:

- Not continued because the env-file token is still expired and auth sanity did not return `200`.
- Project GET status: skipped.
- Transcript count: unknown.
- Task count before generation: unknown.

Task generation retry:

- Not triggered.
- POST status: skipped.
- Task count after 30s/60s/90s: unknown.

Classification:

- AI task issue owner remains **Unknown** from live backend evidence.
- Current blocker is backend/auth behavior plus the need for a fresh token.

Check results:

- `bun run lint`: pass
- `bun run build`: pass
- Dev route smoke: pass for the required routes, including meeting detail for `c1aa6eac-4c0d-4631-921b-a8ff20155603`
