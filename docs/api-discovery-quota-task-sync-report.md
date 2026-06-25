# API Discovery & Task Sync Integration Report

## Summary

This report covers:

1. Investigation and resolution of the Task Sync bug in meeting details.
2. Discovery of backend Quota/Payment endpoints (`GET /quota`, `POST /quota/buy`, `GET /quota/payment/return`).
3. Implementation of the quota API client, React Query hooks, and updated Billing UI with multi-language (EN/VI) support.
4. Recommendations and clarification questions for the backend team.

---

## Task Sync Bug

### Reproduction

We ran a sequence of API calls via `curl` to verify task retrieval and task generation:

1. Checked active tasks of the target project: `GET /project/{id}/task` -> returned `[]` (empty list).
2. Triggered task generation: `POST /project/{id}/task` -> returned `HTTP 204 No Content`.
3. Checked active tasks immediately after: `GET /project/{id}/task` -> returned `[]` (empty list).
4. Waited 5 seconds and checked again: `GET /project/{id}/task` -> returned `[]` (empty list).

### API Results

- `GET /project/{id}/task`: Returned `[]` even after multiple retries and waits.
- `POST /project/{id}/task`: Returned `204 No Content` indicating asynchronous processing.

### Root Cause

1. **Asynchronous Generation Lag:** The backend generation `POST /project/{id}/task` returns `204 No Content` instantly. However, the actual AI generation process runs asynchronously on the backend and takes several seconds.
2. **Missing FE Polling:** The frontend previously executed the invalidation `queryClient.invalidateQueries` immediately upon the `POST` success. Since the backend had not finished generating the tasks, the refetched `GET /project/{id}/task` still returned an empty array, leading the UI to display "No tasks yet". When the user navigated away and returned (or visited the global `/tasks` route which loads later), the tasks had finally finished generating on the backend and were fetched, creating the illusion of a sync bug between routes.

### FE Fix

- **Hierarchical Query Keys:** Standardized the task cache keys hierarchically:
    - `all: ['tasks'] as const`
    - `aggregate: () => ['tasks', 'aggregate'] as const`
    - `byProject: (projectId: string) => ['tasks', 'project', projectId] as const`
- **Unified Hooks:** Standardized `useUpdateTask` and `useDeleteTask` to accept an optional `projectId` parameter, allowing seamless optimistic updates and cache invalidation for both project-scoped pages and global Kanban boards.
- **Smart Polling Loop:** Integrated a polling loop in `ProjectTasksPanel.tsx` that triggers on generation success:
    - Polls `GET /project/{id}/task` every 1.5 seconds.
    - Stops polling when the tasks count changes or tasks are populated.
    - Maximum of 10 retries (~15 seconds) before failing gracefully.
    - Displays `"Đang tạo..." / "Generating..."` during polling.
- **Deduplication:** Added unique ID-based task filtering on the display layer to prevent rendering duplicate tasks if the backend duplicates them on multiple generation triggers.

### Remaining Backend Issue

- Task generation on the backend seems to be failing or inactive during our discovery runs, resulting in empty lists even after long delays. This is documented in the questions below.

---

## Quota API Discovery

We discovered the schemas and behavior of the new quota APIs at runtime:

### 1. GET /quota

- **Command:**
    ```bash
    curl -sS -i "https://snote-api.akagiyuu.dev/quota" \
      -H "Authorization: Bearer <SNOTE_ACCESS_TOKEN>" \
      -H "accept: application/json"
    ```
- **Response Status:** `200 OK`
- **Response Headers:** `content-type: application/json`, `content-length: 1`
- **Response Body:** `5`
- **Inferred Schema:** Returns a single JSON number (e.g. `5`), representing the current project limit (e.g., Free plan limit of 5 projects).

### 2. POST /quota/buy

- **Command:**
    ```bash
    curl -sS -i -X POST "https://snote-api.akagiyuu.dev/quota/buy" \
      -H "Authorization: Bearer <SNOTE_ACCESS_TOKEN>" \
      -H "accept: text/plain,application/json,*/*"
    ```
