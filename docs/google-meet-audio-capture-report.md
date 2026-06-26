## Summary

Meeting audio capture flow was tightened for Google Meet/tab recording.

- The frontend now captures permissions first, validates that the selected tab/source actually provides an audio track, and only then opens the backend streaming connection and starts `MediaRecorder`.
- If the browser returns zero display audio tracks, the frontend stops all captured tracks, does not open the stream, resets recording state, and shows a friendly instruction to use Chrome/Chromium, choose the Google Meet tab, and enable audio sharing.
- Microphone-only mode calls only `getUserMedia({ audio: true })`; it does not call `getDisplayMedia` and should not show a screen/tab picker.
- Upload audio remains available as the fallback path.

## Implementation Notes

Capture sequencing:

1. Request permission/capture.
2. Validate audio track availability.
3. Create the mixed recorder stream.
4. Open backend WebSocket stream.
5. Start `MediaRecorder`.
6. Send chunks.

Tab/meeting mode uses:

```ts
navigator.mediaDevices.getDisplayMedia({
    video: true,
    audio: true,
});
```

After source selection, the frontend checks `displayStream.getAudioTracks()` and `displayStream.getVideoTracks()`. If the selected source has no audio tracks, streaming is blocked before any backend connection is opened.

Microphone-only mode uses:

```ts
navigator.mediaDevices.getUserMedia({ audio: true });
```

MediaRecorder MIME candidate order:

1. `audio/webm;codecs=opus`
2. `audio/webm`
3. `video/webm;codecs=vp8,opus`
4. `video/webm`

The first browser-supported value is used and reported in development diagnostics.

## Development Diagnostics

Diagnostics are development-only and are not part of the normal user-facing UI.

Included fields:

- browser userAgent
- capture mode
- display audio track count
- display video track count
- audio track labels
- audio track settings
- video track settings
- microphone included yes/no
- MediaRecorder MIME selected
- WS opened yes/no
- chunk count
- total bytes
- stop reason
- audio_url poll result

No token value is logged or written to the UI/report.

## Manual Test Checklist

### Test A - Windows + Chrome + Google Meet tab

1. Open Google Meet in Chrome tab A.
2. Open Snote in Chrome tab B.
3. Go to project detail.
4. Choose `Ghi âm từ tab/cuộc họp`.
5. In the picker, choose the correct Google Meet tab.
6. Enable `Share tab audio` / `Also share audio`.
7. Confirm diagnostics:
   - display audio track count >= 1
   - video track count >= 1
   - MIME selected
   - WS opened
   - chunk count increases
   - total bytes increases
8. Stop and save.
9. Confirm `audio_url` appears if backend save succeeds.

### Test B - Wrong Source

1. Choose a screen/window/source with no audio.
2. Expected:
   - audio track count = 0
   - WS does not open
   - UI explains to choose the Google Meet tab and enable audio sharing
   - captured tracks are cleaned up

### Test C - Microphone Only

1. Choose `Ghi bằng microphone`.
2. Confirm no screen/share picker appears.
3. Grant microphone permission.
4. Confirm WS opens after microphone permission.
5. Confirm chunks/bytes increase.
6. Stop/save successfully.

### Test D - Upload Fallback

1. Choose `Tải audio lên`.
2. Select an audio file.
3. Confirm upload/stream fallback still sends chunks and saves audio.

## Conclusion

Web tab audio capture depends on the browser granting an audio track through `getDisplayMedia`.

To test Google Meet audio on web, use Windows + Chrome/Chromium, choose the correct Google Meet tab, and enable share audio.

If the browser returns 0 audio tracks, FE cannot capture audio from that selected tab/source by itself.

If product needs more stable audio capture than the web platform allows, the next direction is Chrome extension `tabCapture` or a desktop app using Electron/Tauri with system audio loopback.
