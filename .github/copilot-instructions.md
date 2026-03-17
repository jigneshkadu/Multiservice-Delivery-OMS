# Copilot / Agent Instructions — Multiservice-Delivery-OMS

Purpose: concise, actionable guidance for AI coding agents working in this repo.

High-level architecture
- Frontend: TypeScript + React (Vite). Run from project root. Key files: `package.json` (scripts: `dev`, `build`, `preview`), `index.tsx`, `App.tsx`, `components/` (UI pieces like `VendorDashboard.tsx`, `VendorCard.tsx`, `RiderDashboard.tsx`).
- Services: `services/` holds API wrappers and integrations: `api.ts`, `geminiService.ts`, `otpService.ts`, `firebaseConfig.ts`. Use these when wiring network/AI features.
- Backend: `backend/` is an Express app (`backend/server.js`) with MySQL2 connection pool and DB initialization. DB artifacts live in `backend/*.sql`.
- Data flow: frontend calls backend REST endpoints under `/api/*` (see `backend/server.js`). Backend initializes tables at startup and exposes order/category/vendor/rider endpoints.

Environment & run commands
- Install deps (root): `npm install`.
- Frontend dev: `npm run dev` (Vite) from repo root.
- Backend dev: `cd backend && npm run dev` (uses `nodemon`), production: `cd backend && npm start`.
- Required env vars: `GEMINI_API_KEY` (set in `.env.local` for dev), and DB vars used in `backend/server.js`: `MYSQLHOST` / `DB_HOST`, `MYSQLUSER` / `DB_USER`, `MYSQLPASSWORD` / `DB_PASSWORD`, `MYSQLPORT`, `MYSQLDATABASE` / `DB_NAME`.

Project-specific conventions (do NOT assume defaults)
- DB schema: IDs are stored as VARCHAR(50) (string IDs). Tables are created at app start in `backend/server.js` — prefer to keep column names and enum values consistent with existing CREATE TABLE statements.
- Orders flow: `orders` table includes `vendor_id` and `rider_id` and statuses are ENUM values (`PENDING`, `ACCEPTED`, `PREPARING`, `OUT_FOR_DELIVERY`, `COMPLETED`, `REJECTED`). Use these exact strings when updating status.
- Location fields: `lat`/`lng` stored as DECIMAL and transformed to numbers in `/api/riders` response (see `backend/server.js`).
- Frontend structure: UI components are small and single-purpose (e.g., `VendorCard.tsx`). Follow existing component style (functional components, props-driven).
- Services layer: network calls go through `services/api.ts`. Reuse this wrapper for auth and data requests; it centralizes base URL and headers.

Integration points & dependencies
- Gemini / Google GenAI: dependency `@google/genai` is present and `services/geminiService.ts` wraps the usage. Ensure `GEMINI_API_KEY` exists for any AI features.
- Firebase: `services/firebaseConfig.ts` contains Firebase initialization — use it for auth/features that reference Firebase.
- MySQL: backend uses `mysql2/promise` with a pooled connection — prefer `pool.query(...)` and parameterized queries to match current code.

Practical examples (where to make changes)
- Add a new API route: update `backend/server.js` and, if it needs schema changes, add SQL in `backend/db_schema.sql` or `backend/dahanu_db.sql` and mirror initialization logic in `server.js`.
- Consume backend data in UI: call `services/api.ts` and update or add a component under `components/` (follow naming e.g., `XyzView.tsx`).
- Add an AI assistant feature: extend `services/geminiService.ts` and ensure `GEMINI_API_KEY` is referenced from `.env.local`.

Testing & debugging notes
- There are no automated tests in the repo. Manual checks: run frontend with `npm run dev`, backend with `cd backend && npm run dev`, then verify endpoints in browser or via curl/Postman.
- Backend logs DB init and listens on `process.env.PORT || 5000`.

Style & safety
- Keep SQL queries parameterized (avoid string interpolation). Match existing enum and column names exactly.
- Avoid adding global state libraries; keep changes minimal and consistent with patterns already present.

If anything is unclear or you want me to expand a section (examples, endpoints list, or code snippets), tell me which area to iterate on.
