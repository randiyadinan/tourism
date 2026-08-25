import React, { useState } from 'react';
import { 
  Plane, 
  Search, 
  Eye, 
  X
} from 'lucide-react';
import { airportTransferService } from '../../services/airportTransferService';
import type { AirportTransferBooking, PaymentStatus } from '../../types';

export const ManageAirportTransfersPage: React.FC = () => {
  const [transfers, setTransfers] = useState<AirportTransferBooking[]>(() => airportTransferService.getTransfers());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [paymentFilter, setPaymentFilter] = useState<string>('All');
  const [selectedTransfer, setSelectedTransfer] = useState<AirportTransferBooking | null>(null);

  const filtered = transfers.filter(t => {
    const matchesSearch = !search ||
      t.bookingCode.toLowerCase().includes(search.toLowerCase()) ||
      t.contactName.toLowerCase().includes(search.toLowerCase()) ||
      t.destinationArea.toLowerCase().includes(search.toLowerCase()) ||
      (t.flightNumber && t.flightNumber.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchesPayment = paymentFilter === 'All' || t.paymentStatus === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const handleUpdateStatus = (id: string, newStatus: 'Pending' | 'Confirmed' | 'Completed') => {
    const all = airportTransferService.getTransfers();
    const updated = all.map(t => t.id === id ? { ...t, status: newStatus } : t);
    localStorage.setItem('lv_airport_transfers', JSON.stringify(updated));
    setTransfers(updated);
    if (selectedTransfer && selectedTransfer.id === id) {
      setSelectedTransfer({ ...selectedTransfer, status: newStatus });
    }
  };

  const handleUpdatePayment = (id: string, newPayment: PaymentStatus) => {
    const all = airportTransferService.getTransfers();
    const updated = all.map(t => t.id === id ? { ...t, paymentStatus: newPayment } : t);
    localStorage.setItem('lv_airport_transfers', JSON.stringify(updated));
    setTransfers(updated);
    if (selectedTransfer && selectedTransfer.id === id) {
      setSelectedTransfer({ ...selectedTransfer, paymentStatus: newPayment });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#082F24]">Airport Transfers Logistics</h1>
          <p className="text-xs text-stone-500">Monitor flight arrivals, meet & greet schedules, and chauffeur assignments.</p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by code, customer, flight, area..."
            className="w-full pl-10 pr-4 py-2 bg-[#FAF8F5] border border-stone-300 rounded-xl text-xs text-[#082F24] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-[#FAF8F5] p-1 rounded-xl border border-stone-200">
            {['All', 'Pending', 'Confirmed', 'Completed'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  statusFilter === st
                    ? 'bg-[#0D3B2E] text-white shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Payment Filter */}
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-3 py-2 bg-[#FAF8F5] border border-stone-300 rounded-xl text-xs text-[#082F24] font-semibold"
          >
            <option value="All">All Payments</option>
            <option value="Unpaid">Unpaid</option>
            <option value="Deposit Paid">Deposit Paid</option>
            <option value="Fully Paid">Fully Paid</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] text-stone-700 font-bold border-b border-stone-200">
              <tr>
                <th className="py-3.5 px-6">Transfer Ref</th>
                <th className="py-3.5 px-4">Passenger / Contact</th>
                <th className="py-3.5 px-4">Flight Details</th>
                <th className="py-3.5 px-4">Route & Destination</th>
                <th className="py-3.5 px-4">Vehicle</th>
                <th className="py-3.5 px-4">Quote</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-600">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-stone-50/50">
                  <td className="py-4 px-6 font-bold text-[#8C6D2B]">
                    {t.bookingCode}
                    <span className="block text-[10px] text-stone-400 font-normal">
                      {t.tripType}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <strong className="text-[#082F24] block">{t.contactName}</strong>
                    <span className="text-[10px] text-stone-400">{t.contactPhone}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1 font-semibold text-[#082F24]">
                      <Plane className="w-3 h-3 text-[#C5A059]" />
                      <span>{t.flightNumber || 'No flight info'}</span>
                    </div>
                    <span className="text-[10px] text-stone-400 block">{t.flightDate} at {t.flightTime}</span>
                  </td>
                  <td className="py-4 px-4 truncate max-w-[180px]">
                    <div className="font-medium text-[#082F24] truncate">{t.destinationArea}</div>
                    <span className="text-[10px] text-stone-400 truncate block">{t.hotelAddress}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-medium text-[#082F24] block">{t.vehicleName}</span>
                    <span className="text-[10px] text-stone-400">{t.passengers} pax • {t.luggageCount} bags</span>
                  </td>
                  <td className="py-4 px-4 font-bold text-[#082F24]">${t.totalPriceUSD}</td>
                  <td className="py-4 px-4">
                    <select
                      value={t.status}
                      onChange={(e) => handleUpdateStatus(t.id, e.target.value as any)}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[11px] border ${
                        t.status === 'Confirmed'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : t.status === 'Pending'
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : 'bg-stone-100 text-stone-800 border-stone-300'
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                  <td className="py-4 px-4">
                    <select
                      value={t.paymentStatus}
                      onChange={(e) => handleUpdatePayment(t.id, e.target.value as any)}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[11px] border ${
                        t.paymentStatus === 'Fully Paid'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : t.paymentStatus === 'Deposit Paid'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      <option value="Unpaid">Unpaid</option>
                      <option value="Deposit Paid">Deposit Paid</option>
                      <option value="Fully Paid">Fully Paid</option>
                    </select>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => setSelectedTransfer(t)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#0D3B2E] bg-stone-100 hover:bg-stone-200 px-2.5 py-1 rounded-lg"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedTransfer && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div>
                <span className="text-xs font-bold text-[#8C6D2B] block">{selectedTransfer.bookingCode}</span>
                <h3 className="font-serif text-xl font-bold text-[#082F24]">Transfer Booking Details</h3>
              </div>
              <button
                onClick={() => setSelectedTransfer(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-stone-600">
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="font-medium">Guest Name:</span>
                <strong className="text-[#082F24]">{selectedTransfer.contactName}</strong>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="font-medium">Phone & Email:</span>
                <span className="text-[#082F24]">{selectedTransfer.contactPhone} ({selectedTransfer.contactEmail})</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="font-medium">Airport:</span>
                <span className="text-[#082F24]">{selectedTransfer.airport}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="font-medium">Flight:</span>
                <strong className="text-[#082F24]">{selectedTransfer.flightNumber} ({selectedTransfer.flightDate} at {selectedTransfer.flightTime})</strong>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="font-medium">Drop-off / Hotel:</span>
                <span className="text-[#082F24] text-right">{selectedTransfer.hotelAddress}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="font-medium">Vehicle Class:</span>
                <span className="text-[#082F24]">{selectedTransfer.vehicleName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="font-medium">Total Quote:</span>
                <strong className="text-emerald-700 text-sm">${selectedTransfer.totalPriceUSD} USD</strong>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedTransfer(null)}
                className="px-5 py-2 bg-[#0D3B2E] text-white text-xs font-bold rounded-xl hover:bg-[#134E3F]"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
