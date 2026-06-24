# Final Web Polish Button/API Smoke Report

## Scope

- Realtime streaming intentionally deferred.
- Focused on Vietnamese UI, mock cleanup, tasks route, button/API smoke.
- Did not implement or modify `/project/{id}/stream`, WebSocket audio capture, or live realtime audio.
- `openapi-snote.json` was requested for audit but is not present in the repo root or `docs/`.

## Removed Mock UI

- Removed the visible mock usage/quota UI, including the previous `used 3/5` style usage surface.
- Replaced quota/subscription surfaces with neutral copy such as `Tài khoản đang hoạt động`.
- Dashboard no longer shows fake usage cards or fake task data.
- Calendar, billing, profile update actions, admin telemetry, checkout, and live assistant screens now use disabled/deferred UI instead of fake success flows.
- Final grep for `used 3/5|3/5|usage|quota|limit|Free plan|Pro plan|mock usage|remaining|minutesUsed|minutesLimit|Free workspace|Pro workspace` returned no matches in `src/components`, `src/app`, `src/providers`, or `src/lib`.

## Vietnamese Localization

- Converted user-facing copy across landing, auth, dashboard, meetings/project detail, transcript, AI chat, references, tasks, profile, billing, calendar, admin, onboarding tour, loading/error states, dialogs, and toasts.
- Kept code identifiers, route names, API payload fields, backend enum values, endpoint strings, library names, and allowed product terms such as `Transcript`.
- Replaced old English/fake landing teaser components with Vietnamese neutral copy so they do not reintroduce quota or fake checkout if reused later.

## Tasks Route Decision

- Chosen option: aggregate `/tasks`.
- `/tasks` is now `Tất cả công việc`, backed by real project-scoped endpoints:
    - `GET /project`
    - `GET /project/{id}/task`
    - `PATCH /task/{id}`
    - `DELETE /task/{id}`
- The page flattens tasks into `{ projectId, projectTitle, ...task }`, supports search, status/priority filters, project open action, status/priority mutation, content edit, and delete.
- Partial project task fetch failures are tolerated; if all project task fetches fail, the page shows an error.
- TODO backend: add global `GET /task` later to avoid client fan-out across all projects.

## Endpoint Inventory

- Auth: `POST /auth/login`, `POST /auth/register`, `GET /auth/me`, `POST /auth/refresh`.
- Project CRUD used by UI: `GET /project`, `POST /project`, `GET /project/{id}`, `PATCH /project/{id}`.
- Transcript/audio: `POST /project/{id}/transcript`, `GET /project/{id}/transcript`.
- AI chat: `GET /project/{id}/chat/history`, `POST /project/{id}/chat` with browser `fetch()` streaming.
- Tasks: `GET /project/{id}/task`, `POST /project/{id}/task`, `PATCH /task/{id}`, `DELETE /task/{id}`.
- Download audio: opens `project.audio_url` directly with `window.open`; no separate download API endpoint is used.

## Button/API Smoke Matrix

