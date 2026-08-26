import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Check, MapPin, Hotel, Car } from 'lucide-react';

export const CustomTripCTA: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 relative overflow-hidden bg-[#062C22] text-white">
      {/* Background Cinematic Tea Estate Texture */}
      <div className="absolute inset-0 z-0 opacity-25">
        <img
          src="https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=2000&q=85"
          alt="Sri Lanka Hill Country Tea Estates"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#062C22] via-[#062C22]/90 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-[#DDEFE8] text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#39A982]" />
              <span>Tailor-Made Holiday Planner</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              Your Sri Lankan Journey <br />
              <span className="text-[#DDEFE8] italic font-normal">Starts Here.</span>
            </h2>

            <p className="text-base sm:text-lg text-stone-200 leading-relaxed max-w-xl">
              Choose your travel dates, handpick destinations, select boutique villa tiers, and receive a transparent instant cost breakdown.
            </p>

            {/* Feature Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs sm:text-sm text-stone-200">
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#176B52] flex items-center justify-center text-[#DDEFE8] shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>100% Transparent instant pricing</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#176B52] flex items-center justify-center text-[#DDEFE8] shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>VIP Airport meet & greet</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#176B52] flex items-center justify-center text-[#DDEFE8] shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Private dedicated chauffeur</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#176B52] flex items-center justify-center text-[#DDEFE8] shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Unlimited itinerary adjustments</span>
              </div>
            </div>

            <div className="pt-3">
              <Link
                to="/customize"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#176B52] hover:bg-[#0B3D2E] text-white font-semibold text-sm transition-all border border-white/20 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <Sparkles className="w-4 h-4 text-[#DDEFE8]" />
                <span>Plan Your Trip</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Visual Trip Preview Card in Liquid Glass */}
          <div className="lg:col-span-5">
            <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-7 sm:p-8 border border-white/20 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/15 pb-3.5">
                <div>
                  <span className="text-[11px] text-[#39A982] uppercase tracking-wider block font-semibold">Sample Custom Itinerary</span>
                  <span className="font-serif text-xl font-bold text-white">Classic Ceylon Odyssey</span>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#176B52] text-white border border-white/20">
                  10 Days
                </span>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-stone-200">
                <div className="flex items-center gap-3 bg-black/25 p-3.5 rounded-2xl border border-white/10">
                  <MapPin className="w-4 h-4 text-[#39A982] shrink-0" />
                  <span>Sigiriya &bull; Kandy &bull; Nuwara Eliya &bull; Yala Safari &bull; Galle</span>
                </div>
                <div className="flex items-center gap-3 bg-black/25 p-3.5 rounded-2xl border border-white/10">
                  <Car className="w-4 h-4 text-[#39A982] shrink-0" />
                  <span>Private Air-Conditioned Sedan + Chauffeur Guide</span>
                </div>
                <div className="flex items-center gap-3 bg-black/25 p-3.5 rounded-2xl border border-white/10">
                  <Hotel className="w-4 h-4 text-[#39A982] shrink-0" />
                  <span>Boutique Tea Bungalows & Heritage Stays</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