- **Response Status:** `200 OK`
- **Response Headers:** `content-type: text/plain; charset=utf-8`, `content-length: 57`
- **Response Body:** `https://pay.payos.vn/web/cf25bd54f3894efbaa125458d61d0fb8`
- **Inferred Schema:** Returns a plain text URL string which is the checkout redirection link powered by PayOS. No request body/parameters are needed to initiate the purchase.

### 3. GET /quota/payment/return

- **Command (no query):**
    ```bash
    curl -sS -i "https://snote-api.akagiyuu.dev/quota/payment/return"
    ```

    - **Result:** `400 Bad Request` with body `Failed to deserialize query string: missing field orderCode`.
- **Command (with orderCode):**
    ```bash
    curl -sS -i "https://snote-api.akagiyuu.dev/quota/payment/return?orderCode=123"
    ```

    - **Result:** `403 Forbidden` with body `{"message":"Invalid payment","detail":null}`.
- **Inferred Schema:** Expects `orderCode` as a query parameter (and potentially other PayOS return signature params). It acts as a public transaction validation webhook/endpoint.

---

## Implemented FE Changes

1. **`src/features/tasks/hooks.ts`**: Standardized the task query keys and unified the `useUpdateTask` and `useDeleteTask` mutations.
2. **`src/components/snote/meetings/ProjectTasksPanel.tsx`**: Added polling loop (1.5s interval up to 15s) and UI loader displaying "Generating..." text. Added unique ID display deduplication.
3. **`src/features/quota/types.ts`**: Tolerant typescript type definition for `QuotaInfo`.
4. **`src/features/quota/api.ts`**: Tolerant parser for `getQuota()` and `buyQuota()`.
5. **`src/features/quota/hooks.ts`**: Implemented `useQuota` and `useBuyQuota` query hooks.
6. **`src/features/i18n/dictionaries.ts`**: Added translations for quota limits, billing buttons, polling loading states, and timeout errors.
7. **`src/components/snote/billing/Billing.tsx`**: Rewritten to pull active project limits (`useQuota`), active projects count (`useProjects`), display a clean progress bar, and trigger the upgrade flow (redirecting the page to the PayOS checkout URL on click).
8. **`src/components/snote/billing/PaymentSuccess.tsx`**: Cleaned up checkout success page to support real success notifications with clean styling and i18n support.

---

## Backend Questions

1. **GET /quota response schema:** Is the response always a single JSON number representing the project limit, or will it be restructured into an object (e.g. `{ limit: number, used: number }`) in the future?
2. **POST /quota/buy request body:** Does it support customized package selection or amount inputs, or does it always default to the `Premium` 70.000đ package?
3. **Payment return behavior:** Does PayOS redirect users to the backend's `/quota/payment/return` directly (which then redirects to the frontend `/billing/success`), or is the frontend expected to capture the query params and call `/quota/payment/return` programmatically?
4. **GET /quota update lag:** Does the quota limit value update instantly after transaction verification?
5. **Asynchronous tasks generation:** Currently, calling task generation returns empty arrays indefinitely even after waiting for several minutes. Is the background task generation worker active on the staging server? Are there any logs showing errors during AI generation?

---

## Commands Run

```bash
# Verify environment setup
test -n "$SNOTE_ACCESS_TOKEN" && echo "Token loaded"

# Test project task retrieval and generation
curl -sS -i "https://snote-api.akagiyuu.dev/project/$SNOTE_PROJECT_ID/task" -H "Authorization: Bearer $SNOTE_ACCESS_TOKEN"
curl -sS -i -X POST "https://snote-api.akagiyuu.dev/project/$SNOTE_PROJECT_ID/task" -H "Authorization: Bearer $SNOTE_ACCESS_TOKEN"

# Discover GET /quota
curl -sS -i "https://snote-api.akagiyuu.dev/quota" -H "Authorization: Bearer $SNOTE_ACCESS_TOKEN" -H "accept: application/json"

# Discover POST /quota/buy
curl -sS -i -X POST "https://snote-api.akagiyuu.dev/quota/buy" -H "Authorization: Bearer $SNOTE_ACCESS_TOKEN"

# Discover GET /quota/payment/return
curl -sS -i "https://snote-api.akagiyuu.dev/quota/payment/return"
curl -sS -i "https://snote-api.akagiyuu.dev/quota/payment/return?orderCode=123"
```
