import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Star } from 'lucide-react';
import { TripPlannerBar } from './TripPlannerBar';

export const Hero: React.FC = () => {
  return (
    <div className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden bg-[#075E63]">
      {/* Background Image: High-Resolution Sri Lanka Coast & Palms */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2200&q=90"
          alt="Sri Lanka Tropical Coast and Nature"
          className="w-full h-full object-cover object-center scale-102"
        />
        {/* Subtle Ocean Teal & Dark Gradient Overlay for Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#075E63]/92 via-[#075E63]/75 to-[#075E63]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#075E63] via-transparent to-black/25" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-12 sm:pb-16 flex-1 flex flex-col justify-center">
        <div className="max-w-2xl space-y-6">
          
          {/* Eyebrow Label */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/12 backdrop-blur-md border border-white/20 text-[#DDF5F0] text-xs font-semibold tracking-wider uppercase shadow-xs">
            <span>PLAN YOUR JOURNEY</span>
          </div>

          {/* Hero Editorial Heading with DM Serif Display */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-white tracking-tight leading-[1.12]">
            Bespoke Sri Lankan <br />
            <span className="text-[#DDF5F0] italic">Journeys</span>
          </h1>

          {/* Editorial Subtitle */}
          <p className="text-base sm:text-lg text-stone-100 font-normal leading-relaxed max-w-xl">
            Discover Sri Lanka through carefully crafted experiences, private journeys and unforgettable island moments.
          </p>

          {/* Modern CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
            <Link
              to="/tours"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold rounded-2xl bg-[#0B7A75] hover:bg-[#075E63] text-white border border-white/20 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              <span>Explore Tours</span>
              <ArrowRight className="w-4 h-4 text-[#DDF5F0]" />
            </Link>

            <Link
              to="/customize"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold rounded-2xl bg-white/15 hover:bg-white/25 text-white border border-white/25 backdrop-blur-xl transition-all transform hover:-translate-y-0.5"
            >
              <span>Build Your Journey</span>
            </Link>
          </div>

          {/* Trust Metrics Row in Glass */}
          <div className="pt-6 flex flex-wrap items-center gap-6 border-t border-white/15 max-w-lg text-white text-xs">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-[#E98B6B] text-[#E98B6B]" />
              <div>
                <span className="font-bold block text-sm">4.96 / 5.0</span>
                <span className="text-[11px] text-stone-200">Verified Reviews</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#55C7C1]" />
              <div>
                <span className="font-bold block text-sm">100% Private</span>
                <span className="text-[11px] text-stone-200">Dedicated Chauffeur</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#55C7C1]" />
              <div>
                <span className="font-bold block text-sm">SLTDA Certified</span>
                <span className="text-[11px] text-stone-200">Licensed Agency</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Floating Glass Holiday Search Panel */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 sm:pb-12 w-full">
        <TripPlannerBar />
      </div>
    </div>
  );
};
