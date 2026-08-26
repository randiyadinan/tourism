import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, DollarSign, Search } from 'lucide-react';
import { INITIAL_DESTINATIONS } from '../../data/destinations';

export const TripPlannerBar: React.FC = () => {
  const [destination, setDestination] = useState<string>('All');
  const [duration, setDuration] = useState<string>('any');
  const [travelers, setTravelers] = useState<number>(2);
  const [budget, setBudget] = useState<string>('any');

  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (destination !== 'All') params.append('destination', destination);
    if (duration !== 'any') {
      if (duration === 'short') { params.append('durationMax', '5'); }
      else if (duration === 'medium') { params.append('durationMin', '6'); params.append('durationMax', '9'); }
      else if (duration === 'long') { params.append('durationMin', '10'); }
    }
    if (budget !== 'any') {
      if (budget === 'luxury') params.append('priceMin', '1200');
      else if (budget === 'mid') { params.append('priceMin', '600'); params.append('priceMax', '1200'); }
      else if (budget === 'budget') params.append('priceMax', '600');
    }
    navigate(`/tours?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-stone-200/90 p-5 sm:p-6 text-[#193238]">
      <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        
        {/* Destination Dropdown */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#193238] flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#087F8C]" />
            Destination
          </label>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full bg-[#FFF9EF] border border-stone-300 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium text-[#193238] focus:outline-none focus:ring-2 focus:ring-[#087F8C] transition-colors"
          >
            <option value="All">All Sri Lanka (Islandwide)</option>
            {INITIAL_DESTINATIONS.map(d => (
              <option key={d.id} value={d.name}>{d.name}</option>
            ))}
          </select>
        </div>

        {/* Travel Dates / Duration */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#193238] flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#087F8C]" />
            Duration
          </label>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full bg-[#FFF9EF] border border-stone-300 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium text-[#193238] focus:outline-none focus:ring-2 focus:ring-[#087F8C] transition-colors"
          >
            <option value="any">Any Duration</option>
            <option value="short">Short Escape (1 - 5 Days)</option>
            <option value="medium">Classic Holiday (6 - 9 Days)</option>
            <option value="long">Grand Discovery (10+ Days)</option>
          </select>
        </div>

        {/* Number of Travelers */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#193238] flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#087F8C]" />
            Travelers
          </label>
          <select
            value={travelers}
            onChange={(e) => setTravelers(Number(e.target.value))}
            className="w-full bg-[#FFF9EF] border border-stone-300 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium text-[#193238] focus:outline-none focus:ring-2 focus:ring-[#087F8C] transition-colors"
          >
            <option value={1}>1 Solo Explorer</option>
            <option value={2}>2 Adults (Couple / Honeymoon)</option>
            <option value={4}>3 - 4 Travelers (Family)</option>
            <option value={8}>5+ Travelers (Friends Group)</option>
          </select>
        </div>

        {/* Budget */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#193238] flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-[#087F8C]" />
            Budget Tier
          </label>
          <select
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full bg-[#FFF9EF] border border-stone-300 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium text-[#193238] focus:outline-none focus:ring-2 focus:ring-[#087F8C] transition-colors"
          >
            <option value="any">All Budgets</option>
            <option value="luxury">Luxury Resorts ($1,200+)</option>
            <option value="mid">Boutique Comfort ($600 - $1,200)</option>
            <option value="budget">Tropical Discovery (&lt; $600)</option>
          </select>
        </div>

        {/* Plan My Trip Button */}
        <div>
          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-[#087F8C] hover:bg-[#075E67] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all hover:shadow-md"
          >
            <Search className="w-4 h-4 text-[#F3D6A4]" />
            <span>Plan My Trip</span>
          </button>
        </div>

      </form>
    </div>
  );
};
