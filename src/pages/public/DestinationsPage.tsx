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
    <div className="bg-[#F8F7F2] min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#176B52] border border-stone-200 text-xs font-semibold uppercase tracking-wider shadow-2xs">
            <MapPin className="w-3.5 h-3.5 text-[#39A982]" />
            <span>Discover Island Regions</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#17231F]">
            Destinations Across Sri Lanka
          </h1>
          <p className="text-sm sm:text-base text-[#68736E] leading-relaxed">
            From the UNESCO ancient rock fortress in Sigiriya and tea estates in Ella to the historic ramparts of Galle Fort and wildlife plains of Yala.
          </p>
        </div>

        {/* Filter Bar in Liquid Glass */}
        <div className="bg-white/85 backdrop-blur-xl p-4 sm:p-5 rounded-3xl border border-white/80 shadow-[0_4px_20px_-4px_rgba(6,44,34,0.06)] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search destinations (e.g. Sigiriya, Ella, Galle)..."
              className="w-full pl-9 pr-3.5 py-2.5 bg-[#F8F7F2] border border-stone-300 rounded-xl text-xs sm:text-sm font-medium text-[#17231F] focus:outline-none focus:ring-2 focus:ring-[#176B52]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {provinces.map((prov) => (
              <button
                key={prov}
                onClick={() => setSelectedProvince(prov)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedProvince === prov
                    ? 'bg-[#0B3D2E] text-white shadow-xs font-semibold'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {prov}
              </button>
            ))}
          </div>
        </div>

        {/* Destinations Grid */}
        {filtered.length === 0 ? (
          <EmptyState
            title="No Destinations Found"
            description="Try changing your search keywords or select 'All' provinces."
            actionText="View All Destinations"
            onAction={() => {
              setSearchQuery('');
              setSelectedProvince('All');
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filtered.map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
