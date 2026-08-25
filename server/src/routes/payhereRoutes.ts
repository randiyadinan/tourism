import { Router } from 'express';
import {
  initiatePayment,
  handleNotification,
  getPaymentStatus
} from '../controllers/payhereController.js';

export const payhereRouter = Router();

// Endpoint to generate payment hash and initiation payload
payhereRouter.post('/initiate', initiatePayment);

// Webhook / IPN endpoint for PayHere notifications
payhereRouter.post('/notify', handleNotification);

// Status lookup endpoint
payhereRouter.get('/status/:orderId', getPaymentStatus);
