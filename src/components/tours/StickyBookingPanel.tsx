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
    <div className="bg-white rounded-xl border border-stone-200/90 p-5 sm:p-6 shadow-md space-y-5">
      
      {/* Price Header */}
      <div className="flex items-baseline justify-between border-b border-stone-100 pb-4">
        <div>
          <span className="text-[11px] text-stone-400 font-semibold block uppercase tracking-wider">Price from</span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-[#12372A]">
              ${tour.pricePerPerson.toLocaleString()}
            </span>
            {tour.originalPrice && (
              <span className="text-xs text-stone-400 line-through">
                ${tour.originalPrice.toLocaleString()}
              </span>
            )}
            <span className="text-xs text-stone-500">/ person</span>
          </div>
        </div>

        <div className="text-right">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#1F6F54]/10 text-[#1F6F54]">
            <Clock className="w-3.5 h-3.5" />
            {tour.durationDays} Days
          </span>
        </div>
      </div>

      {/* Date & Travelers Inputs */}
      <div className="space-y-3.5">
        
        {/* Start Date */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-[#1F2933] flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#1F6F54]" />
            Tour Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full bg-[#FAF8F2] border border-stone-300 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium text-[#1F2933] focus:outline-none focus:ring-2 focus:ring-[#1F6F54]"
          />
        </div>

        {/* Travelers Pickers */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#1F2933]">
              Adults (12+ yrs)
            </label>
            <select
              value={adults}
              onChange={(e) => setAdults(Number(e.target.value))}
              className="w-full bg-[#FAF8F2] border border-stone-300 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium text-[#1F2933] focus:outline-none focus:ring-2 focus:ring-[#1F6F54]"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                <option key={num} value={num}>{num} Adult{num > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#1F2933]">
              Children (2-11 yrs)
            </label>
            <select
              value={children}
              onChange={(e) => setChildren(Number(e.target.value))}
              className="w-full bg-[#FAF8F2] border border-stone-300 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium text-[#1F2933] focus:outline-none focus:ring-2 focus:ring-[#1F6F54]"
            >
              {[0, 1, 2, 3, 4].map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'Child' : 'Children'}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Airport Transfer Toggle */}
        <label className="flex items-start gap-2.5 p-3 rounded-lg border border-stone-200 bg-[#FAF8F2] cursor-pointer hover:border-[#1F6F54] transition-colors">
          <input
            type="checkbox"
            checked={airportPickup}
            onChange={(e) => setAirportPickup(e.target.checked)}
            className="rounded text-[#1F6F54] focus:ring-[#1F6F54] mt-0.5"
          />
          <div className="text-xs">
            <span className="font-semibold text-[#1F2933] flex items-center gap-1">
              <Plane className="w-3.5 h-3.5 text-[#1F6F54]" />
              VIP Airport Pickup (+$40)
            </span>
            <span className="text-stone-500 block text-[11px] mt-0.5">CMB Meet & Greet with dedicated chauffeur</span>
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
            className="flex-1 bg-[#FAF8F2] border border-stone-300 rounded-lg px-3 py-1.5 text-xs font-medium text-[#1F2933] uppercase placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1F6F54]"
          />
          <button
            type="submit"
            className="px-3.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors"
          >
            Apply
          </button>
        </div>

        {appliedDiscount && (
          <div className="flex items-center justify-between text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
            <span className="flex items-center gap-1 font-medium">
              <Percent className="w-3 h-3" />
              Promo "{appliedDiscount.code}" applied!
            </span>
            <span className="font-semibold">-${discountAmount}</span>
          </div>
        )}

        {promoError && (
          <span className="text-[11px] text-rose-600 block">{promoError}</span>
        )}
      </form>

      {/* Pricing Calculation Summary */}
      <div className="bg-[#FAF8F2] rounded-lg p-3.5 space-y-2 text-xs border border-stone-200/70">
        <div className="flex justify-between text-stone-600">
          <span>{adults} Adult{adults > 1 ? 's' : ''} (${tour.pricePerPerson} ea)</span>
          <span className="font-semibold">${adultBaseTotal.toLocaleString()}</span>
        </div>

        {children > 0 && (
          <div className="flex justify-between text-stone-600">
            <span>{children} Child{children > 1 ? 'ren' : ''} (35% off)</span>
            <span className="font-semibold">${childBaseTotal.toLocaleString()}</span>
          </div>
        )}

        {airportPickup && (
          <div className="flex justify-between text-stone-600">
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

        <div className="flex justify-between text-sm font-bold text-[#12372A] pt-2 border-t border-stone-200">
          <span>Total (USD)</span>
          <span className="font-serif text-lg">${finalTotal.toLocaleString()}</span>
        </div>
      </div>

      {/* Book Now Button */}
      <button
        onClick={handleProceedBooking}
        className="w-full py-3 px-4 rounded-lg bg-[#12372A] hover:bg-[#1F6F54] text-white font-semibold text-sm transition-all shadow-xs flex items-center justify-center gap-2"
      >
        <span>Proceed to Secure Checkout</span>
        <ArrowRight className="w-4 h-4" />
      </button>

      {/* Guarantee Notice */}
      <div className="space-y-1.5 text-[11px] text-stone-500 pt-1">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#1F6F54]" />
          <span>100% Secure 256-bit SSL encrypted booking</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CreditCard className="w-3.5 h-3.5 text-[#1F6F54]" />
          <span>PayHere verified Sri Lankan gateway checkout</span>
        </div>
      </div>

    </div>
  );
};
