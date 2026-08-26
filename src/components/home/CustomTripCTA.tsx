import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Check, MapPin, Hotel, Car } from 'lucide-react';

export const CustomTripCTA: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 relative overflow-hidden bg-[#12372A] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#C8A45D] text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Custom Itinerary Builder</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
              Looking for a Unique Route? <br />
              <span className="text-[#C8A45D] italic font-normal">Design Your Dream Trip</span>
            </h2>

            <p className="text-sm sm:text-base text-stone-200 leading-relaxed max-w-xl">
              Choose your travel dates, select favorite destinations, add safaris or scenic train tickets, choose vehicle styles, and receive an instant price estimation.
            </p>

            {/* Feature Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs sm:text-sm text-stone-200">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#C8A45D] shrink-0" />
                <span>Transparent instant pricing</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#C8A45D] shrink-0" />
                <span>VIP Airport Pickup included</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#C8A45D] shrink-0" />
                <span>Dedicated chauffeur-guide</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#C8A45D] shrink-0" />
                <span>Flexible free consultation</span>
              </div>
            </div>

            <div className="pt-3">
              <Link
                to="/customize"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#C8A45D] hover:bg-[#dfb96f] text-[#12372A] font-semibold text-sm transition-all shadow-xs"
              >
                <span>Launch Custom Trip Builder</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Visual Trip Preview Card */}
          <div className="lg:col-span-5">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <span className="text-[11px] text-stone-300 uppercase tracking-wider block">Trip Preview</span>
                  <span className="font-serif text-lg font-bold text-white">Ceylon Explorer</span>
                </div>
                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[#1F6F54] text-white">
                  7 Days
                </span>
              </div>

              <div className="space-y-2 text-xs text-stone-200">
                <div className="flex items-center gap-2.5 bg-black/20 p-2.5 rounded-lg">
                  <MapPin className="w-4 h-4 text-[#C8A45D] shrink-0" />
                  <span>Sigiriya &bull; Kandy &bull; Ella &bull; Yala Safari</span>
                </div>
                <div className="flex items-center gap-2.5 bg-black/20 p-2.5 rounded-lg">
                  <Car className="w-4 h-4 text-[#C8A45D] shrink-0" />
                  <span>Private Air-Conditioned Sedan + Chauffeur</span>
                </div>
                <div className="flex items-center gap-2.5 bg-black/20 p-2.5 rounded-lg">
                  <Hotel className="w-4 h-4 text-[#C8A45D] shrink-0" />
                  <span>Boutique Eco-Lodges & 5-Star Stays</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
