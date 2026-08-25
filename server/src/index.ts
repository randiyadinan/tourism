import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { payhereRouter } from './routes/payhereRoutes.js';
import type { Bindings } from './controllers/payhereController.js';

const app = new Hono<{ Bindings: Bindings }>();

// Enable CORS for frontend
app.use(
  '*',
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization']
  })
);

// Health check endpoint
app.get('/api/health', (c) => {
  return c.json({
    status: 'ok',
    service: 'LankaVoyage Payment Backend (Cloudflare Worker)',
    gateway: 'PayHere Sandbox',
    time: new Date().toISOString()
  });
});

// API Routes
app.route('/api/payhere', payhereRouter);

// Export for Cloudflare Workers
export default app;
