import type { PaymentMethod } from '../types';

export interface PaymentTransaction {
  id: string;
  userId?: string;
  bookingId: string;
  bookingCode: string;
  customerName: string;
  amountUSD: number;
  paymentMethod: PaymentMethod;
  status: 'Successful' | 'Pending' | 'Failed' | 'Refunded';
  transactionReference: string;
  date: string;
  cardLast4?: string;
  cardBrand?: string;
  failureReason?: string;
}

const PAYMENTS_KEY = 'lv_payments';

const INITIAL_TRANSACTIONS: PaymentTransaction[] = [
  {
    id: 'tx-901',
    userId: 'user-customer-1',
    bookingId: 'bk-1001',
    bookingCode: 'LV-2026-8891',
    customerName: 'Sarah Jenkins',
    amountUSD: 2442,
    paymentMethod: 'Credit / Debit Card',
    status: 'Successful',
    transactionReference: 'TXN-STRIPE-9821448',
    date: '2026-08-10T11:24:00Z',
    cardLast4: '4242',
    cardBrand: 'Visa'
  },
  {
    id: 'tx-902',
    userId: 'user-customer-1',
    bookingId: 'bk-1002',
    bookingCode: 'LV-2026-9042',
    customerName: 'Sarah Jenkins',
    amountUSD: 600,
    paymentMethod: 'Credit / Debit Card',
    status: 'Successful',
    transactionReference: 'TXN-STRIPE-7719203',
    date: '2026-08-20T09:19:00Z',
    cardLast4: '8819',
    cardBrand: 'Mastercard'
  }
];

export const paymentService = {
  getTransactions(): PaymentTransaction[] {
    const data = localStorage.getItem(PAYMENTS_KEY);
    if (!data) {
      localStorage.setItem(PAYMENTS_KEY, JSON.stringify(INITIAL_TRANSACTIONS));
      return INITIAL_TRANSACTIONS;
    }
    try {
      return JSON.parse(data);
    } catch {
      localStorage.setItem(PAYMENTS_KEY, JSON.stringify(INITIAL_TRANSACTIONS));
      return INITIAL_TRANSACTIONS;
    }
  },

  /**
   * Returns transactions strictly owned by the specified customer ID.
   */
  getUserTransactions(userId: string): PaymentTransaction[] {
    if (!userId) return [];
    const all = this.getTransactions();
    return all.filter(t => t.userId === userId || (!t.userId && userId === 'user-customer-1'));
  },

  processDemoPayment(
    bookingId: string,
    bookingCode: string,
    customerName: string,
    amountUSD: number,
    paymentMethod: PaymentMethod,
    cardLast4?: string,
    userId?: string,
    cardBrand: string = 'Visa'
  ): { success: boolean; transaction: PaymentTransaction; error?: string } {
    // Check for simulated failure cards (e.g. ends with 0002 or 0000)
    if (cardLast4 === '0002' || cardLast4 === '0000') {
      const failedTx: PaymentTransaction = {
        id: `tx-${Date.now()}`,
        userId,
        bookingId,
        bookingCode,
        customerName,
        amountUSD,
        paymentMethod,
        status: 'Failed',
        transactionReference: `TXN-DECLINED-${Math.floor(1000000 + Math.random() * 9000000)}`,
        date: new Date().toISOString(),
        cardLast4,
        cardBrand,
        failureReason: 'Your card was declined by the issuing bank (Test decline 0002).'
      };
      const transactions = this.getTransactions();
      transactions.unshift(failedTx);
      localStorage.setItem(PAYMENTS_KEY, JSON.stringify(transactions));
      return { success: false, transaction: failedTx, error: 'Your card was declined by the issuing bank. Please use the demo success card.' };
    }

    const transactions = this.getTransactions();
    const newTx: PaymentTransaction = {
      id: `tx-${Date.now()}`,
      userId,
      bookingId,
      bookingCode,
      customerName,
      amountUSD,
      paymentMethod,
      status: 'Successful',
      transactionReference: `TXN-DEMO-${Math.floor(1000000 + Math.random() * 9000000)}`,
      date: new Date().toISOString(),
      cardLast4: cardLast4 || '4242',
      cardBrand
    };
    transactions.unshift(newTx);
    localStorage.setItem(PAYMENTS_KEY, JSON.stringify(transactions));
    return { success: true, transaction: newTx };
  },

  /**
   * Records a verified transaction from the real payment gateway (PayHere).
   */
  recordTransaction(transaction: Omit<PaymentTransaction, 'id' | 'date'> & { id?: string; date?: string }): PaymentTransaction {
    const transactions = this.getTransactions();
    const newTx: PaymentTransaction = {
      ...transaction,
      id: transaction.id || `tx-${Date.now()}`,
      date: transaction.date || new Date().toISOString(),
    };
    transactions.unshift(newTx);
    localStorage.setItem(PAYMENTS_KEY, JSON.stringify(transactions));
    return newTx;
  },

  issueRefund(transactionId: string): PaymentTransaction {
    const transactions = this.getTransactions();
    const idx = transactions.findIndex(t => t.id === transactionId);
    if (idx === -1) throw new Error('Transaction not found');
    transactions[idx].status = 'Refunded';
    localStorage.setItem(PAYMENTS_KEY, JSON.stringify(transactions));
    return transactions[idx];
  }
};

