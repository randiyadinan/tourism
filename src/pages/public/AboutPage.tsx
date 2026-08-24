import React from 'react';
import { 
  Sparkles, 
  TreePine, 
  Users
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const teamMembers = [
    {
      name: 'Dinesh Perera',
      role: 'Founder & Managing Director',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      bio: '20+ years curating bespoke private journeys for international travelers across the Pearl of the Indian Ocean.'
    },
    {
      name: 'Ananya Jayasinghe',
      role: 'Head of Bespoke Experience Design',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      bio: 'Specialist in luxury heritage estates, tea country architecture, and exclusive private wildlife expeditions.'
    },
    {
      name: 'Roshan Silva',
      role: 'Chief Naturalist & Chauffeur Fleet Lead',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      bio: 'Senior Sri Lanka Tourist Development Authority certified lecturer-guide and Yala leopard tracker.'
    }
  ];

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0D3B2E]/10 text-[#0D3B2E] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            Our Story & Heritage
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#082F24]">
            Crafting Sri Lanka’s Finest Travel Stories
          </h1>
          <p className="text-stone-600 leading-relaxed text-base sm:text-lg">
            Founded with a singular vision: to share the timeless magic, regal history, and breathtaking biodiversity of Sri Lanka with warmth, uncompromising luxury, and local authenticity.
          </p>
        </div>

        {/* Brand Mission & Story 2-Column */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative h-[480px] rounded-3xl overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1200&q=85"
              alt="Tea Hills Ceylon"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#082F24]/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white p-6 bg-black/40 backdrop-blur-md rounded-2xl border border-white/20">
              <p className="font-serif text-xl font-bold">"Ayubowan" — May You Live Long</p>
              <p className="text-xs text-stone-200 mt-1">The traditional Ceylon greeting that welcomes every guest as family.</p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="font-serif text-3xl font-bold text-[#082F24]">
              Where Ancient Heritage Meets Contemporary Luxury
            </h2>
            <p className="text-stone-600 text-sm leading-relaxed">
              LankaVoyage was born from a deep love for Sri Lanka’s contrasting landscapes: from the mist-shrouded tea bungalows of the central massif to the ancient granite boulders where wild leopards roam in Yala.
            </p>
            <p className="text-stone-600 text-sm leading-relaxed">
              We operate our own modern private fleet with air conditioning and Wi-Fi, partner directly with luxury boutique hoteliers, and employ only certified chauffeur-guides. This ensures that every single guest experiences flawless service without third-party middlemen.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
                <span className="font-serif text-2xl font-bold text-[#082F24]">100%</span>
                <p className="text-xs text-stone-500 font-medium">Bespoke Private Itineraries</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
                <span className="font-serif text-2xl font-bold text-[#082F24]">SLTDA</span>
                <p className="text-xs text-stone-500 font-medium">Fully Licensed & Bonded</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sustainability & Community Pledge */}
        <div className="bg-[#082F24] text-white p-8 sm:p-12 rounded-3xl relative overflow-hidden space-y-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A059]/20 text-[#E5C378] text-xs font-bold uppercase">
              <TreePine className="w-4 h-4" />
              Conservation & Community
            </div>
            <h3 className="font-serif text-3xl sm:text-4xl font-bold">Our Sustainable Tourism Pledge</h3>
            <p className="text-stone-300 text-sm leading-relaxed">
              We believe luxury travel should protect the natural wonders and empower the local communities we visit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-stone-300">
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-2">
              <h4 className="font-serif text-base font-bold text-white">Ethical Wildlife Protection</h4>
              <p>We support national park conservation guidelines and enforce ethical distance protocols on all whale watching and leopard safaris.</p>
            </div>
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-2">
              <h4 className="font-serif text-base font-bold text-white">Empowering Local Communities</h4>
              <p>We source local village lunches, artisan pottery workshops, and support tea plantation family educational initiatives.</p>
            </div>
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-2">
              <h4 className="font-serif text-base font-bold text-white">Zero Single-Use Plastic</h4>
              <p>All private vehicles are supplied with refillable glass water bottles and biodegradable fresh king coconut straws.</p>
            </div>
          </div>
        </div>

        {/* Leadership Team */}
        <div className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0D3B2E]/10 text-[#0D3B2E] text-xs font-bold uppercase">
              <Users className="w-3.5 h-3.5 text-[#C5A059]" />
              Ceylon Travel Experts
            </div>
            <h3 className="font-serif text-3xl font-bold text-[#082F24]">Meet the Curators Behind Your Trip</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, idx) => (
              <div key={idx} className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm p-6 space-y-4 text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-28 h-28 rounded-full object-cover mx-auto border-4 border-[#FAF8F5] shadow-md"
                />
                <div>
                  <h4 className="font-serif font-bold text-lg text-[#082F24]">{member.name}</h4>
                  <p className="text-xs text-[#8C6D2B] font-semibold">{member.role}</p>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
