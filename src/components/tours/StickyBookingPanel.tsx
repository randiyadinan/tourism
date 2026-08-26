import React, { useState } from 'react';
import { 
  Calendar, 
  ShieldCheck, 
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

  // Price calculations
  const adultBaseTotal = adults * tour.pricePerPerson;
  const childBaseTotal = children * Math.round(tour.pricePerPerson * 0.65);
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
    <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-7 shadow-[0_10px_30px_-10px_rgba(6,44,34,0.08)] space-y-5">
      
      {/* Price Header */}
      <div className="flex items-baseline justify-between border-b border-stone-100 pb-4">
        <div>
          <span className="text-[11px] text-[#68736E] font-semibold block uppercase tracking-wider">Starting from</span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-serif text-3xl font-bold text-[#0B3D2E]">
              ${tour.pricePerPerson.toLocaleString()}
            </span>
            {tour.originalPrice && (
              <span className="text-xs text-stone-400 line-through">
                ${tour.originalPrice.toLocaleString()}
              </span>
            )}
            <span className="text-xs text-[#68736E]">/ person</span>
          </div>
        </div>

        <div className="text-right">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-[#DDEFE8] text-[#176B52]">
            <Clock className="w-3.5 h-3.5" />
            {tour.durationDays} Days
          </span>
        </div>
      </div>

      {/* Date & Travelers Inputs */}
      <div className="space-y-3.5">
        
        {/* Start Date */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-[#17231F] flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#176B52]" />
            Tour Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-[#17231F] focus:outline-none focus:ring-2 focus:ring-[#176B52]"
          />
        </div>

        {/* Travelers Pickers */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#17231F]">
              Adults (12+ yrs)
            </label>
            <select
              value={adults}
              onChange={(e) => setAdults(Number(e.target.value))}
              className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-[#17231F] focus:outline-none focus:ring-2 focus:ring-[#176B52]"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                <option key={num} value={num}>{num} Adult{num > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#17231F]">
              Children (2-11 yrs)
            </label>
            <select
              value={children}
              onChange={(e) => setChildren(Number(e.target.value))}
              className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-[#17231F] focus:outline-none focus:ring-2 focus:ring-[#176B52]"
            >
              {[0, 1, 2, 3, 4].map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'Child' : 'Children'}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Airport Transfer Toggle */}
        <label className="flex items-start gap-2.5 p-3 rounded-2xl border border-stone-200 bg-[#F8F7F2] cursor-pointer hover:border-[#176B52] transition-colors">
          <input
            type="checkbox"
            checked={airportPickup}
            onChange={(e) => setAirportPickup(e.target.checked)}
            className="rounded text-[#176B52] focus:ring-[#176B52] mt-0.5"
          />
          <div className="text-xs">
            <span className="font-semibold text-[#17231F] flex items-center gap-1">
              <Plane className="w-3.5 h-3.5 text-[#176B52]" />
              VIP Airport Pickup (+$40)
            </span>
            <span className="text-[#68736E] block text-[11px] mt-0.5">CMB Meet & Greet with private vehicle</span>
          </div>
        </label>

      </div>

      {/* Promo Code Form */}
      <form onSubmit={handleApplyPromo} className="space-y-1.5 pt-1">
        <div className="flex gap-2">
          <input
            type="text"
            value={promoCodeInput}
            onChange={(e) => setPromoCodeInput(e.target.value)}
            placeholder="Promo code (e.g. CEYLON10)"
            className="flex-1 bg-[#F8F7F2] border border-stone-300 rounded-xl px-3 py-2 text-xs font-medium text-[#17231F] uppercase placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#176B52]"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors"
          >
            Apply
          </button>
        </div>

        {appliedDiscount && (
          <div className="flex items-center justify-between text-xs text-emerald-800 bg-[#DDEFE8] px-3 py-1.5 rounded-xl border border-emerald-200">
            <span className="flex items-center gap-1 font-medium">
              <Percent className="w-3.5 h-3.5" />
              Promo "{appliedDiscount.code}" applied!
            </span>
            <span className="font-semibold">-${discountAmount}</span>
          </div>
        )}

        {promoError && (
          <span className="text-[11px] text-rose-600 block">{promoError}</span>
        )}
      </form>

      {/* Pricing Summary */}
      <div className="bg-[#F8F7F2] rounded-2xl p-4 space-y-2 text-xs border border-stone-200/70">
        <div className="flex justify-between text-[#68736E]">
          <span>{adults} Adult{adults > 1 ? 's' : ''} (${tour.pricePerPerson} ea)</span>
          <span className="font-semibold">${adultBaseTotal.toLocaleString()}</span>
        </div>

        {children > 0 && (
          <div className="flex justify-between text-[#68736E]">
            <span>{children} Child{children > 1 ? 'ren' : ''} (35% off)</span>
            <span className="font-semibold">${childBaseTotal.toLocaleString()}</span>
          </div>
        )}

        {airportPickup && (
          <div className="flex justify-between text-[#68736E]">
            <span>VIP Airport Transfer</span>
            <span className="font-semibold">+$40</span>
          </div>
        )}

        {discountAmount > 0 && (
          <div className="flex justify-between text-emerald-800 font-semibold">
            <span>Discount Savings</span>
            <span>-${discountAmount.toLocaleString()}</span>
          </div>
        )}

        <div className="flex justify-between text-sm font-bold text-[#17231F] pt-2 border-t border-stone-200">
          <span>Total (USD)</span>
          <span className="font-serif text-xl text-[#0B3D2E]">${finalTotal.toLocaleString()}</span>
        </div>
      </div>

      {/* Book Now Button */}
      <button
        onClick={handleProceedBooking}
        className="w-full py-3.5 px-4 rounded-2xl bg-[#0B3D2E] hover:bg-[#176B52] text-white font-semibold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 border border-white/20"
      >
        <span>Proceed to Secure Checkout</span>
        <ArrowRight className="w-4 h-4 text-[#DDEFE8]" />
      </button>

      {/* Guarantee Notice */}
      <div className="space-y-1.5 text-[11px] text-[#68736E] pt-1">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#176B52]" />
          <span>100% Secure 256-bit SSL encrypted booking</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CreditCard className="w-3.5 h-3.5 text-[#176B52]" />
          <span>PayHere verified Sri Lankan gateway checkout</span>
        </div>
      </div>

    </div>
  );
};
