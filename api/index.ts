import { handle } from 'hono/vercel';
import app from '../server/src/index.js';

export const config = {
  runtime: 'nodejs'
};

export default handle(app);
