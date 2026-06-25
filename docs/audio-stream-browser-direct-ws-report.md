## Summary
Browser stream now opens `/project/{id}/stream` directly without Authorization header or query token.

## Code Changes

- **`src/features/audio-stream/project-stream-client.ts`**: The `buildProjectAudioStreamUrl` builds the WebSocket stream URL directly without appending `?token=` queries or auth protocols.
- **`src/components/snote/dev/ProjectAudioStreamDebugPanel.tsx`**:
  - Removed the `authMode` Select selector from the UI layout completely.
  - Set default parameter `authMode: BrowserStreamAuthMode = 'cookie'` internally to preserve code integration stability.
  - Simplified error state check so that whenever `stream.status === 'error'` or `fileStatus === 'error'`, the user-friendly copy `stream.wsError` ("Không thể kết nối luồng ghi âm. Vui lòng thử lại sau.") is rendered in a red alert banner and toasting, while full technical errors are logged to `console.error` for troubleshooting.
- **`src/components/snote/meetings/MeetingDetail.tsx`**: Added descriptive documentation comments to confirm direct auth-free browser WebSocket connection.
- **`scripts/test-stream-webm-file.ts`**: Added support for `SNOTE_STREAM_NO_AUTH=true` env parameter to execute direct WebSocket stream validation without headers.

## Verification

- **Clean project id**: `c1aa6eac-4c0d-4631-921b-a8ff20155603`
- **audio_url before**: `null`
- **Browser WS URL**: `wss://snote-api.akagiyuu.dev/project/c1aa6eac-4c0d-4631-921b-a8ff20155603/stream`
- **Query token present in URL?**: `no`
- **WS connect result**: `pass` (successfully established WebSocket connection and closed with code `1000`)
- **WebM stream result**: `pass` (successfully sent 563319 bytes across 9 chunks)
- **audio_url after**: `https://hcm.ss.bfcplatform.vn/snote/c1aa6eac-4c0d-4631-921b-a8ff20155603/audio`
- **HEAD audio_url**: `HTTP/2 200` with `content-length: 65536`

## Notes
This task only changes the browser stream connection. Other HTTP APIs still use JWT auth normally.
