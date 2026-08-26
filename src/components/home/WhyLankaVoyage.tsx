import React from 'react';
import { 
  Palmtree, 
  Award, 
  Headphones, 
  Car 
} from 'lucide-react';

export const WhyLankaVoyage: React.FC = () => {
  const features = [
    {
      icon: Palmtree,
      title: '100% Tailor-Made & Flexible',
      description: 'Every tropical itinerary is crafted around your travel dates, preferred pace, and interests with unlimited adjustments.'
    },
    {
      icon: Award,
      title: 'Certified Chauffeur-Guides',
      description: 'Travel safely with friendly, experienced English-speaking chauffeur-guides certified by the Sri Lanka Tourism Board.'
    },
    {
      icon: Car,
      title: 'Air-Conditioned Private Fleet',
      description: 'Clean, modern sedans, spacious passenger vans, and customized 4x4 safari jeeps with chilled water and Wi-Fi.'
    },
    {
      icon: Headphones,
      title: '24/7 Island Concierge',
      description: 'Dedicated trip support on WhatsApp and phone from your airport arrival to wheels-up departure.'
    }
  ];

  return (
    <section className="py-20 sm:py-24 bg-white border-y border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16 space-y-3">
          <span className="text-xs font-semibold text-[#087F8C] uppercase tracking-wider">
            Why Choose LankaVoyage
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#193238]">
            Your Island Vacation, Crafted to Perfection
          </h2>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            We combine warm Sri Lankan hospitality with modern travel standards to deliver seamless, carefree holidays.
          </p>
        </div>

        {/* 4 Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div 
              key={i} 
              className="bg-[#FFF9EF] rounded-3xl border border-stone-200/70 p-7 space-y-3.5 transition-all hover:shadow-md hover:border-[#087F8C]/40"
            >
              <div className="w-11 h-11 rounded-2xl bg-[#087F8C] text-[#F3D6A4] flex items-center justify-center shadow-xs">
                <f.icon className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#193238]">
                {f.title}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
