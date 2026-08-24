import React, { useState, useMemo } from 'react';
import { Search, MapPin } from 'lucide-react';
import { destinationService } from '../../services/destinationService';
import { DestinationCard } from '../../components/destinations/DestinationCard';
import { EmptyState } from '../../components/common/EmptyState';

export const DestinationsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('All');

  const destinations = destinationService.getAllDestinations();

  const provinces = ['All', 'Central Province', 'Southern Province', 'Western Province', 'Uva Province', 'Eastern Province', 'Northern Province'];

  const filtered = useMemo(() => {
    return destinations.filter(d => {
      const matchesQuery = !searchQuery || 
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesProvince = selectedProvince === 'All' || d.province === selectedProvince;
      return matchesQuery && matchesProvince;
    });
  }, [destinations, searchQuery, selectedProvince]);

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0D3B2E]/10 text-[#0D3B2E] text-xs font-bold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
            Sri Lanka Regions
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#082F24]">
            Discover Sri Lanka’s Diverse Terrains
          </h1>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            From the misty high tea country of Nuwara Eliya and sacred tooth relics of Kandy to the untouched coral reefs of Trincomalee and wildlife kingdoms of Yala.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search destinations (e.g. Sigiriya, Ella, Galle)..."
              className="w-full pl-10 pr-4 py-2 bg-[#FAF8F5] border border-stone-300 rounded-xl text-xs font-medium text-[#082F24] focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {provinces.map((prov) => (
              <button
                key={prov}
                onClick={() => setSelectedProvince(prov)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedProvince === prov
                    ? 'bg-[#0D3B2E] text-white shadow-sm'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {prov}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={MapPin}
            title="No Destinations Found"
            description="We couldn't find any destinations matching your search. Please try a different query."
            actionText="Clear Search"
            onAction={() => { setSearchQuery(''); setSelectedProvince('All'); }}
          />
        )}

      </div>
    </div>
  );
};
