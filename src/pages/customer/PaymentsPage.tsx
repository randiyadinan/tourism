import React from 'react';
import { 
  CreditCard, 
  Download, 
   
  ShieldCheck } from 'lucide-react';
import { paymentService } from '../../services/paymentService';
import { useAuth } from '../../context/AuthContext';
import { formatPrice } from '../../utils/formatters';

export const PaymentsPage: React.FC = () => {
  const { user } = useAuth();
  const transactions = user ? paymentService.getUserTransactions(user.id) : [];

  const handleDownloadInvoice = (txnRef: string) => {
    alert(`Downloading PDF Invoice for receipt ${txnRef}...`);
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#062C22]">Payments & Digital Invoices</h1>
        <p className="text-xs text-stone-500">View transaction history and download official tax receipts.</p>
      </div>

      {/* Payment Security Badge */}
      <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 flex items-center gap-3 text-xs text-emerald-900">
        <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
        <div>
          <strong className="block">Secure 256-Bit SSL Encrypted Transactions</strong>
          <span>All payments are processed securely with instant digital receipt generation and full consumer protection.</span>
        </div>
      </div>

      {/* Transaction Log Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-stone-100">
          <h3 className="font-serif text-lg font-bold text-[#062C22]">Transaction History</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F7F2] text-stone-700 font-bold border-b border-stone-200">
              <tr>
                <th className="py-3.5 px-6">Transaction Ref</th>
                <th className="py-3.5 px-4">Booking Code</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Method</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-600">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-stone-50/50">
                  <td className="py-4 px-6 font-bold text-[#062C22]">{tx.transactionReference}</td>
                  <td className="py-4 px-4 font-semibold text-[#176B52]">{tx.bookingCode}</td>
                  <td className="py-4 px-4">{new Date(tx.date).toLocaleDateString()}</td>
                  <td className="py-4 px-4 flex items-center gap-1.5 pt-4">
                    <CreditCard className="w-3.5 h-3.5 text-[#176B52]" />
                    <span>{tx.paymentMethod} {tx.cardLast4 ? `(•• ${tx.cardLast4})` : ''}</span>
                  </td>
                  <td className="py-4 px-4 font-bold text-[#062C22]">{formatPrice(tx.amountUSD)}</td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleDownloadInvoice(tx.transactionReference)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#0B3D2E] hover:underline"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
