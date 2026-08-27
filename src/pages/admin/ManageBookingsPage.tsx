import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Users, 
  Plane, 
  X,
  Trash2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { bookingService } from '../../services/bookingService';
import { formatPrice } from '../../utils/formatters';
import type { Booking, BookingStatus, PaymentStatus } from '../../types';

export const ManageBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await adminService.fetchBookings();
      setBookings(data);
    } catch {
      setBookings(bookingService.getAllBookings());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const reloadBookings = () => {
    loadBookings();
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

  const handleConfirm = async (id: string) => {
    try {
      const updated = await adminService.confirmBooking(id);
      bookingService.updateBookingStatus(id, 'Confirmed');
      setBookings(bookings.map(b => b.id === id ? { ...b, ...updated } : b));
      if (selectedBooking && selectedBooking.id === id) {
        setSelectedBooking({ ...selectedBooking, ...updated });
      }
      setStatusMsg({ type: 'success', text: `Booking ${updated.bookingCode} confirmed. Customer notified with payment link.` });
      setTimeout(() => setStatusMsg(null), 4000);
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to confirm booking.' });
      setTimeout(() => setStatusMsg(null), 4000);
    }
  };

  const handleReject = async (id: string) => {
    const reason = window.prompt('Optional: Enter a brief reason for rejection to send to the customer:');
    if (reason === null) return; // Cancelled prompt

    try {
      const updated = await adminService.rejectBooking(id, reason || undefined);
      bookingService.updateBookingStatus(id, 'Rejected');
      setBookings(bookings.map(b => b.id === id ? { ...b, ...updated } : b));
      if (selectedBooking && selectedBooking.id === id) {
        setSelectedBooking({ ...selectedBooking, ...updated });
      }
      setStatusMsg({ type: 'success', text: `Booking ${updated.bookingCode} was rejected and customer notified.` });
      setTimeout(() => setStatusMsg(null), 4000);
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to reject booking.' });
      setTimeout(() => setStatusMsg(null), 4000);
    }
  };

  const handleDelete = async (b: Booking) => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete booking record ${b.bookingCode} (${b.customerName} - ${b.tourTitle || 'Tour'})?\n\nThis will remove the booking safely while preserving the customer profile.`
    );
    if (!confirmed) return;

    try {
      const res = await adminService.deleteBooking(b.id);
      if (res.success) {
        bookingService.deleteBooking(b.id);
        setBookings(prev => prev.filter(item => item.id !== b.id));
        if (selectedBooking && selectedBooking.id === b.id) {
          setSelectedBooking(null);
        }
        setStatusMsg({ type: 'success', text: res.message || `Booking ${b.bookingCode} was deleted successfully.` });
      } else {
        setStatusMsg({ type: 'error', text: res.error || 'Failed to delete booking' });
      }
      setTimeout(() => setStatusMsg(null), 4000);
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to delete booking.' });
      setTimeout(() => setStatusMsg(null), 4000);
    }
  };

  const handleUpdatePayment = (id: string, newPayment: PaymentStatus) => {
    const b = bookings.find(item => item.id === id);
    const amount = (newPayment === 'PAID' || newPayment === 'Fully Paid') ? b?.totalAmount : newPayment === 'Deposit Paid' ? Math.round((b?.totalAmount || 0) * 0.3) : 0;
    const updated = bookingService.updatePaymentStatus(id, newPayment, amount);
    setBookings(bookings.map(item => item.id === id ? updated : item));
    if (selectedBooking && selectedBooking.id === id) {
      setSelectedBooking(updated);
    }
  };

  const handleMarkAsPaid = (id: string) => {
    const updated = bookingService.markAsPaid(id);
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
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#062C22]">Manage Customer Bookings</h1>
          <p className="text-xs text-stone-500">Review bespoke itineraries, confirm pending requests, and manage booking records.</p>
        </div>
        <button
          onClick={reloadBookings}
          disabled={loading}
          className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Global Status Banner */}
      {statusMsg && (
        <div className={`p-3.5 rounded-2xl flex items-center gap-2 text-xs font-bold animate-scale-in ${
          statusMsg.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
            : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          {statusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
          <span>{statusMsg.text}</span>
        </div>
      )}

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
      <div className="liquid-glass-white p-4 rounded-2xl border border-white/80 shadow-[0_4px_20px_-4px_rgba(6,44,34,0.06)] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by code, customer, or tour..."
            className="w-full pl-10 pr-4 py-2 bg-white/70 backdrop-blur-sm border border-stone-200 rounded-xl text-xs text-[#062C22] focus:outline-none focus:border-[#39A982] transition-colors font-medium"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {['All', 'Pending', 'Confirmed', 'Rejected', 'Completed', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'bg-[#0B3D2E] text-white shadow-xs scale-102'
                  : 'bg-white/80 text-stone-600 hover:bg-stone-100 hover:text-[#062C22] border border-stone-200/60'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="liquid-glass-white rounded-3xl border border-white/80 shadow-[0_10px_30px_-10px_rgba(6,44,34,0.08)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F7F2] text-stone-700 font-bold border-b border-stone-200">
              <tr>
                <th className="py-3.5 px-6">Booking Ref</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Tour / Flight</th>
                <th className="py-3.5 px-4">Dates & Pax</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Status & Action</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-600">
              {filtered.map((b) => {
                const isPaid = b.paymentStatus === 'PAID' || b.paymentStatus === 'Fully Paid';
                const isNotPaid = b.paymentStatus === 'NOT PAID' || b.paymentStatus === 'Unpaid';

                return (
                  <tr key={b.id} className="hover:bg-stone-50/50">
                    <td className="py-4 px-6 font-mono font-bold text-[#176B52]">
                      {b.bookingCode}
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-[#062C22]">{b.customerName}</div>
                      <div className="text-[10px] text-stone-400">{b.customerEmail}</div>
                      {b.customerPhone && (
                        <div className="text-[10px] text-stone-400">{b.customerPhone}</div>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-[#062C22] max-w-[200px] truncate">{b.tourTitle}</div>
                      {b.flightNumber && (
                        <div className="text-[10px] text-[#176B52] font-semibold flex items-center gap-1 mt-0.5">
                          <Plane className="w-3 h-3" /> Flight: {b.flightNumber}
                        </div>
                      )}
                      <div className="text-[10px] text-stone-400 capitalize">{b.type.replace('_', ' ')}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div>{b.startDate} to {b.endDate}</div>
                      <div className="text-[10px] text-stone-400 flex items-center gap-1 mt-0.5">
                        <Users className="w-3 h-3 text-[#176B52]" /> {b.totalTravelers} Travelers ({b.adultsCount}A, {b.childrenCount}C)
                      </div>
                    </td>
                    <td className="py-4 px-4 font-bold text-[#062C22]">
                      {formatPrice(b.totalAmount)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          isPaid
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : isNotPaid
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : 'bg-rose-100 text-rose-800 border-rose-300'
                        }`}>
                          {isPaid ? 'PAID' : isNotPaid ? 'NOT PAID' : b.paymentStatus}
                        </span>

                        {isNotPaid && (
                          <button
                            onClick={() => handleMarkAsPaid(b.id)}
                            title="Mark Cash Payment as Received"
                            className="px-2 py-0.5 bg-[#0B3D2E] hover:bg-[#176B52] text-white rounded font-bold text-[10px] flex items-center gap-1 transition-colors shadow-xs"
                          >
                            <CheckCircle2 className="w-3 h-3 text-[#39A982]" />
                            <span>Mark Paid</span>
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1.5">
                        <select
                          value={b.bookingStatus}
                          onChange={(e) => handleUpdateStatus(b.id, e.target.value as BookingStatus)}
                          className={`px-2.5 py-1 rounded-lg font-bold text-[11px] border focus:ring-1 focus:ring-[#176B52] ${
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
                    <td className="py-4 px-6 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedBooking(b)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#0B3D2E] bg-stone-100 hover:bg-stone-200 px-2.5 py-1.5 rounded-xl shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                      <Link
                        to={`/customer/bookings/${b.id}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#176B52] hover:underline px-2 py-1.5"
                      >
                        Voucher
                      </Link>
                      <button
                        onClick={() => handleDelete(b)}
                        title="Delete Booking Record"
                        className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors inline-flex items-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
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
                <span className="text-[10px] font-bold text-[#176B52] uppercase tracking-wider">
                  Admin Itinerary Inspector
                </span>
                <h3 className="font-serif text-xl font-bold text-[#062C22]">
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
              <div className="bg-[#F8F7F2] p-4 rounded-2xl border border-stone-200/80 space-y-2">
                <span className="font-bold text-[#062C22] block">Client Contact Details</span>
                <p><strong>Lead Guest:</strong> {selectedBooking.customerName}</p>
                <p><strong>Email:</strong> {selectedBooking.customerEmail}</p>
                <p><strong>Phone:</strong> {selectedBooking.customerPhone || 'Not provided'}</p>
                {selectedBooking.flightNumber && (
                  <p><strong>Flight Number:</strong> <span className="font-bold text-[#176B52]">{selectedBooking.flightNumber}</span> ({selectedBooking.flightArrivalTime || 'Landing time TBA'})</p>
                )}
              </div>

              <div className="bg-[#F8F7F2] p-4 rounded-2xl border border-stone-200/80 space-y-2">
                <span className="font-bold text-[#062C22] block">Package Preferences</span>
                <p><strong>Hotel Tier:</strong> {selectedBooking.hotelTier || 'Selected tier'}</p>
                <p><strong>Vehicle:</strong> {selectedBooking.vehicleType || 'Dedicated van'}</p>
                <p><strong>Meal Plan:</strong> {selectedBooking.mealPlan || 'Half Board'}</p>
                <p><strong>Airport Transfer:</strong> {selectedBooking.airportPickup ? 'Included' : 'Not requested'}</p>
              </div>
            </div>

            {/* Travelers Breakdown */}
            {selectedBooking.travelers && selectedBooking.travelers.length > 0 && (
              <div className="space-y-2">
                <span className="font-bold text-xs text-[#062C22] flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#176B52]" />
                  Traveler Manifest ({selectedBooking.travelers.length} Guests)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {selectedBooking.travelers.map((t, idx) => (
                    <div key={idx} className="p-3 bg-[#F8F7F2] rounded-xl border border-stone-200 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-[#062C22]">{t.title} {t.fullName} {t.isLead && <span className="text-[10px] text-[#176B52] font-semibold">(Lead)</span>}</div>
                        <div className="text-[10px] text-stone-500">{t.nationality} &bull; Passport: {t.passportNumber || 'N/A'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Price Breakdown */}
            <div className="bg-[#F8F7F2] p-4 rounded-2xl border border-stone-200 space-y-1.5 text-xs">
              <span className="font-bold text-[#062C22] block mb-2">Financial Breakdown</span>
              <div className="flex justify-between text-stone-600">
                <span>Base Tour Price:</span>
                <span>{formatPrice(selectedBooking.basePrice)}</span>
              </div>
              {selectedBooking.customizationTotal > 0 && (
                <div className="flex justify-between text-stone-600">
                  <span>Customization Addons:</span>
                  <span>{formatPrice(selectedBooking.customizationTotal)}</span>
                </div>
              )}
              {selectedBooking.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Promo Discount ({selectedBooking.discountCode}):</span>
                  <span>-{formatPrice(selectedBooking.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-[#062C22] pt-1 border-t border-stone-200 text-sm">
                <span>Total Amount:</span>
                <span className="text-[#0B3D2E]">{formatPrice(selectedBooking.totalAmount)}</span>
              </div>
            </div>

            {/* Status Actions in Modal */}
            <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-stone-600">Status:</span>
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
                {(selectedBooking.paymentStatus === 'NOT PAID' || selectedBooking.paymentStatus === 'Unpaid') && (
                  <button
                    onClick={() => handleMarkAsPaid(selectedBooking.id)}
                    className="px-3 py-1.5 bg-[#0B3D2E] hover:bg-[#176B52] text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#39A982]" /> Mark as Paid
                  </button>
                )}
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-stone-600">Payment:</span>
                  <select
                    value={selectedBooking.paymentStatus}
                    onChange={(e) => handleUpdatePayment(selectedBooking.id, e.target.value as PaymentStatus)}
                    className="px-2 py-1 bg-stone-100 border border-stone-300 rounded-lg text-xs font-semibold"
                  >
                    <option value="PAID">PAID</option>
                    <option value="NOT PAID">NOT PAID</option>
                    <option value="FAILED">FAILED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDelete(selectedBooking)}
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Booking</span>
                </button>
                <Link
                  to={`/customer/bookings/${selectedBooking.id}`}
                  className="px-4 py-1.5 bg-[#0B3D2E] text-white font-bold text-xs rounded-xl hover:bg-[#134E3F]"
                >
                  Open Voucher
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
