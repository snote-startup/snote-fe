# Audio WebSocket Stream Integration Report (Superseded)

> [!NOTE]
> This integration design has been superseded by the simplified direct connection structure documented in [audio-stream-browser-direct-ws-report.md](file:///home/dorriss-dev/Projects/snote/snote-fe/docs/audio-stream-browser-direct-ws-report.md).

## Summary

This is audio recording over WebSocket, not realtime translation.

The frontend now has a project-scoped audio streaming module for `/project/{id}/stream`. It sends WebM audio bytes to the backend and expects the backend to store the final audio file after the WebSocket closes. Transcript and task generation remain separate follow-up API flows.

## Backend Understanding

- Browser opens `wss://snote-api.akagiyuu.dev/project/{id}/stream`.
- Client sends audio bytes during the WebSocket session.
- Backend does not require complex client metadata for this phase.
- Backend stores accumulated bytes after the client closes the WebSocket.
- `GET /project/{id}` should expose `audio_url` after storage completes.
- Transcript creation remains a separate frontend action after audio exists.

## Implemented Modules

- `src/features/audio-stream/types.ts`
    - Shared stream status, events, auth modes, capture options, and file-streaming result types.
- `src/features/audio-stream/project-stream-client.ts`
    - Builds `ws://`/`wss://` URLs from the configured API base.
    - Supports browser auth modes `cookie` and `query-token`.
    - Opens/closes WebSocket, sends `ArrayBuffer` audio chunks, and emits debug events.
- `src/features/audio-stream/audio-mixer.ts`
    - Captures tab/system audio with `getDisplayMedia({ video: true, audio: true })`.
    - Captures microphone with `getUserMedia({ audio: true })`.
    - Mixes selected sources with Web Audio API into one `MediaStream`.
    - Stops all source tracks and closes the audio context on cleanup.
- `src/features/audio-stream/hooks.ts`
    - Adds `useProjectAudioWebSocketStream(projectId)`.
    - Starts capture, streams MediaRecorder WebM chunks every 1000ms, stops cleanly, then polls project detail for `audio_url`.
- `src/features/audio-stream/test-utils.ts`
    - Adds `streamAudioFileToProject(projectId, file)` style utility for deterministic `.webm` file streaming through WebSocket.
    - Slices files into 64KB chunks, closes WebSocket, then polls for `audio_url`.
- `src/components/snote/dev/ProjectAudioStreamDebugPanel.tsx`
    - Minimal collapsible dev/debug panel on project detail.
    - Supports test connect, `.webm` file streaming, tab + mic capture, stop, status, bytes, chunks, and final audio link.
    - Renders in development or when `NEXT_PUBLIC_ENABLE_AUDIO_WS_DEBUG=true`.
- `scripts/discover-project-stream-ws.ts`
    - Bun script using `ws` to test backend support for `Authorization: Bearer <token>` from env.
    - Does not log full tokens.

## Auth Discovery

- Browser cookie:
    - Implemented as `authMode: "cookie"`.
    - Not manually verified in this shell because a browser login session is required.
- Query token:
    - Implemented as `authMode: "query-token"`.
    - Uses the existing browser access token from local storage.
    - Not manually verified against backend in this shell.
- Node Authorization header:
    - Discovery script added at `scripts/discover-project-stream-ws.ts`.
    - Not run successfully because `SNOTE_ACCESS_TOKEN` and `SNOTE_PROJECT_ID` were not present in the shell.
- Result:
    - Browser auth support remains a backend/runtime discovery item.
    - If the Node header script connects but browser `cookie`/`query-token` fails, backend currently requires `Authorization` header, but browser WebSocket cannot set custom `Authorization` headers. Backend then needs cookie, query token, or subprotocol auth support.

## Audio Capture

- Tab audio:
    - Uses `navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })`.
    - User must select the correct tab/window and enable audio sharing.
    - The video track is only used to trigger the browser picker; the UI does not render video.
- Microphone:
    - Uses `navigator.mediaDevices.getUserMedia({ audio: true })`.
    - Supported as an optional source in the capture mixer.
- Mixed stream:
    - Uses `AudioContext.createMediaStreamSource(...)` for each selected source.
    - Connects all sources to `audioContext.createMediaStreamDestination()`.
    - Sends one mixed MediaRecorder stream, not separate recorders.
- MediaRecorder mime type:
    - Preferred: `audio/webm;codecs=opus`.
    - Fallback: `audio/webm`.
    - MP3 is not used.
- Chunk interval:
    - Default is 1000ms.

## Test Results

| Test                           | Result                                     | Notes                                                                  |
| ------------------------------ | ------------------------------------------ | ---------------------------------------------------------------------- |
| Module compile                 | Pass                                       | Covered by `bun run build`.                                            |
| ESLint                         | Pass                                       | `bun run lint`.                                                        |
| Production build               | Pass                                       | Next 16.2.6 build completed.                                           |
| Dev smoke                      | Pass                                       | `rm -rf .next && bun run dev`, then `GET /meetings` returned `200 OK`. |
| Browser cookie WebSocket       | Not tested                                 | Requires logged-in browser session.                                    |
| Browser query-token WebSocket  | Not tested                                 | Requires logged-in browser session and backend support.                |
| Node Authorization WebSocket   | Not tested                                 | Missing `SNOTE_ACCESS_TOKEN` and `SNOTE_PROJECT_ID` in shell.          |
| `.webm` file streaming utility | Implemented, not backend-verified          | UI panel can send a selected `.webm` file through WS.                  |
| Tab + mic capture              | Implemented, not manually browser-verified | Requires browser permission picker.                                    |
| `audio_url` after close        | Implemented polling, backend-verified      | Polls every 2s for up to 90s.                                          |
| Audio playable                 | Not tested                                 | Depends on backend storage result.                                     |

## Manual Backend Verification

Manual verification ran on 2026-06-24 with token and project id provided through environment/session variables only. The full token was not written to source or docs.

- Project id tested: `aa7e7abd-acb6-4529-85ce-f6f89713e292`.
- `GET /project/{id}` before streaming:
    - Result: pass.
    - Status: `HTTP/2 200`.
    - Title: `FE API Discovery 20260609-134624`.
    - `audio_url` before test: present, not null.
- Node Authorization WebSocket:
    - Result: pass.
    - URL: `wss://snote-api.akagiyuu.dev/project/{id}/stream`.
    - Auth: `Authorization: Bearer <env token>` using Node `ws`.
    - Open: yes.
    - Server message: none observed.
    - Close: `1000`, empty reason.
- `.webm` sample:
    - No existing `.webm` was found in `public/`.
    - Source audio found: `public/sample-speech-1m.mp3`.
    - Created with ffmpeg: `public/debug-audio/ws-sample.webm`.
    - WebM file size used by stream script: `563319` bytes.
- File streaming over WebSocket:
    - Result: pass.
    - Script: `scripts/test-stream-webm-file.ts`.
    - WebSocket open: yes.
    - Bytes sent: `563319`.
    - Chunks sent: `9`.
    - Chunk size: `64KB`.
    - Close: `1000`, empty reason.
    - Server message: none observed.
- Project poll after close:
    - Result: pass.
    - Last poll status: `200`.
    - `audio_url` after close: present.
    - Note: this project already had `audio_url` before the test, and the returned storage path is stable, so this verifies the stream endpoint accepted bytes and the project still exposes audio after close; it does not prove URL version changed.
- Audio URL check:
    - Result: pass.
    - `HEAD audio_url`: `200`.
- Browser debug panel:
    - Cookie/session auth: not tested in browser.
    - Query-token auth: not tested in browser.
    - If browser modes fail while Node Authorization continues to pass, backend likely supports Authorization header only and needs cookie, query-token, or subprotocol auth for browser WebSocket clients.

## Clean Project Verification

Manual verification ran on 2026-06-24 against a project that had no audio before streaming. Token and project id were provided through environment/session variables only. The full token was not written to source or docs.

- Project id tested: `0521364a-5d8c-4518-92aa-d7ab4abbc4bc`.
- `GET /project/{id}` before streaming:
    - Result: pass.
    - Status: `HTTP/2 200`.
    - Title: `Nam Dang`.
    - `audio_url` before test: `null`.
- WebM sample:
    - File used: `public/debug-audio/ws-sample.webm`.
    - File size: `563319` bytes.
- File streaming over WebSocket:
    - Result: pass.
    - Script: `scripts/test-stream-webm-file.ts`.
    - URL: `wss://snote-api.akagiyuu.dev/project/{id}/stream`.
    - Auth: `Authorization: Bearer <env token>` using Node `ws`.
    - WebSocket open: yes.
    - Bytes sent: `563319`.
    - Chunks sent: `9`.
    - Close: `1000`, empty reason.
    - Server message: none observed.
- Project poll after close:
    - Script poll result after 30s: `audio_url_after=null`, last status `200`.
    - Follow-up `GET /project/{id}` about 10s later: `HTTP/2 200`, `audio_url` present.
    - Conclusion: backend did create audio from the WebSocket stream after socket close, but this run took about 40s before `audio_url` appeared.
    - Frontend/script poll window was increased from 30s to 90s after this verification.
- Audio URL HEAD check:
    - Result: pass.
    - Status: `HTTP/2 200`.
    - `content-type`: `application/octet-stream`.
    - `content-length`: `65536`.
    - `last-modified`: `Wed, 24 Jun 2026 09:37:20 GMT`.
- Transcript follow-up:
    - Deferred. Existing frontend contract uses multipart audio upload for `POST /project/{id}/transcript`; no safe generate-from-existing-audio contract was verified.
- Browser auth requirement:
    - Node Authorization header works.
    - Browser WebSocket cannot set `Authorization` manually.
    - Browser runtime still requires backend support for cookie/session auth, `?token=<access_token>`, or WebSocket subprotocol auth.

## Known Limitations

- Not realtime transcript or realtime translation.
- Browser cannot capture Google Meet/Zoom audio unless the user selects the correct tab/window and enables share audio.
- Browser WebSocket cannot set a custom `Authorization` header.
- Query-token auth is only useful if backend explicitly supports it.
- Cookie auth only works if backend sets a cookie matching the WebSocket domain and SameSite/Secure rules allow it.
- `getDisplayMedia` needs user activation and browser permission; it cannot silently capture another tab.
- If the socket closes successfully but backend processing is slow, the UI reports: `Backend đang xử lý audio, quá trình này có thể mất khoảng 1 phút...`

## Backend Questions

- Does `/project/{id}/stream` accept cookie/session auth from browser WebSocket?
- Does `/project/{id}/stream?token=<access_token>` accept bearer token as a query parameter?
- If neither works, can backend add cookie, query-token, or WebSocket subprotocol auth for browser clients?
- Does backend tolerate a clean test connection with no meaningful WebM payload, or should clients avoid connect-only tests on real projects?
- Does backend validate WebM container boundaries after chunk accumulation, or store bytes exactly as received?

## Commands

```bash
bun add -d ws @types/ws
bun run lint
bun run build
rm -rf .next
bun run dev
WEBM_FILE="public/debug-audio/ws-sample.webm" bun scripts/test-stream-webm-file.ts
```

Node authorization discovery command, when a human provides env values:

```bash
SNOTE_ACCESS_TOKEN='<paste manually>' \
SNOTE_PROJECT_ID='<project id>' \
bun scripts/discover-project-stream-ws.ts
```

Browser test flow:

```txt
1. Open a project detail page while logged in.
2. Expand "Ghi âm cuộc họp qua WebSocket".
3. Try Cookie/session auth with "Test WS connect".
4. If needed, try Query token.
5. Select a .webm sample and click "Stream .webm file".
6. Wait for close and project polling.
7. Open audio_url when "Audio đã được lưu" appears.
8. For capture, click "Bắt đầu ghi tab + mic", grant tab audio and mic permissions, then "Dừng ghi".
```
