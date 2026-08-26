import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Car, ShieldCheck, Star, Compass } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <div className="relative min-h-[85vh] sm:min-h-[88vh] flex flex-col justify-center overflow-hidden bg-[#062C22]">
      {/* Background Image: Original High-Resolution Sigiriya Rock Fortress */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=2200&q=90"
          alt="Sigiriya Lion Rock Fortress Sri Lanka"
          className="w-full h-full object-cover object-center scale-105"
        />
        {/* Soft, readable Deep Forest Green gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#062C22]/95 via-[#062C22]/75 to-[#062C22]/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#062C22] via-transparent to-black/30" />
      </div>

      {/* Hero Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 flex flex-col justify-center">
        <div className="max-w-3xl space-y-7">
          
          {/* Eyebrow Label */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/12 backdrop-blur-md border border-white/20 text-[#DDEFE8] text-xs font-semibold tracking-wider uppercase shadow-xs">
            <Compass className="w-3.5 h-3.5 text-[#39A982]" />
            <span>BESPOKE SRI LANKAN JOURNEYS & AIRPORT CHAUFFEURS</span>
          </div>

          {/* Editorial Heading with Playfair Display */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.12]">
            Discover Sri Lanka <br />
            <span className="text-[#39A982] italic font-normal">Your Way</span>
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-lg text-stone-100 font-normal leading-relaxed max-w-2xl">
            Choose handcrafted multi-day tours with fixed day-by-day itineraries or book direct airport transfers from Bandaranaike (CMB). Travel comfortably in your private air-conditioned Car or Van with dedicated national chauffeurs.
          </p>

          {/* Primary Action CTA ONLY: Explore Tours */}
          <div className="pt-2">
            <Link
              to="/transfers"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 text-sm font-bold rounded-2xl bg-[#39A982] hover:bg-[#176B52] text-white shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
            >
              <Compass className="w-4 h-4 text-[#DDEFE8]" />
              <span>Explore Tours</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="pt-6 flex flex-wrap items-center gap-6 sm:gap-8 border-t border-white/15 max-w-xl text-white text-xs">
            <div className="flex items-center gap-2.5">
              <Star className="w-4 h-4 fill-[#39A982] text-[#39A982]" />
              <div>
                <span className="font-bold block text-sm">4.96 / 5.0</span>
                <span className="text-[11px] text-stone-200">Verified Reviews</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Car className="w-4 h-4 text-[#39A982]" />
              <div>
                <span className="font-bold block text-sm">Car & Van Fleet</span>
                <span className="text-[11px] text-stone-200">Daily Rates (Rs. 15k / 20k)</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#39A982]" />
              <div>
                <span className="font-bold block text-sm">100% Private</span>
                <span className="text-[11px] text-stone-200">Dedicated Chauffeur</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
