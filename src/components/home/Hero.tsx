import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Star, Award, Compass, Sparkles } from 'lucide-react';
import { TripPlannerBar } from './TripPlannerBar';

export const Hero: React.FC = () => {
  return (
    <div className="relative min-h-[88vh] flex flex-col justify-between overflow-hidden bg-[#12372A]">
      {/* Background Image with Clean Tourism Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=2000&q=90"
          alt="Sigiriya Lion Rock Fortress Sri Lanka"
          className="w-full h-full object-cover object-center"
        />
        {/* Balanced elegant dark overlay for maximum readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#12372A]/95 via-[#12372A]/80 to-[#12372A]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#12372A] via-transparent to-black/20" />
      </div>

      {/* Hero Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-20 pb-10 flex-1 flex flex-col justify-center">
        <div className="max-w-3xl space-y-5">
          
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1F6F54]/60 border border-[#C8A45D]/40 text-stone-100 text-xs font-medium tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-[#C8A45D]" />
            <span>Tailor-Made Sri Lankan Journeys</span>
          </div>

          {/* Clean Prominent Headline */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.12]">
            Discover Sri Lanka <br />
            <span className="text-[#C8A45D] italic font-normal">Your Way</span>
          </h1>

          {/* Short Elegant Supporting Text */}
          <p className="text-base sm:text-lg text-stone-200 font-normal leading-relaxed max-w-2xl">
            Customized private tours, certified chauffeur-guides, hand-selected boutique stays, and dedicated 24/7 concierge support across Sri Lanka.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
            <Link
              to="/tours"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold rounded-lg bg-[#C8A45D] text-[#12372A] hover:bg-[#dfb96f] transition-all shadow-sm"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Tours</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/customize"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/25 transition-all"
            >
              <span>Plan Your Trip</span>
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="pt-6 grid grid-cols-3 gap-4 border-t border-white/15 max-w-md text-white">
            <div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-[#C8A45D] text-[#C8A45D]" />
                <span className="font-serif text-lg sm:text-xl font-bold">4.96 / 5</span>
              </div>
              <p className="text-[11px] text-stone-300">Verified Reviews</p>
            </div>

            <div>
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-[#C8A45D]" />
                <span className="font-serif text-lg sm:text-xl font-bold">100%</span>
              </div>
              <p className="text-[11px] text-stone-300">Private & Flexible</p>
            </div>

            <div>
              <div className="flex items-center gap-1">
                <Award className="w-4 h-4 text-[#C8A45D]" />
                <span className="font-serif text-lg sm:text-xl font-bold">SLTDA</span>
              </div>
              <p className="text-[11px] text-stone-300">Registered Agency</p>
            </div>
          </div>

        </div>
      </div>

      {/* Floating Quick Trip Planner */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 w-full">
        <TripPlannerBar />
      </div>
    </div>
  );
};
