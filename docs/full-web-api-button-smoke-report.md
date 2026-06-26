## Summary

Route smoke passed for the requested frontend routes on the local dev server.

Authenticated API smoke was blocked by an expired local access token. Most protected endpoints returned `401`; `GET /auth/me` returned `500`, which should be treated as a backend/auth failure because an expired token should not produce a generic server error.

Task generation FE polling was fixed during this audit. No payment was performed.

## Environment

- Date: `2026-06-26`
- Runtime/package manager: Bun
- App: Next.js `16.2.6`
- Dev server: `http://localhost:3000`
- API base tested directly: `https://snote-api.akagiyuu.dev`
- Token/project source: `.env.local`, redacted
- Token expiry observed: `2026-06-25T06:16:14Z`

## Route Smoke

| Route | Result | Evidence |
| --- | --- | --- |
| `/` | PASS | `200` |
| `/login` | PASS | `200` |
| `/register` | PASS | `200` |
| `/dashboard` | PASS | `200` |
| `/meetings` | PASS | `200` |
| `/meetings/{SNOTE_PROJECT_ID}` | PASS | `200` |
| `/tasks` | PASS | `200` |
| `/billing` | PASS | `200` |
| `/billing/success` | PASS | `200` |
| `/profile` | PASS | `200` |

## Button/API Matrix

| Button | Route/page | Expected API/navigation | Actual result | Status | Evidence | Likely owner |
| --- | --- | --- | --- | --- | --- | --- |
| Landing CTAs | `/` | Navigate to auth/dashboard/pricing targets | Route rendered | PASS | Route `200`, source-wired navigation | FE |
| Login submit | `/login` | `POST /auth/login`, then `GET /auth/me` | Not submitted with real credentials | BLOCKED | No safe test credentials provided | Unknown |
| Register submit | `/register` | `POST /auth/register`, then `GET /auth/me` | Not submitted | BLOCKED | Avoided creating account | Unknown |
| Language toggle EN/VI | Layout/header | Local i18n state | Source-wired, no API | PASS | `LanguageToggle` local state/store | FE |
| Dashboard cards | `/dashboard` | `GET /project`, task fan-out | Protected API blocked | BLOCKED | `GET /project` -> `401` | Auth/token |
| Meetings list open | `/meetings` | Navigate to `/meetings/{id}` | Source-wired | PASS | Card click uses router push | FE |
| Meetings create | `/meetings` | `POST /project` | Protected API blocked | BLOCKED | Direct `POST /project` -> `401` | Auth/token |
| Project detail edit | `/meetings/{id}` | `PATCH /project/{id}` | Protected API blocked | BLOCKED | Direct PATCH -> `401` | Auth/token |
| Upload audio | `/meetings/{id}` | `POST /project/{id}/transcript` multipart `audio` | Protected API blocked | BLOCKED | Direct empty POST -> `401`; code uses multipart field `audio` | Auth/token |
| Recording start/stop/upload | `/meetings/{id}` | Browser capture + WS `/project/{id}/stream` | UI route/source inspected only | BLOCKED | Browser permissions/expired auth prevented real recording | Unknown |
| Transcript tab | `/meetings/{id}` | `GET /project/{id}/transcript` | Protected API blocked | BLOCKED | Direct GET -> `401` | Auth/token |
| Chat send | `/meetings/{id}` | `POST /project/{id}/chat` streaming fetch | Protected API blocked | BLOCKED | Direct POST -> `401` | Auth/token |
| Generate tasks | `/meetings/{id}` | `POST /project/{id}/task`, poll `GET /project/{id}/task` | Protected API blocked; FE polling fixed | BLOCKED | Direct POST/GET -> `401`; code updated | Auth/token + FE fixed |
| Task status/priority/edit | Meeting/tasks | `PATCH /task/{id}` | Protected API blocked | BLOCKED | Direct PATCH test id -> `401` | Auth/token |
| Task delete | Meeting/tasks | `DELETE /task/{id}` | Skipped without disposable task | BLOCKED | No verified disposable task id | Unknown |
| Tasks Kanban load | `/tasks` | `GET /project` + `GET /project/{id}/task` fan-out | Protected API blocked | BLOCKED | `GET /project` -> `401` | Auth/token |
| Tasks Kanban filters/search/open | `/tasks` | Local filter/search/router push | Source-wired | PASS | `TaskBoard` local filtering and router push | FE |
| Billing upgrade | `/billing` | `POST /quota/buy`, redirect to PayOS URL | Protected API blocked, no payment | BLOCKED | Direct `POST /quota/buy` -> `401` | Auth/token |
| Billing success retry | `/billing/success` | Poll `GET /quota`, retry refetch | Protected API blocked | BLOCKED | `GET /quota` -> `401` | Auth/token |
| Profile/logout | `/profile` | Logout clears local tokens | Source-wired local only | PASS | No backend logout endpoint in code | FE / Backend contract TBD |

