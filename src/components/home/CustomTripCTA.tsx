import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, MapPin, Hotel, Car, Palmtree, Sun } from 'lucide-react';

export const CustomTripCTA: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 relative overflow-hidden bg-[#075E67] text-white">
      {/* Background Palm Beach Texture */}
      <div className="absolute inset-0 z-0 opacity-15">
        <img
          src="https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?auto=format&fit=crop&w=1800&q=80"
          alt="Palm Trees Sky"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-[#F3D6A4] text-xs font-semibold uppercase tracking-wider">
              <Palmtree className="w-4 h-4 text-[#F3D6A4]" />
              <span>Tailor-Made Holiday Planner</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              Your Sri Lanka Story <br />
              <span className="text-[#F3D6A4] italic font-normal">Starts Here.</span>
            </h2>

            <p className="text-base sm:text-lg text-stone-100 leading-relaxed max-w-xl">
              Choose your dates, handpick beaches and wildlife parks, select boutique villa styles, and get an instant transparent quote.
            </p>

            {/* Feature Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs sm:text-sm text-stone-200">
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#087F8C] flex items-center justify-center text-[#F3D6A4] shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>100% Transparent instant pricing</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#087F8C] flex items-center justify-center text-[#F3D6A4] shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>VIP Airport meet & greet</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#087F8C] flex items-center justify-center text-[#F3D6A4] shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Private dedicated chauffeur</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#087F8C] flex items-center justify-center text-[#F3D6A4] shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Unlimited itinerary adjustments</span>
              </div>
            </div>

            <div className="pt-3">
              <Link
                to="/customize"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#087F8C] hover:bg-[#066B77] text-white font-semibold text-sm transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <Sun className="w-4 h-4 text-[#F3D6A4]" />
                <span>Plan Your Journey</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Visual Trip Preview Card */}
          <div className="lg:col-span-5">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-7 border border-white/20 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/15 pb-3.5">
                <div>
                  <span className="text-[11px] text-[#F3D6A4] uppercase tracking-wider block font-semibold">Sample Itinerary</span>
                  <span className="font-serif text-xl font-bold text-white">Tropical Ceylon Escape</span>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#087F8C] text-white">
                  8 Days
                </span>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-stone-200">
                <div className="flex items-center gap-3 bg-black/25 p-3 rounded-2xl">
                  <MapPin className="w-4 h-4 text-[#F3D6A4] shrink-0" />
                  <span>Sigiriya Citadel &bull; Ella Gap &bull; Yala Safari &bull; Mirissa Beach</span>
                </div>
                <div className="flex items-center gap-3 bg-black/25 p-3 rounded-2xl">
                  <Car className="w-4 h-4 text-[#F3D6A4] shrink-0" />
                  <span>Private Air-Conditioned Sedan + Chauffeur Guide</span>
                </div>
                <div className="flex items-center gap-3 bg-black/25 p-3 rounded-2xl">
                  <Hotel className="w-4 h-4 text-[#F3D6A4] shrink-0" />
                  <span>Beachfront Boutique Villas & Tea Bungalows</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
