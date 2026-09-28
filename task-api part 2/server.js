const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./openapi.json');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const isNonEmptyString = (value) =>
  typeof value === 'string' && value.trim().length > 0;

const toApiTask = (task) => task ? { ...task, done: Boolean(task.done) } : null;
const findTask = (id) => toApiTask(db.prepare('SELECT id, title, done FROM tasks WHERE id = ?').get(id));

app.get('/', (req, res) => {
  res.status(200).json({
    name: 'Task API',
    version: '2.0',
    endpoints: ['/tasks']
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/tasks', (req, res) => {
  const tasks = db.prepare('SELECT id, title, done FROM tasks ORDER BY id').all().map(toApiTask);
  res.status(200).json(tasks);
});

app.get('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const task = findTask(id);

  if (!task) {
    return res.status(404).json({ error: `Task ${req.params.id} not found` });
  }

  return res.status(200).json(task);
});

app.post('/tasks', (req, res) => {
  const { title } = req.body;

  if (!isNonEmptyString(title)) {
    return res.status(400).json({ error: 'Title is required and must not be empty' });
  }

  const result = db.prepare('INSERT INTO tasks (title, done) VALUES (?, ?)').run(title.trim(), 0);
  const newTask = findTask(Number(result.lastInsertRowid));

  return res.status(201).json(newTask);
});

app.put('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const task = findTask(id);

  if (!task) {
    return res.status(404).json({ error: `Task ${req.params.id} not found` });
  }

  const { title, done } = req.body;
  const hasTitle = Object.prototype.hasOwnProperty.call(req.body, 'title');
  const hasDone = Object.prototype.hasOwnProperty.call(req.body, 'done');

  if (!hasTitle && !hasDone) {
    return res.status(400).json({ error: 'Provide title and/or done to update the task' });
  }

  if (hasTitle && !isNonEmptyString(title)) {
    return res.status(400).json({ error: 'Title must be a non-empty string' });
  }

  if (hasDone && typeof done !== 'boolean') {
    return res.status(400).json({ error: 'Done must be true or false' });
  }

  const nextTitle = hasTitle ? title.trim() : task.title;
  const nextDone = hasDone ? (done ? 1 : 0) : (task.done ? 1 : 0);

  db.prepare('UPDATE tasks SET title = ?, done = ? WHERE id = ?').run(nextTitle, nextDone, id);
  return res.status(200).json(findTask(id));
});

app.delete('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const result = db.prepare('DELETE FROM tasks WHERE id = ?').run(id);

  if (result.changes === 0) {
    return res.status(404).json({ error: `Task ${req.params.id} not found` });
  }

  return res.status(204).send();
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Task API running at http://localhost:${PORT}`);
    console.log(`Swagger UI available at http://localhost:${PORT}/docs`);
    console.log('SQLite database: tasks.db');
  });
}

module.exports = app;
