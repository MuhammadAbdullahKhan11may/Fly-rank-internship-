# FlyRank Capstone — Embeddable Widget & Lead-Capture Platform

A backend-focused platform that lets an authenticated owner create widgets, embed them on another origin with one `<script>` tag, accept public lead submissions, protect the endpoint, enrich leads, persist them, and retrieve owner-scoped dashboard data.

## Architecture

```text
Owner -> Auth -> Widget CRUD -> PostgreSQL
                     |
                     +-> generated embed snippet

Customer Site (port 5500)
  -> widget.v1.js (long cached)
  -> public config (short cached)
  -> rendered form
  -> POST submission
       -> CORS / JSON size boundary
       -> rate limit / honeypot
       -> validation
       -> geo A -> geo B -> no geo
       -> PostgreSQL
       -> non-blocking notification
Owner -> Dashboard API -> submissions + stats
```

## Run

1. Copy `.env.example` to `.env`.
2. Start PostgreSQL:
   `docker compose up -d`
3. Install:
   `npm install`
4. Generate Prisma client:
   `npm run db:generate`
5. Create migration:
   `npm run db:migrate -- --name init`
6. Seed:
   `npm run db:seed`
7. Start API:
   `npm run dev`

API: `http://localhost:3000`

Serve the second-origin page:
`npx serve customer-site -l 5500`

## Demo login
`demo@example.com` / `DemoPass123!`

## Important endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET|POST /api/widgets`
- `GET|PUT|DELETE /api/widgets/:id`
- `GET /api/public/widgets/:id/config`
- `POST /api/public/widgets/:widgetId/submissions`
- `GET /api/dashboard/submissions`
- `GET /api/dashboard/stats`

## How to embed

Creating a widget returns an embed line. Or use:

`<script src="http://localhost:3000/widget.v1.js?id=YOUR_WIDGET_ID"></script>`

## Failure switches for evidence

Set these in `.env`, restart the API, and capture the output:
- `GEO_PROVIDER_A_DISABLED=true` proves provider B fallback.
- Both geo provider flags `true` prove submission still succeeds without geo.
- `SIDE_EFFECT_FAIL=true` proves notification failure does not break persistence.

## Limitations

This intentionally uses a minimal local customer page, a console notification side effect, and local PostgreSQL. It is a backend capstone, not a production SaaS deployment.
