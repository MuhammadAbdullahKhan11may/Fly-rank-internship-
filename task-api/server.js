const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./openapi.json');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const seedTasks = () => [
  { id: 1, title: 'Finish backend assignment', done: false },
  { id: 2, title: 'Review API endpoints', done: true },
  { id: 3, title: 'Update GitHub README', done: false }
];

let tasks = seedTasks();

const findTask = (id) => tasks.find((task) => task.id === id);

const isNonEmptyString = (value) =>
  typeof value === 'string' && value.trim().length > 0;

app.get('/', (req, res) => {
  res.status(200).json({
    name: 'Task API',
    version: '1.0',
    endpoints: ['/tasks']
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/tasks', (req, res) => {
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

  const nextId = tasks.length > 0 ? Math.max(...tasks.map((task) => task.id)) + 1 : 1;
  const newTask = {
    id: nextId,
    title: title.trim(),
    done: false
  };

  tasks.push(newTask);
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

  if (hasTitle) task.title = title.trim();
  if (hasDone) task.done = done;

  return res.status(200).json(task);
});

app.delete('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = tasks.findIndex((task) => task.id === id);

  if (index === -1) {
    return res.status(404).json({ error: `Task ${req.params.id} not found` });
  }

  tasks.splice(index, 1);
  return res.status(204).send();
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Task API running at http://localhost:${PORT}`);
    console.log(`Swagger UI available at http://localhost:${PORT}/docs`);
  });
}

module.exports = app;
