# Retry Policy Tuning Report

Retry policy changed from dense polling to sparse long-delay polling to avoid backend request spam while allowing AI jobs enough processing time.

## Summary

Transcript and task generation now use bounded retry cycles with sparse long-delay schedules. Each cycle uses one POST request to start the backend AI job and a maximum of four scheduled GET requests to check for generated data.

## Backend Feedback

Backend feedback indicated that the previous frontend behavior risked sending too many requests while AI jobs were still processing. User observation also showed transcript and task generation can take around 60 seconds or longer.

## Transcript Retry Schedule

When a project has `audio_url` and no transcript segments, the frontend sends `POST /project/{id}/transcript` at most once per cycle, then polls `GET /project/{id}/transcript` with:

- attempt 1 after 20 seconds
- attempt 2 after 45 seconds
- attempt 3 after 75 seconds
- attempt 4 after 120 seconds

If transcript data appears on any attempt, polling stops immediately. If all attempts return empty data, the UI shows that the transcript is not ready and allows a new cycle from the check-again button.

## Task Retry Schedule

When the user clicks generate tasks, the frontend sends `POST /project/{id}/task` once for that click, then polls `GET /project/{id}/task` with:

- attempt 1 after 15 seconds
- attempt 2 after 35 seconds
- attempt 3 after 60 seconds
- attempt 4 after 90 seconds

If task data appears on any attempt, polling stops immediately. If all attempts return empty data, the UI shows that tasks are not ready and lets the user try again later.

## Request Spam Prevention

The dense `refetchInterval` transcript polling and 2-second task polling loop were replaced with `setTimeout` schedules. Timeout cleanup runs on component unmount, active cycle IDs prevent stale callbacks from continuing, and pending states disable retry/generate buttons while a cycle is running.

Transcript generation is guarded by `projectId + audio_url` so React StrictMode does not trigger duplicate POST requests for the same automatic generation cycle. Task generation is guarded by a per-click generation cycle and an in-flight ref.

## Files Changed

- `src/components/snote/meetings/MeetingDetail.tsx`
- `src/components/snote/meetings/ProjectTasksPanel.tsx`
- `src/features/projects/hooks.ts`
- `src/features/tasks/hooks.ts`
- `src/features/i18n/dictionaries.ts`
- `docs/retry-policy-tuning-report.md`

## Validation

- `bun run lint`
- `bun run build`
- `rm -rf .next && bun run dev`
- Manual Network check when a browser session is available
- Staged diff token scan before commit
