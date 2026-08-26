import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Grid, 
  List, 
  SlidersHorizontal,
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
    <div className="bg-[#F8F7F2] min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#176B52] border border-stone-200 text-xs font-semibold uppercase tracking-wider shadow-2xs">
            <Compass className="w-3.5 h-3.5 text-[#39A982]" />
            <span>Curated Ceylon Itineraries</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#17231F]">
            Sri Lanka Tours & Journeys
          </h1>
          <p className="text-sm sm:text-base text-[#68736E] max-w-2xl leading-relaxed">
            Private, chauffeured multi-day journeys designed for couples, families, and boutique travel lovers. All tours can be tailored to your preferred pace.
          </p>
        </div>

        {/* Search & Layout Control Bar in Liquid Glass */}
        <div className="bg-white/85 backdrop-blur-xl p-4 sm:p-5 rounded-3xl border border-white/80 shadow-[0_4px_20px_-4px_rgba(6,44,34,0.06)] flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filters.searchQuery || ''}
              onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
              placeholder="Search tours (e.g. Leopard, Train, Sigiriya)..."
              className="w-full pl-9 pr-3.5 py-2.5 bg-[#F8F7F2] border border-stone-300 rounded-xl text-xs sm:text-sm font-medium text-[#17231F] focus:outline-none focus:ring-2 focus:ring-[#176B52]"
            />
          </div>

          {/* Right Controls (Sorting & Layout) */}
          <div className="flex items-center justify-between w-full md:w-auto gap-3">
            
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center gap-1.5 px-3.5 py-2 bg-stone-100 text-[#17231F] text-xs font-semibold rounded-xl"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#176B52]" />
              <span>Filters</span>
            </button>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#68736E] font-medium hidden sm:inline">Sort:</span>
              <select
                value={filters.sortBy || 'popular'}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                className="bg-[#F8F7F2] border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold text-[#17231F] focus:outline-none focus:ring-2 focus:ring-[#176B52]"
              >
                <option value="popular">Most Popular</option>
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
                  layout === 'grid' ? 'bg-white text-[#176B52] shadow-xs font-bold' : 'text-stone-400 hover:text-stone-700'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLayout('horizontal')}
                className={`p-1.5 rounded-lg transition-colors ${
                  layout === 'horizontal' ? 'bg-white text-[#176B52] shadow-xs font-bold' : 'text-stone-400 hover:text-stone-700'
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
          
          {/* Sidebar Desktop Filters */}
          <div className="hidden lg:block lg:col-span-3 sticky top-24">
            <TourFilters
              filters={filters}
              onChange={setFilters}
              onReset={handleResetFilters}
            />
          </div>

          {/* Mobile Filter Drawer */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 lg:hidden">
              <div className="bg-white rounded-3xl p-6 max-w-md w-full max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl">
                <TourFilters
                  filters={filters}
                  onChange={(newFilters) => {
                    setFilters(newFilters);
                    setMobileFilterOpen(false);
                  }}
                  onReset={() => {
                    handleResetFilters();
                    setMobileFilterOpen(false);
                  }}
                />
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full py-3 bg-[#0B3D2E] text-white font-semibold text-xs rounded-xl"
                >
                  Apply & Close
                </button>
              </div>
            </div>
          )}

          {/* Results Grid */}
          <div className="lg:col-span-9 space-y-6">
            <div className="flex items-center justify-between text-xs text-[#68736E] font-medium">
              <span>Showing {filteredTours.length} Signature Tours</span>
            </div>

            {filteredTours.length === 0 ? (
              <EmptyState
                title="No Tours Match Your Criteria"
                description="Try adjusting your budget or destination filters, or design a bespoke itinerary from scratch."
                actionText="Reset All Filters"
                onAction={handleResetFilters}
              />
            ) : (
              <div className={
                layout === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' 
                  : 'space-y-6'
              }>
                {filteredTours.map((tour) => (
                  <TourCard
                    key={tour.id}
                    tour={tour}
                    layout={layout}
                  />
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
