import { serve } from '@hono/node-server';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import app from './index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const PORT = Number(process.env.PORT) || 5001;

console.log(`🚀 Starting LankaVoyage Hono Local Server on port ${PORT}...`);
serve({
  fetch: app.fetch,
  port: PORT
});
