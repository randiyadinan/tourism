import crypto from 'node:crypto';
import path from 'node:path';
import dotenv from 'dotenv';
import type { Request, Response } from 'express';
import { paymentStore } from '../services/paymentStore.js';

// Load .env from both local and parent directories
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '..', '.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'server', '.env') });

/**
 * PayHere MD5 Hash Generator for Payment Initiation
 * Formula: strtoupper(md5(merchant_id + order_id + number_format(amount, 2, '.', '') + currency + strtoupper(md5(merchant_secret))))
 */
export function generatePayHereHash(
  merchantId: string,
  orderId: string,
  amount: number,
  currency: string,
  merchantSecret: string
): string {
  const formattedAmount = Number(amount).toFixed(2);
  const hashedSecret = crypto
    .createHash('md5')
    .update(merchantSecret.trim())
    .digest('hex')
    .toUpperCase();

  const hashString = `${merchantId.trim()}${orderId.trim()}${formattedAmount}${currency.trim()}${hashedSecret}`;
  return crypto
    .createHash('md5')
    .update(hashString)
    .digest('hex')
    .toUpperCase();
}

/**
 * PayHere MD5 Hash Verifier for IPN / Notify Webhook
 * Formula: strtoupper(md5(merchant_id + order_id + payhere_amount + payhere_currency + status_code + strtoupper(md5(merchant_secret))))
 */
export function verifyPayHereNotificationHash(
  merchantId: string,
  orderId: string,
  payhereAmount: string,
  payhereCurrency: string,
  statusCode: string | number,
  receivedMd5sig: string,
  merchantSecret: string
): boolean {
  if (!receivedMd5sig) return false;

  const hashedSecret = crypto
    .createHash('md5')
    .update(merchantSecret.trim())
    .digest('hex')
    .toUpperCase();

  const hashString = `${merchantId.trim()}${orderId.trim()}${payhereAmount.trim()}${payhereCurrency.trim()}${statusCode}${hashedSecret}`;
  const calculatedSig = crypto
    .createHash('md5')
    .update(hashString)
    .digest('hex')
    .toUpperCase();

  return calculatedSig === receivedMd5sig.trim().toUpperCase();
}

/**
 * POST /api/payhere/initiate
 * Generates secure parameters and hash for PayHere Sandbox/Live Checkout
 */
