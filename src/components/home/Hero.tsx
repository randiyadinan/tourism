import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Star, Award, Compass } from 'lucide-react';
import { TripPlannerBar } from './TripPlannerBar';

export const Hero: React.FC = () => {
  return (
    <div className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden">
      {/* Background Image with Cinematic Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=2000&q=90"
          alt="Sigiriya Lion Rock Sri Lanka"
          className="w-full h-full object-cover object-center scale-105 animate-pulse duration-1000"
          style={{ animationDuration: '8s' }}
        />
        {/* Multi-tier luxury gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#082F24]/95 via-[#082F24]/80 to-[#082F24]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#082F24] via-transparent to-black/30" />
      </div>

      {/* Hero Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-24 pb-12 flex-1 flex flex-col justify-center">
        <div className="max-w-3xl space-y-6">
          
          {/* Tagline Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-[#E5C378]" />
            <span className="text-xs sm:text-sm font-semibold tracking-wider text-[#E5C378] uppercase">
              Bespoke Sri Lankan Journeys
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white tracking-tight leading-[1.1]">
            Discover Sri Lanka <br />
            <span className="gold-gradient-text italic font-normal">Your Way</span>
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-lg lg:text-xl text-stone-200 font-normal leading-relaxed max-w-2xl">
            From airport arrival to unforgettable adventures, create a personalized Sri Lankan journey designed around you with private luxury transport, hand-picked boutique villas, and 24/7 dedicated concierge.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <Link
              to="/tours"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold rounded-xl bg-gradient-to-r from-[#C5A059] via-[#DFB76C] to-[#C5A059] text-[#082F24] hover:shadow-2xl hover:shadow-[#C5A059]/30 transform hover:-translate-y-0.5 transition-all shadow-lg"
            >
              <Compass className="w-5 h-5" />
              Explore Tours
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/customize"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md transform hover:-translate-y-0.5 transition-all"
            >
              <Sparkles className="w-4 h-4 text-[#E5C378]" />
              Customize My Trip
            </Link>
          </div>

          {/* Trust Metrics */}
          <div className="pt-8 grid grid-cols-3 gap-4 border-t border-white/15 max-w-lg text-white">
            <div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-[#C5A059] text-[#C5A059]" />
                <span className="font-serif text-xl sm:text-2xl font-bold">4.96 / 5</span>
              </div>
              <p className="text-[11px] sm:text-xs text-stone-300">1,200+ Verified Reviews</p>
            </div>

            <div>
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-[#E5C378]" />
                <span className="font-serif text-xl sm:text-2xl font-bold">100%</span>
              </div>
              <p className="text-[11px] sm:text-xs text-stone-300">Tailor-Made Flex</p>
            </div>

            <div>
              <div className="flex items-center gap-1">
                <Award className="w-4 h-4 text-[#E5C378]" />
                <span className="font-serif text-xl sm:text-2xl font-bold">SLTDA</span>
              </div>
              <p className="text-[11px] sm:text-xs text-stone-300">Govt. Certified Agency</p>
            </div>
          </div>

        </div>
      </div>

      {/* Floating Trip Planner Panel */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12 w-full">
        <TripPlannerBar />
      </div>
    </div>
  );
};
