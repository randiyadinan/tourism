import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Compass, 
  Clock, 
  Star, 
  ArrowRight
} from 'lucide-react';
import { tourService } from '../../services/tourService';

export const ToursPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const allTours = useMemo(() => {
    return tourService.getAllTours();
  }, []);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(allTours.map(t => t.category)));
    return ['All', ...cats];
  }, [allTours]);

  const filteredTours = useMemo(() => {
    return allTours.filter(tour => {
      const matchesCat = selectedCategory === 'All' || tour.category === selectedCategory;
      const matchesSearch = !searchQuery ||
        tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tour.destinations.some(d => d.toLowerCase().includes(searchQuery.toLowerCase())) ||
        tour.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [allTours, selectedCategory, searchQuery]);

  return (
    <div className="bg-[#F8F7F2] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Page Top Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white text-[#176B52] border border-stone-200 text-xs font-semibold uppercase tracking-wider shadow-2xs">
            <Compass className="w-3.5 h-3.5 text-[#39A982]" />
            <span>HANDCRAFTED MULTI-DAY ITINERARIES</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#17231F]">
            Sri Lanka Private Chauffeured Tours
          </h1>
          <p className="text-sm sm:text-base text-[#68736E] leading-relaxed">
            Choose from our curated multi-day tours with fixed day-by-day itineraries and destination photos. Select Car or Van inside any tour to view daily rates and instant pricing.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tours or destinations..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#F8F7F2] border border-stone-300 rounded-xl text-xs font-medium text-[#17231F] focus:outline-none focus:ring-2 focus:ring-[#176B52]"
            />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#0B3D2E] text-white shadow-xs'
                    : 'bg-stone-100 text-[#68736E] hover:bg-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Tours Grid (No vehicle prices on cards, each navigates to /tours/:slug) */}
        {filteredTours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTours.map((tour) => (
              <div 
                key={tour.id}
                className="group bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-[0_4px_20px_-4px_rgba(6,44,34,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(6,44,34,0.12)] transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-1"
              >
                <div>
                  {/* Tour Image */}
                  <div className="relative h-60 overflow-hidden">
                    <img
                      src={tour.heroImage}
                      alt={tour.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute top-3.5 left-3.5 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                      <Clock className="w-3.5 h-3.5 text-[#39A982]" />
                      <span>{tour.durationDays} Days / {tour.durationNights} Nights</span>
                    </div>
                    <div className="absolute top-3.5 right-3.5 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[#0B3D2E] text-xs font-bold shadow-xs">
                      {tour.category}
                    </div>
                  </div>

                  {/* Tour Details */}
                  <div className="p-6 sm:p-7 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#176B52] uppercase tracking-wider text-[10px]">
                        Fixed {tour.durationDays}-Day Route
                      </span>
                      <div className="flex items-center gap-1 font-semibold text-[#17231F]">
                        <Star className="w-3.5 h-3.5 fill-[#39A982] text-[#39A982]" />
                        <span>{tour.rating.toFixed(1)}</span>
                        <span className="text-[#68736E] font-normal">({tour.reviewCount})</span>
                      </div>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-[#17231F] group-hover:text-[#176B52] transition-colors leading-snug">
                      {tour.title}
                    </h3>
                    <p className="text-xs text-[#176B52] font-semibold">{tour.subtitle}</p>
                    <p className="text-xs text-[#68736E] line-clamp-2 leading-relaxed">{tour.overview}</p>

                    {/* Destinations List */}
                    <div className="space-y-1.5 pt-2 border-t border-stone-100">
                      <span className="text-[10px] font-bold text-[#68736E] uppercase tracking-wider block">
                        Destinations Covered
                      </span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {tour.destinations.slice(0, 4).map((dest, i) => (
                          <span key={i} className="text-[11px] bg-[#F8F7F2] text-[#0B3D2E] px-2.5 py-0.5 rounded-md font-medium border border-stone-200">
                            {dest}
                          </span>
                        ))}
                        {tour.destinations.length > 4 && (
                          <span className="text-[10px] text-stone-500 font-semibold">
                            +{tour.destinations.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Button: View Tour -> /tours/:slug */}
                <div className="p-6 pt-0 border-t border-stone-100 mt-2 flex items-center justify-between">
                  <span className="text-xs text-[#68736E] font-semibold">
                    Fixed Itinerary
                  </span>

                  <Link
                    to={`/tours/${tour.slug}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-[#0B3D2E] hover:bg-[#176B52] text-white shadow-xs hover:shadow-md transition-all"
                  >
                    <span>View Tour</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#DDEFE8]" />
                  </Link>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 space-y-3">
            <Compass className="w-8 h-8 text-stone-400 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-[#17231F]">No tours found</h3>
            <p className="text-xs text-[#68736E]">Try changing your search term or category filter.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-4 py-2 rounded-xl bg-[#0B3D2E] text-white text-xs font-semibold hover:bg-[#176B52]"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
