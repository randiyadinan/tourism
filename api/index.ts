import { getRequestListener } from '@hono/node-server';
import app from '../server/src/index.js';

export const config = {
  runtime: 'nodejs'
};

export default getRequestListener(app.fetch);
