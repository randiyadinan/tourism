export interface PayHereInitiateInput {
  orderId: string;
  bookingId?: string;
  bookingCode?: string;
  userId?: string;
  amount: number;
  currency?: string;
  itemTitle: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address?: string;
  city?: string;
  country?: string;
}

export interface PayHereInitiateResponse {
  success: boolean;
  sandbox: boolean;
  merchant_id: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;
  order_id: string;
  items: string;
  amount: string;
  currency: string;
  hash: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  checkout_url: string;
  error?: string;
}

export interface PayHereStatusResponse {
  orderId: string;
  bookingId?: string;
  bookingCode?: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED' | 'CHARGEDBACK';
  amount: number;
  currency: string;
  paymentId?: string;
  paymentMethod?: string;
  cardNoMasked?: string;
  statusCode?: number;
  statusMessage?: string;
  updatedAt: string;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export const payhereService = {
  /**
   * Request cryptographically signed PayHere checkout parameters from server
   */
  async initiatePayment(input: PayHereInitiateInput): Promise<PayHereInitiateResponse> {
    const endpoints = [
      '/api/payhere/initiate',
    ];

    let lastError: any = null;

    for (const url of endpoints) {
      if (!url) continue;
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(input),
        });

        if (response.ok) {
          return await response.json();
        }

        const errData = await response.json().catch(() => ({}));
        if (response.status === 500 && errData.error) {
          throw new Error(errData.error);
        }
        if (response.status === 400 && errData.error) {
          throw new Error(errData.error);
        }
        lastError = new Error(errData.error || `Server returned status ${response.status} (${response.statusText})`);
      } catch (err: any) {
        lastError = err;
        if (err.message && err.message.includes('PayHere Configuration Error')) {
          throw err;
        }
      }
    }

    console.error('All PayHere initiation endpoints failed:', lastError);
    throw new Error(
      lastError?.message || 'Payment initiation failed: Could not establish connection with payment server on port 5000.'
    );
  },

  /**
   * Check backend payment verification status
   */
  async getPaymentStatus(orderId: string): Promise<PayHereStatusResponse | null> {
    const url = `${API_BASE}/api/payhere/status/${encodeURIComponent(orderId)}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        return null;
      }
      return await response.json();
    } catch (error) {
      console.warn('Failed to query payment status:', error);
      return null;
    }
  },

  /**
   * Launch PayHere Modal or Fallback Form Redirect
   */
  launchPayment(
    data: PayHereInitiateResponse,
    callbacks: {
      onCompleted: (orderId: string) => void;
      onDismissed: () => void;
      onError: (error: string) => void;
    }
  ): void {
    const win = window as any;

    if (win.payhere && typeof win.payhere.startPayment === 'function') {
      win.payhere.onCompleted = (orderId: string) => {
        callbacks.onCompleted(orderId);
      };

      win.payhere.onDismissed = () => {
        callbacks.onDismissed();
      };

      win.payhere.onError = (error: any) => {
        const msg = typeof error === 'string' ? error : error?.message || 'Payment encountered an error';
        callbacks.onError(msg);
      };

      const paymentObject = {
        sandbox: data.sandbox,
        merchant_id: data.merchant_id,
        return_url: data.return_url,
        cancel_url: data.cancel_url,
        notify_url: data.notify_url,
        order_id: data.order_id,
        items: data.items,
        amount: data.amount,
        currency: data.currency,
        hash: data.hash,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        country: data.country,
      };

      win.payhere.startPayment(paymentObject);
    } else {
      // Fallback: create and submit hidden POST form to PayHere checkout
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = data.checkout_url;

      const fields: Record<string, string> = {
        merchant_id: data.merchant_id,
        return_url: data.return_url,
        cancel_url: data.cancel_url,
        notify_url: data.notify_url,
        order_id: data.order_id,
        items: data.items,
        currency: data.currency,
        amount: data.amount,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        country: data.country,
        hash: data.hash,
      };

      for (const [key, value] of Object.entries(fields)) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
      }

      document.body.appendChild(form);
      form.submit();
    }
  }
};
