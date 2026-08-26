import React from 'react';
import { 
  Award, 
  Headphones, 
  Car,
  Compass
} from 'lucide-react';

export const WhyLankaVoyage: React.FC = () => {
  const features = [
    {
      icon: Compass,
      title: '100% Bespoke & Flexible',
      description: 'Every itinerary is designed around your travel schedule, personal pace, and boutique accommodation preferences.'
    },
    {
      icon: Award,
      title: 'SLTDA Certified Chauffeurs',
      description: 'Travel in complete comfort with experienced, English-fluent chauffeur-guides licensed by the national tourist board.'
    },
    {
      icon: Car,
      title: 'Private Climate-Controlled Fleet',
      description: 'Clean modern sedans, executive passenger vans, and customized 4x4 wildlife jeeps with complimentary chilled water & Wi-Fi.'
    },
    {
      icon: Headphones,
      title: '24/7 Island Concierge Support',
      description: 'Direct WhatsApp and phone assistance throughout your journey from airport touchdown to departure.'
    }
  ];

  return (
    <section className="py-20 sm:py-28 bg-[#F6F1E7] border-y border-stone-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16 space-y-3">
          <span className="text-xs font-semibold text-[#0B7A75] uppercase tracking-wider">
            WHY CHOOSE LANKAVOYAGE
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#173238]">
            Travel deeper. Feel more.
          </h2>
          <p className="text-sm sm:text-base text-[#68736E] leading-relaxed">
            We combine high-touch personal concierge planning with authentic local knowledge for seamless holidays.
          </p>
        </div>

        {/* 4 Feature Grid with Liquid Glass cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div 
              key={i} 
              className="bg-[#FCFEFD]/85 backdrop-blur-xl rounded-3xl border border-white/80 p-7 space-y-3.5 shadow-[0_4px_20px_-4px_rgba(7,94,99,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(7,94,99,0.12)] transition-all hover:border-[#0B7A75]/40"
            >
              <div className="w-11 h-11 rounded-2xl bg-[#075E63] text-[#DDF5F0] flex items-center justify-center shadow-xs">
                <f.icon className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#173238]">
                {f.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#68736E] leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
