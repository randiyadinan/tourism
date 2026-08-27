import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import app from '../server/dist/index.js';

export const config = {
  runtime: 'nodejs'
};

const rootRouter = new Hono();

// Mount under all possible Vercel serverless function incoming path variations
rootRouter.route('/api', app);
rootRouter.route('/', app);

export default handle(rootRouter);
