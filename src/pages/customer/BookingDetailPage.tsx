import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, 
  ShieldAlert, 
  Printer,
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  Lock,
  RefreshCw
} from 'lucide-react';
import { bookingService } from '../../services/bookingService';
import { payhereService } from '../../services/payhereService';
import { paymentService } from '../../services/paymentService';
import { useAuth } from '../../context/AuthContext';
import { formatPrice } from '../../utils/formatters';
import type { Booking } from '../../types';

export const BookingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { user, isAdmin } = useAuth();

  const isNewRequestSubmitted = (location.state as any)?.newRequestSubmitted;

  const [booking, setBooking] = useState<Booking | undefined>(() =>
    bookingService.getBookingById(id || '', user?.id, user?.role)
  );

  const [isPaying, setIsPaying] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

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

  const isPaid = booking.paymentStatus === 'PAID' || booking.paymentStatus === 'Fully Paid';
  const isConfirmed = booking.bookingStatus === 'Confirmed';
  const isPending = booking.bookingStatus === 'Pending';
  const isRejected = booking.bookingStatus === 'Rejected';
  const isPaymentAvailable = isConfirmed && !isPaid;

  const handlePayNow = async () => {
    if (!isPaymentAvailable || isPaying) return;
    setIsPaying(true);
    setPaymentError(null);

    try {
      const payhereData = await payhereService.initiatePayment({
        orderId: booking.bookingCode,
        bookingId: booking.id,
        bookingCode: booking.bookingCode,
        userId: user?.id || booking.userId,
        amount: booking.totalAmount,
        currency: 'LKR',
        itemTitle: booking.tourTitle || 'Sri Lanka Tour Experience',
        customerName: booking.customerName,
        customerEmail: booking.customerEmail,
        customerPhone: booking.customerPhone,
        flightNumber: booking.flightNumber || 'UL101',
        city: 'Colombo',
        country: 'Sri Lanka'
      });

      payhereService.launchPayment(payhereData, {
        onCompleted: (orderId: string) => {
          bookingService.applyGatewayPaymentSuccess(booking.id, {
            amountPaid: booking.totalAmount,
            paymentMethod: 'Credit / Debit Card'
          });

          paymentService.recordTransaction({
            userId: user?.id || booking.userId,
            bookingId: booking.id,
            bookingCode: booking.bookingCode,
            customerName: booking.customerName,
            amountUSD: booking.totalAmount,
            paymentMethod: 'Credit / Debit Card',
            status: 'Successful',
            transactionReference: `PAYHERE-${orderId}`,
            cardBrand: 'Visa/Mastercard'
          });

          setBooking(prev => prev ? { ...prev, paymentStatus: 'PAID', amountPaid: prev.totalAmount, paymentAvailable: false } : prev);
          setIsPaying(false);

          try {
            confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
          } catch (e) {}
        },
        onDismissed: () => {
          setIsPaying(false);
        },
        onError: (err: string) => {
          setIsPaying(false);
          setPaymentError(`Payment Gateway Error: ${err}`);
        }
      });
    } catch (err: any) {
      setIsPaying(false);
      setPaymentError(err.message || 'Payment initiation failed. Please ensure the booking is confirmed.');
    }
  };

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

      {/* New Request Submitted Banner */}
      {isNewRequestSubmitted && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-xs text-amber-900 animate-scale-in">
          <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-sm">Booking Request Submitted Successfully!</h4>
            <p className="leading-relaxed">
              Your booking request has been submitted. Our team will review your request and confirm availability. You will receive an email once your booking is confirmed, after which the <strong>Pay Now</strong> button will become active.
            </p>
          </div>
        </div>
      )}

      {/* Payment Error Banner */}
      {paymentError && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-2xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{paymentError}</span>
        </div>
      )}

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
            {/* Booking Status Pill */}
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              isConfirmed 
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                : isPending
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-rose-100 text-rose-800 border border-rose-300'
            }`}>
              {isPending ? 'Awaiting Confirmation' : isConfirmed ? 'Confirmed' : isRejected ? 'Rejected' : booking.bookingStatus}
            </span>

            {/* Payment Status Pill */}
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              isPaid
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                : 'bg-amber-100 text-amber-900 border border-amber-300'
            }`}>
              {isPaid ? 'Payment: PAID' : 'Payment: NOT PAID'}
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
              {booking.paymentMethod === 'Credit / Debit Card' ? 'Credit / Debit Card (PayHere Gateway)' : booking.paymentMethod}
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

          {/* Pricing & Interactive Pay Box */}
          <div className="p-5 bg-[#0B3D2E] text-white rounded-2xl space-y-3 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[#39A982] font-bold block uppercase text-[10px]">Total Payable</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isPaid
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                  : 'bg-amber-500/20 text-amber-200 border border-amber-400/40'
              }`}>
                {isPaid ? 'PAID' : 'NOT PAID'}
              </span>
            </div>
            
            <p className="font-serif font-bold text-2xl">{formatPrice(booking.totalAmount)}</p>

            {/* Interactive Pay Now CTA based on Approval State */}
            {isPaymentAvailable && (
              <button
                type="button"
                onClick={handlePayNow}
                disabled={isPaying}
                className="w-full py-2.5 px-4 bg-[#39A982] hover:bg-[#2E8B6B] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isPaying ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                <span>{isPaying ? 'Opening Gateway...' : 'Pay Now with PayHere'}</span>
              </button>
            )}

            {isPending && (
              <div className="flex items-center gap-1.5 text-[11px] text-amber-200 bg-black/20 p-2 rounded-xl">
                <Lock className="w-3.5 h-3.5 shrink-0" />
                <span>Payment unlocks upon Admin confirmation</span>
              </div>
            )}

            {isPaid && (
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-200 bg-emerald-950/40 p-2 rounded-xl">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                <span>Payment settled successfully</span>
              </div>
            )}

            {isRejected && (
              <div className="flex items-center gap-1.5 text-[11px] text-rose-200 bg-rose-950/40 p-2 rounded-xl">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                <span>Booking request not confirmed</span>
              </div>
            )}
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
