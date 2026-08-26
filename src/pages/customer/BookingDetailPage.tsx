import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Printer, 
  Download, 
  ArrowLeft, 
  ShieldCheck, 
  ShieldAlert,
  Users, 
  Plane, 
  Car, 
  Ban,
  QrCode 
} from 'lucide-react';
import { bookingService } from '../../services/bookingService';
import { useAuth } from '../../context/AuthContext';
import type { Booking } from '../../types';

export const BookingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAdmin } = useAuth();
  const [booking, setBooking] = useState<Booking | undefined>(() => 
    bookingService.getBookingById(id || '', user?.id, user?.role)
  );
  const [cancelError, setCancelError] = useState('');

  if (!booking) {
    return (
      <div className="bg-white p-12 rounded-3xl border border-rose-200 text-center space-y-4 shadow-lg max-w-lg mx-auto mt-10">
        <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <span className="px-3 py-1 bg-rose-100 text-rose-800 text-[11px] font-bold uppercase rounded-full">
          403 / 404 Access Denied
        </span>
        <h3 className="font-serif text-2xl font-bold text-[#062C22]">Booking Voucher Not Accessible</h3>
        <p className="text-xs text-stone-600 leading-relaxed">
          This booking either does not exist or belongs to another registered customer account. Customer data isolation prevents unauthorized voucher access.
        </p>
        <Link to="/customer/bookings" className="px-5 py-2.5 bg-[#0B3D2E] text-white text-xs font-bold rounded-xl inline-flex items-center gap-2 hover:bg-[#134E3F] transition-all">
          <ArrowLeft className="w-4 h-4 text-[#39A982]" />
          <span>Return to My Bookings</span>
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadInvoice = () => {
    alert(`Downloading Official Invoice & E-Ticket Voucher for ${booking.bookingCode}... (PDF Generated)`);
  };

  const handleCustomerCancel = () => {
    if (!user) return;
    if (window.confirm('Are you sure you want to cancel this booking? This will notify the operations team.')) {
      try {
        const updated = bookingService.customerCancelBooking(booking.id, user.id);
        setBooking(updated);
        setCancelError('');
      } catch (err: any) {
        setCancelError(err.message || 'Failed to cancel booking');
      }
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to={isAdmin ? '/admin/bookings' : '/customer/bookings'}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-[#0B3D2E]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {isAdmin ? 'Admin Bookings Management' : 'All Bookings'}</span>
        </Link>

        <div className="flex flex-wrap items-center gap-3">
          {(!isAdmin && (booking.bookingStatus === 'Pending' || booking.bookingStatus === 'Confirmed')) && (
            <button
              onClick={handleCustomerCancel}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl hover:bg-rose-100 transition-colors shadow-xs"
            >
              <Ban className="w-3.5 h-3.5" />
              <span>Cancel Booking</span>
            </button>
          )}

          <button
            onClick={handleDownloadInvoice}
            className="flex items-center gap-1.5 px-4 py-2 bg-white border border-stone-300 text-stone-700 text-xs font-bold rounded-xl hover:bg-stone-50 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-[#0B3D2E]" />
            <span>Download PDF Invoice</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#0B3D2E] text-white text-xs font-bold rounded-xl hover:bg-[#134E3F] transition-colors shadow-sm"
          >
            <Printer className="w-3.5 h-3.5 text-[#39A982]" />
            <span>Print Travel Voucher</span>
          </button>
        </div>
      </div>

      {cancelError && (
        <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl font-medium border border-rose-200">
          {cancelError}
        </div>
      )}

      {/* Printable Digital Travel Voucher Card */}
      <div className="bg-white rounded-3xl border-2 border-stone-200 p-8 sm:p-10 shadow-lg space-y-8 relative overflow-hidden print:border-none print:shadow-none print:p-0">
        
        {/* Voucher Header with Watermark Brand */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b-2 border-stone-100 pb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-serif text-3xl font-bold tracking-wider text-[#062C22]">
                Lanka<span className="text-[#176B52]">Voyage</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0B3D2E] text-[#39A982]">
                Official Travel Voucher
              </span>
            </div>
            <p className="text-xs text-stone-500">Sri Lanka Tourism Development Authority License: TS/2026/884</p>
          </div>

          {/* Booking Code & QR Simulator */}
          <div className="flex items-center gap-4 bg-[#F8F7F2] p-3 rounded-2xl border border-stone-200/80">
            <div className="w-12 h-12 rounded-xl bg-white border border-stone-300 flex items-center justify-center text-[#062C22]">
              <QrCode className="w-8 h-8" />
            </div>
            <div>
              <span className="text-[10px] text-stone-400 font-bold block uppercase">Voucher Reference</span>
              <span className="font-serif text-lg font-bold text-[#062C22]">{booking.bookingCode}</span>
            </div>
          </div>
        </div>

        {/* Booking Status Notice Banner */}
        {booking.bookingStatus === 'Pending' && (
          <div className="p-5 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between gap-3 text-xs text-amber-900 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="w-3.5 h-3.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
              <div>
                <strong className="block font-bold text-sm text-amber-950">PENDING</strong>
                <span className="text-amber-800 text-xs">Your booking has been submitted and is waiting for our team to review it.</span>
              </div>
            </div>
            <span className="px-3.5 py-1.5 bg-amber-200 text-amber-900 font-bold rounded-xl text-xs shrink-0">
              Pending Review
            </span>
          </div>
        )}

        {booking.bookingStatus === 'Confirmed' && (
          <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between gap-3 text-xs text-emerald-900 shadow-xs">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <strong className="block font-bold text-sm text-emerald-950">CONFIRMED</strong>
                <span className="text-emerald-800 text-xs">Your booking has been confirmed. Dedicated tourist-board chauffeur guide is dispatched.</span>
              </div>
            </div>
            <span className="px-3.5 py-1.5 bg-emerald-200 text-emerald-900 font-bold rounded-xl text-xs shrink-0">
              Confirmed
            </span>
          </div>
        )}

        {booking.bookingStatus === 'Rejected' && (
          <div className="p-5 bg-rose-50 rounded-2xl border border-rose-200 flex items-center justify-between gap-3 text-xs text-rose-900 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="w-3.5 h-3.5 rounded-full bg-rose-500 shrink-0" />
              <div>
                <strong className="block font-bold text-sm text-rose-950">REJECTED</strong>
                <span className="text-rose-800 text-xs">Unfortunately, your booking request was rejected.</span>
              </div>
            </div>
            <span className="px-3.5 py-1.5 bg-rose-200 text-rose-900 font-bold rounded-xl text-xs shrink-0">
              Rejected
            </span>
          </div>
        )}

        {/* Tour Title & Status */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#F8F7F2] p-6 rounded-2xl border border-stone-200">
          <div>
            <span className="text-xs font-bold text-[#176B52] uppercase tracking-wider">
              {booking.bookingStatus === 'Confirmed' ? 'Confirmed Itinerary' : 'Bespoke Tour Package'}
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#062C22] mt-0.5">{booking.tourTitle}</h2>
            <p className="text-xs text-stone-500 mt-1">
              Dates: <strong>{booking.startDate}</strong> to <strong>{booking.endDate}</strong> • {booking.totalTravelers} Travelers ({booking.adultsCount} Adults{booking.childrenCount ? `, ${booking.childrenCount} Children` : ''}{booking.infantsCount ? `, ${booking.infantsCount} Infants` : ''})
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-3.5 py-1.5 rounded-full text-xs font-bold ${
              booking.bookingStatus === 'Confirmed'
                ? 'bg-emerald-100 text-emerald-800'
                : booking.bookingStatus === 'Pending'
                ? 'bg-amber-100 text-amber-800'
                : booking.bookingStatus === 'Rejected'
                ? 'bg-rose-100 text-rose-800'
                : 'bg-stone-100 text-stone-700'
            }`}>
              {booking.bookingStatus}
            </span>
            <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#0B3D2E] text-[#39A982]">
              {booking.paymentStatus}
            </span>
          </div>
        </div>

        {/* 3-Column Key Specs (Traveler, Vehicle, Chauffeur) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-stone-600">
          
          {/* Column 1: Traveler */}
          <div className="bg-[#F8F7F2] p-5 rounded-2xl border border-stone-200/80 space-y-2">
            <span className="font-bold text-[#062C22] uppercase tracking-wider block flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#176B52]" />
              Lead Traveler
            </span>
            <p className="font-bold text-sm text-[#062C22]">{booking.customerName}</p>
            <p><strong>Email:</strong> {booking.customerEmail}</p>
            <p><strong>Phone:</strong> {booking.customerPhone}</p>
            {booking.travelers && booking.travelers[0]?.passportNumber && (
              <p className="text-[11px] text-stone-400"><strong>Passport:</strong> {booking.travelers[0].passportNumber}</p>
            )}
          </div>

          {/* Column 2: Transportation & Vehicle */}
          <div className="bg-[#F8F7F2] p-5 rounded-2xl border border-stone-200/80 space-y-2">
            <span className="font-bold text-[#062C22] uppercase tracking-wider block flex items-center gap-1.5">
              <Car className="w-4 h-4 text-[#176B52]" />
              Transportation
            </span>
            <p><strong>Vehicle:</strong> {booking.vehicleType || 'Toyota KDH Luxury Van'}</p>
            <p><strong>Chauffeur:</strong> English-Speaking SLTDA Guide</p>
            <p><strong>Inclusions:</strong> Fuel, Highway Tolls & Parking</p>
          </div>

          {/* Column 3: Assigned Guide */}
          <div className="bg-[#F8F7F2] p-5 rounded-2xl border border-stone-200/80 space-y-2">
            <span className="font-bold text-[#062C22] uppercase tracking-wider block flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#176B52]" />
              Chauffeur Guide
            </span>
            <p className="font-bold text-sm text-[#062C22]">
              {booking.bookingStatus === 'Confirmed' ? (booking.assignedGuide?.name || 'Roshan Silva') : 'Allocated upon confirmation'}
            </p>
            <p><strong>Phone:</strong> {booking.bookingStatus === 'Confirmed' ? (booking.assignedGuide?.phone || '+94 77 889 9112') : '+94 77 123 4567'}</p>
            <p className="text-[11px] text-stone-400"><strong>License:</strong> {booking.assignedGuide?.license || 'SLTDA-CG-4412'}</p>
          </div>

        </div>

        {/* Airport Flight Greeting Info */}
        {(booking.airportTransferOption !== 'none' && (booking.airportPickup || booking.airportTransferOption)) && (
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center gap-3 text-xs text-emerald-900">
            <Plane className="w-5 h-5 text-emerald-700 shrink-0" />
            <div>
              <strong>
                {booking.airportTransferOption === 'both'
                  ? 'Airport Transfers: Roundtrip VIP Chauffeur Transfer'
                  : booking.airportTransferOption === 'dropoff'
                  ? 'Airport Transfer: Departure Hotel-to-Airport Transfer'
                  : 'Airport Transfer: VIP Arrival Meet & Greet'}
              </strong>
              <p>Airport: <strong>{booking.airportTransferDetails?.airport || 'Bandaranaike International Airport (CMB)'}</strong> | Flight: <strong>{booking.flightNumber || 'UL 504'}</strong> ({booking.flightArrivalTime || '14:30'})</p>
            </div>
          </div>
        )}

        {/* Special Requests */}
        {booking.travelers && booking.travelers[0]?.specialRequirements && (
          <div className="p-4 bg-[#F8F7F2] rounded-2xl border border-stone-200 text-xs">
            <span className="font-bold text-[#062C22] block uppercase tracking-wider mb-1">Special Requests</span>
            <p className="text-stone-700">{booking.travelers[0].specialRequirements}</p>
          </div>
        )}

        {/* Selected Activities List if any */}
        {booking.activitiesSelected && booking.activitiesSelected.length > 0 && (
          <div className="p-5 bg-[#F8F7F2] rounded-2xl border border-stone-200 space-y-2 text-xs">
            <span className="font-bold text-[#062C22] uppercase tracking-wider block">
              Included Activities & Experiences ({booking.activitiesSelected.length})
            </span>
            <div className="flex flex-wrap gap-2">
              {booking.activitiesSelected.map((act, i) => (
                <span key={i} className="px-3 py-1 bg-white border border-stone-200 text-stone-700 font-semibold rounded-lg shadow-2xs">
                  ✓ {act}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Financial Breakdown Table */}
        <div className="space-y-3">
          <h3 className="font-serif text-lg font-bold text-[#062C22]">Financial Breakdown</h3>
          <div className="border border-stone-200 rounded-2xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-[#F8F7F2] border-b border-stone-200 text-[#062C22] font-bold">
                <tr>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4 text-center">Qty / Days</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                <tr>
                  <td className="py-3 px-4 font-medium">Bespoke Ceylon Tour Package & Private Guiding</td>
                  <td className="py-3 px-4 text-center">{booking.totalTravelers} Pax</td>
                  <td className="py-3 px-4 text-right font-semibold">${booking.basePrice.toLocaleString()}</td>
                </tr>
                {booking.customizationTotal > 0 && (
                  <tr>
                    <td className="py-3 px-4 font-medium">Transportation & Airport VIP Transfers</td>
                    <td className="py-3 px-4 text-center">Package</td>
                    <td className="py-3 px-4 text-right font-semibold">${booking.customizationTotal.toLocaleString()}</td>
                  </tr>
                )}
                {booking.discountAmount > 0 && (
                  <tr className="text-emerald-700 font-semibold">
                    <td className="py-3 px-4">Promo Discount Applied ({booking.discountCode})</td>
                    <td className="py-3 px-4 text-center">-</td>
                    <td className="py-3 px-4 text-right">-${booking.discountAmount.toLocaleString()}</td>
                  </tr>
                )}
              </tbody>
              <tfoot className="bg-[#F8F7F2] border-t border-stone-200 font-bold text-sm text-[#062C22]">
                <tr>
                  <td className="py-3 px-4" colSpan={2}>Total Amount Paid (via {booking.paymentMethod})</td>
                  <td className="py-3 px-4 text-right text-base text-[#0B3D2E]">${booking.totalAmount.toLocaleString()} USD</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Emergency Contacts & Support */}
        <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            <p className="font-bold text-[#062C22]">LankaVoyage 24/7 Concierge Hotline: +94 77 123 4567</p>
            <p>For urgent flight modifications or chauffeur queries, contact our operations desk on WhatsApp.</p>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>100% Protected Travel Experience</span>
          </div>
        </div>

      </div>

    </div>
  );
};
