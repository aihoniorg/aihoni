import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { Env } from './types';
import auth from './routes/auth';
import users from './routes/users';
import businesses from './routes/businesses';
import upload from './routes/upload';

const app = new Hono<{ Bindings: Env }>();

app.use('*', cors({
  origin: ['https://aihoni.com', 'https://www.aihoni.com', 'http://localhost:5173'],
  credentials: true,
}));

app.route('/api/auth', auth);
app.route('/api/users', users);
app.route('/api/businesses', businesses);
app.route('/api/upload', upload);

app.get('/health', (c) => c.json({ ok: true }));

export default app;
