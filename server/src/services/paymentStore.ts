export interface ServerPaymentRecord {
  orderId: string;
  bookingId?: string;
  bookingCode?: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  amount: number;
  currency: string;
  itemTitle: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED' | 'CHARGEDBACK';
  paymentId?: string;
  payhereAmount?: string;
  paymentMethod?: string;
  cardHolderName?: string;
  cardNoMasked?: string;
  cardExpiry?: string;
  statusCode?: number;
  statusMessage?: string;
  createdAt: string;
  updatedAt: string;
  rawNotification?: Record<string, any>;
}

class PaymentStore {
  private records: Map<string, ServerPaymentRecord> = new Map();

  createPayment(data: {
    orderId: string;
    bookingId?: string;
    bookingCode?: string;
    userId?: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    amount: number;
    currency: string;
    itemTitle: string;
  }): ServerPaymentRecord {
    const record: ServerPaymentRecord = {
      ...data,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.records.set(data.orderId, record);
    return record;
  }

  getPayment(orderId: string): ServerPaymentRecord | undefined {
    return this.records.get(orderId);
  }

  updatePaymentStatus(
    orderId: string,
    update: {
      status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED' | 'CHARGEDBACK';
      paymentId?: string;
      payhereAmount?: string;
      paymentMethod?: string;
      cardHolderName?: string;
      cardNoMasked?: string;
      cardExpiry?: string;
      statusCode?: number;
      statusMessage?: string;
      rawNotification?: Record<string, any>;
    }
  ): ServerPaymentRecord | undefined {
    const record = this.records.get(orderId);
    if (!record) return undefined;

    const updated: ServerPaymentRecord = {
      ...record,
      ...update,
      updatedAt: new Date().toISOString(),
    };
    this.records.set(orderId, updated);
    return updated;
  }

  getAllPayments(): ServerPaymentRecord[] {
    return Array.from(this.records.values());
  }
}

export const paymentStore = new PaymentStore();
