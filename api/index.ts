import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import app from '../server/src/index.js';

export const config = {
  runtime: 'edge'
};

const router = new Hono();

// Mount root app into /api base path as well as root
router.route('/api', app);
router.route('/', app);

export default handle(router);
