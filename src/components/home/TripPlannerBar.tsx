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
    <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-[0_20px_50px_-15px_rgba(6,44,34,0.12)] border border-white/90 p-5 sm:p-7 text-[#17231F]">
      <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        
        {/* Destination Dropdown */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#17231F] flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#176B52]" />
            Destination
          </label>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full bg-[#F8F7F2]/90 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-[#17231F] focus:outline-none focus:ring-2 focus:ring-[#176B52] transition-colors"
          >
            <option value="All">All Sri Lanka (Islandwide)</option>
            {INITIAL_DESTINATIONS.map(d => (
              <option key={d.id} value={d.name}>{d.name}</option>
            ))}
          </select>
        </div>

        {/* Travel Duration */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#17231F] flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#176B52]" />
            Duration
          </label>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full bg-[#F8F7F2]/90 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-[#17231F] focus:outline-none focus:ring-2 focus:ring-[#176B52] transition-colors"
          >
            <option value="any">Any Duration</option>
            <option value="short">Short Getaway (1 - 5 Days)</option>
            <option value="medium">Classic Ceylon (6 - 9 Days)</option>
            <option value="long">Grand Discovery (10+ Days)</option>
          </select>
        </div>

        {/* Number of Travelers */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#17231F] flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#176B52]" />
            Travelers
          </label>
          <select
            value={travelers}
            onChange={(e) => setTravelers(Number(e.target.value))}
            className="w-full bg-[#F8F7F2]/90 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-[#17231F] focus:outline-none focus:ring-2 focus:ring-[#176B52] transition-colors"
          >
            <option value={1}>1 Solo Explorer</option>
            <option value={2}>2 Adults (Couple / Honeymoon)</option>
            <option value={4}>3 - 4 Travelers (Family)</option>
            <option value={8}>5+ Travelers (Private Group)</option>
          </select>
        </div>

        {/* Budget */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#17231F] flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-[#176B52]" />
            Tier & Style
          </label>
          <select
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full bg-[#F8F7F2]/90 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-[#17231F] focus:outline-none focus:ring-2 focus:ring-[#176B52] transition-colors"
          >
            <option value="any">All Styles</option>
            <option value="luxury">Luxury Stays ($1,200+)</option>
            <option value="mid">Boutique Comfort ($600 - $1,200)</option>
            <option value="budget">Classic Explorer (&lt; $600)</option>
          </select>
        </div>

        {/* Plan My Trip Button */}
        <div>
          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-[#0B3D2E] hover:bg-[#176B52] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs hover:shadow-md transition-all transform hover:-translate-y-0.5"
          >
            <Search className="w-4 h-4 text-[#DDEFE8]" />
            <span>Plan My Trip</span>
          </button>
        </div>

      </form>
    </div>
  );
};
