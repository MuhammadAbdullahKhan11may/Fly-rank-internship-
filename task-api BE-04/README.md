# Task API — PostgreSQL + Docker (BE-04)

This assignment containerizes the Task API and moves persistence to PostgreSQL. PostgreSQL runs in Docker with a named volume, while Docker Compose starts both the API and database together.

## Architecture

The API endpoints, validation rules, and request/response behavior from the previous assignment are preserved. Database operations are isolated in `taskRepository.js`, which implements the storage operations used by the routes. The storage implementation now uses PostgreSQL instead of SQLite/in-memory storage.

## Stack

- Node.js + Express
- PostgreSQL 16
- `pg` PostgreSQL client
- Docker + Docker Compose
- Swagger UI
- dotenv

## Environment

The real `.env` file is ignored by Git. A safe `.env.example` is committed as a template.

Create `.env` from `.env.example` if needed:

```env
PORT=3000
POSTGRES_USER=taskuser
POSTGRES_PASSWORD=taskpassword
POSTGRES_DB=taskdb
DATABASE_URL=postgresql://taskuser:taskpassword@db:5432/taskdb
```

## Run the Complete Stack

Docker Desktop must be installed and running.

```bash
docker compose up --build
```

After startup:

- API: `http://localhost:3000`
- Swagger UI: `http://localhost:3000/docs`
- Health check: `http://localhost:3000/health`

Stop the stack with:

```bash
docker compose down
```

Do not use `docker compose down -v` when testing persistence because `-v` intentionally deletes the database volume.

## Database Initialization

`init.sql` creates the `tasks` table when the PostgreSQL volume is initialized. It also inserts three starter rows only when the table is empty.

```sql
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  done BOOLEAN NOT NULL DEFAULT FALSE
);
```

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/` | API information |
| GET | `/health` | API/database health check |
| GET | `/tasks` | List all tasks |
| GET | `/tasks/:id` | Get one task |
| POST | `/tasks` | Create a task |
| PUT | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |

Example create request:

```json
{
  "title": "Test Docker persistence"
}
```

## Persistence Test

I checked persistence using the following process:

1. Started the stack with `docker compose up --build`.
2. Created a new task using `POST /tasks` from Swagger UI.
3. Confirmed the task appeared in `GET /tasks`.
4. Stopped the containers with `docker compose down`.
5. Started them again with `docker compose up`.
6. Called `GET /tasks` again and confirmed the created task was still present.

The data survives because PostgreSQL stores its database files in the named `postgres_data` Docker volume rather than inside the disposable container filesystem.

## Assignment Requirement Check

- PostgreSQL runs in Docker.
- PostgreSQL uses a persistent named volume.
- `.env` contains the connection configuration and is Git-ignored.
- `.env.example` is committed.
- `init.sql` creates the database table.
- `taskRepository.js` contains the PostgreSQL repository implementation.
- API endpoints and behavior remain the same while the persistence implementation changes.
- `docker-compose.yml` starts the app and database together.
- Persistence can be verified across container restarts.

## Project Structure

```text
task-api/
├── .dockerignore
├── .env.example
├── .gitignore
├── Dockerfile
├── README.md
├── database.js
├── docker-compose.yml
├── init.sql
├── openapi.json
├── package.json
├── server.js
└── taskRepository.js
```
