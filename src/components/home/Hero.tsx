import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Palmtree, Waves, Sun } from 'lucide-react';
import { TripPlannerBar } from './TripPlannerBar';

export const Hero: React.FC = () => {
  return (
    <div className="relative min-h-[90vh] flex flex-col justify-between overflow-hidden bg-[#075E67]">
      {/* Background Image: Stunning Tropical Sri Lankan Beach & Palms */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2200&q=90"
          alt="Tropical Beach Mirissa Sri Lanka Palm Trees"
          className="w-full h-full object-cover object-center scale-102"
        />
        {/* Fresh tropical gradient overlay: crystal ocean teal & warm sunlight */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#075E67]/90 via-[#075E67]/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#075E67]/80 via-transparent to-black/20" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-12 sm:pb-16 flex-1 flex flex-col justify-center">
        <div className="max-w-2xl space-y-6">
          
          {/* Tropical Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-semibold tracking-wider uppercase shadow-xs">
            <Palmtree className="w-3.5 h-3.5 text-[#F3D6A4]" />
            <span>Your Ceylon Adventure Starts Here</span>
          </div>

          {/* Tropical Heading */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.12]">
            Discover Sri Lanka, <br />
            <span className="text-[#F3D6A4] italic font-normal">Your Way.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-stone-100 font-normal leading-relaxed max-w-xl">
            Private journeys &bull; Tropical escapes &bull; Unforgettable experiences
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
            <Link
              to="/tours"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold rounded-2xl bg-[#087F8C] hover:bg-[#075E67] text-white shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              <Compass className="w-4 h-4 text-[#F3D6A4]" />
              <span>Explore Tours</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/customize"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold rounded-2xl bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-md transition-all transform hover:-translate-y-0.5"
            >
              <Sun className="w-4 h-4 text-[#E7B85C]" />
              <span>Plan Your Journey</span>
            </Link>
          </div>

          {/* Highlights Row */}
          <div className="pt-6 grid grid-cols-3 gap-4 border-t border-white/20 max-w-md text-white">
            <div className="flex items-center gap-2">
              <Waves className="w-4 h-4 text-[#F3D6A4] shrink-0" />
              <div>
                <span className="font-serif text-base sm:text-lg font-bold block">1,340 km</span>
                <span className="text-[11px] text-stone-200">Coastline & Beaches</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Palmtree className="w-4 h-4 text-[#F3D6A4] shrink-0" />
              <div>
                <span className="font-serif text-base sm:text-lg font-bold block">100%</span>
                <span className="text-[11px] text-stone-200">Private & Tailor-Made</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-[#E7B85C] shrink-0" />
              <div>
                <span className="font-serif text-base sm:text-lg font-bold block">4.96 ★</span>
                <span className="text-[11px] text-stone-200">Verified Reviews</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Floating Holiday Search / Trip Planner */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 sm:pb-12 w-full">
        <TripPlannerBar />
      </div>
    </div>
  );
};
