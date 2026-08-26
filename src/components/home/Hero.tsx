import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Star, Award, Compass, Sparkles } from 'lucide-react';
import { TripPlannerBar } from './TripPlannerBar';

export const Hero: React.FC = () => {
  return (
    <div className="relative min-h-[85vh] sm:min-h-[88vh] flex flex-col justify-between overflow-hidden bg-[#0D3B2E]">
      {/* Background Image with Cinematic Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=2000&q=90"
          alt="Sigiriya Lion Rock Fortress Sri Lanka"
          className="w-full h-full object-cover object-center"
        />
        {/* Deep Forest Green Gradient Overlay for Maximum Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D3B2E]/95 via-[#0D3B2E]/85 to-[#0D3B2E]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D3B2E] via-transparent to-black/25" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-8 sm:pb-12 flex-1 flex flex-col justify-center">
        <div className="max-w-2xl space-y-6">
          
          {/* Small Premium Label */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F6B50]/60 border border-[#C5A059]/40 text-stone-100 text-xs font-medium tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Bespoke Sri Lankan Journeys</span>
          </div>

          {/* Heading */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.12]">
            Discover Sri Lanka <br />
            <span className="text-[#C5A059] italic font-normal">Your Way</span>
          </h1>

          {/* Short Description */}
          <p className="text-base sm:text-lg text-stone-200 font-normal leading-relaxed max-w-xl">
            Private chauffeur-guided journeys, boutique villas, and tailor-made Ceylon travel experiences designed around you.
          </p>

          {/* Clear CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1">
            <Link
              to="/tours"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold rounded-lg bg-[#0D3B2E] hover:bg-[#1F6B50] text-white border border-[#C5A059]/50 transition-all shadow-xs"
            >
              <Compass className="w-4 h-4 text-[#C5A059]" />
              <span>Explore Tours</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/customize"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/25 transition-all"
            >
              <span>Plan Your Journey</span>
            </Link>
          </div>

          {/* Trust Metrics */}
          <div className="pt-6 grid grid-cols-3 gap-4 border-t border-white/15 max-w-md text-white">
            <div>
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-[#C5A059] text-[#C5A059]" />
                <span className="font-serif text-lg font-bold">4.96 / 5</span>
              </div>
              <p className="text-[11px] text-stone-300">Verified Reviews</p>
            </div>

            <div>
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                <span className="font-serif text-lg font-bold">100%</span>
              </div>
              <p className="text-[11px] text-stone-300">Private & Tailor-Made</p>
            </div>

            <div>
              <div className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-[#C5A059]" />
                <span className="font-serif text-lg font-bold">SLTDA</span>
              </div>
              <p className="text-[11px] text-stone-300">Certified Agency</p>
            </div>
          </div>

        </div>
      </div>

      {/* Floating Quick Trip Planner */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-10 w-full">
        <TripPlannerBar />
      </div>
    </div>
  );
};
