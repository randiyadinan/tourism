import React from 'react';
import { 
  TreePine, 
  Award, 
  ShieldCheck 
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const teamMembers = [
    {
      name: 'Dinesh Perera',
      role: 'Founder & Managing Director',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      bio: '20+ years curating bespoke private journeys for international travelers across Sri Lanka.'
    },
    {
      name: 'Ananya Jayasinghe',
      role: 'Head of Experience Design',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      bio: 'Specialist in luxury heritage estates, tea country architecture, and private wildlife expeditions.'
    },
    {
      name: 'Roshan Silva',
      role: 'Chief Naturalist & Fleet Lead',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      bio: 'Senior Sri Lanka Tourist Board certified lecturer-guide and wildlife tracker.'
    }
  ];

  return (
    <div className="bg-[#FAF8F2] min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Hero Banner */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-semibold text-[#1F6F54] uppercase tracking-wider">
            Our Story & Values
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#12372A]">
            Crafting Sri Lanka’s Finest Travel Stories
          </h1>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            Founded with a clear vision: to share the natural beauty, rich culture, and warm hospitality of Sri Lanka with reliability, comfort, and local authenticity.
          </p>
        </div>

        {/* Brand Story 2-Column */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-md">
            <img
              src="https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1200&q=85"
              alt="Tea Hills Sri Lanka"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#12372A]/80 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 text-white p-5 bg-black/40 backdrop-blur-xs rounded-xl border border-white/20">
              <p className="font-serif text-lg font-bold">"Ayubowan" — May You Live Long</p>
              <p className="text-xs text-stone-200 mt-0.5">The traditional Ceylon greeting that welcomes every guest with genuine warmth.</p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-stone-600 leading-relaxed">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#12372A] leading-snug">
              Authentic Island Hospitality with Modern Travel Standards
            </h2>
            <p>
              LankaVoyage was established by travel specialists passionate about showcasing Sri Lanka beyond standard tourist routes. We believe a holiday should be personalized, relaxed, and deeply memorable.
            </p>
            <p>
              From private wildlife safaris in Yala to reserved first-class train journeys through Nuwara Eliya and peaceful boutique retreats in Galle, every detail of your itinerary is coordinated by a dedicated travel manager.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-3 text-stone-800">
              <div className="p-3.5 bg-white rounded-xl border border-stone-200 shadow-xs">
                <span className="font-serif text-2xl font-bold text-[#12372A] block">10+</span>
                <span className="text-xs text-stone-500 font-medium">Years Experience</span>
              </div>
              <div className="p-3.5 bg-white rounded-xl border border-stone-200 shadow-xs">
                <span className="font-serif text-2xl font-bold text-[#12372A] block">100%</span>
                <span className="text-xs text-stone-500 font-medium">Private Journeys</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#12372A] text-[#C8A45D] flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#12372A]">Certified Chauffeurs</h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Every driver in our fleet is government certified, English-fluent, and committed to passenger safety and comfort.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#12372A] text-[#C8A45D] flex items-center justify-center">
              <TreePine className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#12372A]">Sustainable Travel</h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              We partner with community-driven eco resorts, ethical wildlife sanctuaries, and local artisans across Sri Lanka.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#12372A] text-[#C8A45D] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#12372A]">Transparent Pricing</h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              All quotes clearly outline vehicle, fuel, highway tolls, permits, and hotel taxes with zero hidden charges.
            </p>
          </div>
        </div>

        {/* Leadership Team */}
        <div className="space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#12372A]">Our Experience Team</h2>
            <p className="text-xs sm:text-sm text-stone-600">The travel designers and local guides behind your journey.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teamMembers.map((member, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden border border-stone-200 shadow-xs flex flex-col">
                <div className="h-56 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5 space-y-1.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#12372A]">{member.name}</h3>
                    <span className="text-xs font-semibold text-[#1F6F54] block">{member.role}</span>
                    <p className="text-xs text-stone-600 pt-2 leading-relaxed">{member.bio}</p>
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
