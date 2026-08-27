import type { Context } from 'hono';
import { paymentStore } from '../services/paymentStore.js';
import { bookingStore } from '../services/bookingStore.js';
import { md5 } from '../utils/crypto.js';

export interface Bindings {
  PAYHERE_MERCHANT_ID?: string;
  PAYHERE_MERCHANT_SECRET?: string;
  PAYHERE_SANDBOX_MODE?: string;
  PAYHERE_CALLBACK_URL?: string;
  FRONTEND_URL?: string;
}

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
  const hashedSecret = md5(merchantSecret.trim()).toUpperCase();
  const hashString = `${merchantId.trim()}${orderId.trim()}${formattedAmount}${currency.trim()}${hashedSecret}`;
  return md5(hashString).toUpperCase();
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

  const hashedSecret = md5(merchantSecret.trim()).toUpperCase();
  const hashString = `${merchantId.trim()}${orderId.trim()}${payhereAmount.trim()}${payhereCurrency.trim()}${statusCode}${hashedSecret}`;
  const calculatedSig = md5(hashString).toUpperCase();

  return calculatedSig === receivedMd5sig.trim().toUpperCase();
}

/**
 * Helper to get environment variable from Hono Context or process.env
 */
function getEnvVar(c: Context<{ Bindings: Bindings }>, key: keyof Bindings): string | undefined {
  return (c.env && (c.env as any)[key]) || (typeof process !== 'undefined' ? process.env[key] : undefined);
}

/**
 * POST /api/payhere/initiate
 * Generates secure parameters and hash for PayHere Sandbox/Live Checkout
 */
export async function initiatePayment(c: Context<{ Bindings: Bindings }>) {
  try {
    const body = await c.req.json().catch(() => ({}));
    const {
      orderId,
      bookingId,
      bookingCode,
      userId,
      amount,
      currency = 'LKR',
      itemTitle,
      customerName,
      customerEmail,
      customerPhone,
      flightNumber,
      address = 'No. 12, Galle Road',
      city = 'Colombo',
      country = 'Sri Lanka'
    } = body;

    if (!flightNumber || typeof flightNumber !== 'string' || !flightNumber.trim()) {
      return c.json({
        error: 'Flight number is required.'
      }, 400);
    }

    if (!orderId || !amount || !customerName || !customerEmail) {
      return c.json({
        error: 'Missing required parameters: orderId, amount, customerName, and customerEmail are required.'
      }, 400);
    }

    const merchantId = getEnvVar(c, 'PAYHERE_MERCHANT_ID');
    const merchantSecret = getEnvVar(c, 'PAYHERE_MERCHANT_SECRET');

    if (!merchantId || !merchantSecret) {
      console.error('PayHere Error: PAYHERE_MERCHANT_ID or PAYHERE_MERCHANT_SECRET missing from environment.');
      return c.json({
        error: 'PayHere Configuration Error: PAYHERE_MERCHANT_ID or PAYHERE_MERCHANT_SECRET is missing. Please configure them in your server environment.'
      }, 500);
    }

    const isSandbox = (getEnvVar(c, 'PAYHERE_SANDBOX_MODE') || 'true').toLowerCase() !== 'false';
    const frontendBaseUrl = getEnvVar(c, 'FRONTEND_URL') || 'https://tourism.vercel.app';
    const callbackBaseUrl = getEnvVar(c, 'PAYHERE_CALLBACK_URL') || `${new URL(c.req.url).origin}/api/payhere/notify`;

    const returnUrl = `${frontendBaseUrl}/checkout?payment_status=return&order_id=${encodeURIComponent(orderId)}&booking_id=${encodeURIComponent(bookingId || '')}`;
    const cancelUrl = `${frontendBaseUrl}/checkout?payment_status=cancelled&order_id=${encodeURIComponent(orderId)}`;
    const notifyUrl = callbackBaseUrl;

    const numAmount = Number(amount);
    const formattedAmount = numAmount.toFixed(2);

    // Compute secure cryptographic hash
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
      flightNumber: flightNumber.trim(),
      amount: numAmount,
      currency,
      itemTitle: itemTitle || 'LankaVoyage Travel Experience',
    });

    return c.json({
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
    return c.json({ error: error.message || 'Internal server error' }, 500);
  }
}

/**
 * POST /api/payhere/notify
 * Webhook/IPN endpoint called by PayHere upon payment completion
 */
export async function handleNotification(c: Context<{ Bindings: Bindings }>) {
  try {
    let payload: any = {};
    const contentType = c.req.header('content-type') || '';

    if (contentType.includes('application/json')) {
      payload = await c.req.json().catch(() => ({}));
    } else {
      payload = await c.req.parseBody().catch(() => ({}));
    }

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

    const merchantSecret = getEnvVar(c, 'PAYHERE_MERCHANT_SECRET');
    if (!merchantSecret) {
      console.error('[PayHere IPN] PAYHERE_MERCHANT_SECRET is not configured.');
      return c.text('Server configuration error', 500);
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
      return c.text('Signature verification failed', 400);
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

    // Also update server-side bookingStore if order matches a booking
    const paymentRecord = paymentStore.getPayment(order_id);
    const bookingIdentifier = paymentRecord?.bookingId || paymentRecord?.bookingCode || order_id;
    if (mappedStatus === 'SUCCESS') {
      bookingStore.markAsPaid(bookingIdentifier);
    } else if (mappedStatus === 'FAILED' || mappedStatus === 'CANCELLED') {
      bookingStore.updatePaymentStatus(bookingIdentifier, mappedStatus);
    }

    console.log(`[PayHere IPN] Order ${order_id} updated to ${mappedStatus}`);
    return c.text('OK', 200);
  } catch (error: any) {
    console.error('[PayHere IPN] Error processing notification:', error);
    return c.text('Internal Server Error', 500);
  }
}

/**
 * GET /api/payhere/status/:orderId
 * Fetches server-verified status for an order
 */
export async function getPaymentStatus(c: Context<{ Bindings: Bindings }>) {
  try {
    const orderId = c.req.param('orderId');
    if (!orderId) {
      return c.json({ error: 'Missing orderId parameter' }, 400);
    }
    const payment = paymentStore.getPayment(orderId);

    if (!payment) {
      return c.json({ error: 'Payment record not found' }, 404);
    }

    return c.json({
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
    return c.json({ error: error.message || 'Internal server error' }, 500);
  }
}
