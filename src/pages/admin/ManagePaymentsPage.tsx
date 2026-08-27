import React, { useState } from 'react';
import { 
   
  Search, 
  RotateCcw } from 'lucide-react';
import { paymentService } from "../../services/paymentService";
import { formatPrice } from '../../utils/formatters';
import type { PaymentTransaction } from '../../services/paymentService';

export const ManagePaymentsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(() => paymentService.getTransactions());
  const [search, setSearch] = useState('');

  const filtered = transactions.filter(t =>
    t.transactionReference.toLowerCase().includes(search.toLowerCase()) ||
    t.customerName.toLowerCase().includes(search.toLowerCase()) ||
    t.bookingCode.toLowerCase().includes(search.toLowerCase())
  );

  const handleRefund = (id: string) => {
    if (confirm('Issue a full refund for this transaction?')) {
      const updated = paymentService.issueRefund(id);
      setTransactions(transactions.map(t => t.id === id ? updated : t));
    }
  };

  const totalCollected = transactions.filter(t => t.status === 'Successful').reduce((sum, t) => sum + t.amountUSD, 0);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#062C22]">Manage Payments & Transactions</h1>
          <p className="text-xs text-stone-500">Gateway audit logs, refunds, and settlement status.</p>
        </div>

        <div className="bg-white px-5 py-2.5 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-2">
          <span className="text-xs text-stone-400 font-bold uppercase">Total Settled:</span>
          <span className="font-serif text-lg font-bold text-[#0B3D2E]">{formatPrice(totalCollected)}</span>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-stone-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by transaction reference or customer..."
          className="w-full bg-transparent border-none text-xs text-[#062C22] focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F7F2] text-stone-700 font-bold border-b border-stone-200">
              <tr>
                <th className="py-3.5 px-6">Reference ID</th>
                <th className="py-3.5 px-4">Booking Code</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Method</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-600">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-stone-50/50">
                  <td className="py-4 px-6 font-bold text-[#062C22]">{t.transactionReference}</td>
                  <td className="py-4 px-4 font-semibold text-[#176B52]">{t.bookingCode}</td>
                  <td className="py-4 px-4">{t.customerName}</td>
                  <td className="py-4 px-4">{t.paymentMethod}</td>
                  <td className="py-4 px-4 font-bold text-[#062C22]">{formatPrice(t.amountUSD)}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      t.status === 'Successful' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    {t.status === 'Successful' ? (
                      <button
                        onClick={() => handleRefund(t.id)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:underline"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Issue Refund</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-stone-400">Refunded</span>
                    )}
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
