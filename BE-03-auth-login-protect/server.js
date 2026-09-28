require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./openapi.json');
const supabase = require('./supabase');
const { createClient } = require('@supabase/supabase-js');
const requireAuth = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

const validCredentials = (email, password) =>
  typeof email === 'string' && email.trim() && typeof password === 'string' && password.length > 0;

app.get('/', (req, res) => res.status(200).json({
  name: 'BE-03 Auth API',
  version: '1.0.0',
  docs: '/docs'
}));

app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

app.post('/auth/signup', async (req, res) => {
  const { email, password } = req.body || {};
  if (!validCredentials(email, password)) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  try {
    const { data, error } = await supabase.auth.signUp({ email: email.trim(), password });
    if (error) return res.status(400).json({ error: error.message });
    return res.status(201).json({ user: data.user });
  } catch (error) {
    return res.status(500).json({ error: 'Unable to create account' });
  }
});

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!validCredentials(email, password)) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error || !data.session) return res.status(401).json({ error: 'Invalid login credentials' });
    return res.status(200).json({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      user: data.user
    });
  } catch (error) {
    return res.status(401).json({ error: 'Invalid login credentials' });
  }
});

app.get('/public/info', (req, res) => {
  return res.status(200).json({ message: 'Welcome stranger! This info is public.' });
});

app.get('/protected/profile', requireAuth, (req, res) => {
  return res.status(200).json({
    id: req.user.id,
    email: req.user.email,
    created_at: req.user.created_at
  });
});

app.get('/protected/dashboard', requireAuth, (req, res) => {
  return res.status(200).json({ message: 'Welcome to the protected dashboard.', user_id: req.user.id });
});

app.post('/auth/logout', requireAuth, async (req, res) => {
  try {
    const userClient = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
      global: { headers: { Authorization: `Bearer ${req.accessToken}` } },
      auth: { persistSession: false, autoRefreshToken: false }
    });
    const { error } = await userClient.auth.signOut();
    if (error) return res.status(400).json({ error: error.message });
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: 'Unable to log out' });
  }
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running and connected to Supabase at http://localhost:${PORT}`);
    console.log(`Swagger UI: http://localhost:${PORT}/docs`);
  });
}

module.exports = app;
