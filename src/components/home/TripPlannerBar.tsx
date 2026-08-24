import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, DollarSign, Search, Sparkles } from 'lucide-react';
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
    <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-[#C5A059]/30 p-4 sm:p-6 text-stone-800">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-200/80">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#C5A059]" />
          <span className="font-serif font-bold text-sm sm:text-base text-[#082F24]">Quick Trip Planner</span>
        </div>
        <span className="text-xs text-stone-500 hidden sm:inline">Find your perfect bespoke Sri Lankan itinerary</span>
      </div>

      <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
        
        {/* Destination Dropdown */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
            Destination
          </label>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#082F24] focus:outline-none focus:ring-2 focus:ring-[#C5A059] transition-all"
          >
            <option value="All">All Sri Lanka (Islandwide)</option>
            {INITIAL_DESTINATIONS.map(d => (
              <option key={d.id} value={d.name}>{d.name} ({d.province})</option>
            ))}
          </select>
        </div>

        {/* Duration */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
            Duration
          </label>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#082F24] focus:outline-none focus:ring-2 focus:ring-[#C5A059] transition-all"
          >
            <option value="any">Any Duration</option>
            <option value="short">Short Getaway (1 - 5 Days)</option>
            <option value="medium">Classic Tour (6 - 9 Days)</option>
            <option value="long">Grand Explorer (10+ Days)</option>
          </select>
        </div>

        {/* Number of Travelers */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-[#C5A059]" />
            Travelers
          </label>
          <select
            value={travelers}
            onChange={(e) => setTravelers(Number(e.target.value))}
            className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#082F24] focus:outline-none focus:ring-2 focus:ring-[#C5A059] transition-all"
          >
            <option value={1}>1 Solo Traveler</option>
            <option value={2}>2 Adults (Couple)</option>
            <option value={4}>3 - 4 Travelers (Family)</option>
            <option value={8}>5 - 8+ Travelers (Group)</option>
          </select>
        </div>

        {/* Budget */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-[#C5A059]" />
            Budget Per Person
          </label>
          <select
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#082F24] focus:outline-none focus:ring-2 focus:ring-[#C5A059] transition-all"
          >
            <option value="any">Any Budget</option>
            <option value="budget">Comfort ($300 - $600)</option>
            <option value="mid">Premium ($600 - $1,200)</option>
            <option value="luxury">Ultra Luxury ($1,200+)</option>
          </select>
        </div>

        {/* Search CTA */}
        <div className="space-y-1 sm:col-span-2 lg:col-span-1 pt-1 sm:pt-4 lg:pt-5">
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-[#0D3B2E] hover:bg-[#134E3F] text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
          >
            <Search className="w-4 h-4 text-[#E5C378]" />
            <span>Search Tours</span>
          </button>
        </div>

      </form>
    </div>
  );
};
