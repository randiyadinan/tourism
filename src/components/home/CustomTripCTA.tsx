import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight,  Check, Plane, MapPin, Hotel, Car } from 'lucide-react';

export const CustomTripCTA: React.FC = () => {
  return (
    <section className="py-20 relative overflow-hidden bg-[#082F24] text-white">
      {/* Background Graphic Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#E5C378] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              Tailor-Made Wizard
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              Can’t Find Your Exact Route? <br />
              <span className="gold-gradient-text italic font-normal">Build Your Dream Trip in Minutes</span>
            </h2>

            <p className="text-base text-stone-200 leading-relaxed max-w-xl">
              Use our interactive custom trip calculator. Select your dates, handpick destinations from Sigiriya to Mirissa, add wildlife safaris and train tickets, choose vehicle and hotel tiers, and watch the dynamic price update live.
            </p>

            {/* Feature Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-sm text-stone-200">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#C5A059]/30 flex items-center justify-center text-[#E5C378]">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>100% Real-Time Transparent Pricing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#C5A059]/30 flex items-center justify-center text-[#E5C378]">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>VIP Airport Pickup Guaranteed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#C5A059]/30 flex items-center justify-center text-[#E5C378]">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Private Chauffeur & Vehicle</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#C5A059]/30 flex items-center justify-center text-[#E5C378]">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Zero Commitment to Request Quote</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                to="/customize"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#C5A059] via-[#DFB76C] to-[#C5A059] text-[#082F24] text-base font-bold rounded-xl shadow-xl hover:shadow-2xl hover:shadow-[#C5A059]/30 transition-all transform hover:-translate-y-0.5"
              >
                <Sparkles className="w-5 h-5" />
                Start 10-Step Trip Builder
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-4 bg-white/10 hover:bg-white/15 text-white text-sm font-semibold rounded-xl border border-white/20 transition-colors"
              >
                Speak with a Specialist
              </Link>
            </div>
          </div>

          {/* Right Column: Visual Interactive Preview Card */}
          <div className="lg:col-span-5">
            <div className="bg-[#0D3B2E] p-6 sm:p-8 rounded-3xl border border-[#C5A059]/30 shadow-2xl space-y-6 relative">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-xs text-[#E5C378] font-bold uppercase tracking-wider">Live Quotation Preview</p>
                  <h4 className="font-serif text-lg font-bold text-white">Custom Ceylon Itinerary</h4>
                </div>
                <span className="px-3 py-1 bg-[#C5A059]/20 text-[#E5C378] text-xs font-bold rounded-full border border-[#C5A059]/40">
                  Instant Estimate
                </span>
              </div>

              {/* Sample Live Line Items */}
              <div className="space-y-3 text-xs text-stone-200">
                <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                  <span className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-[#C5A059]" /> 8 Days / 4 Destinations</span>
                  <span className="font-semibold text-white">$640</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                  <span className="flex items-center gap-2"><Plane className="w-3.5 h-3.5 text-[#C5A059]" /> Airport VIP Transfer</span>
                  <span className="font-semibold text-white">$40</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                  <span className="flex items-center gap-2"><Hotel className="w-3.5 h-3.5 text-[#C5A059]" /> 5-Star Luxury Resorts</span>
                  <span className="font-semibold text-white">$320</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                  <span className="flex items-center gap-2"><Car className="w-3.5 h-3.5 text-[#C5A059]" /> Private AC Van</span>
                  <span className="font-semibold text-white">$120</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                  <span className="flex items-center gap-2"><Sparkles className="w-3.5 h-3.5 text-[#C5A059]" /> Yala Safari + Blue Train</span>
                  <span className="font-semibold text-white">$110</span>
                </div>
              </div>

              {/* Total Box */}
              <div className="bg-[#082F24] p-4 rounded-xl border border-[#C5A059]/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase text-[#E5C378] font-bold block">Estimated Total</span>
                  <span className="text-xs text-stone-400">For 2 Travelers</span>
                </div>
                <span className="font-serif text-2xl font-bold text-white">$1,230</span>
              </div>

              <Link
                to="/customize"
                className="w-full block text-center py-3 bg-[#C5A059] hover:bg-[#E5C378] text-[#082F24] font-bold rounded-xl text-sm transition-all shadow-md"
              >
                Customize This Itinerary &rarr;
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
