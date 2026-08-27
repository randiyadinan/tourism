import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import app from '../server/src/index.js';

export const config = {
  runtime: 'nodejs'
};

const router = new Hono();
router.route('/api', app);
router.route('/', app);

export default handle(router);
