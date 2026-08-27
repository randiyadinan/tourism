import { handle } from 'hono/vercel';
import app from '../server/dist/index.js';

export default handle(app);
