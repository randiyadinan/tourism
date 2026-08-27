import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { payhereRouter } from './routes/payhereRoutes.js';
import { bookingRouter } from './routes/bookingRoutes.js';
import { authRouter } from './routes/authRoutes.js';
import { adminRouter } from './routes/adminRoutes.js';
import { tourStore } from './services/tourStore.js';
import { destinationStore } from './services/destinationStore.js';
const app = new Hono();
// Enable secure CORS for frontend
app.use('*', cors({
    origin: (origin) => {
        if (!origin)
            return '*';
        if (origin.includes('localhost') ||
            origin.includes('127.0.0.1') ||
            origin.endsWith('.vercel.app') ||
            origin.includes('tourism-swart-seven.vercel.app') ||
            origin.includes('lankavoyage.com')) {
            return origin;
        }
        return 'https://tourism-swart-seven.vercel.app';
    },
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization']
}));
// Health check endpoint (matches /, /api, /api/health, /health)
app.get('/', (c) => {
    return c.json({
        status: 'ok',
        service: 'LankaVoyage API Backend',
        gateway: 'PayHere Sandbox',
        time: new Date().toISOString()
    });
});
app.get('/api', (c) => {
    return c.json({
        status: 'ok',
        service: 'LankaVoyage API Backend',
        gateway: 'PayHere Sandbox',
        time: new Date().toISOString()
    });
});
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
// Public Tours & Destinations Endpoints
app.get('/api/tours', (c) => {
    const tours = tourStore.getAllTours().filter(t => t.published);
    return c.json({ success: true, data: tours });
});
app.get('/tours', (c) => {
    const tours = tourStore.getAllTours().filter(t => t.published);
    return c.json({ success: true, data: tours });
});
app.get('/api/tours/:idOrSlug', (c) => {
    const tour = tourStore.getTourById(c.req.param('idOrSlug'));
    if (!tour)
        return c.json({ success: false, error: 'Tour not found' }, 404);
    return c.json({ success: true, data: tour });
});
app.get('/tours/:idOrSlug', (c) => {
    const tour = tourStore.getTourById(c.req.param('idOrSlug'));
    if (!tour)
        return c.json({ success: false, error: 'Tour not found' }, 404);
    return c.json({ success: true, data: tour });
});
app.get('/api/destinations', (c) => {
    const destinations = destinationStore.getAllDestinations().filter(d => d.active);
    return c.json({ success: true, data: destinations });
});
app.get('/destinations', (c) => {
    const destinations = destinationStore.getAllDestinations().filter(d => d.active);
    return c.json({ success: true, data: destinations });
});
app.get('/api/destinations/:idOrSlug', (c) => {
    const dest = destinationStore.getDestinationById(c.req.param('idOrSlug'));
    if (!dest)
        return c.json({ success: false, error: 'Destination not found' }, 404);
    return c.json({ success: true, data: dest });
});
app.get('/destinations/:idOrSlug', (c) => {
    const dest = destinationStore.getDestinationById(c.req.param('idOrSlug'));
    if (!dest)
        return c.json({ success: false, error: 'Destination not found' }, 404);
    return c.json({ success: true, data: dest });
});
// Admin Management Router (Mounted under /api/admin and /admin)
app.route('/api/admin', adminRouter);
app.route('/admin', adminRouter);
// Standard API Routes (Mounted under both /api/* and /* for transparent Vercel Function routing)
app.route('/api/payhere', payhereRouter);
app.route('/payhere', payhereRouter);
app.route('/api/bookings', bookingRouter);
app.route('/bookings', bookingRouter);
app.route('/api/auth', authRouter);
app.route('/auth', authRouter);
// Export for Cloudflare Workers / Node server
export default app;
