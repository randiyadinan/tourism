import React from 'react';
import { 
  Sparkles, 
  Calendar, 
  Plane, 
  Car, 
  Activity as ActivityIcon,
  ShieldCheck
} from 'lucide-react';
import type { CustomTripState } from '../../types';
import { INITIAL_ACTIVITIES } from '../../data/activities';

interface DynamicPriceReceiptProps {
  customTrip: CustomTripState;
  showDetails?: boolean;
  className?: string;
}

export interface CalculatedCost {
  daysCount: number;
  totalTravelers: number;
  baseTourPerDay: number;
  baseTourTotal: number;
  airportPickupCost: number;
  activitiesList: { title: string }[];
  vehicleCost: number;
  subtotal: number;
  discount: number;
  estimatedTotal: number;
}

export function calculateCustomTripCost(trip: CustomTripState): CalculatedCost {
  const d1 = new Date(trip.arrivalDate || '2026-11-01');
  const d2 = new Date(trip.departureDate || '2026-11-08');
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  const daysCount = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24))) || 7;

  const totalAdults = trip.adults || 2;
  const totalChildren = trip.children || 0;
  const totalTravelers = totalAdults + totalChildren + (trip.infants || 0);

  // Base day charge for route planning, private guiding, highway fees
  const baseTourPerDay = 55;
  const baseTourTotal = baseTourPerDay * daysCount * totalAdults + (baseTourPerDay * 0.6 * daysCount * totalChildren);

  // Airport transfer
  let airportPickupCost = 0;
  if (trip.airportTransferOption === 'pickup') {
    airportPickupCost = 40;
  } else if (trip.airportTransferOption === 'dropoff') {
    airportPickupCost = 40;
  } else if (trip.airportTransferOption === 'both') {
    airportPickupCost = 75;
  } else if (trip.airportTransferOption === 'none') {
    airportPickupCost = 0;
  } else if (trip.airportPickup) {
    airportPickupCost = 40;
  }

  // Selected activities (selection-only: no cost added to total)
  const activitiesList = trip.selectedActivities.map(actId => {
    const act = INITIAL_ACTIVITIES.find(a => a.id === actId);
    return {
      title: act?.title || 'Bespoke Experience'
    };
  });

  // Vehicle
  const vehicleDailyRates = {
    'Private Car': 65,
    'Private Van': 95,
    'Luxury SUV': 140,
    'Shared Transport': 35
  };
  const vehicleRate = vehicleDailyRates[trip.transportType] || 95;
  const vehicleCost = vehicleRate * daysCount;

  // Subtotal strictly consists of Base Tour + Airport Transfer + Transportation
  const subtotal = Math.round(baseTourTotal + airportPickupCost + vehicleCost);
  const discount = Math.round(subtotal * 0.05); // 5% custom itinerary package discount
  const estimatedTotal = subtotal - discount;

  return {
    daysCount,
    totalTravelers,
    baseTourPerDay,
    baseTourTotal: Math.round(baseTourTotal),
    airportPickupCost,
    activitiesList,
    vehicleCost,
    subtotal,
    discount,
    estimatedTotal
  };
}

export const DynamicPriceReceipt: React.FC<DynamicPriceReceiptProps> = ({ 
  customTrip, 
  showDetails = true,
  className = '' 
}) => {
  const cost = calculateCustomTripCost(customTrip);

  return (
    <div className={`bg-white rounded-3xl border border-stone-200 p-6 shadow-xl space-y-5 ${className}`}>
      
      {/* Header */}
      <div className="border-b border-stone-100 pb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#C5A059]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#8C6D2B]">
            Real-Time Quotation
          </span>
        </div>
        <h4 className="font-serif text-xl font-bold text-[#082F24] mt-1">
          {cost.daysCount}-Day Bespoke Journey
        </h4>
        <p className="text-xs text-stone-500">
          {customTrip.adults} Adults{customTrip.children > 0 ? `, ${customTrip.children} Children` : ''} • {customTrip.selectedDestinations.length} Destinations
        </p>
      </div>

      {/* Itemized Line Items */}
      {showDetails && (
        <div className="space-y-2.5 text-xs text-stone-600">
          
          <div className="flex items-center justify-between py-1 border-b border-stone-100">
            <span className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
              Base Chauffeur-Guide & Route ({cost.daysCount} Days)
            </span>
            <span className="font-bold text-[#082F24]">${cost.baseTourTotal.toLocaleString()}</span>
          </div>

          {cost.airportPickupCost > 0 && (
            <div className="flex items-center justify-between py-1 border-b border-stone-100">
              <span className="flex items-center gap-1.5 font-medium">
                <Plane className="w-3.5 h-3.5 text-[#C5A059]" />
                {customTrip.airportTransferOption === 'both'
                  ? 'Roundtrip Airport VIP Transfers'
                  : customTrip.airportTransferOption === 'dropoff'
                  ? 'Hotel to Airport Chauffeur Dropoff'
                  : 'VIP Airport Meet & Pickup'}
              </span>
              <span className="font-bold text-[#082F24]">${cost.airportPickupCost}</span>
            </div>
          )}

          <div className="flex items-center justify-between py-1 border-b border-stone-100">
            <span className="flex items-center gap-1.5 font-medium">
              <Car className="w-3.5 h-3.5 text-[#C5A059]" />
              Transportation ({customTrip.transportType})
            </span>
            <span className="font-bold text-[#082F24]">${cost.vehicleCost.toLocaleString()}</span>
          </div>

          {cost.activitiesList.length > 0 && (
            <div className="space-y-1 py-1 border-b border-stone-100">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-bold text-[#082F24]">
                  <ActivityIcon className="w-3.5 h-3.5 text-[#C5A059]" />
                  Included Activities ({cost.activitiesList.length})
                </span>
                <span className="text-[11px] font-semibold text-emerald-700">Selected</span>
              </div>
              <div className="pl-5 space-y-0.5 text-[11px] text-stone-500">
                {cost.activitiesList.map((a, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="truncate max-w-[200px]">✓ {a.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Package Savings */}
          <div className="flex items-center justify-between text-emerald-700 font-semibold pt-1">
            <span>Package Discount (5%)</span>
            <span>-${cost.discount.toLocaleString()}</span>
          </div>

        </div>
      )}

      {/* Grand Total */}
      <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-stone-200 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-wider font-bold text-[#8C6D2B] block">
            Estimated Total
          </span>
          <span className="text-xs text-stone-500">
            For {cost.totalTravelers} Traveler{cost.totalTravelers > 1 ? 's' : ''} ({cost.daysCount} Days)
          </span>
        </div>
        <span className="font-serif text-3xl font-bold text-[#0D3B2E]">
          ${cost.estimatedTotal.toLocaleString()}
        </span>
      </div>

      <div className="flex items-center gap-2 text-[11px] text-stone-500">
        <ShieldCheck className="w-4 h-4 text-[#0D3B2E] shrink-0" />
        <span>Price includes private vehicle, chauffeur guide, taxes, and route toll fees.</span>
      </div>

    </div>
  );
};
