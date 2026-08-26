import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  MapPin, 
  Award, 
  Headphones, 
  Car 
} from 'lucide-react';

export const WhyLankaVoyage: React.FC = () => {
  const features = [
    {
      icon: Sparkles,
      title: '100% Tailor-Made & Flexible',
      description: 'Every itinerary is crafted around your travel dates, preferred pace, and interests with unlimited adjustments.'
    },
    {
      icon: Award,
      title: 'Certified Chauffeur-Guides',
      description: 'Travel safely with experienced English-speaking chauffeur-guides certified by the Sri Lanka Tourism Board.'
    },
    {
      icon: Car,
      title: 'Modern Private Fleet',
      description: 'Clean, air-conditioned sedans, spacious vans, and customized 4x4 safari cruisers with bottled water and Wi-Fi.'
    },
    {
      icon: Headphones,
      title: '24/7 Island Concierge',
      description: 'Dedicated trip support on WhatsApp and phone from airport arrival to your departure flight.'
    },
    {
      icon: ShieldCheck,
      title: 'Licensed & Fully Insured',
      description: 'Registered agency with full passenger vehicle insurance and direct access to local support.'
    },
    {
      icon: MapPin,
      title: 'Handpicked Accommodations',
      description: 'Carefully vetted boutique hotels, colonial tea bungalows, safari camps, and beachfront resorts.'
    }
  ];

  return (
    <section className="py-20 sm:py-24 bg-white border-y border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16 space-y-3">
          <span className="text-xs font-semibold text-[#1F6B50] uppercase tracking-wider">
            Why Choose LankaVoyage
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0D3B2E]">
            Why Discerning Travelers Choose LankaVoyage
          </h2>
          <p className="text-sm sm:text-base text-[#66716C] leading-relaxed">
            We blend genuine Sri Lankan hospitality with international travel standards to deliver seamless, memorable journeys.
          </p>
        </div>

        {/* 6 Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((f, i) => (
            <div 
              key={i} 
              className="bg-[#FAF8F3] rounded-xl border border-stone-200/80 p-7 space-y-3.5 transition-all hover:shadow-xs hover:border-[#1F6B50]/40"
            >
              <div className="w-10 h-10 rounded-lg bg-[#0D3B2E] text-[#C5A059] flex items-center justify-center shadow-xs">
                <f.icon className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#0D3B2E]">
                {f.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#66716C] leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
