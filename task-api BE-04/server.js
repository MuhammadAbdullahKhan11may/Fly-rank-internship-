const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./openapi.json');
const taskRepository = require('./taskRepository');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const isNonEmptyString = (value) =>
  typeof value === 'string' && value.trim().length > 0;

app.get('/', (req, res) => {
  res.status(200).json({ name: 'Task API', version: '3.0', endpoints: ['/tasks'] });
});

app.get('/health', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.status(200).json({ status: 'ok' });
  } catch (error) {
    res.status(503).json({ status: 'error', error: 'Database unavailable' });
  }
});

app.get('/tasks', async (req, res, next) => {
  try { res.status(200).json(await taskRepository.findAll()); } catch (error) { next(error); }
});

app.get('/tasks/:id', async (req, res, next) => {
  try {
    const task = await taskRepository.findById(Number(req.params.id));
    if (!task) return res.status(404).json({ error: `Task ${req.params.id} not found` });
    return res.status(200).json(task);
  } catch (error) { return next(error); }
});

app.post('/tasks', async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!isNonEmptyString(title)) return res.status(400).json({ error: 'Title is required and must not be empty' });
    return res.status(201).json(await taskRepository.create(title.trim()));
  } catch (error) { return next(error); }
});

app.put('/tasks/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const task = await taskRepository.findById(id);
    if (!task) return res.status(404).json({ error: `Task ${req.params.id} not found` });

    const { title, done } = req.body;
    const hasTitle = Object.prototype.hasOwnProperty.call(req.body, 'title');
    const hasDone = Object.prototype.hasOwnProperty.call(req.body, 'done');
    if (!hasTitle && !hasDone) return res.status(400).json({ error: 'Provide title and/or done to update the task' });
    if (hasTitle && !isNonEmptyString(title)) return res.status(400).json({ error: 'Title must be a non-empty string' });
    if (hasDone && typeof done !== 'boolean') return res.status(400).json({ error: 'Done must be true or false' });

    const updated = await taskRepository.update(id, hasTitle ? title.trim() : task.title, hasDone ? done : task.done);
    return res.status(200).json(updated);
  } catch (error) { return next(error); }
});

app.delete('/tasks/:id', async (req, res, next) => {
  try {
    const deleted = await taskRepository.remove(Number(req.params.id));
    if (!deleted) return res.status(404).json({ error: `Task ${req.params.id} not found` });
    return res.status(204).send();
  } catch (error) { return next(error); }
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Task API running at http://localhost:${PORT}`);
    console.log(`Swagger UI available at http://localhost:${PORT}/docs`);
    console.log('Storage: PostgreSQL');
  });
}

module.exports = app;
