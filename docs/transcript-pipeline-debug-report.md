# Transcript Pipeline Debug Report

## Summary
Investigated the cause of the `404` error in the transcript/translation flow after audio recording or upload is completed. The direct API tests show that the core transcript retrieval (`GET /project/{id}/transcript`) is fully functional. The main causes of user-facing errors are:
1. The chat/AI assistant endpoint `POST /project/{id}/chat` returns a `404 Not Found` with a message `"No project with given id"` when there are no transcript segments generated yet for that project.
2. The frontend failed to automatically poll or refetch the transcript segments when an audio was recorded via WebSocket streaming (or when the page was refreshed after upload). Since `isTranscriptPolling` was only set to `true` inside the `UploadSection`'s callback, the UI remained stuck in the "Chưa có transcript" (No transcript yet) empty state.

## Exact 404 Request
* **Method**: `POST`
* **URL**: `https://snote-api.akagiyuu.dev/project/{id}/chat`
* **Status**: `404 Not Found`
* **Response Body**: `{"message":"No project with given id","detail":null}`
* **Request Payload**: `{"prompt": "..."}`
* **Content-Type**: `application/json`
* **Trigger**: Trying to send a chat message when the project does not have any transcript segments generated yet.

## FE Source Inspection
* **API File**: [api.ts](file:///home/dorriss-dev/Projects/snote/snote-fe/src/features/projects/api.ts#L82-L97)
  - `uploadProjectAudio` calls `POST /project/{id}/upload` which aligns with the OpenAPI spec.
  - `getProjectTranscript` calls `GET /project/{id}/transcript`.
  - `sendProjectChatMessage` calls `POST /project/{id}/chat`.
* **Component File**: [MeetingDetail.tsx](file:///home/dorriss-dev/Projects/snote/snote-fe/src/components/snote/meetings/MeetingDetail.tsx)
  - `isTranscriptPolling` controls the refetch interval for transcripts. It was only set to `true` when a manual file upload succeeded. It was not automatically initiated when visiting a project detail page with an existing `audio_url` but no transcript, or when WebSocket recording stopped.

## Direct API Results
Tested using active token on project `3c12b5bf-b1e0-4292-b30b-addedf405825`:
* **Project Status**: `200 OK`
* **audio_url present?**: `yes`
* **GET transcript status**: `200 OK`
* **GET transcript body shape**: Array of objects with `id`, `speaker`, `text`, `start`, `end`.
* **transcript count**: 1 segment.

## Upload Endpoint Result
Tested using `ws-sample.webm` on new project `df66d88d-d6eb-402d-9c82-a4bd9165d586`:
* **Endpoint**: `POST /project/{id}/upload`
* **Status**: `204 No Content`
* **audio_url before/after**: `null` -> `https://hcm.ss.bfcplatform.vn/snote/df66d88d-d6eb-402d-9c82-a4bd9165d586/audio`

## Transcript Polling Result
Polled the new project status and transcript:
* **audio_url before/after**: `null` -> `https://hcm.ss.bfcplatform.vn/snote/df66d88d-d6eb-402d-9c82-a4bd9165d586/audio` (appeared immediately after upload).
* **transcript status before/after**: `200 OK` with empty array `[]` -> `200 OK` with populated segments array.
* **transcript count after 30/60/90s**: `0` -> `0` -> `1` (appeared around 60 seconds mark).

## Root Cause
1. **Frontend-initiated Chat 404**: The backend `POST /project/{id}/chat` returns a confusing `404` error code when the transcript is not yet ready.
2. **Missing FE Polling Trigger**: The frontend lacked auto-polling logic for cases where `audio_url` was present but `transcript` was empty (e.g. after browser WebSocket direct recording, or after a page reload).

## FE Fix Applied
* **MeetingDetail.tsx**:
  - Added a `useEffect` that triggers `isTranscriptPolling = true` when `project.audio_url` is present but the `transcript` is empty.
  - Increased the polling timeout duration inside `TranscriptPanel` from 60 seconds to 90 seconds.
  - Updated the "Kiểm tra lại" (Check again) button click handler to reset the polling timeout so users can manually resume polling.
* **dictionaries.ts**:
  - Updated `generating` copy to: `"Đang tạo transcript từ audio..."` / `"Generating transcript from audio..."`.
  - Updated `processing` copy to: `"Transcript chưa sẵn sàng."` / `"Transcript is not ready yet."`.
  - Updated `processingDesc` copy to: `"Vui lòng thử lại sau ít phút."` / `"Please try again in a few minutes."`.

## Backend Questions
1. Why does `POST /project/{id}/chat` return a `404` error code with `"No project with given id"` when the project actually exists but simply lacks a transcript? It should return a more descriptive status (like `400 Bad Request` with a "No transcript generated yet" error message).
