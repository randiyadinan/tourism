import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Star } from 'lucide-react';
import { TripPlannerBar } from './TripPlannerBar';

export const Hero: React.FC = () => {
  return (
    <div className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden bg-[#062C22]">
      {/* Background Image: High-Resolution Sigiriya / Sri Lankan Nature Landscape */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=2200&q=90"
          alt="Sri Lanka Sigiriya and Nature"
          className="w-full h-full object-cover object-center scale-102 transition-transform duration-1000"
        />
        {/* Subtle Deep Forest Green Gradient Overlay for Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#062C22]/92 via-[#062C22]/75 to-[#062C22]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#062C22] via-transparent to-black/25" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-12 sm:pb-16 flex-1 flex flex-col justify-center">
        <div className="max-w-2xl space-y-6">
          
          {/* Eyebrow Label */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/12 backdrop-blur-md border border-white/20 text-[#DDEFE8] text-xs font-semibold tracking-wider uppercase shadow-xs">
            <span>DISCOVER CEYLON</span>
          </div>

          {/* Hero Editorial Heading with Playfair Display */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.12]">
            Discover Sri Lanka <br />
            <span className="text-[#39A982] italic">Your Way</span>
          </h1>

          {/* Editorial Subtitle */}
          <p className="text-base sm:text-lg text-stone-100 font-normal leading-relaxed max-w-xl">
            Private chauffeur journeys, misty tea hills, UNESCO ancient fortresses, and luxury coastal sanctuaries tailored around you.
          </p>

          {/* Modern CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
            <Link
              to="/tours"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold rounded-2xl bg-[#176B52] hover:bg-[#0B3D2E] text-white border border-white/20 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              <span>Explore Tours</span>
              <ArrowRight className="w-4 h-4 text-[#DDEFE8]" />
            </Link>

            <Link
              to="/customize"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold rounded-2xl bg-white/15 hover:bg-white/25 text-white border border-white/25 backdrop-blur-xl transition-all transform hover:-translate-y-0.5"
            >
              <span>Plan Your Journey</span>
            </Link>
          </div>

          {/* Trust Metrics Row in Glass */}
          <div className="pt-6 flex flex-wrap items-center gap-6 border-t border-white/15 max-w-lg text-white text-xs">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-[#39A982] text-[#39A982]" />
              <div>
                <span className="font-bold block text-sm">4.96 / 5.0</span>
                <span className="text-[11px] text-stone-200">Verified Reviews</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#39A982]" />
              <div>
                <span className="font-bold block text-sm">100% Private</span>
                <span className="text-[11px] text-stone-200">Dedicated Chauffeur</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#39A982]" />
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
