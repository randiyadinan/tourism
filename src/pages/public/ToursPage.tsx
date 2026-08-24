import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Grid, 
  List, 
  SlidersHorizontal, 
  Sparkles,
  Compass
} from 'lucide-react';
import { tourService } from '../../services/tourService';
import type { TourFilterParams } from '../../services/tourService';
import { TourCard } from '../../components/tours/TourCard';
import { TourFilters } from '../../components/tours/TourFilters';
import { EmptyState } from '../../components/common/EmptyState';

export const ToursPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [layout, setLayout] = useState<'grid' | 'horizontal'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Initialize filter state from URL params
  const [filters, setFilters] = useState<TourFilterParams>(() => {
    return {
      category: (searchParams.get('category') as any) || 'All',
      destination: searchParams.get('destination') || 'All',
      durationMin: searchParams.get('durationMin') ? Number(searchParams.get('durationMin')) : undefined,
      durationMax: searchParams.get('durationMax') ? Number(searchParams.get('durationMax')) : undefined,
      priceMin: searchParams.get('priceMin') ? Number(searchParams.get('priceMin')) : undefined,
      priceMax: searchParams.get('priceMax') ? Number(searchParams.get('priceMax')) : undefined,
      searchQuery: searchParams.get('q') || '',
      sortBy: (searchParams.get('sortBy') as any) || 'popular'
    };
  });

  const filteredTours = useMemo(() => {
    return tourService.filterTours(filters);
  }, [filters]);

  const handleResetFilters = () => {
    setFilters({
      category: 'All',
      destination: 'All',
      searchQuery: '',
      sortBy: 'popular'
    });
    setSearchParams({});
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0D3B2E]/10 text-[#0D3B2E] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            Signature Collections
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#082F24]">
            Bespoke Sri Lankan Tours & Itineraries
          </h1>
          <p className="text-sm sm:text-base text-stone-600 max-w-3xl leading-relaxed">
            Every itinerary is private, chauffeured, and customized. Filter by destination, travel style, or duration, or adjust any tour to your exact preferences.
          </p>
        </div>

        {/* Search & Layout Control Bar */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filters.searchQuery || ''}
              onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
              placeholder="Search tours (e.g. Leopard, Train, Sigiriya)..."
              className="w-full pl-10 pr-4 py-2 bg-[#FAF8F5] border border-stone-300 rounded-xl text-xs font-medium text-[#082F24] focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
            />
          </div>

          {/* Right Controls (Sorting & Layout) */}
          <div className="flex items-center justify-between w-full md:w-auto gap-4">
            
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center gap-2 px-3 py-2 bg-stone-100 text-[#082F24] text-xs font-bold rounded-xl"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#C5A059]" />
              <span>Filters</span>
            </button>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-400 font-medium hidden sm:inline">Sort:</span>
              <select
                value={filters.sortBy || 'popular'}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                className="bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2 text-xs font-bold text-[#082F24] focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
              >
                <option value="popular">Most Popular & Featured</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="duration_asc">Duration: Short to Long</option>
                <option value="duration_desc">Duration: Long to Short</option>
              </select>
            </div>

            {/* Layout Switcher */}
            <div className="hidden sm:flex items-center bg-stone-100 p-1 rounded-xl">
              <button
                onClick={() => setLayout('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  layout === 'grid' ? 'bg-white text-[#0D3B2E] shadow-xs' : 'text-stone-400 hover:text-stone-700'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLayout('horizontal')}
                className={`p-1.5 rounded-lg transition-colors ${
                  layout === 'horizontal' ? 'bg-white text-[#0D3B2E] shadow-xs' : 'text-stone-400 hover:text-stone-700'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

        {/* Main Content Layout (Sidebar + Results) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Filters Sidebar */}
          <div className={`lg:col-span-4 xl:col-span-3 ${mobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
            <TourFilters
              filters={filters}
              onChange={setFilters}
              onReset={handleResetFilters}
            />
          </div>

          {/* Tours Grid / List */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-6">
            
            {/* Results Count Bar */}
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span>Showing <strong>{filteredTours.length}</strong> luxury tours in Sri Lanka</span>
              {filteredTours.length > 0 && (
                <span className="text-[#8C6D2B] font-semibold">100% Tailor-made & Private</span>
              )}
            </div>

            {/* Tours Container */}
            {filteredTours.length > 0 ? (
              <div className={layout === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-6'}>
                {filteredTours.map((tour) => (
                  <TourCard key={tour.id} tour={tour} layout={layout} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Compass}
                title="No Matching Tours Found"
                description="We couldn't find any tours matching your active filter criteria. Try resetting filters or build a custom route from scratch."
                actionText="Reset All Filters"
                onAction={handleResetFilters}
              />
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
