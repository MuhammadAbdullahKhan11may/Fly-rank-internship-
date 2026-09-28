# Task API — SQLite Edition (BE-02)

This project continues the original CRUD Task API by replacing the in-memory task array with a real **SQLite database**. The API routes and request/response behavior stay the same, but tasks now survive server restarts.

## Why SQLite?

SQLite was chosen because it is lightweight, requires no separate database server, and stores the database in a single local file. It is a good fit for this assignment because the project can create and use the database automatically when it starts.

## Database

The application creates `tasks.db` in the project root automatically. It also creates the `tasks` table if it does not already exist.

The table contains:

- `id` — integer primary key
- `title` — task title
- `done` — completion status stored as `0` or `1`

If the table is empty, the application inserts three example tasks. Because seeding only happens when the table is empty, restarting the server does not duplicate them.

## Requirements

- Node.js 18 or newer
- npm

## Install and Run

```bash
npm install
npm start
```

The API runs at:

```text
http://localhost:3000
```

Swagger UI is available at:

```text
http://localhost:3000/docs
```

On the first run, `tasks.db` is created automatically.

## Endpoints

| Method | Endpoint | Description | Success |
| --- | --- | --- | --- |
| GET | `/` | API information | 200 |
| GET | `/health` | Health check | 200 |
| GET | `/tasks` | List all tasks from SQLite | 200 |
| GET | `/tasks/:id` | Get one task | 200 |
| POST | `/tasks` | Insert a new task | 201 |
| PUT | `/tasks/:id` | Update a task | 200 |
| DELETE | `/tasks/:id` | Delete a task | 204 |

Invalid POST/PUT data returns **400 Bad Request**. Requesting an unknown task ID returns **404 Not Found**.

## Example Task

```json
{
  "id": 1,
  "title": "Finish backend assignment",
  "done": false
}
```

## Example SQL Query

I used SQL queries to inspect and modify the same data used by the API. For example:

```sql
SELECT * FROM tasks;
```

Other assignment queries to try in DB Browser for SQLite:

```sql
SELECT * FROM tasks WHERE done = 1;
SELECT COUNT(*) FROM tasks;
UPDATE tasks SET done = 1;
DELETE FROM tasks WHERE done = 1;
```

Changes made directly in the database are reflected by the API because both use the same `tasks.db` file.

## Database Viewer Screenshot

Before submitting the repository, open `tasks.db` using **DB Browser for SQLite**, select the `tasks` table, and take your own screenshot. Save it as:

```text
images/database.png
```

Then replace this note with the following Markdown line:

```md
![SQLite tasks table](images/database.png)
```

## Testing Persistence

1. Run `npm start`.
2. Create a task with `POST /tasks`.
3. Confirm it appears with `GET /tasks`.
4. Stop the server.
5. Start it again with `npm start`.
6. Run `GET /tasks` again. The created task should still be present.

## Status Codes

- `200 OK` — successful read or update
- `201 Created` — task created
- `204 No Content` — task deleted
- `400 Bad Request` — invalid request body
- `404 Not Found` — task ID does not exist

## Assignment Stage Commit Messages

If you are completing the assignment stage by stage in Git, the requested commit messages are:

1. `Stage 0: create SQLite database`
2. `Stage 1: database read endpoints`
3. `Stage 2: insert into database`
4. `Stage 3: update and delete with SQL`
5. `Stage 4: explored SQLite`
6. `Stage 5: database documentation`
