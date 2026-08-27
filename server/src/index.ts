import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { payhereRouter } from './routes/payhereRoutes.js';
import { bookingRouter } from './routes/bookingRoutes.js';
import { authRouter } from './routes/authRoutes.js';
import type { Bindings } from './controllers/payhereController.js';

const app = new Hono<{ Bindings: Bindings }>();

// Enable CORS for frontend
app.use(
  '*',
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization']
  })
);

// Health check endpoint (matches both /api/health and /health)
app.get('/api/health', (c) => {
  return c.json({
    status: 'ok',
    service: 'LankaVoyage API Backend',
    gateway: 'PayHere Sandbox',
    time: new Date().toISOString()
  });
});
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    service: 'LankaVoyage API Backend',
    gateway: 'PayHere Sandbox',
    time: new Date().toISOString()
  });
});

// API Routes (Mounted under both /api/* and /* for transparent Vercel Function routing)
app.route('/api/payhere', payhereRouter);
app.route('/payhere', payhereRouter);

app.route('/api/bookings', bookingRouter);
app.route('/bookings', bookingRouter);

app.route('/api/auth', authRouter);
app.route('/auth', authRouter);

// Export for Cloudflare Workers / Node server
export default app;
