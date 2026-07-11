# Ledger — Meal & Expense Tracker (Next.js frontend)

## 1. Prerequisites
- Node.js 18.17+ (Node 20 recommended)
- The ASP.NET Core API running (default: `http://localhost:5118`)

## 2. Setup
```bash
cd frontend
npm install
cp .env.local.example .env.local
```

Edit `.env.local` if your API runs on a different URL:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5118
```

## 3. Run
```bash
npm run dev
```
Open http://localhost:3000 — it will redirect you to `/login`.

## 4. Trying it out
1. Go to `/register`, create a normal user account — you'll land on `/dashboard`.
2. To see the admin dashboard, promote that user to Admin directly in the database
   (see the API's README), then log in again — you'll land on `/admin` instead.

## 5. How auth works here
- On login/register, the API returns an access token (15 min) and a refresh token (7 days).
  Both are stored in `localStorage` along with the user profile.
- Every API request automatically attaches `Authorization: Bearer <accessToken>`
  (see `src/lib/api.ts`).
- If a request comes back `401`, the client automatically calls `/api/auth/refresh`,
  stores the new tokens, and retries the original request — this happens transparently,
  so you generally won't notice access tokens expiring during normal use.
- If the refresh token itself is invalid/expired, the session is cleared and routes
  guarded by `<AuthGuard>` redirect to `/login`.
- `<AuthGuard requireRole="Admin">` / `requireRole="User"` protect `/admin/*` and
  `/dashboard/*` respectively — a user with the wrong role gets redirected to
  their own dashboard rather than seeing a blank/broken page.

## 6. Project structure
```
src/
  app/
    login/, register/        — public auth pages
    dashboard/                — user area (Overview, Meals, Expenses)
    admin/                     — admin area (Overview, Users)
  components/
    AppShell.tsx              — sidebar layout shared by both dashboards
    AuthGuard.tsx              — route protection by auth state + role
    ui.tsx                     — Card, PageHeader, Banner, Spinner, etc.
  lib/
    api.ts                     — axios instance with auto token refresh
    auth-context.tsx           — login/register/logout + current user state
    token-store.ts             — localStorage session persistence
    types.ts                   — shared TypeScript types matching API DTOs
    utils.ts                   — currency/date formatting, error messages
```

## 7. Notes
- Styling is Tailwind CSS with a small custom token set (see `tailwind.config.ts` —
  colors named `pine`, `amber`, `ink`, `paper`) rather than a component library, so
  it's easy to reskin.
- No server-side rendering of protected data — this is a client-rendered SPA-style
  dashboard talking to the API directly, which keeps the auth model simple with a
  bearer-token API. If you later want SSR'd dashboards, the token storage strategy
  would need to move to httpOnly cookies instead.
