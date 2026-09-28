const db = require('./database');

const taskRepository = {
  async findAll() {
    const { rows } = await db.query('SELECT id, title, done FROM tasks ORDER BY id');
    return rows;
  },

  async findById(id) {
    const { rows } = await db.query('SELECT id, title, done FROM tasks WHERE id = $1', [id]);
    return rows[0] || null;
  },

  async create(title) {
    const { rows } = await db.query(
      'INSERT INTO tasks (title, done) VALUES ($1, FALSE) RETURNING id, title, done',
      [title]
    );
    return rows[0];
  },

  async update(id, title, done) {
    const { rows } = await db.query(
      'UPDATE tasks SET title = $1, done = $2 WHERE id = $3 RETURNING id, title, done',
      [title, done, id]
    );
    return rows[0] || null;
  },

  async remove(id) {
    const result = await db.query('DELETE FROM tasks WHERE id = $1', [id]);
    return result.rowCount > 0;
  }
};

module.exports = taskRepository;
