# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server (HMR enabled)
npm run build     # Production build → dist/
npm run preview   # Serve production build locally
npm run lint      # ESLint across all files
```

## Environment

Requires a `.env` file at the project root with:

```
VITE_SUPABASE_URL=https://<project>.supabase.co/rest/v1/
VITE_SUPABASE_KEY=<anon-key>
```

## Architecture

React 19 + Vite SPA. Entry point: `index.html` → `src/main.jsx` → `src/App.jsx`.

### Routing

React Router 7 is fully wired. All routes are defined in `src/App.jsx`:

| Path | Page | Auth required |
|---|---|---|
| `/` | AuthPage (login + register) | No |
| `/home` | HomePage | Yes |
| `/tasks` | AllTasksPage | Yes |
| `/tasks/pending` | PendingTasksPage | Yes |
| `/tasks/completed` | CompletedTasksPage | Yes |
| `/contact` | ContactPage | Yes |
| `*` | ErrorPage | No |

`ProtectedRoute` wraps auth-required pages — it reads `currentUser` from context and redirects to `/` if null.

### State / Context

`src/context/AppContext.jsx` is the single source of truth. It exposes via `useApp()`:

- **Auth**: `currentUser`, `register()`, `login()`, `logout()`
- **Tasks**: `tasks`, `addTask()`, `updateTask()`, `deleteTask()`, `toggleComplete()`
- **Stats**: `dailyCount` — tasks toggled to completed today (derived, not stored)
- **Request state**: `loading`, `error` — all async ops go through `withRequest()` which sets these

### Service layer

All Supabase calls live in `src/services/` — components never call axios directly:

- `supabaseClient.js` — axios instance pre-configured with `VITE_SUPABASE_URL` and `VITE_SUPABASE_KEY`
- `userService.js` — `registerUser()`, `loginUser()` (hits `/users` table directly; no Supabase Auth)
- `taskService.js` — `fetchTasks()`, `createTask()`, `patchTask()`, `removeTask()`
- `mappers.js` — `mapUser()` / `mapTask()` convert snake_case DB rows to camelCase JS objects

All service functions return camelCase objects; always go through `mappers.js` when adding new queries.

### Data model (Supabase schema)

```
users  — id (uuid), first_name, last_name, username, email, password
tasks  — id (uuid), title, description, created_at, completed, completed_at, user_id (FK → users.id)
```

### Styling

Plain CSS files co-located with each component/page (`TaskRow.css` next to `TaskRow.jsx`). Global resets and CSS custom properties live in `src/index.css`.

### ESLint

Flat config (`eslint.config.js`). Unused-var rule ignores uppercase identifiers (`^[A-Z_]`). React Hooks and React Refresh rules are enabled.
