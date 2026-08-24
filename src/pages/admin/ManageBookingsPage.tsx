import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Users, 
  Car, 
  Plane, 
  Sparkles,
  X
} from 'lucide-react';
import { bookingService } from '../../services/bookingService';
import type { Booking, BookingStatus, PaymentStatus } from '../../types';

export const ManageBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>(() => bookingService.getAllBookings());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const reloadBookings = () => {
    setBookings(bookingService.getAllBookings());
  };

  const filtered = bookings.filter(b => {
    const matchesSearch = !search ||
      b.bookingCode.toLowerCase().includes(search.toLowerCase()) ||
      b.customerName.toLowerCase().includes(search.toLowerCase()) ||
      (b.tourTitle && b.tourTitle.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || b.bookingStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = bookings.filter(b => b.bookingStatus === 'Pending').length;

  const handleUpdateStatus = (id: string, newStatus: BookingStatus) => {
    const updated = bookingService.updateBookingStatus(id, newStatus);
    setBookings(bookings.map(b => b.id === id ? updated : b));
    if (selectedBooking && selectedBooking.id === id) {
      setSelectedBooking(updated);
    }
  };

  const handleConfirm = (id: string) => {
    handleUpdateStatus(id, 'Confirmed');
  };

  const handleReject = (id: string) => {
    if (window.confirm('Are you sure you want to reject this booking request?')) {
      handleUpdateStatus(id, 'Rejected');
    }
  };

  const handleUpdatePayment = (id: string, newPayment: PaymentStatus) => {
    const b = bookings.find(item => item.id === id);
    const amount = newPayment === 'Fully Paid' ? b?.totalAmount : newPayment === 'Deposit Paid' ? Math.round((b?.totalAmount || 0) * 0.3) : 0;
    const updated = bookingService.updatePaymentStatus(id, newPayment, amount);
    setBookings(bookings.map(item => item.id === id ? updated : item));
    if (selectedBooking && selectedBooking.id === id) {
      setSelectedBooking(updated);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#082F24]">Manage Customer Bookings</h1>
          <p className="text-xs text-stone-500">Review bespoke itineraries, confirm pending requests, and assign operations.</p>
        </div>
        <button
          onClick={reloadBookings}
          className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl transition-all"
        >
          ↻ Refresh List
        </button>
      </div>

      {/* Pending Banner Alert */}
      {pendingCount > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <strong className="font-bold text-sm block">Action Required: {pendingCount} Pending Booking{pendingCount > 1 ? 's' : ''}</strong>
              <span>Customer submissions start as Pending. Review and Confirm or Reject below.</span>
            </div>
          </div>
          <button
            onClick={() => setStatusFilter('Pending')}
            className="px-4 py-1.5 bg-amber-600 text-white font-bold text-xs rounded-xl hover:bg-amber-700 transition-all shrink-0"
          >
            Filter Pending Requests ({pendingCount})
          </button>
        </div>
      )}

      {/* Controls */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by code, customer, or tour..."
            className="w-full pl-10 pr-4 py-2 bg-[#FAF8F5] border border-stone-300 rounded-xl text-xs text-[#082F24] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {['All', 'Pending', 'Confirmed', 'Rejected', 'Completed', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'bg-[#0D3B2E] text-white shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {st} {st === 'Pending' && pendingCount > 0 ? `(${pendingCount})` : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] text-stone-700 font-bold border-b border-stone-200">
              <tr>
                <th className="py-3.5 px-6">Booking Ref</th>
                <th className="py-3.5 px-4">Lead Guest</th>
                <th className="py-3.5 px-4">Tour / Route</th>
                <th className="py-3.5 px-4">Travel Dates</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Status & Actions</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-6 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-600">
              {filtered.map((b) => (
                <tr key={b.id} className={`hover:bg-stone-50/50 ${b.bookingStatus === 'Pending' ? 'bg-amber-50/30' : ''}`}>
                  <td className="py-4 px-6 font-bold text-[#8C6D2B]">
                    {b.bookingCode}
                    <span className="block text-[10px] text-stone-400 font-normal">
                      {b.type === 'custom_trip' ? 'Bespoke Custom' : 'Fixed Tour'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <strong className="text-[#082F24] block">{b.customerName}</strong>
                    <span className="text-[10px] text-stone-400">{b.customerEmail}</span>
                  </td>
                  <td className="py-4 px-4 truncate max-w-[180px] font-medium">{b.tourTitle}</td>
                  <td className="py-4 px-4 whitespace-nowrap">{b.startDate} to {b.endDate}</td>
                  <td className="py-4 px-4 font-bold text-[#082F24]">${b.totalAmount.toLocaleString()}</td>
                  <td className="py-4 px-4">
                    <div className="space-y-1.5">
                      <select
                        value={b.bookingStatus}
                        onChange={(e) => handleUpdateStatus(b.id, e.target.value as BookingStatus)}
                        className={`px-2.5 py-1 rounded-lg font-bold text-[11px] border focus:ring-1 focus:ring-[#C5A059] ${
                          b.bookingStatus === 'Confirmed'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : b.bookingStatus === 'Pending'
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : b.bookingStatus === 'Rejected'
                            ? 'bg-rose-100 text-rose-800 border-rose-300'
                            : 'bg-stone-100 text-stone-700 border-stone-300'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>

                      {b.bookingStatus === 'Pending' && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleConfirm(b.id)}
                            title="Confirm Booking"
                            className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[10px] flex items-center gap-0.5"
                          >
                            <CheckCircle2 className="w-3 h-3" /> Confirm
                          </button>
                          <button
                            onClick={() => handleReject(b.id)}
                            title="Reject Booking"
                            className="px-2 py-0.5 bg-rose-600 hover:bg-rose-700 text-white rounded font-bold text-[10px] flex items-center gap-0.5"
                          >
                            <XCircle className="w-3 h-3" /> Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <select
                      value={b.paymentStatus}
                      onChange={(e) => handleUpdatePayment(b.id, e.target.value as PaymentStatus)}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[11px] border focus:ring-1 focus:ring-[#C5A059] ${
                        b.paymentStatus === 'Fully Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : b.paymentStatus === 'Deposit Paid' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      <option value="Unpaid">Unpaid</option>
                      <option value="Deposit Paid">Deposit Paid</option>
                      <option value="Fully Paid">Fully Paid</option>
                      <option value="Refunded">Refunded</option>
                    </select>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => setSelectedBooking(b)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#0D3B2E] bg-stone-100 hover:bg-stone-200 px-2.5 py-1 rounded-lg"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>
                    <Link
                      to={`/customer/bookings/${b.id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#8C6D2B] hover:underline"
                    >
                      Voucher
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Inspect Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto space-y-6">
            
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div>
                <span className="text-[10px] font-bold text-[#8C6D2B] uppercase tracking-wider">
                  Admin Itinerary Inspector
                </span>
                <h3 className="font-serif text-xl font-bold text-[#082F24]">
                  {selectedBooking.bookingCode} — {selectedBooking.tourTitle}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:bg-stone-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-stone-200/80 space-y-2">
                <span className="font-bold text-[#082F24] flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#C5A059]" />
                  Guest Details
                </span>
                <p><strong>Name:</strong> {selectedBooking.customerName}</p>
                <p><strong>Email:</strong> {selectedBooking.customerEmail}</p>
                <p><strong>Phone:</strong> {selectedBooking.customerPhone}</p>
                <p><strong>Travelers:</strong> {selectedBooking.adultsCount} Adults, {selectedBooking.childrenCount} Children, {selectedBooking.infantsCount} Infants</p>
              </div>

              <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-stone-200/80 space-y-2">
                <span className="font-bold text-[#082F24] flex items-center gap-1.5">
                  <Car className="w-4 h-4 text-[#C5A059]" />
                  Transportation & Schedule
                </span>
                <p><strong>Vehicle:</strong> {selectedBooking.vehicleType || 'Toyota KDH Luxury Van'}</p>
                <p><strong>Travel Dates:</strong> {selectedBooking.startDate} to {selectedBooking.endDate}</p>
                <p><strong>Chauffeur:</strong> English-Speaking Tourist Guide</p>
                <p><strong>Package Type:</strong> {selectedBooking.type === 'custom_trip' ? 'Bespoke Tour' : 'Fixed Tour'}</p>
              </div>
            </div>

            {/* Airport Transfer Info */}
            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-stone-200/80 space-y-2 text-xs">
              <span className="font-bold text-[#082F24] flex items-center gap-1.5">
                <Plane className="w-4 h-4 text-[#C5A059]" />
                Airport Transfer Logistics
              </span>
              <p><strong>Transfer Option:</strong> {selectedBooking.airportTransferOption || (selectedBooking.airportPickup ? 'Arrival Pickup' : 'None')}</p>
              <p><strong>Airport:</strong> {selectedBooking.airportTransferDetails?.airport || 'Bandaranaike Intl Airport (CMB)'}</p>
              <p><strong>Flight Number:</strong> {selectedBooking.flightNumber || 'UL 504'} (Arrival Time: {selectedBooking.flightArrivalTime || '14:30'})</p>
            </div>

            {/* Activities List */}
            {selectedBooking.activitiesSelected && selectedBooking.activitiesSelected.length > 0 && (
              <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-stone-200/80 space-y-2 text-xs">
                <span className="font-bold text-[#082F24] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#C5A059]" />
                  Selected Activities ({selectedBooking.activitiesSelected.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedBooking.activitiesSelected.map((act, i) => (
                    <span key={i} className="px-2.5 py-1 bg-white border border-stone-200 rounded text-stone-700 font-semibold">
                      ✓ {act}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Special Requests */}
            {(selectedBooking.notes || (selectedBooking.travelers && selectedBooking.travelers[0]?.specialRequirements)) && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                <strong>Special Requests / Notes:</strong> {selectedBooking.travelers?.[0]?.specialRequirements || selectedBooking.notes}
              </div>
            )}

            {/* Complete Price Breakdown */}
            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-stone-200/80 space-y-2 text-xs">
              <span className="font-bold text-[#082F24] block">Complete Price Breakdown</span>
              <div className="space-y-1 text-stone-600">
                <div className="flex justify-between">
                  <span>Base Package Price:</span>
                  <span className="font-semibold">${selectedBooking.basePrice?.toLocaleString() || 0}</span>
                </div>
                {selectedBooking.customizationTotal > 0 && (
                  <div className="flex justify-between">
                    <span>Custom Add-ons (Transport & Airport VIP):</span>
                    <span className="font-semibold">${selectedBooking.customizationTotal?.toLocaleString()}</span>
                  </div>
                )}
                {selectedBooking.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount Applied:</span>
                    <span className="font-semibold">-${selectedBooking.discountAmount?.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-[#082F24] pt-1 border-t border-stone-200 text-sm">
                  <span>Total Amount Paid / Due:</span>
                  <span className="text-[#0D3B2E]">${selectedBooking.totalAmount.toLocaleString()} USD</span>
                </div>
              </div>
            </div>

            {/* Status Actions in Modal */}
            <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-stone-600">Change Status:</span>
                <button
                  onClick={() => handleConfirm(selectedBooking.id)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Confirm
                </button>
                <button
                  onClick={() => handleReject(selectedBooking.id)}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl flex items-center gap-1"
                >
                  <XCircle className="w-3.5 h-3.5" /> Reject
                </button>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to={`/customer/bookings/${selectedBooking.id}`}
                  className="px-4 py-1.5 bg-[#0D3B2E] text-white font-bold text-xs rounded-xl hover:bg-[#134E3F]"
                >
                  Open Full Voucher
                </Link>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="px-4 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
