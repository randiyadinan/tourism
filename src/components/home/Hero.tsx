import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Star, Award } from 'lucide-react';
import { TripPlannerBar } from './TripPlannerBar';

export const Hero: React.FC = () => {
  return (
    <div className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden bg-[#062C22]">
      {/* Background Image: Original High-Resolution Sigiriya Rock Fortress */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=2200&q=90"
          alt="Sigiriya Lion Rock Fortress Sri Lanka"
          className="w-full h-full object-cover object-center scale-105 animate-[scaleIn_1.6s_ease-out_forwards] motion-reduce:transform-none motion-reduce:animate-none"
        />
        {/* Soft, readable Deep Forest Green gradient overlay without crushing the photo */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#062C22]/90 via-[#062C22]/65 to-[#062C22]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#062C22] via-transparent to-black/25" />
      </div>

      {/* Hero Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-12 sm:pb-16 flex-1 flex flex-col justify-center">
        <div className="max-w-2xl space-y-6">
          
          {/* Eyebrow Label with subtle sequential animation */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/12 backdrop-blur-md border border-white/20 text-[#DDEFE8] text-xs font-semibold tracking-wider uppercase shadow-xs animate-[fadeInUp_0.6s_ease-out_forwards] motion-reduce:animate-none">
            <span>BESPOKE SRI LANKAN JOURNEYS</span>
          </div>

          {/* Editorial Heading with Playfair Display */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.12] animate-[fadeInUp_0.8s_ease-out_forwards] motion-reduce:animate-none">
            Discover Sri Lanka <br />
            <span className="text-[#39A982] italic font-normal">Your Way</span>
          </h1>

          {/* Short Supporting Text */}
          <p className="text-base sm:text-lg text-stone-100 font-normal leading-relaxed max-w-xl animate-[fadeInUp_1.0s_ease-out_forwards] motion-reduce:animate-none">
            Bespoke Sri Lankan journeys shaped around the places, experiences and moments you want to remember.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2 animate-[fadeInUp_1.2s_ease-out_forwards] motion-reduce:animate-none">
            <Link
              to="/tours"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold rounded-2xl bg-[#0B3D2E] hover:bg-[#176B52] text-white border border-white/20 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
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

          {/* Trust Highlights in Frosted Glass */}
          <div className="pt-6 flex flex-wrap items-center gap-6 border-t border-white/15 max-w-lg text-white text-xs animate-[fadeInUp_1.4s_ease-out_forwards] motion-reduce:animate-none">
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
              <Award className="w-4 h-4 text-[#39A982]" />
              <div>
                <span className="font-bold block text-sm">SLTDA Certified</span>
                <span className="text-[11px] text-stone-200">Registered Agency</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Floating Glass Trip Planner Panel */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 sm:pb-12 w-full animate-[fadeInUp_1.5s_ease-out_forwards] motion-reduce:animate-none">
        <TripPlannerBar />
      </div>
    </div>
  );
};
