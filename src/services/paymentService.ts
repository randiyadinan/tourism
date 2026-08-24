import type { PaymentMethod } from '../types';

export interface PaymentTransaction {
  id: string;
  bookingId: string;
  bookingCode: string;
  customerName: string;
  amountUSD: number;
  paymentMethod: PaymentMethod;
  status: 'Successful' | 'Pending' | 'Failed' | 'Refunded';
  transactionReference: string;
  date: string;
  cardLast4?: string;
}

const PAYMENTS_KEY = 'lv_payments';

const INITIAL_TRANSACTIONS: PaymentTransaction[] = [
  {
    id: 'tx-901',
    bookingId: 'bk-1001',
    bookingCode: 'LV-2026-8891',
    customerName: 'Sarah Jenkins',
    amountUSD: 2442,
    paymentMethod: 'Credit / Debit Card',
    status: 'Successful',
    transactionReference: 'TXN-STRIPE-9821448',
    date: '2026-08-10T11:24:00Z',
    cardLast4: '4242'
  },
  {
    id: 'tx-902',
    bookingId: 'bk-1002',
    bookingCode: 'LV-2026-9042',
    customerName: 'Sarah Jenkins',
    amountUSD: 600,
    paymentMethod: 'Credit / Debit Card',
    status: 'Successful',
    transactionReference: 'TXN-STRIPE-7719203',
    date: '2026-08-20T09:19:00Z',
    cardLast4: '8819'
  }
];

export const paymentService = {
  getTransactions(): PaymentTransaction[] {
    const data = localStorage.getItem(PAYMENTS_KEY);
    if (!data) {
      localStorage.setItem(PAYMENTS_KEY, JSON.stringify(INITIAL_TRANSACTIONS));
      return INITIAL_TRANSACTIONS;
    }
    return JSON.parse(data);
  },

  processDemoPayment(
    bookingId: string,
    bookingCode: string,
    customerName: string,
    amountUSD: number,
    paymentMethod: PaymentMethod,
    cardLast4?: string
  ): { success: boolean; transaction: PaymentTransaction } {
    const transactions = this.getTransactions();
    const newTx: PaymentTransaction = {
      id: `tx-${Date.now()}`,
      bookingId,
      bookingCode,
      customerName,
      amountUSD,
      paymentMethod,
      status: 'Successful',
      transactionReference: `TXN-DEMO-${Math.floor(1000000 + Math.random() * 9000000)}`,
      date: new Date().toISOString(),
      cardLast4: cardLast4 || '4242'
    };
    transactions.unshift(newTx);
    localStorage.setItem(PAYMENTS_KEY, JSON.stringify(transactions));
    return { success: true, transaction: newTx };
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
