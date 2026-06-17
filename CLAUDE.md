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
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_KEY=<anon-key>
VITE_STRIPE_PUBLIC_KEY=<stripe-publishable-key>
```

Note: `VITE_SUPABASE_URL` is the bare project URL (no `/rest/v1/` suffix) — the `supabase-js` client constructs its own paths.

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
| `/donate` | DonatePage | Yes |
| `*` | ErrorPage | No |

`ProtectedRoute` wraps auth-required pages — it reads `currentUser` from context and redirects to `/` if null.

### State / Context

`src/context/AppContext.jsx` is the single source of truth. It exposes via `useApp()`:

- **Auth**: `currentUser`, `register()`, `login()`, `logout()`
- **Tasks**: `tasks`, `addTask()`, `updateTask()`, `deleteTask()`, `toggleComplete()`
- **Stats**: `dailyCount` — tasks toggled to completed today (derived, not stored)
- **Request state**: `loading`, `error` — all async ops go through `withRequest()` which sets these
- **Session gate**: `sessionLoading` — `true` until `supabase.auth.getSession()` resolves on mount; use this to avoid a flash-of-unauthenticated-content

On mount, `AppContext` calls `supabase.auth.getSession()` to rehydrate a persisted session, then subscribes to `onAuthStateChange` to handle sign-out. Tasks are fetched immediately after a session is found or after `login()`.

### Service layer

All Supabase calls live in `src/services/` — components never touch the Supabase client directly:

- `supabaseClient.js` — `supabase-js` client created with `VITE_SUPABASE_URL` + `VITE_SUPABASE_KEY`
- `userService.js` — `registerUser()`, `loginUser()`, `logoutUser()` via **Supabase Auth** (`signUp`, `signInWithPassword`, `signOut`)
- `taskService.js` — `fetchTasks()`, `createTask()`, `patchTask()`, `removeTask()` via supabase-js table API
- `mappers.js` — `mapUser()` / `mapTask()` convert snake_case DB rows to camelCase JS objects

All service functions return camelCase objects; always go through `mappers.js` when adding new queries.

### Data model (Supabase schema)

```
users  — id (uuid), first_name, last_name, username, email  [mirror of auth.users, created by DB trigger]
tasks  — id (uuid), title, description, created_at, completed, completed_at, user_id (FK → users.id)
```

### Styling

Plain CSS files co-located with each component/page (`TaskRow.css` next to `TaskRow.jsx`). Global resets and CSS custom properties live in `src/index.css`.

### ESLint

Flat config (`eslint.config.js`). Unused-var rule ignores uppercase identifiers (`^[A-Z_]`). React Hooks and React Refresh rules are enabled.
