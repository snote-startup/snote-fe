## Summary

Local/demo task fallback removed. Task generation now uses backend POST `/project/{id}/task` and polls GET `/project/{id}/task`.

## Fallback Removed

- Removed the runtime demo task store and localStorage-backed task generation.
- Removed the meeting detail task panel imports and branches that generated or displayed frontend-only tasks.
- Removed the old demo fallback report that documented the temporary local task path.

## API Flow Restored

- Generate action calls backend `POST /project/{id}/task`.
- Expected backend response is `204 No Content`.
- After POST success, the frontend invalidates project task and aggregate task queries.
- The meeting task panel polls `GET /project/{id}/task` every 2 seconds for up to 90 seconds.

## Meeting Detail Task Flow

- The `Công việc` tab renders only backend tasks from `GET /project/{id}/task`.
- If transcript segments are missing, the UI shows: `Cần transcript trước khi tạo công việc.`
- While generation is pending, the UI shows: `Đang tạo task từ transcript...`
- If polling times out, the UI shows: `Task chưa sẵn sàng. Vui lòng thử lại sau ít phút.`
- If backend generation fails, the UI shows: `Không thể tạo task lúc này. Vui lòng thử lại.`

## Global Tasks Page

- `/tasks` continues to use real backend data via project fan-out: `GET /project` then `GET /project/{id}/task`.
- Empty backend responses render the real empty state.
- Search and filter operate only on backend-returned tasks.

## Validation

- Required commands: `bun run lint`, `bun run build`, `rm -rf .next && bun run dev`.
- Manual browser check required for `/meetings/{projectId}` task generation and `/tasks` backend data rendering.
- Cached diff token scan required before commit.

## Remaining Backend Notes

- Backend should return generated tasks from `GET /project/{id}/task` after accepting `POST /project/{id}/task`.
- A future global task endpoint would avoid the current `/tasks` page project fan-out.
