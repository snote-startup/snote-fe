# SNOTE Auth API Integration Report

## Summary

The frontend auth flow now uses the real backend auth API from the Bruno contract instead of mock `AppProvider` login/signup behavior. Zustand is the auth source of truth, Axios attaches bearer tokens, tokens persist in localStorage on the client, and a client-side guard protects dashboard/admin routes.

Non-auth product data remains mock-backed for meetings, tasks, calendar, billing, profile, live assistant, and admin dashboard content.

## Files Changed

- `.env`: added `API_URL=https://snote-api.akagiyuu.dev`; existing `NEXT_PUBLIC_API_URL` was preserved.
- `.env.example`: added `API_URL` and `NEXT_PUBLIC_API_URL` examples for the dev backend.
- `.gitignore`: added an exception so `.env.example` can be tracked while local `.env` stays ignored.
- `src/lib/api/api-url.ts`: reads `NEXT_PUBLIC_API_URL`, then `API_URL`, then the existing localhost fallback.
- `src/lib/api/auth-api.ts`: new auth API service for login, register, me, and refresh.
- `src/lib/api/auth-token-storage.ts`: new localStorage token persistence utility.
- `src/lib/api/token-parser.ts`: new parser for raw JWT text and supported JSON token shapes.
- `src/lib/api/axios-config.ts`: added Authorization request interceptor and one-shot 401 refresh retry.
- `src/stores/use-auth-store.ts`: replaced placeholder token state with real async auth actions and bootstrap.
- `src/providers/auth-route-guard.tsx`: new client-side route protection.
- `src/app/providers.tsx`: wraps app content in `AuthRouteGuard`.
- `src/providers/snote-app-provider.tsx`: delegates login/register/logout to the auth store and derives app user from real auth user.
- `src/components/snote/auth/Login.tsx`: calls real login, shows loading/error state, removes mock defaults.
- `src/components/snote/auth/Signup.tsx`: calls real register, shows loading/error state, removes mock defaults.

## API URL / Environment Behavior

- The known dev backend is `https://snote-api.akagiyuu.dev`.
- `.env.example` documents both:
    - `API_URL=https://snote-api.akagiyuu.dev`
    - `NEXT_PUBLIC_API_URL=https://snote-api.akagiyuu.dev`
- The existing frontend helper is used instead of hardcoding URLs in source.
- Because auth calls currently run from client components, `NEXT_PUBLIC_API_URL` is needed for browser bundles. `API_URL` remains documented and available for server/shared usage.
- The old `http://localhost:8080` fallback remains in source as the last fallback.

## Auth Flow Implemented

- Login posts `{ email, password }` to `/auth/login`.
- Register posts `{ email, name, password }` to `/auth/register`.
- After login/register, tokens are stored and `/auth/me` is called to populate the real authenticated user.
- Session bootstrap reads stored tokens on the client and calls `/auth/me`.
- Logout clears the Zustand auth state and localStorage tokens.
- Login/register pages redirect to `/dashboard` on success.
- Signed-in users visiting `/login` or `/register` are redirected to `/dashboard`.

## Token Parsing Behavior

`parseAuthTokens()` supports:

- raw non-empty JWT string response bodies.
- JSON strings containing token fields.
- already-unwrapped JSON objects.
- `{ accessToken, refreshToken }`
- `{ access_token, refresh_token }`
- `{ token }`
- `{ jwt }`
- `{ data: { accessToken, refreshToken } }`
- `{ data: { access_token, refresh_token } }`

If a non-empty string is not parseable JSON, the whole string is treated as the access token.

## Storage Behavior

- Tokens are persisted in localStorage under:
    - `snote.access_token`
    - `snote.refresh_token`
- localStorage access is guarded behind `typeof window !== 'undefined'`.
- No token is read during SSR.
- No secrets were added to `.env.example`.

## Axios / Refresh Behavior

- Requests include `Authorization: Bearer <access_token>` when a stored access token exists.
- On 401, Axios retries the failed request once after calling `/auth/refresh`.
- Refresh uses `refresh_token` if present, otherwise falls back to the current access token per the Bruno contract note.
- Refreshed tokens are persisted.
- If refresh fails or no token exists, stored tokens are cleared and a client auth event triggers logout/redirect.
- Infinite retry loops are avoided with a private `_retry` flag on the original request.

## Route Guard Behavior

Client-side route protection covers:

- `/dashboard`
- `/live-assistant/*`
- `/meetings/*`
- `/tasks`
- `/calendar`
- `/billing/*`
- `/profile`
- `/admin/*`

Behavior:

- Signed-out users on protected routes go to `/login`.
- Signed-in users on `/login` or `/register` go to `/dashboard`.
- `/admin` and `/admin/*` require `user.role === 'admin'`.
- If `/auth/me` does not include a role, admin access is denied conservatively.

## Commands Run and Results

- `bun run check-types`: passed.
- `bun run lint`: passed.
- `bun run build`: passed.

Build note:

- Next.js build still emits the existing Node deprecation warning: `DEP0205 module.register() is deprecated`.

Tests:

- `bun test` was not run as a blocker because the prior project scan found no test files.

## Known Limitations

- Auth route protection is client-side only. Protected route HTML can still be statically generated; server-side protection should be added when the app has server-readable sessions/cookies.
- Admin guard depends on `/auth/me` returning `role: 'admin'`. If the backend omits `role`, admin is blocked.
- The login/register UI now calls real auth, but the rest of the product still uses mock data.
- The floating role/theme switcher remains for mock product preview; it cannot grant admin access through the route guard.
- Token persistence is localStorage-based for now, which is pragmatic but less secure than an HTTP-only cookie session.
- The exact `/auth/me` user response shape is assumed to include at least `id`, `email`, and `name`; missing fields may need normalization once the backend contract is finalized.

## Next Recommended Work

1. Confirm and document the `/auth/me` response shape, especially user role.
2. Move route protection to server/middleware once auth can be read securely server-side.
3. Replace localStorage token persistence with HTTP-only cookie session handling if the backend supports it.
4. Add focused auth tests for token parsing, login/register errors, bootstrap, refresh, logout, and guards.
5. Start replacing mock product data with typed backend services after auth is stable.
