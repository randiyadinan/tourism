import express, { type Request, type Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { payhereRouter } from './routes/payhereRoutes.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for development & production frontend
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Body parsers - PayHere IPN sends application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// API Routes
app.use('/api/payhere', payhereRouter);

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'LankaVoyage Payment Backend',
    gateway: 'PayHere Sandbox',
    time: new Date().toISOString()
  });
});

const server = (app as any).listen(Number(PORT), '0.0.0.0', () => {});
server.on('listening', () => {
  console.log(`🚀 LankaVoyage Payment Server running on port ${PORT}`);
  console.log(`💳 PayHere Gateway: ${process.env.PAYHERE_SANDBOX_MODE !== 'false' ? 'SANDBOX' : 'PRODUCTION'}`);
});




process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Server terminated');
  });
});

process.on('SIGINT', () => {
  server.close(() => {
    console.log('Server terminated');
  });
});

