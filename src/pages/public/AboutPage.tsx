import React from 'react';
import { 
  TreePine, 
  Award, 
  ShieldCheck,
  Leaf
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const teamMembers = [
    {
      name: 'Dinesh Perera',
      role: 'Founder & Managing Director',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      bio: '20+ years curating bespoke private journeys and heritage expeditions for international travelers across Sri Lanka.'
    },
    {
      name: 'Ananya Jayasinghe',
      role: 'Head of Experience Design',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      bio: 'Specialist in luxury tea country bungalows, boutique heritage villas, and private wildlife safaris.'
    },
    {
      name: 'Roshan Silva',
      role: 'Chief Naturalist & Fleet Lead',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      bio: 'Senior Sri Lanka Tourist Board certified lecturer-guide and wildlife photography specialist.'
    }
  ];

  return (
    <div className="bg-[#F8F7F2] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Hero Banner */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#176B52] border border-stone-200 text-xs font-semibold uppercase tracking-wider shadow-2xs">
            <Leaf className="w-3.5 h-3.5 text-[#39A982]" />
            <span>Our Story & Values</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#17231F]">
            Crafting Sri Lanka’s Finest Travel Stories
          </h1>
          <p className="text-sm sm:text-base text-[#68736E] leading-relaxed">
            Sharing the UNESCO heritage, misty tea hills, and warm island hospitality of Sri Lanka with care, comfort, and local authenticity.
          </p>
        </div>

        {/* Brand Story 2-Column */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="relative h-[420px] rounded-3xl overflow-hidden shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1200&q=85"
              alt="Tea Hills & Nature Sri Lanka"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#062C22]/90 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white p-5 bg-[#062C22]/60 backdrop-blur-md rounded-2xl border border-white/20">
              <p className="font-serif text-lg font-bold">"Ayubowan" — May You Live Long</p>
              <p className="text-xs text-stone-200 mt-0.5">The traditional Ceylon greeting that welcomes every guest with warmth and respect.</p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-[#68736E] leading-relaxed">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#17231F] leading-snug">
              Authentic Island Hospitality with Modern Travel Standards
            </h2>
            <p>
              LankaVoyage was established by local travel specialists passionate about showcasing Sri Lanka beyond standard tourist routes. We believe every holiday should be personalized, relaxed, and deeply memorable.
            </p>
            <p>
              From private wildlife safaris in Yala and tea country hikes in Ella to peaceful boutique retreats in Galle Fort, every detail is handled by your dedicated concierge.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-3 text-[#17231F]">
              <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs">
                <span className="font-serif text-2xl font-bold text-[#0B3D2E] block">10+</span>
                <span className="text-xs text-[#68736E] font-medium">Years Experience</span>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs">
                <span className="font-serif text-2xl font-bold text-[#0B3D2E] block">100%</span>
                <span className="text-xs text-[#68736E] font-medium">Private Journeys</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/85 backdrop-blur-xl p-7 rounded-3xl border border-white/80 shadow-xs space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-[#0B3D2E] text-[#DDEFE8] flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#17231F]">Certified Chauffeurs</h3>
            <p className="text-xs sm:text-sm text-[#68736E] leading-relaxed">
              Every driver in our fleet is government certified, English-fluent, and committed to passenger safety and comfort.
            </p>
          </div>

          <div className="bg-white/85 backdrop-blur-xl p-7 rounded-3xl border border-white/80 shadow-xs space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-[#176B52] text-white flex items-center justify-center">
              <TreePine className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#17231F]">Sustainable Travel</h3>
            <p className="text-xs sm:text-sm text-[#68736E] leading-relaxed">
              We partner with community-driven eco resorts, ethical wildlife conservation reserves, and local artisans.
            </p>
          </div>

          <div className="bg-white/85 backdrop-blur-xl p-7 rounded-3xl border border-white/80 shadow-xs space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-[#062C22] text-[#39A982] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#17231F]">Transparent Pricing</h3>
            <p className="text-xs sm:text-sm text-[#68736E] leading-relaxed">
              All quotes clearly outline vehicle, fuel, highway tolls, permits, and hotel taxes with zero hidden charges.
            </p>
          </div>
        </div>

        {/* Leadership Team */}
        <div className="space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#17231F]">Our Experience Team</h2>
            <p className="text-xs sm:text-sm text-[#68736E]">The travel designers and local guides behind your vacation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teamMembers.map((member, i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-xs flex flex-col">
                <div className="h-60 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#17231F]">{member.name}</h3>
                    <span className="text-xs font-semibold text-[#176B52] block">{member.role}</span>
                    <p className="text-xs text-[#68736E] pt-2 leading-relaxed">{member.bio}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
