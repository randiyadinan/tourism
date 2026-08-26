import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Sparkles, ShieldCheck, Star } from 'lucide-react';
import { TripPlannerBar } from './TripPlannerBar';

export const Hero: React.FC = () => {
  return (
    <div className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden bg-[#062C22]">
      {/* Background Image: Iconic Sigiriya Rock Fortress & Ceylon Landscape */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=2200&q=90"
          alt="Sigiriya Rock Fortress and Sri Lanka Nature"
          className="w-full h-full object-cover object-center scale-102"
        />
        {/* Deep Forest Green Gradient Overlay for Luxury & Legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#062C22]/95 via-[#062C22]/80 to-[#062C22]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#062C22] via-transparent to-black/30" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-12 sm:pb-16 flex-1 flex flex-col justify-center">
        <div className="max-w-2xl space-y-6">
          
          {/* Liquid Glass Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white text-xs font-semibold tracking-wider uppercase shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#39A982]" />
            <span>Bespoke Sri Lankan Journeys</span>
          </div>

          {/* Hero Heading in Playfair Display */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.12]">
            Discover Sri Lanka <br />
            <span className="text-[#DDEFE8] italic font-normal">Your Way.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-stone-200 font-normal leading-relaxed max-w-xl">
            Tailor-made itineraries, private English-speaking chauffeur-guides, and handpicked luxury boutique stays across the island.
          </p>

          {/* Dual CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
            <Link
              to="/tours"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold rounded-2xl bg-[#176B52] hover:bg-[#0B3D2E] text-white border border-white/20 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              <Compass className="w-4 h-4 text-[#DDEFE8]" />
              <span>Explore Tours</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/customize"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold rounded-2xl bg-white/15 hover:bg-white/25 text-white border border-white/25 backdrop-blur-xl transition-all transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4 text-[#39A982]" />
              <span>Plan Your Journey</span>
            </Link>
          </div>

          {/* Trust Metrics Pill in Glass */}
          <div className="pt-6 flex flex-wrap items-center gap-6 border-t border-white/15 max-w-lg text-white text-xs">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-[#39A982] text-[#39A982]" />
              <div>
                <span className="font-bold block text-sm">4.96 / 5.0</span>
                <span className="text-[11px] text-stone-300">Verified Reviews</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#39A982]" />
              <div>
                <span className="font-bold block text-sm">100% Private</span>
                <span className="text-[11px] text-stone-300">Dedicated Chauffeur</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#39A982]" />
              <div>
                <span className="font-bold block text-sm">SLTDA Certified</span>
                <span className="text-[11px] text-stone-300">Licensed Agency</span>
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
