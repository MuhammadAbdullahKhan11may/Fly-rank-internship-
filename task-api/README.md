# Task API

A small REST API for managing a to-do list. It demonstrates the four CRUD operations using **Node.js**, **Express**, and an **in-memory array**. Interactive API documentation is available through **Swagger UI**.

> Data is intentionally stored only in memory. Restarting the server resets the task list to the three example tasks.

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

Swagger UI:

```text
http://localhost:3000/docs
```

## Endpoints

| Method | Endpoint | Description | Success |
| --- | --- | --- | --- |
| GET | `/` | API information | 200 |
| GET | `/health` | Health check | 200 |
| GET | `/tasks` | List all tasks | 200 |
| GET | `/tasks/:id` | Get one task | 200 |
| POST | `/tasks` | Create a task | 201 |
| PUT | `/tasks/:id` | Update a task | 200 |
| DELETE | `/tasks/:id` | Delete a task | 204 |

Invalid POST/PUT data returns **400 Bad Request**. Requesting an unknown task ID returns **404 Not Found** with a JSON error message.

## Example Task

```json
{
  "id": 1,
  "title": "Finish backend assignment",
  "done": false
}
```

## Example curl Output

Request:

```bash
curl -i http://localhost:3000/tasks/1
```

Example response:

```text
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{"id":1,"title":"Finish backend assignment","done":false}
```

Create a task:

```bash
curl -i -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d '{"title":"Buy milk"}'
```

## Swagger UI

After starting the server, open `http://localhost:3000/docs`. Swagger UI lists the API endpoints and lets you run the complete CRUD cycle using **Try it out**.

Before submitting, take your own screenshot of the running Swagger page and save it as `images/swagger.png`. Then add it here:

```md
![Swagger UI](images/swagger.png)
```

## Status Codes

- `200 OK` — successful read or update
- `201 Created` — task created
- `204 No Content` — task deleted
- `400 Bad Request` — invalid request body
- `404 Not Found` — task ID does not exist

## Suggested Assignment Commit History

To preserve the assignment's required stage-by-stage history, make meaningful commits while adding the project to your repository rather than presenting the finished folder as fake historical work. Suggested messages are:

1. `Stage 0: hello server`
2. `Stage 1: root and health endpoints`
3. `Stage 2: read endpoints with 404`
4. `Stage 3: create with validation`
5. `Stage 4: full CRUD`
6. `Stage 5: Swagger UI`
7. `Stage 6: publish and docs`
