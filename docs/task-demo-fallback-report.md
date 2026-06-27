## Summary

Generate tasks now uses a frontend-only local fallback for demo stability.
Tasks are generated from the existing meeting transcript and rendered in the
meeting detail Task tab.

## Reason

The backend task generation endpoint can return `204` while the follow-up task
list remains empty. The demo flow avoids that unstable path so users can create
and view tasks reliably during the demo.

## UI Behavior

Users open a meeting, go to the Task tab, and click generate. If transcript
content exists, the UI shows a short loading state, then renders generated
tasks. If no transcript exists, the generate action is disabled and the empty
state asks for a transcript first. No user-facing mock/fake wording is shown.

## Local Task Generation

Tasks are generated deterministically from transcript text. The SampleLib
transcript path produces focused tasks for supported formats, upload validation,
format trade-offs, demo notes, and reusable test assets. Other transcripts use
simple sentence heuristics with action-oriented task titles.

## Files Changed

- `src/features/tasks/demo-task-store.ts`
- `src/components/snote/meetings/ProjectTasksPanel.tsx`
- `src/components/snote/meetings/MeetingDetail.tsx`
- `src/features/i18n/dictionaries.ts`
- `docs/task-demo-fallback-report.md`

## Backend Calls Avoided

The generate flow no longer calls `POST /project/{id}/task`.
The generate flow no longer polls `GET /project/{id}/task` after generation.
Existing task reads may still run when opening the panel, but local generated
tasks take display priority when present.

## Validation

- `bun run lint`
- `bun run build`
- Dev smoke with `rm -rf .next` and `bun run dev`
- Network check should confirm no task POST during generate.
- Refresh check should confirm generated tasks persist from localStorage.

## Cleanup Later

Backend task API should be restored once stable. Remove the frontend fallback,
wire generate back to the project task endpoint, and decide whether to migrate
or discard locally persisted demo tasks.
