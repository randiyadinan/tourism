import { Hono } from 'hono';
import {
  initiatePayment,
  handleNotification,
  getPaymentStatus,
  type Bindings
} from '../controllers/payhereController.js';

export const payhereRouter = new Hono<{ Bindings: Bindings }>();

// Endpoint to generate payment hash and initiation payload
payhereRouter.post('/initiate', initiatePayment);

// Webhook / IPN endpoint for PayHere notifications
payhereRouter.post('/notify', handleNotification);

// Status lookup endpoint
payhereRouter.get('/status/:orderId', getPaymentStatus);
