import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Compass, Plane } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <div className="relative min-h-[88vh] sm:min-h-[90vh] flex flex-col justify-center overflow-hidden bg-[#062C22]">
      
      {/* 1. Background Image with Slow Ambient Ken-Burns Motion */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=2400&q=90"
          alt="Sigiriya Lion Rock Fortress Sri Lanka"
          className="w-full h-full object-cover object-center scale-105 animate-[scaleIn_20s_ease-out_infinite_alternate]"
        />
        
        {/* Deep Forest Emerald Glass Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#062C22]/95 via-[#062C22]/80 to-[#062C22]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#062C22] via-transparent to-black/35" />
      </div>

      {/* 2. Floating Ambient Glow Elements */}
      <div className="ambient-glow-orb w-96 h-96 bg-[#176B52] top-10 left-10" />
      <div className="ambient-glow-orb w-80 h-80 bg-[#C5A059] bottom-10 right-20 opacity-20" />

      {/* 3. Hero Main Glass Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 flex flex-col justify-center">
        <div className="max-w-3xl space-y-7 animate-[fadeInUp_0.8s_cubic-bezier(0.16,1,0.3,1)]">
          
          {/* Liquid Glass Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass text-[#DDEFE8] text-xs font-semibold tracking-wider uppercase shadow-md">
            <Compass className="w-3.5 h-3.5 text-[#39A982] animate-spin-slow" />
            <span>BESPOKE SRI LANKAN JOURNEYS & AIRPORT CHAUFFEURS</span>
          </div>

          {/* Editorial Heading with Playfair Display */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.12]">
            Discover Sri Lanka <br />
            <span className="text-[#39A982] italic font-normal bg-gradient-to-r from-[#39A982] via-[#E6CA85] to-[#39A982] bg-clip-text text-transparent">
              Your Way
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-lg text-stone-100 font-normal leading-relaxed max-w-2xl text-shadow-sm">
            Choose handcrafted multi-day tours with fixed day-by-day itineraries or book direct airport transfers from Bandaranaike (CMB). Travel comfortably in your private air-conditioned Car or Van with dedicated national chauffeurs.
          </p>

          {/* Primary Action CTA Button: Plan Your Airport Transfer -> /transfers */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              to="/transfers"
              className="glass-btn-emerald inline-flex items-center justify-center gap-2.5 px-8 py-4 text-sm font-bold rounded-2xl text-white shadow-xl group"
            >
              <Plane className="w-4 h-4 text-[#DDEFE8]" />
              <span>Book Airport Transfer</span>
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Trust Highlights - Liquid Glass Pill Card */}
          <div className="pt-6 flex flex-wrap items-center gap-6 sm:gap-8 border-t border-white/15 max-w-xl text-white text-xs">
            <div className="flex items-center gap-2.5">
              <Star className="w-4 h-4 fill-[#39A982] text-[#39A982]" />
              <div>
                <span className="font-bold block text-sm">4.96 / 5.0</span>
                <span className="text-[11px] text-stone-200">Verified Reviews</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Compass className="w-4 h-4 text-[#39A982]" />
              <div>
                <span className="font-bold block text-sm">SLTDA Certified</span>
                <span className="text-[11px] text-stone-200">Professional Chauffeurs</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