## API Results by Feature

| Feature | Endpoint | Result |
| --- | --- | --- |
| Auth | `GET /auth/me` | FAIL: `500`, body keys `detail,message`, message `Something went wrong` |
| Auth | `POST /auth/refresh` | BLOCKED: `401` |
| Project | `GET /project` | BLOCKED: `401` |
| Project | `GET /project/{id}` | BLOCKED: `401` |
| Project | `PATCH /project/{id}` | BLOCKED: `401` |
| Project | `POST /project` | BLOCKED: `401` |
| Transcript/upload | `GET /project/{id}/transcript` | BLOCKED: `401` |
| Transcript/upload | `POST /project/{id}/upload` | BLOCKED: `401`; app source uses `/project/{id}/transcript`, not `/upload` |
| Transcript/upload | `POST /project/{id}/transcript` | BLOCKED: `401` |
| Chat | `GET /project/{id}/chat/history` | BLOCKED: `401` |
| Chat | `POST /project/{id}/chat` | BLOCKED: `401` |
| Tasks | `GET /project/{id}/task` | BLOCKED: `401` |
| Tasks | `POST /project/{id}/task` | BLOCKED: `401` |
| Tasks | `PATCH /task/{id}` | BLOCKED: `401` |
| Tasks | `DELETE /task/{id}` | SKIPPED: no disposable task id |
| Quota/Billing | `GET /quota` | BLOCKED: `401` |
| Quota/Billing | `POST /quota/buy` | BLOCKED: `401`; no payment was performed |

## Failures

- `GET /auth/me` returned `500` for an expired token. Expected behavior is a clean `401`.
- Live task-generation classification could not be completed because project/task endpoints rejected auth.
- Audio stream was not exercised with real browser capture; source inspection shows the WS URL is direct and does not attach an auth token.

## Backend Questions

- Should expired auth tokens consistently return `401` for all auth/protected endpoints, including `GET /auth/me`?
- Does `POST /project/{id}/task` create a background job with a status endpoint, or is polling `GET /project/{id}/task` the intended contract?
- Can backend return a generation job id or task-generation status to avoid blind 90-second polling?
- Is `/project/{id}/upload` still a valid endpoint, or should frontend only use `POST /project/{id}/transcript`?
- Should audio stream auth rely only on cookies, since the WS URL currently has no auth token attached?
- Should backend add a global `GET /task` endpoint to replace `/tasks` client fan-out?

## FE Fixes Applied

- Extended project task generation polling to 90 seconds.
- Disabled generate/regenerate controls while generation polling is active.
- Added exact EN/VI generation and not-ready messages.
- Removed premature success toast for accepted task-generation POST.

## Commands Run

- `bun install`
- `rm -rf .next && bun run dev`
- Route curl smoke against local dev server
- Direct API curl smoke against `https://snote-api.akagiyuu.dev`
- JWT expiry decode without printing token
- `bun run lint`

Smoke counts:

- Route smoke: PASS `10`, FAIL `0`, BLOCKED `0`
- API smoke: PASS `0`, FAIL `1`, BLOCKED `15`, SKIPPED `1`
- Button/source matrix: PASS `5`, FAIL `0`, BLOCKED `15`
