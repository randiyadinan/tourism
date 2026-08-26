import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Check
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
import { paymentService } from '../../services/paymentService';
import { payhereService } from '../../services/payhereService';
import { useAuth } from '../../context/AuthContext';
import { INITIAL_DESTINATIONS } from '../../data/destinations';
import { INITIAL_ACTIVITIES } from '../../data/activities';

export const CustomTripPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Initial Custom Trip State
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
      airportTransferOption: 'pickup',
      selectedDestinations: defaultDests,
      selectedActivities: defaultActs,
      transportType: 'Private Car',
      accommodationLevel: 'Premium 4-Star',
      mealPlan: 'Breakfast Included',
      specialRequests: ''
    };
  });

  // Final Step 8 Form State
  const [contactName, setContactName] = useState(user?.name || '');
  const [contactEmail, setContactEmail] = useState(user?.email || '');
  const [contactPhone, setContactPhone] = useState(user?.phone || '');
  const [contactCountry, setContactCountry] = useState(user?.country || 'United Kingdom');
  const [paymentMethod, setPaymentMethod] = useState<'PayHere Online Card' | 'Bank Wire Transfer' | 'Pay Later on Arrival'>('PayHere Online Card');

  const updateTrip = (updates: Partial<CustomTripState>) => {
    setTripState(prev => ({ ...prev, ...updates }));
  };

  const stepsList = [
    { num: 1, label: 'Dates' },
    { num: 2, label: 'Travelers' },
    { num: 3, label: 'Arrival' },
    { num: 4, label: 'Destinations' },
    { num: 5, label: 'Activities' },
    { num: 6, label: 'Vehicle' },
    { num: 7, label: 'Review' },
    { num: 8, label: 'Confirm' }
  ];

  const handleNext = () => {
    if (currentStep < 8) setCurrentStep(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const handleFinalBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const cost = calculateCustomTripCost(tripState);

    const destNames = tripState.selectedDestinations.map(dId => {
      const found = INITIAL_DESTINATIONS.find(d => d.id === dId);
      return found ? found.name : dId;
    });

    const actNames = tripState.selectedActivities.map(aId => {
      const found = INITIAL_ACTIVITIES.find(a => a.id === aId);
      return found ? found.title : aId;
    });

    const newBooking = bookingService.createBooking({
      type: 'custom_trip',
      userId: user?.id || 'guest-user',
      customerName: contactName,
      customerEmail: contactEmail,
      customerPhone: contactPhone,
      startDate: tripState.arrivalDate,
      endDate: tripState.departureDate,
      adultsCount: tripState.adults,
      childrenCount: tripState.children,
      infantsCount: tripState.infants,
      destinationsCovered: destNames,
      activitiesSelected: actNames,
      vehicleType: tripState.transportType,
      airportPickup: tripState.airportPickup,
      flightNumber: tripState.flightNumber,
      flightArrivalTime: tripState.arrivalTime,
      basePrice: cost.baseTourTotal,
      customizationTotal: cost.vehicleCost + cost.airportPickupCost,
      discountAmount: cost.discount,
      taxAmount: 0,
      totalAmount: cost.estimatedTotal,
      amountPaid: 0,
      bookingStatus: 'Pending',
      paymentStatus: 'Unpaid',
      paymentMethod: paymentMethod === 'PayHere Online Card' ? 'Credit / Debit Card' : 'Bank Wire Transfer',
      notes: tripState.specialRequests,
      travelers: [
        {
          title: 'Mr',
          fullName: contactName,
          email: contactEmail,
          phone: contactPhone,
          nationality: contactCountry,
          isLead: true
        }
      ]
    });

    if (paymentMethod === 'PayHere Online Card') {
      try {
        const payhereData = await payhereService.initiatePayment({
          orderId: newBooking.bookingCode,
          bookingId: newBooking.id,
          bookingCode: newBooking.bookingCode,
          userId: user?.id,
          amount: cost.estimatedTotal,
          currency: 'USD',
          itemTitle: `${cost.daysCount}-Day Bespoke Sri Lanka Expedition`,
          customerName: contactName,
          customerEmail: contactEmail,
          customerPhone: contactPhone,
          city: 'Colombo',
          country: 'Sri Lanka'
        });

        payhereService.launchPayment(payhereData, {
          onCompleted: (orderId: string) => {
            bookingService.applyGatewayPaymentSuccess(newBooking.id, {
              amountPaid: cost.estimatedTotal,
              paymentMethod: 'Credit / Debit Card'
            });

            const txnRef = `PAYHERE-TXN-${orderId}`;
            paymentService.recordTransaction({
              userId: user?.id || 'guest',
              bookingId: newBooking.id,
              bookingCode: newBooking.bookingCode,
              customerName: contactName,
              amountUSD: cost.estimatedTotal,
              paymentMethod: 'Credit / Debit Card',
              status: 'Successful',
              transactionReference: txnRef,
              cardBrand: 'Visa/Mastercard'
            });

            try {
              confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
            } catch (err) {}

            navigate(`/customer/bookings/${newBooking.id}`);
          },
          onDismissed: () => {
            setIsSubmitting(false);
          },
          onError: (err: string) => {
            alert(`Payment Error: ${err}`);
            setIsSubmitting(false);
          }
        });
      } catch (err: any) {
        console.error('Failed to initiate PayHere for custom trip:', err);
        setIsSubmitting(false);
        navigate(`/customer/bookings/${newBooking.id}`);
      }
    } else {
      setIsSubmitting(false);
      try {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } catch (err) {}
      navigate(`/customer/bookings/${newBooking.id}`);
    }
  };

  return (
    <div className="bg-[#F8F7F2] min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#176B52] border border-stone-200 text-xs font-semibold uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#39A982]" />
            <span>Bespoke Holiday Designer</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#17231F]">
            Design Your Tailor-Made Journey
          </h1>
          <p className="text-sm sm:text-base text-[#68736E]">
            Customize dates, group size, private chauffeur vehicle, destinations, and experiences with real-time price estimation.
          </p>
        </div>

        {/* 8-Step Stepper Bar in Liquid Glass */}
        <div className="bg-white/85 backdrop-blur-xl p-4 rounded-2xl border border-white/80 shadow-[0_4px_20px_-4px_rgba(6,44,34,0.06)] overflow-x-auto">
          <div className="flex items-center justify-between min-w-[620px] gap-2">
            {stepsList.map((st) => {
              const isPast = st.num < currentStep;
              const isCurrent = st.num === currentStep;

              return (
                <div 
                  key={st.num}
                  onClick={() => setCurrentStep(st.num)}
                  className={`flex items-center gap-2 cursor-pointer transition-colors ${
                    isCurrent 
                      ? 'text-[#0B3D2E] font-bold' 
                      : isPast 
                        ? 'text-stone-700 font-medium' 
                        : 'text-stone-400 opacity-60'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCurrent 
                      ? 'bg-[#0B3D2E] text-white shadow-xs' 
                      : isPast 
                        ? 'bg-[#DDEFE8] text-[#176B52]' 
                        : 'bg-stone-100 text-stone-500'
                  }`}>
                    {isPast ? <Check className="w-3.5 h-3.5" /> : st.num}
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
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-[0_4px_20px_-4px_rgba(6,44,34,0.05)] space-y-8 min-h-[480px] flex flex-col justify-between">
            
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
                <form onSubmit={handleFinalBooking} className="space-y-5 text-xs sm:text-sm">
                  <div>
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#17231F]">Lead Traveler Details & Confirmation</h2>
                    <p className="text-xs text-[#68736E] mt-1">Enter your contact details to finalize the custom trip and generate your travel voucher.</p>
                  </div>

                  <div className="space-y-3.5">
                    <div className="space-y-1">
                      <label className="font-semibold text-[#17231F]">Full Legal Name (as on Passport) *</label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="e.g. Eleanor Vance"
                        className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl p-2.5 font-medium text-[#17231F] focus:outline-none focus:ring-2 focus:ring-[#176B52]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="space-y-1">
                        <label className="font-semibold text-[#17231F]">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="eleanor@example.com"
                          className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl p-2.5 font-medium text-[#17231F] focus:outline-none focus:ring-2 focus:ring-[#176B52]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-semibold text-[#17231F]">Phone / WhatsApp *</label>
                        <input
                          type="tel"
                          required
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          placeholder="+44 7911 123456"
                          className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl p-2.5 font-medium text-[#17231F] focus:outline-none focus:ring-2 focus:ring-[#176B52]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-[#17231F]">Country of Residence</label>
                      <input
                        type="text"
                        value={contactCountry}
                        onChange={(e) => setContactCountry(e.target.value)}
                        placeholder="United Kingdom"
                        className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl p-2.5 font-medium text-[#17231F] focus:outline-none focus:ring-2 focus:ring-[#176B52]"
                      />
                    </div>

                    {/* Payment Method Selector */}
                    <div className="space-y-1.5 pt-2">
                      <label className="font-semibold text-[#17231F] block">Select Payment Method</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {[
                          { id: 'PayHere Online Card', label: 'Credit / Debit Card (PayHere)' },
                          { id: 'Bank Wire Transfer', label: 'Bank Wire Transfer' },
                          { id: 'Pay Later on Arrival', label: 'Pay Later on Arrival' }
                        ].map((m) => (
                          <label
                            key={m.id}
                            className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-colors ${
                              paymentMethod === m.id
                                ? 'bg-[#DDEFE8] border-[#176B52] text-[#0B3D2E] font-semibold'
                                : 'bg-[#F8F7F2] border-stone-200 text-stone-600'
                            }`}
                          >
                            <input
                              type="radio"
                              name="paymentMethod"
                              checked={paymentMethod === m.id}
                              onChange={() => setPaymentMethod(m.id as any)}
                              className="text-[#176B52] focus:ring-[#176B52]"
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
                    className="w-full py-3.5 px-4 bg-[#0B3D2E] hover:bg-[#176B52] text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 border border-white/20"
                  >
                    {isSubmitting ? (
                      <span>Submitting Custom Itinerary...</span>
                    ) : (
                      <>
                        <span>Submit Booking & Reserve Itinerary</span>
                        <ArrowRight className="w-4 h-4 text-[#DDEFE8]" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Bottom Nav Controls (Prev / Next) */}
            {currentStep < 8 && (
              <div className="flex items-center justify-between pt-6 border-t border-stone-100">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentStep === 1}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl border border-stone-200 transition-colors ${
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
                  className="flex items-center gap-1.5 text-xs font-semibold px-5 py-2 rounded-xl bg-[#0B3D2E] text-white hover:bg-[#176B52] shadow-xs transition-colors"
                >
                  <span>{currentStep === 7 ? 'Proceed to Confirmation' : 'Continue'}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#DDEFE8]" />
                </button>
              </div>
            )}

          </div>

          {/* Right Column: Dynamic Price Summary (4 Cols) */}
          <div className="lg:col-span-4 sticky top-24">
            <DynamicPriceReceipt customTrip={tripState} />
          </div>

        </div>

      </div>
    </div>
  );
};
