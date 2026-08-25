import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  CreditCard,
  ShieldCheck,
  Check,
  ArrowRight,
  ArrowLeft,
  Lock,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Calendar,
  Users,
  Plane,
  Sparkles,
  Info,
  Clock
} from 'lucide-react';
import type { PaymentMethod } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { bookingService } from '../../services/bookingService';
import { paymentService } from '../../services/paymentService';
import { payhereService } from '../../services/payhereService';
import { analytics } from '../../services/analytics';

interface CheckoutState {
  tourId: string;
  tourTitle: string;
  tourImage: string;
  durationDays: number;
  startDate: string;
  adults: number;
  children: number;
  airportPickup: boolean;
  discountCode: string;
  discountAmount: number;
  totalAmount: number;
  destinations: string[];
  vehicleType: string;
}

type CheckoutPhase = 'form' | 'initiating' | 'gateway_opened' | 'pending_verification' | 'success' | 'error';

export const CheckoutPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const state = location.state as CheckoutState | null;

  // URL parameters handling (for PayHere return/redirect callbacks)
  const returnPaymentStatus = searchParams.get('payment_status');
  const returnOrderId = searchParams.get('order_id');
  const returnBookingId = searchParams.get('booking_id');

  // Form: Lead Traveler
  const [travelerName, setTravelerName] = useState(user?.name || '');
  const [travelerEmail, setTravelerEmail] = useState(user?.email || '');
  const [travelerPhone, setTravelerPhone] = useState(user?.phone || '');
  const [nationality, setNationality] = useState('Sri Lanka');
  const [passportNumber, setPassportNumber] = useState('');

  useEffect(() => {
    if (state) {
      analytics.beginCheckout(state.tourId, state.tourTitle, state.totalAmount, 'USD');
    }
  }, [state]);

  const [address, setAddress] = useState('No. 12, Lotus Road');
  const [city, setCity] = useState('Colombo');
  const [specialRequests, setSpecialRequests] = useState('');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Credit / Debit Card');

  // Terms acceptance
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Phase management & results
  const [phase, setPhase] = useState<CheckoutPhase>('form');
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successBookingId, setSuccessBookingId] = useState(returnBookingId || '');
  const [successBookingCode, setSuccessBookingCode] = useState(returnOrderId || '');
  const [successTxnRef, setSuccessTxnRef] = useState('');

  // Auto-fill user information when available
  useEffect(() => {
    if (user) {
      if (!travelerName) setTravelerName(user.name);
      if (!travelerEmail) setTravelerEmail(user.email);
      if (!travelerPhone && user.phone) setTravelerPhone(user.phone);
    }
  }, [user]);

  // Handle Return from PayHere Hosted Redirect if applicable
  useEffect(() => {
    if (returnPaymentStatus === 'return' && returnOrderId) {
      setPhase('initiating');
      setStatusMessage('Verifying payment confirmation with PayHere gateway...');

      // Query server status independently
      payhereService.getPaymentStatus(returnOrderId).then((statusData) => {
        if (statusData && statusData.status === 'SUCCESS') {
          const booking = bookingService.getBookingById(returnOrderId) || 
                          bookingService.getAllBookings().find(b => b.bookingCode === returnOrderId || b.id === returnBookingId);
          
          if (booking) {
            bookingService.applyGatewayPaymentSuccess(booking.id, {
              amountPaid: booking.totalAmount,
              paymentMethod: 'Credit / Debit Card'
            });

            const txnRef = statusData.paymentId ? `PAYHERE-${statusData.paymentId}` : `PH-CONFIRMED-${returnOrderId}`;
            paymentService.recordTransaction({
              userId: booking.userId,
              bookingId: booking.id,
              bookingCode: booking.bookingCode,
              customerName: booking.customerName,
              amountUSD: booking.totalAmount,
              paymentMethod: 'Credit / Debit Card',
              status: 'Successful',
              transactionReference: txnRef,
              cardBrand: statusData.paymentMethod || 'Credit / Debit Card'
            });

            setSuccessBookingId(booking.id);
            setSuccessBookingCode(booking.bookingCode);
            setSuccessTxnRef(txnRef);
            setPhase('success');
            triggerConfetti();
          } else {
            setSuccessBookingCode(returnOrderId);
            setSuccessTxnRef(`PH-${returnOrderId}`);
            setPhase('success');
            triggerConfetti();
          }
        } else if (statusData && statusData.status === 'FAILED') {
          setErrorMessage(statusData.statusMessage || 'Payment transaction failed or was declined by the bank.');
          setPhase('error');
        } else {
          // Transaction still processing or awaiting IPN callback
          setSuccessBookingCode(returnOrderId);
          setPhase('pending_verification');
        }
      }).catch((err) => {
        console.warn('Could not immediately query payment status:', err);
        // Do NOT treat as error or auto-success; display safe pending verification notice
        setSuccessBookingCode(returnOrderId);
        setPhase('pending_verification');
      });
    } else if (returnPaymentStatus === 'cancelled') {
      setErrorMessage('Payment was cancelled in the PayHere portal. No charges were made.');
      setPhase('error');
    }
  }, [returnPaymentStatus, returnOrderId, returnBookingId]);

  // Redirect if no checkout state and not returning from PayHere
  useEffect(() => {
    if (!state && !returnOrderId) {
      navigate('/tours', { replace: true });
    }
  }, [state, returnOrderId, navigate]);

  const triggerConfetti = () => {
    try {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      setTimeout(() => confetti({ particleCount: 80, spread: 60, origin: { y: 0.5, x: 0.3 } }), 250);
      setTimeout(() => confetti({ particleCount: 80, spread: 60, origin: { y: 0.5, x: 0.7 } }), 500);
    } catch {
      // Safe fallback
    }
  };

  if (!state && !returnOrderId) return null;

  // Validation
  const isFormValid = () => {
    if (!travelerName.trim() || !travelerEmail.trim() || !travelerPhone.trim()) return false;
    if (!termsAccepted) return false;
    return true;
  };

  // Handle Checkout submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid() || !state) return;

    setPhase('initiating');
    setStatusMessage('Securing reservation and connecting to PayHere Gateway...');

    // 1. Create Provisional Booking (Status: Pending, PaymentStatus: Unpaid)
    const endDate = new Date(new Date(state.startDate).getTime() + state.durationDays * 86400000)
      .toISOString()
      .split('T')[0];

    const provisionalBooking = bookingService.createBooking({
      userId: user?.id || 'guest-user',
      customerName: travelerName,
      customerEmail: travelerEmail,
      customerPhone: travelerPhone,
      type: 'standard_tour',
      tourId: state.tourId,
      tourTitle: state.tourTitle,
      tourImage: state.tourImage,
      startDate: state.startDate,
      endDate,
      adultsCount: state.adults,
      childrenCount: state.children,
      infantsCount: 0,
      destinationsCovered: state.destinations,
      vehicleType: state.vehicleType,
      airportPickup: state.airportPickup,
      travelers: [
        {
          title: 'Mr',
          fullName: travelerName,
          email: travelerEmail,
          phone: travelerPhone,
          nationality: nationality || 'International',
          passportNumber: passportNumber || undefined,
          isLead: true,
          specialRequirements: specialRequests || undefined,
        },
      ],
      basePrice: state.totalAmount + state.discountAmount,
      customizationTotal: state.airportPickup ? 40 : 0,
      discountAmount: state.discountAmount,
      discountCode: state.discountCode || undefined,
      taxAmount: 0,
      totalAmount: state.totalAmount,
      amountPaid: 0,
      bookingStatus: 'Pending',
      paymentStatus: 'Unpaid',
      paymentMethod: paymentMethod,
      notes: specialRequests || undefined,
    });

    // If Payment Method is NOT Credit / Debit Card (e.g. Bank Wire / Pay on Arrival)
    if (paymentMethod !== 'Credit / Debit Card') {
      await new Promise((r) => setTimeout(r, 1000));
      setSuccessBookingId(provisionalBooking.id);
      setSuccessBookingCode(provisionalBooking.bookingCode);
      setSuccessTxnRef(`MANUAL-${provisionalBooking.bookingCode}`);
      setPhase('success');
      triggerConfetti();
      return;
    }

    // 2. Real PayHere Gateway Flow
    try {
      const payherePayload = await payhereService.initiatePayment({
        orderId: provisionalBooking.bookingCode,
        bookingId: provisionalBooking.id,
        bookingCode: provisionalBooking.bookingCode,
        userId: user?.id,
        amount: state.totalAmount,
        currency: 'USD',
        itemTitle: state.tourTitle,
        customerName: travelerName,
        customerEmail: travelerEmail,
        customerPhone: travelerPhone,
        address: address,
        city: city,
        country: nationality || 'Sri Lanka',
      });

      setPhase('gateway_opened');
      setStatusMessage('PayHere Secure Checkout Window Opened. Please complete payment in the popup.');

      // 3. Launch PayHere JS Modal or Redirect
      analytics.initiatePayment(provisionalBooking.bookingCode, state.totalAmount, 'USD');
      payhereService.launchPayment(payherePayload, {
        onCompleted: async (orderId: string) => {
          setPhase('initiating');
          setStatusMessage('Payment verified! Finalizing booking confirmation...');

          // Track GA4 Purchase
          analytics.purchase(orderId, provisionalBooking.bookingCode, state.totalAmount, 'USD');

          // Confirm booking & payment
          bookingService.applyGatewayPaymentSuccess(provisionalBooking.id, {
            amountPaid: state.totalAmount,
            paymentMethod: 'Credit / Debit Card',
          });

          const txnRef = `PAYHERE-TXN-${orderId}`;
          paymentService.recordTransaction({
            userId: user?.id,
            bookingId: provisionalBooking.id,
            bookingCode: provisionalBooking.bookingCode,
            customerName: travelerName,
            amountUSD: state.totalAmount,
            paymentMethod: 'Credit / Debit Card',
            status: 'Successful',
            transactionReference: txnRef,
            cardBrand: 'Visa/Mastercard',
          });

          setSuccessBookingId(provisionalBooking.id);
          setSuccessBookingCode(provisionalBooking.bookingCode);
          setSuccessTxnRef(txnRef);
          setPhase('success');
          triggerConfetti();
        },
        onDismissed: () => {
          setPhase('form');
          setErrorMessage('');
        },
        onError: (err: string) => {
          console.error('PayHere Checkout error:', err);
          setErrorMessage(`PayHere Gateway error: ${err}`);
          setPhase('error');
        },
      });
    } catch (err: any) {
      console.error('Payment initiation failure:', err);
      setErrorMessage(err.message || 'Could not connect to payment gateway. Please check your backend server.');
      setPhase('error');
    }
  };

  // ─── INITIATING / PROCESSING VIEW ─────────────────────────────
  if (phase === 'initiating' || phase === 'gateway_opened') {
    return (
      <div className="bg-[#FAF8F5] min-h-screen flex items-center justify-center py-20 px-4">
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xl p-10 max-w-md w-full text-center space-y-6">
          <div className="relative w-20 h-20 mx-auto">
            <Loader2 className="w-20 h-20 text-[#C5A059] animate-spin" />
            <Lock className="w-8 h-8 text-[#0D3B2E] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>

          <div className="space-y-2">
            <h3 className="font-serif text-xl font-bold text-[#082F24]">PayHere Secure Payment</h3>
            <p className="text-xs text-stone-600 leading-relaxed">{statusMessage}</p>
          </div>

          <div className="bg-[#FAF8F5] rounded-2xl p-4 border border-stone-200 text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-stone-500">Gateway:</span>
              <strong className="text-[#082F24] font-mono">PayHere Sandbox (PCI-DSS)</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Currency:</span>
              <strong className="text-[#082F24]">USD / LKR</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Security:</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 256-Bit SSL Encrypted
              </span>
            </div>
          </div>

          {phase === 'gateway_opened' && (
            <div className="space-y-3 pt-2">
              <p className="text-[11px] text-stone-400">
                If the popup did not appear or was blocked by your browser, click below:
              </p>
              <button
                type="button"
                onClick={() => setPhase('form')}
                className="text-xs font-bold text-[#0D3B2E] underline hover:text-[#C5A059]"
              >
                Return to Checkout Form
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── SUCCESS VIEW ─────────────────────────────
  if (phase === 'success') {
    return (
      <div className="bg-[#FAF8F5] min-h-screen flex items-center justify-center py-20 px-4">
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xl p-8 sm:p-10 max-w-lg w-full text-center space-y-6 animate-fadeIn">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
            <CheckCircle2 className="w-12 h-12 text-emerald-600" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Payment Confirmed
            </div>
            <h1 className="font-serif text-3xl font-bold text-[#082F24]">Booking Confirmed!</h1>
            <p className="text-stone-600 text-xs sm:text-sm">
              Your reservation has been verified and confirmed through the PayHere gateway.
            </p>
          </div>

          <div className="bg-[#FAF8F5] rounded-2xl border border-stone-200 p-5 space-y-3 text-left">
            <div className="flex items-center justify-between">
              <span className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Booking Reference</span>
              <span className="font-serif text-lg font-bold text-[#0D3B2E]">{successBookingCode}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-500">Gateway Transaction</span>
              <span className="font-mono font-semibold text-stone-700">{successTxnRef}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-500">Payment Status</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                PAID & CONFIRMED
              </span>
            </div>
            <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-200/60">
              <span className="text-stone-500">Digital Travel Voucher</span>
              <span className="text-emerald-700 font-bold">Issued & Ready</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {successBookingId ? (
              <button
                onClick={() => navigate(`/customer/bookings/${successBookingId}`)}
                className="flex-1 py-3.5 px-5 bg-gradient-to-r from-[#C5A059] to-[#E5C378] text-[#082F24] font-bold text-xs sm:text-sm rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                View Booking Voucher
              </button>
            ) : (
              <button
                onClick={() => navigate('/customer/bookings')}
                className="flex-1 py-3.5 px-5 bg-gradient-to-r from-[#C5A059] to-[#E5C378] text-[#082F24] font-bold text-xs sm:text-sm rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                My Bookings
              </button>
            )}

            <button
              onClick={() => navigate('/customer/payments')}
              className="flex-1 py-3.5 px-5 bg-[#0D3B2E] text-white font-bold text-xs sm:text-sm rounded-xl hover:bg-[#134E3F] transition-all flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              Payment Records
            </button>
          </div>

          <Link to="/tours" className="text-xs text-[#8C6D2B] font-semibold hover:underline block pt-2">
            ← Continue browsing more Sri Lanka tours
          </Link>
        </div>
      </div>
    );
  }

  // ─── PENDING VERIFICATION VIEW ─────────────────────────────
  if (phase === 'pending_verification') {
    return (
      <div className="bg-[#FAF8F5] min-h-screen flex items-center justify-center py-20 px-4">
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xl p-8 sm:p-10 max-w-lg w-full text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto ring-8 ring-amber-50">
            <Clock className="w-12 h-12 text-amber-600" />
          </div>

          <div className="space-y-2">
            <h1 className="font-serif text-3xl font-bold text-[#082F24]">Payment Verification Pending</h1>
            <p className="text-stone-600 text-xs sm:text-sm">
              We received your redirect from the payment gateway. Your bank transaction is currently undergoing automated settlement verification.
            </p>
          </div>

          {successBookingCode && (
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-left space-y-1">
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">Booking Reference</span>
              <span className="font-mono text-base font-bold text-[#082F24] block">{successBookingCode}</span>
              <p className="text-[11px] text-stone-500 pt-1">
                Your provisional itinerary has been logged in our operations queue. Our concierge system will update your booking status to Confirmed as soon as settlement is cleared by the gateway IPN.
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/customer/bookings')}
              className="flex-1 py-3 px-5 bg-[#0D3B2E] text-white font-bold text-xs rounded-xl hover:bg-[#134E3F] transition-all flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4 text-[#E5C378]" />
              Check My Bookings
            </button>
            <Link
              to="/contact"
              className="flex-1 py-3 px-5 bg-stone-100 text-stone-700 font-bold text-xs rounded-xl hover:bg-stone-200 transition-all flex items-center justify-center gap-2"
            >
              Contact Concierge
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── ERROR VIEW ─────────────────────────────
  if (phase === 'error') {
    return (
      <div className="bg-[#FAF8F5] min-h-screen flex items-center justify-center py-20 px-4">
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xl p-8 sm:p-10 max-w-lg w-full text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-rose-100 flex items-center justify-center mx-auto ring-8 ring-rose-50">
            <AlertTriangle className="w-12 h-12 text-rose-600" />
          </div>

          <div className="space-y-2">
            <h1 className="font-serif text-3xl font-bold text-[#082F24]">Payment Incomplete</h1>
            <p className="text-stone-600 text-xs sm:text-sm">{errorMessage || 'The payment was not completed by the gateway.'}</p>
          </div>

          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-left">
            <div className="flex items-start gap-2.5 text-xs text-rose-800">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <div className="space-y-1">
                <strong className="block">Need assistance?</strong>
                <p className="text-rose-700 leading-relaxed">
                  Your reservation details have been saved. You can retry with PayHere Sandbox or select an alternative payment method.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setPhase('form')}
              className="flex-1 py-3.5 px-6 bg-gradient-to-r from-[#C5A059] to-[#E5C378] text-[#082F24] font-bold text-xs sm:text-sm rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Try Again
            </button>
            <button
              onClick={() => {
                setPaymentMethod('Bank Wire Transfer');
                setPhase('form');
              }}
              className="flex-1 py-3.5 px-6 bg-[#0D3B2E] text-white font-bold text-xs sm:text-sm rounded-xl hover:bg-[#134E3F] transition-all flex items-center justify-center gap-2"
            >
              Pay via Bank Wire
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── MAIN CHECKOUT FORM ─────────────────────────────
  return (
    <div className="bg-[#FAF8F5] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
          <Link to="/" className="hover:text-[#0D3B2E]">Home</Link>
          <span>/</span>
          <Link to="/tours" className="hover:text-[#0D3B2E]">Tours</Link>
          <span>/</span>
          <span className="text-[#8C6D2B] font-bold">Secure Checkout</span>
        </div>

        {/* Page Header */}
        <div className="space-y-1">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#082F24]">Secure Checkout</h1>
          <p className="flex items-center gap-1.5 text-xs text-stone-500">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            256-bit SSL encrypted · Verified PayHere Gateway · Instant digital e-voucher
          </p>
        </div>

        {/* Two Column Layout */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ─── LEFT COLUMN: Form ─── */}
          <div className="lg:col-span-7 space-y-6">
            {/* Section A: Order Summary */}
            {state && (
              <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 space-y-4">
                <h3 className="font-serif text-lg font-bold text-[#082F24] flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#C5A059]" />
                  Order Summary
                </h3>

                <div className="flex gap-4">
                  <img
                    src={state.tourImage}
                    alt={state.tourTitle}
                    className="w-20 h-20 rounded-2xl object-cover border border-stone-200"
                  />
                  <div className="flex-1 space-y-1">
                    <h4 className="font-serif font-bold text-sm text-[#082F24]">{state.tourTitle}</h4>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                        {state.startDate} · {state.durationDays} Days
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-[#C5A059]" />
                        {state.adults} Adult{state.adults > 1 ? 's' : ''}
                        {state.children > 0 ? `, ${state.children} Child${state.children > 1 ? 'ren' : ''}` : ''}
                      </span>
                    </div>
                  </div>
                </div>

                {state.destinations && state.destinations.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {state.destinations.map((d, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#0D3B2E]/10 text-[#0D3B2E]"
                      >
                        <MapPin className="w-3 h-3" />
                        {d}
                      </span>
                    ))}
                  </div>
                )}

                {state.airportPickup && (
                  <div className="flex items-center gap-2 text-xs text-[#082F24] bg-[#FAF8F5] rounded-xl px-3 py-2 border border-stone-100">
                    <Plane className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span className="font-semibold">VIP Airport Pickup (CMB) included</span>
                    <span className="ml-auto font-bold">+$40</span>
                  </div>
                )}

                {state.discountCode && state.discountAmount > 0 && (
                  <div className="flex items-center justify-between text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-2 rounded-xl">
                    <span>Promo: {state.discountCode}</span>
                    <span>-${state.discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                  <span className="text-sm font-bold text-[#082F24]">Total Due</span>
                  <span className="font-serif text-2xl font-bold text-[#0D3B2E]">
                    ${state.totalAmount.toLocaleString()} USD
                  </span>
                </div>
              </div>
            )}

            {/* Section B: Lead Traveler Details */}
            <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#082F24]">Lead Traveler Details</h3>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-600">Full Name (as on passport) *</label>
                <input
                  type="text"
                  required
                  value={travelerName}
                  onChange={(e) => setTravelerName(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm text-[#082F24] focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                  placeholder="John Smith"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-600">Email Address (for e-voucher) *</label>
                  <input
                    type="email"
                    required
                    value={travelerEmail}
                    onChange={(e) => setTravelerEmail(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm text-[#082F24] focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                    placeholder="john@example.com"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-600">Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={travelerPhone}
                    onChange={(e) => setTravelerPhone(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm text-[#082F24] focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                    placeholder="+94 77 123 4567"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-600">Country / Nationality</label>
                  <input
                    type="text"
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm text-[#082F24] focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                    placeholder="Sri Lanka / United Kingdom"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-600">Passport Number (Optional)</label>
                  <input
                    type="text"
                    value={passportNumber}
                    onChange={(e) => setPassportNumber(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm text-[#082F24] focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                    placeholder="N1234567"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-600">Billing Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm text-[#082F24] focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                    placeholder="No. 12, Main Street"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-600">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm text-[#082F24] focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                    placeholder="Colombo"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-600">Special Requests</label>
                <textarea
                  rows={2}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-[#082F24] focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                  placeholder="e.g. Vegetarian meals, honeymoon welcome, specific pickup landmark..."
                />
              </div>
            </div>

            {/* Section C: Payment Method Selector */}
            <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#082F24]">Select Payment Method</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(
                  [
                    'Credit / Debit Card',
                    'PayPal',
                    'Bank Wire Transfer',
                    'Pay on Arrival / Deposit',
                  ] as const
                ).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setPaymentMethod(m)}
                    className={`p-4 rounded-2xl border-2 text-xs font-semibold text-left transition-all ${
                      paymentMethod === m
                        ? 'bg-[#0D3B2E] text-white border-[#0D3B2E] shadow-lg'
                        : 'bg-[#FAF8F5] text-stone-700 border-stone-200 hover:border-[#C5A059]/50 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {paymentMethod === m ? (
                        <Check className="w-4 h-4 text-[#E5C378]" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-stone-300" />
                      )}
                      <span className="font-bold">{m}</span>
                    </div>
                    {m === 'Credit / Debit Card' && (
                      <span className="text-[10px] opacity-80 block pl-6">
                        PayHere Gateway (Visa, Mastercard, Amex)
                      </span>
                    )}
                    {m === 'PayPal' && (
                      <span className="text-[10px] opacity-80 block pl-6">Instant International Checkout</span>
                    )}
                    {m === 'Bank Wire Transfer' && (
                      <span className="text-[10px] opacity-80 block pl-6">SWIFT / Commercial Bank Invoice</span>
                    )}
                    {m === 'Pay on Arrival / Deposit' && (
                      <span className="text-[10px] opacity-80 block pl-6">20% Deposit (Balance on Check-in)</span>
                    )}
                  </button>
                ))}
              </div>

              {/* PayHere Gateway Badge */}
              {paymentMethod === 'Credit / Debit Card' && (
                <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 space-y-2 text-xs text-emerald-900">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-[#0D3B2E]">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Secured by PayHere Sandbox Gateway</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-200/60 text-emerald-900 text-[10px] font-mono font-bold">
                      SANDBOX MODE
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    You will complete payment through PayHere's official PCI-DSS compliant checkout window.
                    Your card numbers and CVV are processed directly by PayHere and never touched by our servers.
                  </p>
                </div>
              )}

              {paymentMethod === 'PayPal' && (
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs text-blue-900">
                  <strong>PayPal Payment:</strong> You will receive a direct PayPal payment invoice to {travelerEmail || 'your email'} upon confirmation.
                </div>
              )}

              {paymentMethod === 'Bank Wire Transfer' && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900">
                  <strong>Bank Wire Transfer:</strong> Official Commercial Bank of Ceylon / Hatton National Bank SWIFT transfer instructions will be issued with your digital voucher.
                </div>
              )}

              {paymentMethod === 'Pay on Arrival / Deposit' && (
                <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 text-xs text-purple-900">
                  <strong>Pay on Arrival:</strong> Your itinerary will be reserved immediately. A 20% advance confirmation deposit is verified prior to chauffeur dispatch.
                </div>
              )}
            </div>
          </div>

          {/* ─── RIGHT COLUMN: Sticky Summary & Pay CTA ─── */}
          {state && (
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl border border-stone-200 shadow-xl p-6 space-y-5 sticky top-24">
                {/* Tour Preview */}
                <div className="relative rounded-2xl overflow-hidden h-36">
                  <img
                    src={state.tourImage}
                    alt={state.tourTitle}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <h4 className="font-serif font-bold text-sm text-white">{state.tourTitle}</h4>
                    <p className="text-white/80 text-[11px]">
                      {state.durationDays} Days · Starts {state.startDate}
                    </p>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 text-xs text-stone-600">
                  <div className="flex justify-between">
                    <span>
                      {state.adults} Adult{state.adults > 1 ? 's' : ''} Base Tour
                    </span>
                    <span className="font-semibold text-[#082F24]">
                      ${(state.totalAmount + state.discountAmount - (state.airportPickup ? 40 : 0)).toLocaleString()}
                    </span>
                  </div>
                  {state.airportPickup && (
                    <div className="flex justify-between">
                      <span>VIP Airport Pickup</span>
                      <span className="font-semibold text-[#082F24]">$40</span>
                    </div>
                  )}
                  {state.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Promotional Savings</span>
                      <span>-${state.discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-3 border-t border-stone-200">
                    <span className="text-base font-bold text-[#082F24]">Total Due</span>
                    <span className="font-serif text-3xl font-bold text-[#0D3B2E]">
                      ${state.totalAmount.toLocaleString()} USD
                    </span>
                  </div>
                </div>

                {/* Terms Checkbox */}
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="w-4 h-4 rounded border-stone-300 text-[#0D3B2E] focus:ring-[#C5A059] mt-0.5 accent-[#0D3B2E]"
                  />
                  <span className="text-[11px] text-stone-500 leading-relaxed">
                    I agree to LankaVoyage's <span className="text-[#0D3B2E] font-semibold underline">Terms of Service</span>,{' '}
                    <span className="text-[#0D3B2E] font-semibold underline">Privacy Policy</span>, and{' '}
                    <span className="text-[#0D3B2E] font-semibold underline">Cancellation Policy</span>.
                  </span>
                </label>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={!isFormValid()}
                    className={`w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold text-sm sm:text-base shadow-xl transition-all ${
                      isFormValid()
                        ? 'bg-gradient-to-r from-[#C5A059] via-[#DFB76C] to-[#C5A059] text-[#082F24] hover:shadow-2xl hover:shadow-[#C5A059]/30 transform hover:-translate-y-0.5'
                        : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    }`}
                  >
                    <Lock className="w-4 h-4" />
                    <span>
                      {paymentMethod === 'Credit / Debit Card'
                        ? `Pay $${state.totalAmount.toLocaleString()} with PayHere`
                        : `Confirm Booking • $${state.totalAmount.toLocaleString()}`}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold text-stone-500 hover:text-stone-700 hover:bg-stone-50 transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back to Tour Details
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="pt-3 border-t border-stone-100 space-y-2 text-[11px] text-stone-500">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#0D3B2E] shrink-0" />
                    <span>100% Financial Protection & Refund Guarantee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0D3B2E] shrink-0" />
                    <span>Official SLTDA Licensed Chauffeurs & Guides</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
