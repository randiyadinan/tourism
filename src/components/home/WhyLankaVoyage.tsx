import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
   
  MapPin, 
  Award, 
  Headphones, 
  Car, 
  CheckCircle2 
} from 'lucide-react';

export const WhyLankaVoyage: React.FC = () => {
  const features = [
    {
      icon: Sparkles,
      title: '100% Tailor-Made & Flexible',
      description: 'Every itinerary is custom designed from scratch around your travel style, pace, and passions with unlimited revisions.'
    },
    {
      icon: Award,
      title: 'Elite Certified Chauffeur-Guides',
      description: 'Travel with Sri Lanka Tourist Board certified English-speaking chauffeur-guides with 10+ years of unblemished hospitality.'
    },
    {
      icon: Car,
      title: 'Luxury Private Fleet',
      description: 'Immaculate air-conditioned Mercedes sedans, high-roof Toyota vans, and 4x4 safari cruisers with Wi-Fi and chilled refreshments.'
    },
    {
      icon: Headphones,
      title: '24/7 Island Concierge',
      description: 'Dedicated trip coordinator on WhatsApp and phone from the moment your plane touches down to wheels-up departure.'
    },
    {
      icon: ShieldCheck,
      title: 'Government Certified & Insured',
      description: 'Fully licensed Sri Lanka Tourist Development Authority (SLTDA) agency with comprehensive passenger insurance.'
    },
    {
      icon: MapPin,
      title: 'Handpicked Luxury Hotels',
      description: 'Exclusive partner rates at Relais & Châteaux clifftop villas, colonial tea bungalows, and 5-star oceanfront sanctuaries.'
    }
  ];

  return (
    <section className="py-20 bg-[#FAF8F5] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0D3B2E]/10 text-[#0D3B2E] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            The LankaVoyage Difference
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#082F24]">
            Why Discerning Travelers Choose LankaVoyage
          </h2>
          <p className="text-base text-stone-600 leading-relaxed">
            We don’t believe in cookie-cutter tours. We blend authentic island heritage with international luxury standards for effortless journeys.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div 
                key={idx}
                className="bg-white rounded-2xl p-8 border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 luxury-card group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#0D3B2E]/5 border border-[#C5A059]/30 flex items-center justify-center group-hover:bg-[#0D3B2E] transition-colors duration-300">
                    <Icon className="w-7 h-7 text-[#0D3B2E] group-hover:text-[#E5C378] transition-colors duration-300" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#082F24]">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-stone-100 flex items-center gap-1 text-xs text-[#C5A059] font-bold">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />
                  <span>Guaranteed Standards</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
