# College Frontend

A React + TypeScript app for managing the departments, students and teachers served by [`college-backend`](../college-backend).

| Concern      | Library                                                                                                 |
| ------------ | ------------------------------------------------------------------------------------------------------- |
| Build        | Vite, pnpm                                                                                              |
| API calls    | axios (`src/lib/api.ts`)                                                                                |
| Server state | TanStack Query (`src/api/`)                                                                             |
| Client state | `useState`, plus React context for the shared delete confirmation (`src/components/confirm-dialog.tsx`) |
| Global state | zustand, for the persisted light/dark theme (`src/store/theme.ts`)                                      |
| Routing      | React Router                                                                                            |
| UI           | shadcn/ui with Tailwind CSS v4                                                                          |
| Data grid    | TanStack Table v8, using the shadcn data-table pattern (`src/components/data-table.tsx`)                |

## Screens

| Route         | What                                                                        |
| ------------- | --------------------------------------------------------------------------- |
| `/`           | Home, with totals for each resource                                         |
| `/department` | Department grid with server-side pagination, search, add, update and delete |
| `/student`    | Student grid, same actions, with a department multi-select                  |
| `/teacher`    | Teacher grid, same actions, with a department multi-select                  |

Deleting asks for confirmation in an alert dialog. Adding and updating use a dialog form. Backend errors, such as a duplicate name or deleting a department that still has members, appear as toasts.

## Run with Docker

Start the backend first (`cd ../college-backend && pnpm docker:up`). Then:

```bash
docker compose up -d --build   # http://localhost:8080
docker compose down            # stop and remove it
```

The image builds the app and serves it with nginx. nginx also forwards `/api` to the backend at `http://host.docker.internal:3000`. You can override this with `API_UPSTREAM`, or change the published port with `WEB_PORT`.

## Run locally

```bash
pnpm install
cp .env.example .env
pnpm dev                       # http://localhost:5173
```

## `VITE_API_BASE_URL`

Every request goes through the axios instance in `src/lib/api.ts`, which uses `VITE_API_BASE_URL` as its base URL. The default is `/api/v1`, a relative path: the Vite dev server (`pnpm dev`) and nginx (Docker) both proxy `/api` to the backend, so the browser only talks to one origin. You can also point it straight at the backend, e.g. `http://localhost:3000/api/v1`. The backend allows CORS from `http://localhost:5173` and `http://localhost:8080` by default; add other origins to its `CORS_ORIGIN`.

Vite inlines this variable at build time. For Docker, set it in `.env` or the shell before running `docker compose up --build`.

## Branch Order To learn More in-depth

1. main
2. feature/department
3. feature/user
4. feature/v1-routes
5. feature/user-department
