# Stream and Billing Polish Report

## Summary

Polished the meeting recording and billing experiences so they read as product UI instead of implementation/debug surfaces. Recording now asks for media permissions before opening the project stream, and billing now clamps project usage progress while presenting Premium as a clear upgrade.

## Recording UI Changes

- Reworked the project recording panel copy for Vietnamese and English.
- Removed the visible beta badge, rough realtime warning, connection test button, auth controls, and chunks/bytes/status debug sidebar from the user-facing panel.
- Kept upload and live recording as first-class actions: start recording, stop and save audio, and upload audio.
- Replaced raw technical errors with friendly permission and source-selection messages.

## Recording Runtime Fix

- Changed the recording order to request display audio, request microphone access, validate audio tracks, then open the project stream and start `MediaRecorder`.
- Added cleanup on startup and recorder errors: recorder stop, stream close, media track stop, audio context close, pending send reset, and UI error state.
- The browser stream URL is built directly as `/project/{projectId}/stream` with no browser credential query.

## Billing UI Changes

- Rebuilt billing into current-plan and Premium upgrade cards.
- Added Premium benefits, one-time price display, checkout loading state, and Premium-active state.
- Removed disabled invoice/payment-management filler actions from the main upgrade area.

## Quota Display Fix

- Uses `projects.length` as used count.
- Uses `GET /quota` limit with a Free fallback of 5.
- Treats limit `>= 20` as Premium.
- Clamps rendered progress to 100%.
- Shows a friendly over-limit state when used projects exceed the current limit.

## Payment Flow

- The upgrade button calls `POST /quota/buy` and redirects to the returned PayOS checkout URL.
- `/billing/success` follows Flow A: it only checks `GET /quota`, retries every 2 seconds up to 10 times, and then shows a pending state with a manual retry button if the limit has not updated.

## Manual Test Results

- `bun run lint`: pass.
- `bun run build`: pass.
- `rm -rf .next && bun run dev`: pass, served at `http://localhost:3000`.
- Route smoke via local HTTP returned `200` for `/meetings`, `/meetings/01bf8336-1a59-403d-91cc-de6860a04148`, `/billing`, `/billing/success`, `/tasks`, and `/dashboard`.
- Smoke HTML grep did not find old recording wording such as beta badge copy, test connection copy, the old tab+mic button copy, or the old rough realtime warning.
- Authenticated project verification was not run because the expected access-token and project-id environment variables were not exported in the shell. No token was copied into commands or files.
- Interactive browser media permission testing was not run in this terminal session.
- Real checkout payment was not performed.

## Known Backend/Environment Notes

- Browser permission prompts and real tab-audio capture require an interactive browser session.
- No payment success is faked; checkout redirects depend on the backend returning the PayOS URL.
- The repository has existing ignored/local and historical documentation references to auth examples; the touched recording/billing files and this report do not contain a real token.
