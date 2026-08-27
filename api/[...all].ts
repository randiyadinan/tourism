import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import app from '../server/src/index.js';

export const config = {
  runtime: 'nodejs'
};

const rootRouter = new Hono();
rootRouter.route('/api', app);
rootRouter.route('/', app);

export default handle(rootRouter);