export async function initiatePayment(req: Request, res: Response): Promise<void> {
  try {
    const {
      orderId,
      bookingId,
      bookingCode,
      userId,
      amount,
      currency = 'USD',
      itemTitle,
      customerName,
      customerEmail,
      customerPhone,
      address = 'No. 12, Galle Road',
      city = 'Colombo',
      country = 'Sri Lanka'
    } = req.body;

    if (!orderId || !amount || !customerName || !customerEmail) {
      res.status(400).json({
        error: 'Missing required parameters: orderId, amount, customerName, and customerEmail are required.'
      });
      return;
    }

    const merchantId = process.env.PAYHERE_MERCHANT_ID;
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;

    if (!merchantId || !merchantSecret) {
      console.error('PayHere Error: PAYHERE_MERCHANT_ID or PAYHERE_MERCHANT_SECRET missing from environment.');
      res.status(500).json({
        error: 'PayHere Configuration Error: PAYHERE_MERCHANT_ID or PAYHERE_MERCHANT_SECRET is missing. Please configure them in your server .env file.'
      });
      return;
    }

    const isSandbox = (process.env.PAYHERE_SANDBOX_MODE || 'true').toLowerCase() !== 'false';
    const callbackBaseUrl = process.env.PAYHERE_CALLBACK_URL || 'http://localhost:5000/api/payhere/notify';
    const frontendBaseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    
    const returnUrl = `${frontendBaseUrl}/checkout?payment_status=return&order_id=${encodeURIComponent(orderId)}&booking_id=${encodeURIComponent(bookingId || '')}`;
    const cancelUrl = `${frontendBaseUrl}/checkout?payment_status=cancelled&order_id=${encodeURIComponent(orderId)}`;
    const notifyUrl = callbackBaseUrl;

    const numAmount = Number(amount);
    const formattedAmount = numAmount.toFixed(2);

    // Compute secure cryptographic hash on server
    const hash = generatePayHereHash(
      merchantId,
      orderId,
      numAmount,
      currency,
      merchantSecret
    );

    // Split name for PayHere
    const nameParts = customerName.trim().split(' ');
    const firstName = nameParts[0] || 'Guest';
    const lastName = nameParts.slice(1).join(' ') || 'Traveler';

    // Record intent in server store
    paymentStore.createPayment({
      orderId,
      bookingId,
      bookingCode,
      userId,
      customerName,
      customerEmail,
      customerPhone: customerPhone || '',
      amount: numAmount,
      currency,
      itemTitle: itemTitle || 'LankaVoyage Travel Experience',
    });

    console.log(`[PayHere] Initiated payment for order ${orderId}, amount: ${currency} ${formattedAmount}`);

    res.json({
      success: true,
      sandbox: isSandbox,
      merchant_id: merchantId,
      return_url: returnUrl,
      cancel_url: cancelUrl,
      notify_url: notifyUrl,
      order_id: orderId,
      items: itemTitle || 'LankaVoyage Travel Experience',
      amount: formattedAmount,
      currency: currency,
      hash: hash,
      first_name: firstName,
      last_name: lastName,
      email: customerEmail,
      phone: customerPhone || '+94770000000',
      address: address || 'No. 12, Galle Face Road',
      city: city || 'Colombo',
      country: country || 'Sri Lanka',
      checkout_url: isSandbox
        ? 'https://sandbox.payhere.lk/pay/checkout'
        : 'https://www.payhere.lk/pay/checkout'
    });
  } catch (error: any) {
    console.error('Error initiating PayHere payment:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

/**
 * POST /api/payhere/notify
 * Webhook/IPN endpoint called by PayHere upon payment completion
 */
export async function handleNotification(req: Request, res: Response): Promise<void> {
  try {
    const payload = req.body;
    console.log('[PayHere IPN] Received notification payload:', payload);

    const {
      merchant_id,
      order_id,
      payment_id,
      payhere_amount,
      payhere_currency,
      status_code,
      md5sig,
      method,
      status_message,
      card_holder_name,
      card_no,
      card_expiry
    } = payload;

    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
    if (!merchantSecret) {
      console.error('[PayHere IPN] PAYHERE_MERCHANT_SECRET is not configured.');
      res.status(500).send('Server configuration error');
      return;
    }

    // Verify signature
    const isValidSignature = verifyPayHereNotificationHash(
      merchant_id,
      order_id,
      payhere_amount,
      payhere_currency,
      status_code,
      md5sig,
      merchantSecret
    );

    if (!isValidSignature) {
      console.warn('[PayHere IPN] Signature mismatch for order:', order_id);
      res.status(400).send('Signature verification failed');
      return;
    }

    let mappedStatus: 'SUCCESS' | 'FAILED' | 'CANCELLED' | 'PENDING' | 'CHARGEDBACK' = 'PENDING';
    const numStatusCode = Number(status_code);

    if (numStatusCode === 2) {
      mappedStatus = 'SUCCESS';
    } else if (numStatusCode === 0) {
      mappedStatus = 'PENDING';
    } else if (numStatusCode === -1) {
      mappedStatus = 'CANCELLED';
    } else if (numStatusCode === -2) {
      mappedStatus = 'FAILED';
    } else if (numStatusCode === -3) {
      mappedStatus = 'CHARGEDBACK';
    }

    paymentStore.updatePaymentStatus(order_id, {
      status: mappedStatus,
      paymentId: payment_id,
      payhereAmount: payhere_amount,
      paymentMethod: method || 'Credit / Debit Card',
      cardHolderName: card_holder_name,
      cardNoMasked: card_no,
      cardExpiry: card_expiry,
      statusCode: numStatusCode,
      statusMessage: status_message,
      rawNotification: payload,
    });

    console.log(`[PayHere IPN] Order ${order_id} updated to ${mappedStatus}`);
    res.status(200).send('OK');
  } catch (error: any) {
    console.error('[PayHere IPN] Error processing notification:', error);
    res.status(500).send('Internal Server Error');
  }
}

/**
 * GET /api/payhere/status/:orderId
 * Fetches server-verified status for an order
 */
export async function getPaymentStatus(req: Request, res: Response): Promise<void> {
  try {
    const { orderId } = req.params;
    const payment = paymentStore.getPayment(orderId);

    if (!payment) {
      res.status(404).json({ error: 'Payment record not found' });
      return;
    }

    res.json({
      orderId: payment.orderId,
      bookingId: payment.bookingId,
      bookingCode: payment.bookingCode,
      status: payment.status,
      amount: payment.amount,
      currency: payment.currency,
      paymentId: payment.paymentId,
      paymentMethod: payment.paymentMethod,
      cardNoMasked: payment.cardNoMasked,
      statusCode: payment.statusCode,
      statusMessage: payment.statusMessage,
      updatedAt: payment.updatedAt
    });
  } catch (error: any) {
    console.error('Error fetching payment status:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
