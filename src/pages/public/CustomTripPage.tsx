import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Calendar, 
  Users, 
  Plane, 
  MapPin, 
  Car, 
  ClipboardCheck, 
  CreditCard
} from 'lucide-react';
import type { CustomTripState } from '../../types';
import { 
  Step1Dates, 
  Step2Travelers, 
  Step3Arrival, 
  Step4Destinations, 
  Step5Activities, 
  Step6Transport, 
  Step7Review 
} from '../../components/custom/CustomWizardSteps';
import { DynamicPriceReceipt, calculateCustomTripCost } from '../../components/custom/DynamicPriceReceipt';
import { bookingService } from '../../services/bookingService';
import { useAuth } from '../../context/AuthContext';
import { INITIAL_DESTINATIONS } from '../../data/destinations';
import { INITIAL_ACTIVITIES } from '../../data/activities';

export const CustomTripPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Initial Custom Trip State (No hotels, no meals)
  const [tripState, setTripState] = useState<CustomTripState>(() => {
    const destParam = searchParams.get('destId');
    const actParam = searchParams.get('activityId');

    const defaultDests = destParam ? [destParam] : ['dest-sigiriya', 'dest-kandy', 'dest-ella', 'dest-yala'];
    const defaultActs = actParam ? [actParam] : ['act-yala-safari', 'act-ella-train'];

    return {
      arrivalDate: '2026-11-01',
      departureDate: '2026-11-08',
      adults: 2,
      children: 0,
      infants: 0,
      airport: 'Bandaranaike Intl Airport (CMB) - Colombo',
      flightNumber: 'UL 504',
      arrivalTime: '14:30',
      airportPickup: true,
      airportTransferOption: 'both',
      airportTransferDetails: {
        airport: 'Bandaranaike Intl Airport (CMB) - Colombo',
        flightNumber: 'UL 504',
        arrivalTime: '14:30',
        passengers: 2,
        priceUSD: 75
      },
      selectedDestinations: defaultDests,
      selectedActivities: defaultActs,
      transportType: 'Private Van',
      specialRequests: ''
    };
  });

  // Step 8: Traveler details & payment selection
  const [contactName, setContactName] = useState(user?.name || '');
  const [contactEmail, setContactEmail] = useState(user?.email || '');
  const [contactPhone, setContactPhone] = useState(user?.phone || '');
  const [paymentMethod, setPaymentMethod] = useState<'Credit / Debit Card' | 'PayPal' | 'Bank Wire Transfer' | 'Pay on Arrival / Deposit'>('Credit / Debit Card');

  React.useEffect(() => {
    if (user) {
      if (!contactName) setContactName(user.name);
      if (!contactEmail) setContactEmail(user.email);
      if (!contactPhone && user.phone) setContactPhone(user.phone);
    }
  }, [user]);

  const updateTrip = (updates: Partial<CustomTripState>) => {
    setTripState(prev => ({ ...prev, ...updates }));
  };

  const stepsList = [
    { num: 1, label: 'Dates', icon: Calendar },
    { num: 2, label: 'Travelers', icon: Users },
    { num: 3, label: 'Arrival', icon: Plane },
    { num: 4, label: 'Destinations', icon: MapPin },
    { num: 5, label: 'Activities', icon: Sparkles },
    { num: 6, label: 'Transport', icon: Car },
    { num: 7, label: 'Review', icon: ClipboardCheck },
    { num: 8, label: 'Book', icon: CreditCard }
  ];

  const handleNext = () => {
    if (currentStep < 8) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handleFinalBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const cost = calculateCustomTripCost(tripState);
    const destNames = tripState.selectedDestinations.map(id => INITIAL_DESTINATIONS.find(d => d.id === id)?.name || id);
    const actNames = tripState.selectedActivities.map(id => INITIAL_ACTIVITIES.find(a => a.id === id)?.title || id);

    setTimeout(() => {
      const newBooking = bookingService.createBooking({
        userId: user?.id || 'user-customer-1',
        customerName: contactName,
        customerEmail: contactEmail,
        customerPhone: contactPhone,
        type: 'custom_trip',
        tourTitle: `${cost.daysCount}-Day Bespoke Sri Lanka Expedition`,
        tourImage: 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=800&q=80',
        startDate: tripState.arrivalDate,
        endDate: tripState.departureDate,
        adultsCount: tripState.adults,
        childrenCount: tripState.children,
        infantsCount: tripState.infants,
        destinationsCovered: destNames,
        vehicleType: tripState.transportType,
        activitiesSelected: actNames,
        airportPickup: tripState.airportPickup,
        airportTransferOption: tripState.airportTransferOption,
        airportTransferDetails: tripState.airportTransferDetails,
        flightNumber: tripState.flightNumber,
        flightArrivalTime: tripState.arrivalTime,
        travelers: [
          {
            title: 'Mr',
            fullName: contactName,
            email: contactEmail,
            phone: contactPhone,
            nationality: 'International',
            isLead: true,
            specialRequirements: tripState.specialRequests
          }
        ],
        basePrice: cost.baseTourTotal,
        customizationTotal: cost.vehicleCost + cost.airportPickupCost,
        discountAmount: cost.discount,
        taxAmount: 0,
        totalAmount: cost.estimatedTotal,
        amountPaid: cost.estimatedTotal,
        bookingStatus: 'Pending',
        paymentStatus: 'Fully Paid',
        paymentMethod: paymentMethod,
        notes: tripState.specialRequests
      });

      setIsSubmitting(false);

      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (err) {}

      navigate(`/customer/bookings/${newBooking.id}`);
    }, 1200);
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#C5A059]/20 text-[#8C6D2B] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            8-Step Custom Tour Wizard
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#082F24]">
            Design Your Bespoke Sri Lankan Journey
          </h1>
          <p className="text-sm sm:text-base text-stone-600">
            Customize dates, group size, private vehicle, destinations, and activities with real-time price updates.
          </p>
        </div>

        {/* 8-Step Progress Stepper Bar */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm overflow-x-auto">
          <div className="flex items-center justify-between min-w-[650px] gap-2">
            {stepsList.map((st) => {
              const isPast = st.num < currentStep;
              const isCurrent = st.num === currentStep;

              return (
                <div 
                  key={st.num}
                  onClick={() => setCurrentStep(st.num)}
                  className={`flex items-center gap-2 cursor-pointer transition-all ${
                    isCurrent 
                      ? 'text-[#0D3B2E] font-bold' 
                      : isPast 
                        ? 'text-stone-700 font-medium' 
                        : 'text-stone-400 opacity-60'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCurrent 
                      ? 'bg-[#0D3B2E] text-[#E5C378] ring-4 ring-[#C5A059]/30' 
                      : isPast 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-stone-100 text-stone-500'
                  }`}>
                    {isPast ? <Check className="w-4 h-4" /> : st.num}
                  </div>
                  <span className="text-xs">{st.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Active Step (8 Cols) */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-10 rounded-3xl border border-stone-200 shadow-sm space-y-8 min-h-[500px] flex flex-col justify-between">
            
            {/* Step Components Render */}
            <div>
              {currentStep === 1 && <Step1Dates tripState={tripState} onChange={updateTrip} />}
              {currentStep === 2 && <Step2Travelers tripState={tripState} onChange={updateTrip} />}
              {currentStep === 3 && <Step3Arrival tripState={tripState} onChange={updateTrip} />}
              {currentStep === 4 && <Step4Destinations tripState={tripState} onChange={updateTrip} />}
              {currentStep === 5 && <Step5Activities tripState={tripState} onChange={updateTrip} />}
              {currentStep === 6 && <Step6Transport tripState={tripState} onChange={updateTrip} />}
              {currentStep === 7 && <Step7Review tripState={tripState} onChange={updateTrip} />}

              {/* STEP 8: BOOKING & CONFIRMATION FORM */}
              {currentStep === 8 && (
                <form onSubmit={handleFinalBooking} className="space-y-6">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#082F24]">Lead Traveler Details & Confirmation</h3>
                    <p className="text-sm text-stone-600">Enter your details to finalize the custom trip and generate your travel voucher.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700">Full Legal Name (as on Passport)</label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-4 py-2.5 text-sm font-semibold text-[#082F24]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-stone-700">Email Address (for Digital Voucher)</label>
                        <input
                          type="email"
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-4 py-2.5 text-sm font-semibold text-[#082F24]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-stone-700">WhatsApp / Phone Number</label>
                        <input
                          type="tel"
                          required
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-4 py-2.5 text-sm font-semibold text-[#082F24]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700">Special Notes / Requests</label>
                      <textarea
                        rows={2}
                        value={tripState.specialRequests}
                        onChange={(e) => updateTrip({ specialRequests: e.target.value })}
                        placeholder="e.g. Extra child seat, celebration surprise for anniversary, specific photo stops..."
                        className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-4 py-2.5 text-xs text-[#082F24]"
                      />
                    </div>

                    {/* Payment Selector */}
                    <div className="space-y-2 pt-2">
                      <label className="text-xs font-bold text-stone-700 block">Payment Preference</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          { id: 'Credit / Debit Card' as const, label: 'Credit / Debit Card (Instant)' },
                          { id: 'PayPal' as const, label: 'PayPal Checkout' },
                          { id: 'Bank Wire Transfer' as const, label: 'Bank Wire (Invoice)' },
                          { id: 'Pay on Arrival / Deposit' as const, label: '20% Deposit (Balance on Arrival)' }
                        ].map((m) => (
                          <label
                            key={m.id}
                            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                              paymentMethod === m.id
                                ? 'border-[#0D3B2E] bg-[#0D3B2E]/5 font-bold text-[#082F24]'
                                : 'border-stone-200 bg-[#FAF8F5] text-stone-600'
                            }`}
                          >
                            <input
                              type="radio"
                              name="paymentMethod"
                              checked={paymentMethod === m.id}
                              onChange={() => setPaymentMethod(m.id)}
                              className="text-[#0D3B2E] focus:ring-[#C5A059]"
                            />
                            <span className="text-xs">{m.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-gradient-to-r from-[#C5A059] to-[#8C6D2B] text-[#082F24] hover:from-[#E5C378] hover:to-[#C5A059] font-bold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>Submitting Custom Itinerary...</span>
                    ) : (
                      <>
                        <span>Submit Booking (Awaiting Admin Confirmation)</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Bottom Nav Controls (Prev / Next) */}
            {currentStep < 8 && (
              <div className="flex items-center justify-between pt-8 border-t border-stone-100">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentStep === 1}
                  className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl border border-stone-200 transition-all ${
                    currentStep === 1
                      ? 'text-stone-300 border-stone-100 cursor-not-allowed'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-1.5 text-xs font-bold px-6 py-2.5 rounded-xl bg-[#0D3B2E] text-white hover:bg-[#134E3F] shadow-sm transition-all"
                >
                  <span>{currentStep === 7 ? 'Proceed to Confirmation' : 'Continue'}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#E5C378]" />
                </button>
              </div>
            )}

          </div>

          {/* Right Column: Dynamic Price Summary (4 Cols) */}
          <div className="lg:col-span-4 sticky top-28">
            <DynamicPriceReceipt customTrip={tripState} />
          </div>

        </div>

      </div>
    </div>
  );
};
