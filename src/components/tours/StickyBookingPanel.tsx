import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
   
  ShieldCheck, 
  Sparkles, 
  Check, 
  Plane, 
  ArrowRight,
  CreditCard,
  Percent,
  Clock
} from 'lucide-react';
import type { Tour } from '../../types';
import { INITIAL_DISCOUNTS } from '../../data/initialBookings';

interface StickyBookingPanelProps {
  tour: Tour;
  onBookNow: (bookingDetails: {
    startDate: string;
    adults: number;
    children: number;
    airportPickup: boolean;
    discountCode: string;
    discountAmount: number;
    totalAmount: number;
  }) => void;
}

export const StickyBookingPanel: React.FC<StickyBookingPanelProps> = ({ tour, onBookNow }) => {
  const [startDate, setStartDate] = useState<string>('2026-10-15');
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);
  const [airportPickup, setAirportPickup] = useState<boolean>(true);
  const [promoCodeInput, setPromoCodeInput] = useState<string>('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; percent?: number; fixed?: number } | null>({
    code: 'CEYLON10',
    percent: 10
  });
  const [promoError, setPromoError] = useState<string>('');

  const navigate = useNavigate();

  // Price calculations
  const adultBaseTotal = adults * tour.pricePerPerson;
  const childBaseTotal = children * Math.round(tour.pricePerPerson * 0.65); // 35% discount for kids
  const pickupTotal = airportPickup ? 40 : 0;
  const subtotal = adultBaseTotal + childBaseTotal + pickupTotal;

  let discountAmount = 0;
  if (appliedDiscount) {
    if (appliedDiscount.percent) {
      discountAmount = Math.round((subtotal * appliedDiscount.percent) / 100);
    } else if (appliedDiscount.fixed) {
      discountAmount = appliedDiscount.fixed;
    }
  }

  const finalTotal = Math.max(0, subtotal - discountAmount);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const code = promoCodeInput.trim().toUpperCase();
    const found = INITIAL_DISCOUNTS.find(d => d.code === code && d.isActive);
    if (found) {
      setAppliedDiscount({
        code: found.code,
        percent: found.discountType === 'percentage' ? found.discountValue : undefined,
        fixed: found.discountType === 'fixed_usd' ? found.discountValue : undefined
      });
      setPromoCodeInput('');
    } else {
      setPromoError('Invalid or expired coupon code.');
    }
  };

  const handleProceedBooking = () => {
    onBookNow({
      startDate,
      adults,
      children,
      airportPickup,
      discountCode: appliedDiscount?.code || '',
      discountAmount,
      totalAmount: finalTotal
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-xl space-y-6 sticky top-24">
      
      {/* Price Header */}
      <div className="flex items-baseline justify-between border-b border-stone-100 pb-5">
        <div>
          <span className="text-xs text-stone-400 font-semibold block uppercase tracking-wider">Price from</span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-[#082F24]">
              ${tour.pricePerPerson.toLocaleString()}
            </span>
            {tour.originalPrice && (
              <span className="text-sm text-stone-400 line-through">
                ${tour.originalPrice.toLocaleString()}
              </span>
            )}
            <span className="text-xs text-stone-500">/ person</span>
          </div>
        </div>

        <div className="text-right">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#134E3F]/15 text-[#0D3B2E]">
            <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
            {tour.durationDays} Days
          </span>
        </div>
      </div>

      {/* Date & Travelers Inputs */}
      <div className="space-y-4">
        
        {/* Start Date */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-[#082F24] uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
            Select Tour Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-[#082F24] focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
          />
        </div>

        {/* Travelers Pickers */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#082F24] uppercase tracking-wider">
              Adults (12+ yrs)
            </label>
            <select
              value={adults}
              onChange={(e) => setAdults(Number(e.target.value))}
              className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2 text-sm font-semibold text-[#082F24] focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                <option key={n} value={n}>{n} Adult{n > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#082F24] uppercase tracking-wider">
              Children (2-11 yrs)
            </label>
            <select
              value={children}
              onChange={(e) => setChildren(Number(e.target.value))}
              className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2 text-sm font-semibold text-[#082F24] focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
            >
              {[0, 1, 2, 3, 4].map(n => (
                <option key={n} value={n}>{n} Child{n !== 1 ? 'ren' : ''}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Airport Transfer Add-on */}
        <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-stone-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0D3B2E]/10 flex items-center justify-center text-[#0D3B2E]">
              <Plane className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#082F24]">VIP Airport Pickup (CMB)</p>
              <p className="text-[11px] text-stone-500">Chauffeur Meet & Greet + $40</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={airportPickup}
            onChange={(e) => setAirportPickup(e.target.checked)}
            className="w-5 h-5 rounded border-stone-300 text-[#0D3B2E] focus:ring-[#C5A059] accent-[#0D3B2E]"
          />
        </div>

      </div>

      {/* Promo Code Box */}
      <div className="space-y-2 pt-2 border-t border-stone-100">
        <form onSubmit={handleApplyPromo} className="flex gap-2">
          <input
            type="text"
            value={promoCodeInput}
            onChange={(e) => setPromoCodeInput(e.target.value)}
            placeholder="Promo code (e.g. CEYLON10)"
            className="flex-1 bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2 text-xs font-medium text-[#082F24] uppercase placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
          />
          <button
            type="submit"
            className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-xl transition-colors"
          >
            Apply
          </button>
        </form>
        {appliedDiscount && (
          <div className="flex items-center justify-between text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1.5 rounded-lg">
            <span className="flex items-center gap-1">
              <Percent className="w-3.5 h-3.5" />
              Code {appliedDiscount.code} applied!
            </span>
            <span>-${discountAmount}</span>
          </div>
        )}
        {promoError && <p className="text-xs text-rose-600 font-medium">{promoError}</p>}
      </div>

      {/* Itemized Price Breakdown */}
      <div className="space-y-2 text-xs text-stone-600 border-t border-stone-100 pt-3">
        <div className="flex items-center justify-between">
          <span>{adults} Adult{adults > 1 ? 's' : ''} Base Tour</span>
          <span className="font-semibold text-[#082F24]">${adultBaseTotal.toLocaleString()}</span>
        </div>
        {children > 0 && (
          <div className="flex items-center justify-between">
            <span>{children} Child{children > 1 ? 'ren' : ''} (35% Off)</span>
            <span className="font-semibold text-[#082F24]">${childBaseTotal.toLocaleString()}</span>
          </div>
        )}
        {airportPickup && (
          <div className="flex items-center justify-between">
            <span>VIP Colombo Airport Pickup</span>
            <span className="font-semibold text-[#082F24]">$40</span>
          </div>
        )}
        {discountAmount > 0 && (
          <div className="flex items-center justify-between text-emerald-700 font-semibold">
            <span>Promotional Savings</span>
            <span>-${discountAmount.toLocaleString()}</span>
          </div>
        )}
        <div className="flex items-center justify-between text-base font-bold text-[#082F24] pt-2 border-t border-stone-200">
          <span>Total Investment</span>
          <span className="font-serif text-2xl text-[#0D3B2E]">${finalTotal.toLocaleString()}</span>
        </div>
      </div>

      {/* Main Booking Action Buttons */}
      <div className="space-y-2.5">
        <button
          onClick={handleProceedBooking}
          className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-gradient-to-r from-[#C5A059] via-[#DFB76C] to-[#C5A059] text-[#082F24] font-bold text-base shadow-xl hover:shadow-2xl hover:shadow-[#C5A059]/30 transition-all transform hover:-translate-y-0.5"
        >
          <CreditCard className="w-5 h-5" />
          <span>Book Now • Instant Voucher</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => navigate(`/customize?tourId=${tour.id}`)}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#0D3B2E]/10 hover:bg-[#0D3B2E]/15 text-[#0D3B2E] font-bold text-xs transition-colors"
        >
          <Sparkles className="w-4 h-4 text-[#C5A059]" />
          <span>Customize Hotels, Route & Activities</span>
        </button>
      </div>

      {/* Trust Badges */}
      <div className="pt-2 border-t border-stone-100 space-y-2 text-[11px] text-stone-500">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#0D3B2E] shrink-0" />
          <span>100% Financial Protection & Refund Guarantee</span>
        </div>
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4 text-[#0D3B2E] shrink-0" />
          <span>Dedicated 24/7 Island Chauffeur & Support</span>
        </div>
      </div>

    </div>
  );
};
