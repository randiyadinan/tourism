import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  Lock,
  Calendar,
  Users,
  ShieldCheck,
  CreditCard,
  Banknote,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertCircle,
  Car,
  MapPin
} from 'lucide-react';
import { bookingService } from '../../services/bookingService';
import { payhereService } from '../../services/payhereService';
import { useAuth } from '../../context/AuthContext';
import { analytics } from '../../services/analytics';
import { formatPrice } from '../../utils/formatters';
import type { PaymentMethod } from '../../types';
import { CountrySelect } from '../../components/common/CountrySelect';

export const CheckoutPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const state = location.state as {
    tourId?: string;
    tourTitle?: string;
    tourImage?: string;
    durationDays?: number;
    startDate?: string;
    adults?: number;
    children?: number;
    airportPickup?: boolean;
    discountCode?: string;
    discountAmount?: number;
    totalAmount?: number;
    destinations?: string[];
    vehicleType?: string;
    flightNumber?: string;
    arrivalTime?: string;
  } | null;

  const [leadName, setLeadName] = useState(user?.name || '');
  const [leadEmail, setLeadEmail] = useState(user?.email || '');
  const [leadPhone, setLeadPhone] = useState(user?.phone || '');
  const [leadCountry, setLeadCountry] = useState(user?.country || 'United Kingdom');
  const [flightNumber, setFlightNumber] = useState(state?.flightNumber || '');
  const [flightNumberError, setFlightNumberError] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Credit / Debit Card');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // PayHere Redirect Verification State
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [verificationPending, setVerificationPending] = useState(false);
  const [verifiedBookingCode, setVerifiedBookingCode] = useState<string | null>(null);

  // Check for PayHere redirect return
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const orderId = searchParams.get('order_id') || searchParams.get('orderId');
    const paymentStatusParam = searchParams.get('payment_status') || searchParams.get('status');

    if (orderId) {
      setVerifyingPayment(true);
      const allBookings = bookingService.getAllBookings();
      const existing = allBookings.find(b => b.bookingCode === orderId || b.id === orderId);

      if (paymentStatusParam === 'cancel' || paymentStatusParam === 'cancelled' || paymentStatusParam === 'failed' || paymentStatusParam === '-1') {
        setVerifyingPayment(false);
        setVerificationPending(false);
        if (existing) {
          bookingService.applyGatewayPaymentFailure(existing.id, paymentStatusParam.includes('cancel') ? 'CANCELLED' : 'FAILED');
        }
        setSubmitError(`Payment was cancelled or unsuccessful with PayHere (Reference: ${orderId}). Please retry.`);
        return;
      }

      payhereService.getPaymentStatus(orderId)
        .then((verificationResult) => {
          setVerifyingPayment(false);
          if (verificationResult?.status === 'SUCCESS') {
            if (existing) {
              bookingService.applyGatewayPaymentSuccess(existing.id, {
                amountPaid: existing.totalAmount,
                paymentMethod: 'Credit / Debit Card'
              });
              setVerifiedBookingCode(existing.bookingCode);
              try {
                confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
              } catch (e) {}
            }
          } else if (verificationResult?.status === 'FAILED' || verificationResult?.status === 'CANCELLED') {
            if (existing) {
              bookingService.applyGatewayPaymentFailure(existing.id, verificationResult.status);
            }
            setSubmitError(`PayHere payment ${verificationResult.status.toLowerCase()} for Order ${orderId}.`);
          } else {
            // Still pending IPN or verification
            setVerificationPending(true);
            setVerifiedBookingCode(orderId);
          }
        })
        .catch(err => {
          console.warn('Backend payment status verification check:', err);
          setVerifyingPayment(false);
          setVerificationPending(true);
          setVerifiedBookingCode(orderId);
        });
    }
  }, []);

  // Track checkout view
  useEffect(() => {
    if (state && state.totalAmount) {
      analytics.beginCheckout(
        state.tourId || 'tour-custom',
        state.tourTitle || 'Sri Lanka Tour',
        state.totalAmount,
        'LKR'
      );
    }
  }, [state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setFlightNumberError('');

    if (!flightNumber || !flightNumber.trim()) {
      setFlightNumberError('Flight number is required.');
      setSubmitError('Flight number is required.');
      return;
    }

    if (!agreeTerms) {
      setSubmitError('Please accept the Terms and Cancellation Policy to complete booking.');
      return;
    }

    if (!state || !state.totalAmount) {
      setSubmitError('Booking information is missing. Please select a tour again.');
      return;
    }

    setIsSubmitting(true);

    try {
      // UNIFIED APPROVAL FLOW:
      // When a customer selects any Tour or Airport Transfer and submits checkout:
      // 1. DO NOT immediately open PayHere.
      // 2. Create booking request with bookingStatus = "Pending", paymentStatus = "NOT PAID", paymentAvailable = false.
      // 3. Customer sees confirmation that their request is under review.
      const newBooking = bookingService.createBooking({
        type: 'standard_tour',
        userId: user?.id || 'guest-user',
        customerName: leadName,
        customerEmail: leadEmail,
        customerPhone: leadPhone,
        tourId: state.tourId,
        tourTitle: state.tourTitle,
        tourImage: state.tourImage,
        startDate: state.startDate || '2026-10-15',
        endDate: '2026-10-25',
        adultsCount: state.adults || 2,
        childrenCount: state.children || 0,
        infantsCount: 0,
        destinationsCovered: state.destinations || [],
        vehicleType: state.vehicleType || 'Private Luxury Sedan',
        airportPickup: state.airportPickup || false,
        flightNumber: flightNumber.trim(),
        flightArrivalTime: state.arrivalTime || '14:30',
        basePrice: state.totalAmount + (state.discountAmount || 0),
        customizationTotal: state.airportPickup ? 40 : 0,
        discountAmount: state.discountAmount || 0,
        discountCode: state.discountCode,
        taxAmount: 0,
        totalAmount: state.totalAmount,
        amountPaid: 0,
        bookingStatus: 'Pending',
        paymentStatus: 'NOT PAID',
        paymentAvailable: false,
        paymentMethod: paymentMethod,
        notes: specialRequests,
        travelers: [
          {
            title: 'Mr',
            fullName: leadName,
            email: leadEmail,
            phone: leadPhone,
            nationality: leadCountry,
            passportNumber: passportNumber || undefined,
            isLead: true
          }
        ]
      });

      setIsSubmitting(false);
      try {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}

      // Navigate to booking detail confirmation screen
      navigate(`/customer/bookings/${newBooking.id}`, {
        state: { newRequestSubmitted: true }
      });
    } catch (err: any) {
      setSubmitError(err?.message || 'Failed to finalize your reservation. Please try again.');
      setIsSubmitting(false);
    }
  };

  // ─── VERIFICATION STATES ─────────────────────────────
  if (verifyingPayment) {
    return (
      <div className="bg-[#F8F7F2] min-h-screen py-20 flex items-center justify-center">
        <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-xl max-w-md w-full text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-[#176B52] border-t-transparent animate-spin mx-auto" />
          <h2 className="font-serif text-2xl font-bold text-[#17231F]">Verifying Payment...</h2>
          <p className="text-xs text-[#68736E]">
            Please wait while we confirm your PayHere transaction.
          </p>
        </div>
      </div>
    );
  }

  if (verificationPending) {
    return (
      <div className="bg-[#F8F7F2] min-h-screen py-20 flex items-center justify-center">
        <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-xl max-w-md w-full text-center space-y-4">
          <Clock className="w-12 h-12 text-amber-500 mx-auto" />
          <h2 className="font-serif text-2xl font-bold text-[#17231F]">Payment Verification Pending</h2>
          <p className="text-xs text-[#68736E] leading-relaxed">
            Your transaction for booking <span className="font-bold text-[#17231F]">{verifiedBookingCode}</span> has been received and is awaiting gateway settlement.
          </p>
          <Link
            to="/customer/bookings"
            className="inline-block px-6 py-2.5 rounded-xl bg-[#0B3D2E] text-white text-xs font-semibold"
          >
            Go to My Bookings
          </Link>
        </div>
      </div>
    );
  }

  if (verifiedBookingCode && !verificationPending) {
    return (
      <div className="bg-[#F8F7F2] min-h-screen py-20 flex items-center justify-center">
        <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-xl max-w-md w-full text-center space-y-4">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h2 className="font-serif text-2xl font-bold text-[#17231F]">Payment Successful!</h2>
          <p className="text-xs text-[#68736E] leading-relaxed">
            Booking reference <span className="font-bold text-[#17231F]">{verifiedBookingCode}</span> is confirmed.
          </p>
          <Link
            to="/customer/bookings"
            className="inline-block px-6 py-2.5 rounded-xl bg-[#0B3D2E] text-white text-xs font-semibold shadow-xs"
          >
            View Reservation Details
          </Link>
        </div>
      </div>
    );
  }

  // ─── MAIN CHECKOUT FORM ─────────────────────────────
  return (
    <div className="bg-[#F8F7F2] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-[#68736E] font-medium">
          <Link to="/" className="hover:text-[#176B52]">Home</Link>
          <span>/</span>
          <Link to="/tours" className="hover:text-[#176B52]">Tours</Link>
          <span>/</span>
          <span className="text-[#176B52] font-semibold">Secure Checkout</span>
        </div>

        {/* Page Header */}
        <div className="space-y-1">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#17231F]">Secure Checkout</h1>
          <p className="flex items-center gap-1.5 text-xs text-[#68736E]">
            <Lock className="w-3.5 h-3.5 text-[#176B52]" />
            256-bit SSL encrypted · Verified PayHere Gateway · Instant digital travel voucher
          </p>
        </div>

        {/* Two Column Layout */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Form (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Section A: Order Summary */}
            {state && (
              <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 space-y-4">
                <h3 className="font-serif text-lg font-bold text-[#17231F] flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#39A982]" />
                  Selected Itinerary
                </h3>

                <div className="flex gap-4">
                  <img
                    src={state.tourImage}
                    alt={state.tourTitle}
                    className="w-20 h-20 rounded-2xl object-cover border border-stone-200"
                  />
                  <div className="flex-1 space-y-1">
                    <h4 className="font-serif font-bold text-sm text-[#17231F]">{state.tourTitle}</h4>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#68736E]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#176B52]" />
                        {state.startDate} · {state.durationDays} Days
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-[#176B52]" />
                        {state.adults} Adult{state.adults && state.adults > 1 ? 's' : ''}
                        {state.children && state.children > 0 ? `, ${state.children} Child` : ''}
                      </span>
                    </div>
                  </div>
                </div>

                {state.destinations && state.destinations.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {state.destinations.map((d, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#DDEFE8] text-[#176B52]"
                      >
                        <MapPin className="w-3 h-3" />
                        {d}
                      </span>
                    ))}
                  </div>
                )}

                {state.airportPickup && (
                  <div className="flex items-center gap-2 text-xs text-[#17231F] bg-[#F8F7F2] rounded-xl px-3.5 py-2 border border-stone-200">
                    <Car className="w-4 h-4 text-[#176B52]" />
                    <span>Includes VIP Airport Pickup & Dedicated Chauffeur Fleet</span>
                  </div>
                )}
              </div>
            )}

            {/* Section B: Lead Traveler Form */}
            <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#17231F]">Lead Traveler Information</h3>

              <div className="space-y-3.5 text-xs sm:text-sm">
                <div className="space-y-1">
                  <label className="font-semibold text-[#17231F]">Full Name (as on Passport) *</label>
                  <input
                    type="text"
                    required
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    placeholder="e.g. David Miller"
                    className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl p-3 font-medium text-[#17231F] focus:outline-none focus:ring-2 focus:ring-[#176B52]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="font-semibold text-[#17231F]">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      placeholder="david@example.com"
                      className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl p-3 font-medium text-[#17231F] focus:outline-none focus:ring-2 focus:ring-[#176B52]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-[#17231F]">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      placeholder="+44 7911 123456"
                      className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl p-3 font-medium text-[#17231F] focus:outline-none focus:ring-2 focus:ring-[#176B52]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div className="space-y-1">
                    <label className="font-semibold text-[#17231F]">
                      Flight Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={flightNumber}
                      onChange={(e) => {
                        setFlightNumber(e.target.value);
                        if (e.target.value.trim()) {
                          setFlightNumberError('');
                        }
                      }}
                      placeholder="e.g. UL 504 / EK 650"
                      className={`w-full bg-[#F8F7F2] border rounded-xl p-3 font-medium text-[#17231F] uppercase focus:outline-none focus:ring-2 ${
                        flightNumberError 
                          ? 'border-rose-400 focus:ring-rose-400 bg-rose-50/20' 
                          : 'border-stone-300 focus:ring-[#176B52]'
                      }`}
                    />
                    {flightNumberError && (
                      <p className="text-xs text-rose-600 font-medium flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{flightNumberError}</span>
                      </p>
                    )}
                  </div>

                  <CountrySelect
                    label="Country of Residence"
                    value={leadCountry}
                    onChange={(c) => setLeadCountry(c)}
                    placeholder="Select country..."
                  />

                  <div className="space-y-1">
                    <label className="font-semibold text-[#17231F]">Passport (Optional)</label>
                    <input
                      type="text"
                      value={passportNumber}
                      onChange={(e) => setPassportNumber(e.target.value)}
                      placeholder="GB12345678"
                      className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl p-3 font-medium text-[#17231F] focus:outline-none focus:ring-2 focus:ring-[#176B52]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#17231F]">Special Requests & Dietary Requirements</label>
                  <textarea
                    rows={3}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="Vegetarian meal preferences, child car seat requirements, flight arrival details..."
                    className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl p-3 font-medium text-[#17231F] focus:outline-none focus:ring-2 focus:ring-[#176B52]"
                  />
                </div>
              </div>
            </div>

            {/* Section C: Payment Method Selector */}
            <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#17231F]">Payment Options</h3>

              <div className="space-y-2.5">
                {/* 1. Credit / Debit Card */}
                <label
                  className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-colors ${
                    paymentMethod === 'Credit / Debit Card'
                      ? 'bg-[#DDEFE8] border-[#176B52]'
                      : 'bg-[#F8F7F2] border-stone-200 hover:bg-stone-100/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payMethod"
                      checked={paymentMethod === 'Credit / Debit Card'}
                      onChange={() => setPaymentMethod('Credit / Debit Card')}
                      className="text-[#176B52] focus:ring-[#176B52]"
                    />
                    <div>
                      <span className="text-xs sm:text-sm font-bold text-[#17231F] block">
                        Credit / Debit Card
                      </span>
                      <span className="text-[11px] text-[#68736E]">
                        Secure payment via PayHere
                      </span>
                    </div>
                  </div>
                  <CreditCard className="w-5 h-5 text-[#176B52]" />
                </label>

                {/* 2. Cash Payment */}
                <label
                  className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-colors ${
                    paymentMethod === 'Cash Payment'
                      ? 'bg-[#DDEFE8] border-[#176B52]'
                      : 'bg-[#F8F7F2] border-stone-200 hover:bg-stone-100/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payMethod"
                      checked={paymentMethod === 'Cash Payment'}
                      onChange={() => setPaymentMethod('Cash Payment')}
                      className="text-[#176B52] focus:ring-[#176B52]"
                    />
                    <div>
                      <span className="text-xs sm:text-sm font-bold text-[#17231F] block">
                        Cash Payment
                      </span>
                      <span className="text-[11px] text-[#68736E]">
                        Pay at the agreed time/location
                      </span>
                    </div>
                  </div>
                  <Banknote className="w-5 h-5 text-[#176B52]" />
                </label>
              </div>
            </div>

            {/* Error Display */}
            {submitError && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs text-rose-700">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{submitError}</span>
              </div>
            )}

            {/* Terms Agreement */}
            <div className="space-y-4">
              <label className="flex items-start gap-2.5 text-xs text-[#68736E] cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="rounded text-[#176B52] focus:ring-[#176B52] mt-0.5"
                />
                <span>
                  I have read and agree to LankaVoyage's{' '}
                  <Link to="/terms-and-conditions" target="_blank" className="text-[#176B52] underline font-semibold">
                    Terms & Conditions
                  </Link>{' '}
                  and{' '}
                  <Link to="/cancellation-refund-policy" target="_blank" className="text-[#176B52] underline font-semibold">
                    Cancellation & Refund Policy
                  </Link>.
                </span>
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#0B3D2E] hover:bg-[#176B52] text-white font-bold text-sm rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 border border-white/20"
              >
                {isSubmitting ? (
                  <span>Processing Reservation...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-[#DDEFE8]" />
                    <span>
                      {paymentMethod === 'Credit / Debit Card'
                        ? `Pay ${formatPrice(state?.totalAmount || 0)} with PayHere`
                        : 'Confirm Reservation (Cash Payment)'}
                    </span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* RIGHT COLUMN: Price Receipt & Guarantee (5 Cols) */}
          <div className="lg:col-span-5 sticky top-24 space-y-5">
            
            {/* Price Receipt Card */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4 shadow-xs">
              <h3 className="font-serif text-lg font-bold text-[#17231F] border-b border-stone-100 pb-3">
                Price Breakdown
              </h3>

              <div className="space-y-2.5 text-xs text-[#68736E]">
                <div className="flex justify-between">
                  <span>Base Package</span>
                  <span className="font-semibold text-[#17231F]">
                    {formatPrice((state?.totalAmount || 0) + (state?.discountAmount || 0))}
                  </span>
                </div>

                {state?.discountAmount && state.discountAmount > 0 ? (
                  <div className="flex justify-between text-emerald-800 font-semibold">
                    <span>Promo Discount ({state.discountCode})</span>
                    <span>-{formatPrice(state.discountAmount)}</span>
                  </div>
                ) : null}

                <div className="flex justify-between text-base font-bold text-[#17231F] pt-3 border-t border-stone-200">
                  <span>Total Due</span>
                  <span className="font-serif text-2xl text-[#0B3D2E]">
                    {formatPrice(state?.totalAmount || 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="bg-[#DDEFE8]/40 rounded-3xl p-5 border border-[#176B52]/20 space-y-3 text-xs text-[#17231F]">
              <div className="flex items-center gap-2 font-bold text-[#176B52]">
                <ShieldCheck className="w-4 h-4" />
                <span>Our Booking Guarantee</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-[#68736E]">
                <li>&bull; 100% full refund up to 30 days prior to departure</li>
                <li>&bull; Zero hidden taxes, fuel surcharges, or toll fees</li>
                <li>&bull; Dedicated 24/7 personal WhatsApp concierge</li>
              </ul>
            </div>

          </div>

        </form>

      </div>
    </div>
  );
};
