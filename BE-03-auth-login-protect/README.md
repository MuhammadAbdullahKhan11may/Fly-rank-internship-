# BE-03 — Auth: Login & Protect

A secure REST API built with Node.js, Express and Supabase Auth. It supports account creation, login, JWT bearer authentication, reusable authentication middleware, protected routes, logout, and Swagger UI documentation.

## Features

- Sign up with email and password
- Log in and receive access/refresh tokens
- Public endpoint that requires no authentication
- JWT verification using Supabase `auth.getUser(token)`
- Reusable `requireAuth` middleware
- Protected profile and dashboard endpoints
- Protected logout endpoint
- Swagger UI with Bearer Token authorization
- Environment variables kept outside source control

## Setup

1. Create a Supabase project.
2. In Supabase, copy the Project URL and anon/publishable key.
3. Copy `.env.example` to `.env`.
4. Add your real values:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your_supabase_anon_key
PORT=3000
```

5. Install and start:

```bash
npm install
npm start
```

Server: `http://localhost:3000`  
Swagger UI: `http://localhost:3000/docs`

## API Reference

| Method | Endpoint | Authentication | Expected success |
|---|---|---|---|
| POST | `/auth/signup` | No | 201 |
| POST | `/auth/login` | No | 200 |
| POST | `/auth/logout` | Bearer JWT | 204 |
| GET | `/public/info` | No | 200 |
| GET | `/protected/profile` | Bearer JWT | 200 |
| GET | `/protected/dashboard` | Bearer JWT | 200 |

Missing signup/login fields return `400`. Missing, malformed, invalid, or expired bearer tokens return `401` on protected routes.

## Testing the authentication flow

Create an account:

```bash
curl -i -X POST http://localhost:3000/auth/signup -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"password123"}'
```

Log in:

```bash
curl -i -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"password123"}'
```

Copy `access_token` from the login response and use it on a protected endpoint:

```bash
curl -i http://localhost:3000/protected/profile -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

You can also open `/docs`, click **Authorize**, paste the JWT, and test the protected endpoints in Swagger UI.

## Swagger Screenshot

After configuring your own Supabase `.env` and running the API, take a screenshot of `/docs` showing the routes and save it as `images/swagger-ui.png` before final submission.

## Security

The real `.env` file is ignored by Git. Never commit Supabase credentials or access tokens. `.env.example` contains placeholders only and is safe to commit.

## Suggested assignment commit history

When creating the submission repository, make the assignment stages visible in your Git history rather than uploading everything as one commit:

1. `Stage 0: setup server and supabase client`
2. `Stage 1: signup and login routes working`
3. `Stage 2: public route and protected route`
4. `Stage 3: profile route token verification`
5. `Stage 4: auth middleware and logout endpoint`
6. `Stage 5: Swagger UI documentation with bearer auth`
7. `Stage 6: publish to GitHub and write README`
