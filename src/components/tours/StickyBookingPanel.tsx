import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calendar, 
  ShieldCheck, 
  ArrowRight, 
  Clock, 
  Car, 
  Users, 
  Briefcase,
  CheckCircle2
} from 'lucide-react';
import type { Tour } from '../../types';
import { vehiclePricingService } from '../../services/vehiclePricingService';
import type { TourVehicleOption } from '../../data/tourVehiclePricing';
import { formatPrice } from '../../utils/formatters';

interface StickyBookingPanelProps {
  tour: Tour;
  onBookNow: (bookingDetails: {
    startDate: string;
    adults: number;
    children: number;
    airportPickup: boolean;
    vehicleType: string;
    totalAmount: number;
  }) => void;
}

export const StickyBookingPanel: React.FC<StickyBookingPanelProps> = ({ tour, onBookNow }) => {
  const [startDate, setStartDate] = useState<string>('2026-10-15');
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);
  const [airportPickup] = useState<boolean>(true);
  
  // Selected Vehicle: strictly 'car' or 'van'
  const [selectedVehicleId, setSelectedVehicleId] = useState<'car' | 'van' | null>(null);

  // Managed Vehicle Options from vehiclePricingService (Admin single source of truth)
  const [vehicleOptions, setVehicleOptions] = useState<TourVehicleOption[]>(() => vehiclePricingService.getAllVehicleOptions());

  useEffect(() => {
    setVehicleOptions(vehiclePricingService.getAllVehicleOptions());
  }, []);

  const selectedVehicle: TourVehicleOption | null = useMemo(() => {
    if (!selectedVehicleId) return null;
    return vehicleOptions.find(v => v.id === selectedVehicleId) || null;
  }, [selectedVehicleId, vehicleOptions]);

  // Tour Price Formula = Managed Vehicle Daily Rate × Fixed Tour Duration
  const fixedDays = tour.durationDays;
  const pricing = useMemo(() => {
    if (!selectedVehicleId) return { totalLKR: 0, totalUSD: 0, dailyLKR: 0, dailyUSD: 0 };
    return vehiclePricingService.calculateTourPrice(selectedVehicleId, fixedDays);
  }, [selectedVehicleId, fixedDays, vehicleOptions]);

  const handleProceedBooking = () => {
    if (!selectedVehicle) {
      alert('Please select a vehicle (Car or Van) to proceed.');
      return;
    }

    const totalPax = adults + children;
    if (totalPax > selectedVehicle.capacityPassengers) {
      alert(`The selected ${selectedVehicle.categoryTitle} supports up to ${selectedVehicle.capacityPassengers} passengers. Please select a Van or adjust passenger count.`);
      return;
    }

    onBookNow({
      startDate,
      adults,
      children,
      airportPickup,
      vehicleType: `${selectedVehicle.categoryTitle} (${formatPrice(pricing.dailyLKR)}/day)`,
      totalAmount: pricing.totalLKR
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-7 shadow-[0_10px_30px_-10px_rgba(6,44,34,0.08)] space-y-6">
      
      {/* 1. Header with Fixed Tour Duration */}
      <div className="border-b border-stone-100 pb-4 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#176B52] uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#39A982]" />
            FIXED {fixedDays}-DAY ITINERARY
          </span>
          <span className="text-xs font-semibold text-[#0B3D2E] bg-[#DDEFE8] px-2.5 py-0.5 rounded-full">
            {tour.category}
          </span>
        </div>
        <h3 className="font-serif text-xl font-bold text-[#17231F] leading-snug">
          {tour.title}
        </h3>
      </div>

      {/* 2. Vehicle Selection (Strictly Car or Van from vehiclePricingService) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#17231F] uppercase tracking-wider flex items-center gap-1.5">
            <Car className="w-4 h-4 text-[#176B52]" />
            Select Chauffeured Vehicle
          </span>
          <span className="text-[11px] text-[#68736E]">2 Options</span>
        </div>

        <div className="space-y-2.5">
          {vehicleOptions.map((veh) => {
            const isSelected = selectedVehicleId === veh.id;
            const itemTotalLKR = veh.dailyPriceLKR * fixedDays;

            return (
              <div
                key={veh.id}
                onClick={() => setSelectedVehicleId(veh.id)}
                className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#DDEFE8]/60 border-[#0B3D2E] shadow-sm'
                    : 'bg-[#F8F7F2] border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={veh.image}
                      alt={veh.name}
                      className="w-14 h-11 rounded-xl object-cover border border-stone-200 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-serif font-bold text-[#17231F]">
                          {veh.id === 'car' ? '🚗' : '🚐'} {veh.categoryTitle}
                        </span>
                        <span className="text-[10px] font-bold bg-white text-[#176B52] px-2 py-0.5 rounded-md border border-stone-200">
                          {veh.badge}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#68736E] block">
                        {formatPrice(veh.dailyPriceLKR)}/day
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm font-serif font-bold text-[#0B3D2E] block">
                      {formatPrice(itemTotalLKR)}
                    </span>
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-stone-200/60 flex items-center justify-between text-[10px] text-stone-600">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-[#176B52]" />
                    Max {veh.capacityPassengers} Pax
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3 h-3 text-[#176B52]" />
                    {veh.capacityLuggage} Suitcases
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Tour Departure Date & Passengers */}
      <div className="space-y-3 pt-2 border-t border-stone-100">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-[#17231F] flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#176B52]" />
            Tour Start Date
          </label>
          <input
            type="date"
            required
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl p-2.5 text-xs font-medium text-[#17231F] focus:outline-none focus:ring-2 focus:ring-[#176B52]"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#17231F] block">Adults (Age 12+)</label>
            <input
              type="number"
              min="1"
              max="8"
              value={adults}
              onChange={(e) => setAdults(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl p-2 text-xs font-medium text-[#17231F] focus:ring-2 focus:ring-[#176B52]"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#17231F] block">Children (Age 2–11)</label>
            <input
              type="number"
              min="0"
              max="6"
              value={children}
              onChange={(e) => setChildren(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl p-2 text-xs font-medium text-[#17231F] focus:ring-2 focus:ring-[#176B52]"
            />
          </div>
        </div>
      </div>

      {/* 4. Live Tour Booking Summary & Total */}
      <div className="p-4 bg-[#0B3D2E] text-white rounded-2xl space-y-3">
        <div className="flex items-center justify-between border-b border-white/15 pb-2.5">
          <div>
            <span className="text-[10px] text-[#39A982] uppercase font-bold tracking-wider block">
              TOTAL TOUR PRICE
            </span>
            <span className="text-[11px] text-stone-200">
              {fixedDays} Days &bull; {selectedVehicle ? selectedVehicle.categoryTitle : 'Select Car/Van'}
            </span>
          </div>

          <div className="text-right">
            {selectedVehicle ? (
              <span className="font-serif text-2xl font-bold text-white block leading-tight">
                {formatPrice(pricing.totalLKR)}
              </span>
            ) : (
              <span className="text-xs font-medium text-stone-300">
                Select vehicle above
              </span>
            )}
          </div>
        </div>

        <div className="space-y-1 text-[11px] text-stone-200">
          <div className="flex justify-between">
            <span>Rate Calculation:</span>
            <span className="font-semibold text-white">
              {selectedVehicle ? `${formatPrice(pricing.dailyLKR)} × ${fixedDays} Days` : '—'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Chauffeur & Fuel:</span>
            <span className="font-semibold text-[#39A982]">Included 100%</span>
          </div>
          <div className="flex justify-between">
            <span>Airport Pickup (CMB):</span>
            <span className="font-semibold text-white">Included</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleProceedBooking}
          disabled={!selectedVehicle}
          className={`w-full py-3.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-md ${
            !selectedVehicle
              ? 'bg-stone-600 text-stone-300 cursor-not-allowed opacity-80'
              : 'bg-[#39A982] hover:bg-[#176B52] text-white hover:shadow-lg transform hover:-translate-y-0.5'
          }`}
        >
          {!selectedVehicle ? (
            <span>Please Select Car or Van to Book</span>
          ) : (
            <>
              <span>Book Tour &bull; {formatPrice(pricing.totalLKR)}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* Trust guarantees */}
      <div className="flex items-center justify-center gap-3 text-[11px] text-[#68736E] pt-1">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#176B52]" />
          Dedicated Chauffeur
        </span>
        <span>&bull;</span>
        <span className="flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#176B52]" />
          Fixed Itinerary
        </span>
      </div>

    </div>
  );
};
