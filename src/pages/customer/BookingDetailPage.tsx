import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShieldAlert, 
  Printer
} from 'lucide-react';
import { bookingService } from '../../services/bookingService';
import { useAuth } from '../../context/AuthContext';
import { formatPrice } from '../../utils/formatters';
import type { Booking } from '../../types';

export const BookingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAdmin } = useAuth();

  const [booking, setBooking] = useState<Booking | undefined>(() =>
    bookingService.getBookingById(id || '', user?.id, user?.role)
  );

  useEffect(() => {
    setBooking(bookingService.getBookingById(id || '', user?.id, user?.role));
    bookingService.fetchBookingsFromServer().then(() => {
      setBooking(bookingService.getBookingById(id || '', user?.id, user?.role));
    });
  }, [id, user]);

  if (!booking) {
    return (
      <div className="bg-white p-12 rounded-3xl border border-rose-200 text-center space-y-4 shadow-lg max-w-lg mx-auto mt-10">
        <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h3 className="font-serif text-2xl font-bold text-[#062C22]">Booking Not Found</h3>
        <p className="text-xs text-stone-600 leading-relaxed">
          This booking record either does not exist or belongs to another customer account.
        </p>
        <Link 
          to="/customer/bookings" 
          className="px-5 py-2.5 bg-[#0B3D2E] text-white text-xs font-bold rounded-xl inline-flex items-center gap-2 hover:bg-[#134E3F] transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-[#39A982]" />
          <span>Return to My Bookings</span>
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to={isAdmin ? '/admin/bookings' : '/customer/bookings'}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-[#0B3D2E]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {isAdmin ? 'Admin Bookings' : 'My Bookings'}</span>
        </Link>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl transition-colors"
        >
          <Printer className="w-4 h-4" />
          <span>Print Voucher / Confirmation</span>
        </button>
      </div>

      {/* Booking Details Card */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden p-6 sm:p-10 space-y-8">
        
        {/* Header Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#176B52] block">
              Official Booking Record
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#062C22]">
              {booking.tourTitle}
            </h1>
            <p className="text-xs text-stone-500 font-medium mt-1">
              Reference: <strong className="text-[#176B52]">{booking.bookingCode}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              booking.bookingStatus === 'Confirmed' 
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                : booking.bookingStatus === 'Pending'
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-rose-100 text-rose-800 border border-rose-300'
            }`}>
              Booking: {booking.bookingStatus}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              booking.paymentStatus === 'PAID' || booking.paymentStatus === 'Fully Paid'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                : booking.paymentStatus === 'NOT PAID' || booking.paymentStatus === 'Unpaid'
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-rose-100 text-rose-800 border border-rose-300'
            }`}>
              Payment: {booking.paymentStatus === 'PAID' || booking.paymentStatus === 'Fully Paid' ? 'PAID' : booking.paymentStatus === 'NOT PAID' || booking.paymentStatus === 'Unpaid' ? 'NOT PAID' : booking.paymentStatus}
            </span>
          </div>
        </div>

        {/* 6 Key Grid Fields + Payment Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
          
          <div className="p-4 bg-[#F8F7F2] rounded-2xl border border-stone-200/80 space-y-1">
            <span className="text-stone-400 font-bold block uppercase text-[10px]">Service Type</span>
            <p className="font-bold text-[#062C22] text-sm">{booking.tourTitle}</p>
          </div>

          <div className="p-4 bg-[#F8F7F2] rounded-2xl border border-stone-200/80 space-y-1">
            <span className="text-stone-400 font-bold block uppercase text-[10px]">Travel Dates</span>
            <p className="font-bold text-[#062C22] text-sm">{booking.startDate} to {booking.endDate}</p>
          </div>

          <div className="p-4 bg-[#F8F7F2] rounded-2xl border border-stone-200/80 space-y-1">
            <span className="text-stone-400 font-bold block uppercase text-[10px]">Payment Method</span>
            <p className="font-bold text-[#062C22] text-sm">
              {booking.paymentMethod === 'Credit / Debit Card' ? 'Credit / Debit Card (PayHere)' : booking.paymentMethod}
            </p>
          </div>

          <div className="p-4 bg-[#F8F7F2] rounded-2xl border border-stone-200/80 space-y-1">
            <span className="text-stone-400 font-bold block uppercase text-[10px]">Total Travelers</span>
            <p className="font-bold text-[#062C22] text-sm">{booking.totalTravelers} Passengers ({booking.adultsCount} Adults, {booking.childrenCount} Children)</p>
          </div>

          <div className="p-4 bg-[#F8F7F2] rounded-2xl border border-stone-200/80 space-y-1">
            <span className="text-stone-400 font-bold block uppercase text-[10px]">Destinations</span>
            <p className="font-bold text-[#062C22] text-sm">{booking.destinationsCovered?.join(', ') || 'Sri Lanka'}</p>
          </div>

          <div className="p-4 bg-[#0B3D2E] text-white rounded-2xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[#39A982] font-bold block uppercase text-[10px]">Total Price</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                booking.paymentStatus === 'PAID' || booking.paymentStatus === 'Fully Paid'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                  : 'bg-amber-500/20 text-amber-200 border border-amber-400/40'
              }`}>
                {booking.paymentStatus === 'PAID' || booking.paymentStatus === 'Fully Paid' ? 'PAID' : 'NOT PAID'}
              </span>
            </div>
            <p className="font-serif font-bold text-xl">{formatPrice(booking.totalAmount)}</p>
          </div>

        </div>

        {/* Customer Information & Flight Details Summary */}
        <div className="pt-4 border-t border-stone-100 space-y-2 text-xs">
          <h3 className="font-serif font-bold text-sm text-[#062C22]">Primary Customer & Flight Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-600">
            <p>
              <strong>Name:</strong> {booking.customerName} &bull; <strong>Email:</strong> {booking.customerEmail} &bull; <strong>Phone:</strong> {booking.customerPhone || '—'}
            </p>
            <p>
              <strong>Flight Number:</strong> <span className="font-bold text-[#062C22] uppercase">{booking.flightNumber || 'Not specified'}</span>
              {booking.flightArrivalTime ? ` (Arrival: ${booking.flightArrivalTime})` : ''}
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
