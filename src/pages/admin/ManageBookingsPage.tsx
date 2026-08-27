import React, { useState, useEffect } from 'react';
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
import { formatPrice } from '../../utils/formatters';
import type { Booking, BookingStatus, PaymentStatus } from '../../types';

export const ManageBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>(() => bookingService.getAllBookings());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    bookingService.fetchBookingsFromServer().then((latest) => {
      setBookings(latest);
    });
  }, []);

  const reloadBookings = () => {
    setBookings(bookingService.getAllBookings());
    bookingService.fetchBookingsFromServer().then((latest) => {
      setBookings(latest);
    });
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
      <div className="liquid-glass-white p-4 rounded-2xl border border-white/80 shadow-[0_4px_20px_-4px_rgba(6,44,34,0.06)] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by code, customer, or tour..."
            className="w-full pl-10 pr-4 py-2 bg-white/70 backdrop-blur-sm border border-stone-200 rounded-xl text-xs text-[#062C22] focus:outline-none focus:border-[#39A982] transition-colors"
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
              {st} {st === 'Pending' && pendingCount > 0 ? `(${pendingCount})` : ''}
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
                <th className="py-3.5 px-6">Booking ID</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Tour</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Total</th>
                <th className="py-3.5 px-4">Payment Method</th>
                <th className="py-3.5 px-4">Payment Status</th>
                <th className="py-3.5 px-4">Booking Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-600">
              {filtered.map((b) => {
                const isPaid = b.paymentStatus === 'PAID' || b.paymentStatus === 'Fully Paid';
                const isNotPaid = b.paymentStatus === 'NOT PAID' || b.paymentStatus === 'Unpaid';
                const isCash = b.paymentMethod === 'Cash Payment';

                return (
                  <tr key={b.id} className={`hover:bg-stone-50/50 ${b.bookingStatus === 'Pending' ? 'bg-amber-50/30' : ''}`}>
                    <td className="py-4 px-6 font-bold text-[#176B52]">
                      {b.bookingCode}
                      <span className="block text-[10px] text-stone-400 font-normal">
                        {b.type === 'custom_trip' ? 'Bespoke Custom' : 'Fixed Tour'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <strong className="text-[#062C22] block">{b.customerName}</strong>
                      <span className="text-[10px] text-stone-400">{b.customerEmail}</span>
                    </td>
                    <td className="py-4 px-4 truncate max-w-[170px] font-medium">{b.tourTitle}</td>
                    <td className="py-4 px-4 whitespace-nowrap text-xs">{b.startDate} to {b.endDate}</td>
                    <td className="py-4 px-4 font-bold text-[#062C22]">{formatPrice(b.totalAmount)}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                        isCash
                          ? 'bg-amber-50 text-amber-900 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}>
                        {b.paymentMethod}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-1.5 items-start">
                        <span className={`px-2.5 py-1 rounded-lg font-bold text-[11px] border ${
                          isPaid
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : isNotPaid
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : 'bg-rose-100 text-rose-800 border-rose-300'
                        }`}>
                          {isPaid ? 'PAID' : isNotPaid ? 'NOT PAID' : b.paymentStatus}
                        </span>

                        {/* Admin Mark as Paid action for NOT PAID cash or pending bookings */}
                        {isNotPaid && (
                          <button
                            onClick={() => handleMarkAsPaid(b.id)}
                            title="Mark Cash Payment as Received"
                            className="px-2 py-0.5 bg-[#0B3D2E] hover:bg-[#176B52] text-white rounded font-bold text-[10px] flex items-center gap-1 transition-colors shadow-xs"
                          >
                            <CheckCircle2 className="w-3 h-3 text-[#39A982]" />
                            <span>Mark as Paid</span>
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
                    <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedBooking(b)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#0B3D2E] bg-stone-100 hover:bg-stone-200 px-2.5 py-1 rounded-lg"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                      <Link
                        to={`/customer/bookings/${b.id}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#176B52] hover:underline"
                      >
                        Voucher
                      </Link>
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
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#062C22] flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#176B52]" />
                    Customer Profile
                  </span>
                  <Link
                    to={`/admin/customers`}
                    className="text-[11px] font-bold text-[#176B52] hover:underline"
                  >
                    Directory →
                  </Link>
                </div>
                <p><strong>Name:</strong> {selectedBooking.customerName}</p>
                <p><strong>Email:</strong> {selectedBooking.customerEmail}</p>
                <p><strong>Phone:</strong> {selectedBooking.customerPhone || 'Not provided'}</p>
                <p><strong>Total Travelers:</strong> {selectedBooking.totalTravelers || (selectedBooking.adultsCount + selectedBooking.childrenCount + selectedBooking.infantsCount)} ({selectedBooking.adultsCount} Adults, {selectedBooking.childrenCount} Children, {selectedBooking.infantsCount} Infants)</p>
              </div>

              <div className="bg-[#F8F7F2] p-4 rounded-2xl border border-stone-200/80 space-y-2">
                <span className="font-bold text-[#062C22] flex items-center gap-1.5">
                  <Car className="w-4 h-4 text-[#176B52]" />
                  Transportation & Schedule
                </span>
                <p><strong>Vehicle:</strong> {selectedBooking.vehicleType || 'Toyota KDH Luxury Van'}</p>
                <p><strong>Travel Dates:</strong> {selectedBooking.startDate} to {selectedBooking.endDate}</p>
                <p><strong>Chauffeur:</strong> English-Speaking Tourist Guide</p>
                <p><strong>Package Type:</strong> {selectedBooking.type === 'custom_trip' ? 'Bespoke Tour' : selectedBooking.type === 'airport_transfer' ? 'Airport Transfer' : 'Fixed Tour'}</p>
              </div>
            </div>

            {/* Individual Traveler Passenger Details */}
            {selectedBooking.travelers && selectedBooking.travelers.length > 0 && (
              <div className="bg-[#F8F7F2] p-4 rounded-2xl border border-stone-200/80 space-y-2 text-xs">
                <span className="font-bold text-[#062C22] flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#176B52]" />
                  Passenger / Traveler Profiles ({selectedBooking.travelers.length})
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedBooking.travelers.map((t, idx) => (
                    <div key={idx} className="p-2.5 bg-white rounded-xl border border-stone-200 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <strong className="text-[#062C22]">{t.title} {t.fullName}</strong>
                        {t.isLead && (
                          <span className="px-1.5 py-0.5 bg-[#0B3D2E] text-white text-[9px] font-bold rounded">
                            Lead Guest
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-500"><strong>Nationality:</strong> {t.nationality || 'International'}</p>
                      {t.passportNumber && (
                        <p className="text-[11px] text-stone-500"><strong>Passport:</strong> <span className="font-mono">{t.passportNumber}</span></p>
                      )}
                      {t.email && (
                        <p className="text-[11px] text-stone-500"><strong>Email:</strong> {t.email}</p>
                      )}
                      {t.phone && (
                        <p className="text-[11px] text-stone-500"><strong>Phone:</strong> {t.phone}</p>
                      )}
                      {t.specialRequirements && (
                        <p className="text-[11px] text-amber-700"><strong>Requirement:</strong> {t.specialRequirements}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Airport Transfer Info */}
            <div className="bg-[#F8F7F2] p-4 rounded-2xl border border-stone-200/80 space-y-2 text-xs">
              <span className="font-bold text-[#062C22] flex items-center gap-1.5">
                <Plane className="w-4 h-4 text-[#176B52]" />
                Airport Transfer Logistics
              </span>
              <p><strong>Transfer Option:</strong> {selectedBooking.airportTransferOption || (selectedBooking.airportPickup ? 'Arrival Pickup' : 'None')}</p>
              <p><strong>Airport:</strong> {selectedBooking.airportTransferDetails?.airport || 'Bandaranaike Intl Airport (CMB)'}</p>
              <p><strong>Flight Number:</strong> <span className="font-bold text-[#062C22] uppercase">{selectedBooking.flightNumber || 'Not specified'}</span> {selectedBooking.flightArrivalTime ? `(Arrival Time: ${selectedBooking.flightArrivalTime})` : ''}</p>
            </div>

            {/* Activities List */}
            {selectedBooking.activitiesSelected && selectedBooking.activitiesSelected.length > 0 && (
              <div className="bg-[#F8F7F2] p-4 rounded-2xl border border-stone-200/80 space-y-2 text-xs">
                <span className="font-bold text-[#062C22] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#176B52]" />
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
            <div className="bg-[#F8F7F2] p-4 rounded-2xl border border-stone-200/80 space-y-2 text-xs">
              <span className="font-bold text-[#062C22] block">Complete Price Breakdown</span>
              <div className="space-y-1 text-stone-600">
                <div className="flex justify-between">
                  <span>Base Package Price:</span>
                  <span className="font-semibold">{formatPrice(selectedBooking.basePrice || 0)}</span>
                </div>
                {selectedBooking.customizationTotal > 0 && (
                  <div className="flex justify-between">
                    <span>Custom Add-ons (Transport & Airport VIP):</span>
                    <span className="font-semibold">{formatPrice(selectedBooking.customizationTotal)}</span>
                  </div>
                )}
                {selectedBooking.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount Applied:</span>
                    <span className="font-semibold">-{formatPrice(selectedBooking.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-[#062C22] pt-1 border-t border-stone-200 text-sm">
                  <span>Total Amount Paid / Due:</span>
                  <span className="text-[#0B3D2E]">{formatPrice(selectedBooking.totalAmount)}</span>
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
                <Link
                  to={`/customer/bookings/${selectedBooking.id}`}
                  className="px-4 py-1.5 bg-[#0B3D2E] text-white font-bold text-xs rounded-xl hover:bg-[#134E3F]"
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
