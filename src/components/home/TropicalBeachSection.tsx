import React from 'react';
import { Link } from 'react-router-dom';
import { Waves, ArrowRight, Sun, MapPin } from 'lucide-react';

export const TropicalBeachSection: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 relative overflow-hidden bg-[#075E67] text-white">
      {/* High-res Golden Tropical Beach Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=90"
          alt="Golden Tropical Sri Lanka Coast Mirissa Bentota"
          className="w-full h-full object-cover object-center scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#075E67]/95 via-[#075E67]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#075E67]/90 via-transparent to-black/30" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-2xl space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-[#F3D6A4] text-xs font-semibold uppercase tracking-wider">
            <Waves className="w-4 h-4 text-[#F3D6A4]" />
            <span>Southern & Eastern Coastlines</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            Life is Better <br />
            <span className="text-[#F3D6A4] italic font-normal">By the Ocean.</span>
          </h2>

          <p className="text-base sm:text-lg text-stone-100 leading-relaxed">
            From the turquoise surfing bays of Weligama and golden palm beaches of Mirissa to the historic ramparts of Galle Fort and tranquil lagoons of Bentota.
          </p>

          {/* Beach Tags */}
          <div className="flex flex-wrap gap-2.5 pt-2 text-xs font-medium">
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/15 backdrop-blur-md border border-white/20">
              <MapPin className="w-3.5 h-3.5 text-[#F3D6A4]" />
              Mirissa Beach
            </span>
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/15 backdrop-blur-md border border-white/20">
              <MapPin className="w-3.5 h-3.5 text-[#F3D6A4]" />
              Bentota Golden Sands
            </span>
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/15 backdrop-blur-md border border-white/20">
              <MapPin className="w-3.5 h-3.5 text-[#F3D6A4]" />
              Galle Dutch Fort
            </span>
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/15 backdrop-blur-md border border-white/20">
              <MapPin className="w-3.5 h-3.5 text-[#F3D6A4]" />
              Trincomalee Coral Reefs
            </span>
          </div>

          <div className="pt-4">
            <Link
              to="/tours?category=Beach+%26+Coastal"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-[#087F8C] hover:bg-[#075E67] text-white font-semibold text-sm transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <Sun className="w-4 h-4 text-[#F3D6A4]" />
              <span>Explore Coastal Tours</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};
