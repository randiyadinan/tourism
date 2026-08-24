import React from 'react';
import { 
  Calendar, 
  Plane, 
  Car, 
  Plus, 
  Minus, 
  Clock
} from 'lucide-react';
import type { CustomTripState } from '../../types';
import { INITIAL_DESTINATIONS } from '../../data/destinations';
import { INITIAL_ACTIVITIES } from '../../data/activities';

interface WizardStepProps {
  tripState: CustomTripState;
  onChange: (updates: Partial<CustomTripState>) => void;
}

// STEP 1: DATES
export const Step1Dates: React.FC<WizardStepProps> = ({ tripState, onChange }) => {
  const d1 = new Date(tripState.arrivalDate || '2026-11-01');
  const d2 = new Date(tripState.departureDate || '2026-11-08');
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  const daysCount = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 7;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-serif text-2xl font-bold text-[#082F24]">When are you planning to visit Sri Lanka?</h3>
        <p className="text-sm text-stone-600">Select your intended arrival and departure dates. You can adjust these later.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#082F24] uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#C5A059]" />
            Arrival Date in Sri Lanka
          </label>
          <input
            type="date"
            value={tripState.arrivalDate}
            onChange={(e) => onChange({ arrivalDate: e.target.value })}
            className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-4 py-3 text-sm font-semibold text-[#082F24] focus:ring-2 focus:ring-[#C5A059] focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-[#082F24] uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#C5A059]" />
            Departure Date from Sri Lanka
          </label>
          <input
            type="date"
            value={tripState.departureDate}
            onChange={(e) => onChange({ departureDate: e.target.value })}
            className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-4 py-3 text-sm font-semibold text-[#082F24] focus:ring-2 focus:ring-[#C5A059] focus:outline-none"
          />
        </div>
      </div>

      {/* Duration Highlight Box */}
      <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#C5A059]/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0D3B2E] text-[#E5C378] flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="font-serif font-bold text-[#082F24] text-base">Trip Duration: {daysCount} Days / {daysCount - 1} Nights</p>
            <p className="text-xs text-stone-500">Suggested destination coverage: {Math.min(6, Math.max(2, Math.floor(daysCount / 2)))} regions</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
          Optimal Pace
        </span>
      </div>
    </div>
  );
};

// STEP 2: TRAVELERS
export const Step2Travelers: React.FC<WizardStepProps> = ({ tripState, onChange }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-serif text-2xl font-bold text-[#082F24]">Who is traveling on this journey?</h3>
        <p className="text-sm text-stone-600">We size vehicle capacity and chauffeur arrangements based on your party.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Adults */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h4 className="font-serif text-lg font-bold text-[#082F24]">Adults</h4>
            <p className="text-xs text-stone-500">Ages 12 and above</p>
          </div>
          <div className="flex items-center justify-between bg-[#FAF8F5] p-2 rounded-xl border border-stone-300">
            <button
              onClick={() => onChange({ adults: Math.max(1, tripState.adults - 1) })}
              className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center text-stone-700 hover:bg-stone-100 font-bold"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-serif text-2xl font-bold text-[#082F24]">{tripState.adults}</span>
            <button
              onClick={() => onChange({ adults: tripState.adults + 1 })}
              className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center text-stone-700 hover:bg-stone-100 font-bold"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Children */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h4 className="font-serif text-lg font-bold text-[#082F24]">Children</h4>
            <p className="text-xs text-stone-500">Ages 2 to 11 (Reduced Rate)</p>
          </div>
          <div className="flex items-center justify-between bg-[#FAF8F5] p-2 rounded-xl border border-stone-300">
            <button
              onClick={() => onChange({ children: Math.max(0, tripState.children - 1) })}
              className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center text-stone-700 hover:bg-stone-100 font-bold"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-serif text-2xl font-bold text-[#082F24]">{tripState.children}</span>
            <button
              onClick={() => onChange({ children: tripState.children + 1 })}
              className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center text-stone-700 hover:bg-stone-100 font-bold"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Infants */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h4 className="font-serif text-lg font-bold text-[#082F24]">Infants</h4>
            <p className="text-xs text-stone-500">Under 2 years (Complimentary)</p>
          </div>
          <div className="flex items-center justify-between bg-[#FAF8F5] p-2 rounded-xl border border-stone-300">
            <button
              onClick={() => onChange({ infants: Math.max(0, tripState.infants - 1) })}
              className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center text-stone-700 hover:bg-stone-100 font-bold"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-serif text-2xl font-bold text-[#082F24]">{tripState.infants}</span>
            <button
              onClick={() => onChange({ infants: tripState.infants + 1 })}
              className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center text-stone-700 hover:bg-stone-100 font-bold"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

// STEP 3: ARRIVAL & AIRPORT TRANSFERS
export const Step3Arrival: React.FC<WizardStepProps> = ({ tripState, onChange }) => {
  const transferOptions = [
    {
      id: 'both' as const,
      title: 'Roundtrip Airport VIP Transfers',
      desc: 'Arrival VIP Chauffeur meet & greeting + Departure hotel-to-airport dropoff.',
      price: '+$75 (Best Value)',
      popular: true
    },
    {
      id: 'pickup' as const,
      title: 'Arrival Pickup Only',
      desc: 'Dedicated chauffeur meets you at Arrivals with personalized name signboard & garlands.',
      price: '+$40'
    },
    {
      id: 'dropoff' as const,
      title: 'Departure Dropoff Only',
      desc: 'Chauffeur picks you up from your hotel and transfers smoothly to the airport terminal.',
      price: '+$40'
    },
    {
      id: 'none' as const,
      title: 'No Airport Transfer Needed',
      desc: 'You will arrange your own airport transfers independently.',
      price: '$0'
    }
  ];

  const currentOption = tripState.airportTransferOption || (tripState.airportPickup ? 'pickup' : 'none');

  const handleSelectOption = (option: 'none' | 'pickup' | 'dropoff' | 'both') => {
    onChange({
      airportTransferOption: option,
      airportPickup: option === 'pickup' || option === 'both',
      airportTransferDetails: {
        airport: tripState.airport || 'Bandaranaike Intl Airport (CMB) - Colombo',
        flightNumber: tripState.flightNumber,
        arrivalTime: tripState.arrivalTime,
        passengers: tripState.adults + tripState.children,
        priceUSD: option === 'both' ? 75 : option === 'pickup' || option === 'dropoff' ? 40 : 0
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-serif text-2xl font-bold text-[#082F24]">Airport Transfers & Arrival Details</h3>
        <p className="text-sm text-stone-600">Choose your VIP airport chauffeur transfer options and flight timing.</p>
      </div>

      {/* Transfer Option Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {transferOptions.map((opt) => {
          const isSelected = currentOption === opt.id;
          return (
            <div
              key={opt.id}
              onClick={() => handleSelectOption(opt.id)}
              className={`cursor-pointer rounded-2xl border p-4 transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'border-[#0D3B2E] bg-[#0D3B2E]/5 ring-2 ring-[#C5A059]'
                  : 'border-stone-200 bg-white hover:border-stone-300 shadow-sm'
              }`}
            >
              {('popular' in opt && opt.popular) && (
                <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#C5A059] text-[#082F24]">
                  Save $5
                </span>
              )}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Plane className="w-5 h-5 text-[#0D3B2E]" />
                  <h4 className="font-serif font-bold text-base text-[#082F24]">{opt.title}</h4>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">{opt.desc}</p>
              </div>

              <div className="pt-3 mt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="font-bold text-[#082F24]">{opt.price}</span>
                <span className={`font-bold px-2 py-0.5 rounded-md ${
                  isSelected ? 'bg-[#0D3B2E] text-white' : 'bg-stone-100 text-stone-700'
                }`}>
                  {isSelected ? '✓ Selected' : 'Select'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Flight & Airport Details */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
        <h4 className="font-serif font-bold text-base text-[#082F24] flex items-center gap-2">
          <Plane className="w-4 h-4 text-[#C5A059]" />
          Flight & Arrival Information
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-600">Airport in Sri Lanka</label>
            <select
              value={tripState.airport}
              onChange={(e) => onChange({ 
                airport: e.target.value,
                airportTransferDetails: {
                  ...tripState.airportTransferDetails,
                  airport: e.target.value
                }
              })}
              className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#082F24]"
            >
              <option value="Bandaranaike Intl Airport (CMB) - Colombo">Bandaranaike Intl Airport (CMB - Colombo)</option>
              <option value="Mattala Rajapaksa Intl Airport (HRI) - Hambantota">Mattala Rajapaksa Intl (HRI - Hambantota)</option>
              <option value="Jaffna Intl Airport (JAF)">Jaffna Intl Airport (JAF)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-600">Inbound Flight Number (If known)</label>
            <input
              type="text"
              value={tripState.flightNumber}
              onChange={(e) => onChange({ 
                flightNumber: e.target.value,
                airportTransferDetails: {
                  ...tripState.airportTransferDetails,
                  airport: tripState.airport,
                  flightNumber: e.target.value
                }
              })}
              placeholder="e.g. UL 504 / QR 668 / EK 650 / BA 2042"
              className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2.5 text-sm text-[#082F24]"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-stone-600">Estimated Arrival / Land Time</label>
          <input
            type="time"
            value={tripState.arrivalTime}
            onChange={(e) => onChange({ 
              arrivalTime: e.target.value,
              airportTransferDetails: {
                ...tripState.airportTransferDetails,
                airport: tripState.airport,
                arrivalTime: e.target.value
              }
            })}
            className="w-full sm:w-1/2 bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2.5 text-sm text-[#082F24]"
          />
        </div>
      </div>
    </div>
  );
};

// STEP 4: DESTINATIONS
export const Step4Destinations: React.FC<WizardStepProps> = ({ tripState, onChange }) => {
  const toggleDest = (id: string) => {
    const list = [...tripState.selectedDestinations];
    const idx = list.indexOf(id);
    if (idx !== -1) {
      list.splice(idx, 1);
    } else {
      list.push(id);
    }
    onChange({ selectedDestinations: list });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-serif text-2xl font-bold text-[#082F24]">Select Destinations to Visit</h3>
        <p className="text-sm text-stone-600">Click to add or remove Sri Lankan regions from your route.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {INITIAL_DESTINATIONS.map((dest) => {
          const isSelected = tripState.selectedDestinations.includes(dest.id);
          return (
            <div
              key={dest.id}
              onClick={() => toggleDest(dest.id)}
              className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'border-[#0D3B2E] bg-[#0D3B2E]/5 ring-2 ring-[#C5A059]'
                  : 'border-stone-200 bg-white hover:border-stone-300 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={dest.heroImage}
                  alt={dest.name}
                  className="w-14 h-14 rounded-xl object-cover"
                />
                <div>
                  <h4 className="font-serif font-bold text-[#082F24] text-base">{dest.name}</h4>
                  <p className="text-[11px] text-stone-500">{dest.province}</p>
                </div>
              </div>

              <p className="text-xs text-stone-600 line-clamp-2">{dest.shortDescription}</p>

              <div className="pt-3 mt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-stone-500">{dest.recommendedDuration}</span>
                <span className={`font-bold px-2 py-0.5 rounded-md ${
                  isSelected ? 'bg-[#0D3B2E] text-white' : 'bg-stone-100 text-stone-700'
                }`}>
                  {isSelected ? '✓ Added' : '+ Add'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// STEP 5: ACTIVITIES (NO PRICES IN CUSTOMER UI)
export const Step5Activities: React.FC<WizardStepProps> = ({ tripState, onChange }) => {
  const toggleActivity = (id: string) => {
    const list = [...tripState.selectedActivities];
    const idx = list.indexOf(id);
    if (idx !== -1) {
      list.splice(idx, 1);
    } else {
      list.push(id);
    }
    onChange({ selectedActivities: list });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-serif text-2xl font-bold text-[#082F24]">Select Activities & Experiences</h3>
        <p className="text-sm text-stone-600">Choose the activities and excursions you wish to include in your personalized route.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {INITIAL_ACTIVITIES.map((act) => {
          const isSelected = tripState.selectedActivities.includes(act.id);
          return (
            <div
              key={act.id}
              onClick={() => toggleActivity(act.id)}
              className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'border-[#0D3B2E] bg-[#0D3B2E]/5 ring-2 ring-[#C5A059]'
                  : 'border-stone-200 bg-white hover:border-stone-300 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={act.image}
                  alt={act.title}
                  className="w-14 h-14 rounded-xl object-cover"
                />
                <div>
                  <h4 className="font-serif font-bold text-[#082F24] text-sm line-clamp-1">{act.title}</h4>
                  <p className="text-[11px] text-[#8C6D2B] font-semibold">{act.destination}</p>
                </div>
              </div>

              <p className="text-xs text-stone-600 line-clamp-2">{act.shortDescription}</p>

              <div className="pt-3 mt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-stone-500 font-medium">{act.duration}</span>
                <span className={`font-bold px-2.5 py-1 rounded-md transition-colors ${
                  isSelected ? 'bg-[#0D3B2E] text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}>
                  {isSelected ? '✓ Selected' : '☐ Select'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// STEP 6: TRANSPORTATION
export const Step6Transport: React.FC<WizardStepProps> = ({ tripState, onChange }) => {
  const options = [
    {
      type: 'Private Car',
      title: 'Toyota Executive Sedan',
      desc: 'Ideal for 1 - 3 travelers with moderate luggage. Climate control, bottled water & Wi-Fi.',
      rate: '$65 / day'
    },
    {
      type: 'Private Van',
      title: 'Toyota KDH High-Roof Luxury Van',
      desc: 'Top choice for 3 - 6 travelers. Reclining velvet seats, panoramic windows & large luggage space.',
      rate: '$95 / day',
      popular: true
    },
    {
      type: 'Luxury SUV',
      title: 'Toyota Land Cruiser Prado 4x4',
      desc: 'Leather interior, premium sound system, all-terrain luxury for demanding travelers.',
      rate: '$140 / day'
    },
    {
      type: 'Shared Transport',
      title: 'Air-Conditioned Shared Coach / Train',
      desc: 'Cost-conscious option for budget explorers with express intercity connections.',
      rate: '$35 / day'
    }
  ] as const;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-serif text-2xl font-bold text-[#082F24]">Select Chauffeur & Vehicle Type</h3>
        <p className="text-sm text-stone-600">All private vehicles include dedicated English-speaking tourist-board chauffeur.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {options.map((opt) => {
          const isSelected = tripState.transportType === opt.type;
          return (
            <div
              key={opt.type}
              onClick={() => onChange({ transportType: opt.type })}
              className={`cursor-pointer rounded-2xl border p-5 transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'border-[#0D3B2E] bg-[#0D3B2E]/5 ring-2 ring-[#C5A059]'
                  : 'border-stone-200 bg-white hover:border-stone-300 shadow-sm'
              }`}
            >
              {('popular' in opt && opt.popular) && (
                <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#C5A059] text-[#082F24]">
                  Most Popular
                </span>
              )}
              <div className="space-y-2">
                <Car className="w-6 h-6 text-[#0D3B2E]" />
                <h4 className="font-serif font-bold text-lg text-[#082F24]">{opt.title}</h4>
                <p className="text-xs text-stone-600 leading-relaxed">{opt.desc}</p>
              </div>
              <div className="pt-4 mt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="font-bold text-sm text-[#082F24]">{opt.rate}</span>
                <span className={`text-xs font-bold ${isSelected ? 'text-[#0D3B2E]' : 'text-stone-400'}`}>
                  {isSelected ? '✓ Selected' : 'Select'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// STEP 7: REVIEW SUMMARY
export const Step7Review: React.FC<WizardStepProps> = ({ tripState }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-serif text-2xl font-bold text-[#082F24]">Review Your Custom Sri Lankan Route</h3>
        <p className="text-sm text-stone-600">Please review all parameters before entering traveler details.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4 text-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-stone-100">
          <div>
            <span className="text-xs text-stone-400 font-semibold block">Travel Dates</span>
            <span className="font-bold text-[#082F24]">{tripState.arrivalDate} to {tripState.departureDate}</span>
          </div>
          <div>
            <span className="text-xs text-stone-400 font-semibold block">Party Size</span>
            <span className="font-bold text-[#082F24]">{tripState.adults} Adults{tripState.children > 0 ? `, ${tripState.children} Children` : ''}{tripState.infants > 0 ? `, ${tripState.infants} Infants` : ''}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-stone-100">
          <div>
            <span className="text-xs text-stone-400 font-semibold block">Airport Transfer</span>
            <span className="font-bold text-[#082F24]">
              {tripState.airportTransferOption === 'both' 
                ? 'Roundtrip Airport VIP Transfers'
                : tripState.airportTransferOption === 'dropoff'
                ? 'Departure Airport Dropoff'
                : tripState.airportTransferOption === 'pickup' || tripState.airportPickup
                ? 'Arrival Airport Pickup'
                : 'No Transfer Needed'}
            </span>
          </div>
          <div>
            <span className="text-xs text-stone-400 font-semibold block">Transportation</span>
            <span className="font-bold text-[#082F24]">{tripState.transportType}</span>
          </div>
        </div>

        <div>
          <span className="text-xs text-stone-400 font-semibold block mb-2">Destinations Included ({tripState.selectedDestinations.length})</span>
          <div className="flex flex-wrap gap-2">
            {tripState.selectedDestinations.map(dId => {
              const dest = INITIAL_DESTINATIONS.find(d => d.id === dId);
              return (
                <span key={dId} className="px-3 py-1 bg-[#0D3B2E]/10 text-[#0D3B2E] font-bold text-xs rounded-full">
                  {dest?.name || dId}
                </span>
              );
            })}
          </div>
        </div>

        {tripState.selectedActivities.length > 0 && (
          <div className="pt-2">
            <span className="text-xs text-stone-400 font-semibold block mb-2">Selected Activities ({tripState.selectedActivities.length})</span>
            <div className="flex flex-wrap gap-2">
              {tripState.selectedActivities.map(aId => {
                const act = INITIAL_ACTIVITIES.find(a => a.id === aId);
                return (
                  <span key={aId} className="px-3 py-1 bg-[#C5A059]/20 text-[#8C6D2B] font-bold text-xs rounded-full">
                    ✓ {act?.title || aId}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