| Route                        | Action                                                    | Endpoint                                                     | Status                                        | Notes                                                                           |
| ---------------------------- | --------------------------------------------------------- | ------------------------------------------------------------ | --------------------------------------------- | ------------------------------------------------------------------------------- |
| `/`                          | Landing CTAs to app/auth                                  | none                                                         | real                                          | Routes to dashboard/login/register; copy is Vietnamese.                         |
| `/login`                     | Đăng nhập                                                 | `POST /auth/login`, then account bootstrap via auth store    | real, not manually network-verified           | Code path stores token; no token was hardcoded.                                 |
| `/register`                  | Đăng ký                                                   | `POST /auth/register`, then account bootstrap via auth store | real, not manually network-verified           | Vietnamese validation/error copy.                                               |
| `/dashboard`                 | Load overview                                             | `GET /project`, `GET /project/{id}/task` fan-out             | real, not manually network-verified           | No fake quota; pending task count uses real aggregate query.                    |
| `/dashboard`                 | Tạo cuộc họp / Tải audio lên                              | none                                                         | real route action                             | Navigates to `/meetings`; no fake success toast.                                |
| `/dashboard`                 | Hướng dẫn nhanh                                           | local product tour                                           | real local UI                                 | Uses local tour state/toasts only.                                              |
| `/meetings`                  | Load projects                                             | `GET /project`                                               | real, not manually network-verified           | Search is local filter.                                                         |
| `/meetings`                  | Tạo cuộc họp                                              | `POST /project`                                              | real, not manually network-verified           | Success toast only after mutation success.                                      |
| `/meetings/[id]`             | Load project                                              | `GET /project/{id}`                                          | real, not manually network-verified           | Error/loading states Vietnamese.                                                |
| `/meetings/[id]`             | Chỉnh sửa cuộc họp                                        | `PATCH /project/{id}`                                        | real, not manually network-verified           | Success toast only after API success.                                           |
| `/meetings/[id]`             | Tải audio lên                                             | `POST /project/{id}/transcript`                              | real, not manually network-verified           | Multipart upload field is `audio`.                                              |
| `/meetings/[id]`             | Load transcript                                           | `GET /project/{id}/transcript`                               | real, not manually network-verified           | Polling remains upload/transcript polling, not realtime stream.                 |
| `/meetings/[id]`             | Load chat history                                         | `GET /project/{id}/chat/history`                             | real, not manually network-verified           | Uses paginated history query.                                                   |
| `/meetings/[id]`             | Gửi câu hỏi AI                                            | `POST /project/{id}/chat`                                    | real, not manually network-verified           | Existing text streaming preserved; not audio realtime.                          |
| `/meetings/[id]`             | Dừng phản hồi AI                                          | abort controller                                             | real local behavior                           | Cancels current fetch request.                                                  |
| `/meetings/[id]`             | Nguồn tham chiếu                                          | none                                                         | real local behavior                           | Scrolls/highlights transcript segment if present.                               |
| `/meetings/[id]`             | Tải audio                                                 | `project.audio_url`                                          | real if URL exists                            | Button disabled/absent when no audio URL.                                       |
| `/meetings/[id]`             | Tạo công việc                                             | `POST /project/{id}/task`                                    | real, not manually network-verified           | Success toast only after API success.                                           |
| `/meetings/[id]`             | Cập nhật trạng thái/ưu tiên task                          | `PATCH /task/{id}`                                           | real, not manually network-verified           | Project task cache and aggregate cache invalidated.                             |
| `/meetings/[id]`             | Sửa nội dung task                                         | `PATCH /task/{id}`                                           | real, not manually network-verified           | Dialog action calls API.                                                        |
| `/meetings/[id]`             | Xóa task                                                  | `DELETE /task/{id}`                                          | real, not manually network-verified           | Confirmation dialog required.                                                   |
| `/tasks`                     | Load all tasks                                            | `GET /project` + `GET /project/{id}/task`                    | real aggregate, not manually network-verified | Replaces old project-scoped placeholder.                                        |
| `/tasks`                     | Filter/search                                             | none                                                         | real local behavior                           | Search checks task content and project title.                                   |
| `/tasks`                     | Open project                                              | none                                                         | real route action                             | Navigates to `/meetings/{projectId}`.                                           |
| `/tasks`                     | Status/priority/edit/delete                               | `PATCH /task/{id}`, `DELETE /task/{id}`                      | real, not manually network-verified           | Uses aggregate hooks and invalidation.                                          |
| `/profile`                   | Save profile, password, 2FA, notification, delete account | none                                                         | disabled                                      | Backend APIs pending; no fake success toast.                                    |
| `/calendar`                  | Open meetings                                             | none                                                         | real route action                             | Calendar events disabled until backend event API exists.                        |
| `/billing`                   | Upgrade/payment/invoice buttons                           | none                                                         | disabled                                      | Billing backend pending; no fake checkout or fake usage numbers.                |
| `/pricing`                   | Register/login/open billing                               | none                                                         | real route action                             | Upgrade buttons disabled until billing API exists.                              |
| `/billing/checkout/[planId]` | Checkout page actions                                     | none                                                         | disabled/deferred                             | No fake card form or payment simulation.                                        |
| `/billing/success`           | Payment success route                                     | none                                                         | deferred                                      | Does not show fake payment success.                                             |
| `/admin`, `/admin/dashboard` | Admin telemetry                                           | none                                                         | disabled/deferred                             | Shows backend pending notice; no fake telemetry.                                |
| `/live-assistant/*`          | Realtime setup/permissions/audio/active/review            | none                                                         | deferred                                      | Explicitly routes to deferred notice; no WebSocket/audio capture/fake realtime. |

## Fake/Disabled Action Audit

- Kept `toast.success` only after real API mutations or real local clipboard/tour actions.
- Replaced fake profile save/password/notification/delete actions with disabled controls.
- Replaced fake calendar event UI with a backend-pending page.
- Replaced fake billing/checkout/payment success surfaces with disabled/deferred states.
- Replaced live assistant setup/permissions/audio-check/active/review screens with a clear deferred notice.
- Remaining `setTimeout` usage is for UI delay/poll timeout/highlight cleanup/product tour reload, not fake API success.

## Manual/API Smoke Notes

- `SNOTE_ACCESS_TOKEN`: missing, so authenticated API button testing was not run against backend with a real token.
- Code-level endpoint audit, lint, production build, and dev route smoke were completed.
- Dev route smoke returned `200 OK` for `/`, `/login`, `/tasks`, and `/meetings`.

## Errors Found

- `/tasks` was previously a placeholder and has been replaced with real aggregate task UI.
- Dashboard showed fake usage/task surfaces and now uses real projects/task aggregate data.
- Several old UI areas showed fake billing/profile/calendar/admin/live-assistant actions; these are now disabled or deferred.
- Build initially failed on `PricingTeaser` optional `href` typing; fixed with explicit CTA typing.

## Remaining Backend Questions

- Should backend add global `GET /task` for `/tasks` instead of client fan-out?
- What is the final billing/subscription/quota API contract?
- What profile/password/2FA/notification/delete-account endpoints should the frontend use?
- What calendar/event API should power `/calendar`?
- What admin metrics/user-management API should power admin pages?
- What exact realtime audio protocol should power `/project/{id}/stream` later?

## Commands

- `rg`/grep audit commands for mock usage, fake actions, and English UI strings.
- `test -n "$SNOTE_ACCESS_TOKEN" && echo "token ok" || echo "token missing"` -> `token missing`.
- `bun run lint` -> pass.
- `bun run build` -> pass.
- `rm -rf .next && bun run dev` -> server ready at `http://localhost:3000`; route smoke `HEAD /`, `/login`, `/tasks`, `/meetings` -> `200 OK`; server stopped.
