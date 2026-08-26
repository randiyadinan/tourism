import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar,  Sparkles } from 'lucide-react';

export const TravelInspiration: React.FC = () => {
  const articles = [
    {
      title: 'Top 7 Secrets to Spotting Leopards in Yala National Park',
      category: 'Wildlife Guide',
      date: 'August 2026',
      image: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=800&q=80',
      excerpt: 'Why dawn safaris in Block 1 and working with certified local naturalists double your odds of big cat encounters.'
    },
    {
      title: 'The Iconic Kandy to Ella Train Journey: Everything You Need to Know',
      category: 'Train Travel',
      date: 'July 2026',
      image: 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=800&q=80',
      excerpt: 'Which side of the carriage to sit on, ticket booking hacks, and photography tips over the Nine Arches Bridge.'
    },
    {
      title: 'Sri Lanka Weather Guide: When is the Best Time to Visit Each Coast?',
      category: 'Seasonal Travel',
      date: 'June 2026',
      image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80',
      excerpt: 'Understanding the twin monsoon seasons so you can enjoy guaranteed sunshine whether you travel in January or July.'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#176B52]/15 text-[#176B52] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Travel Inspiration
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#062C22]">
            Stories from the Wonder of Asia
          </h2>
          <p className="text-sm sm:text-base text-stone-600">
            Expert insider advice, wildlife tracking guides, and cultural notes from our Ceylon travel curators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((art, idx) => (
            <div key={idx} className="group bg-[#F8F7F2] rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between luxury-card">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={art.image}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#0B3D2E] text-[#39A982] border border-[#176B52]/40">
                  {art.category}
                </span>
              </div>

              <div className="p-6 flex flex-col justify-between flex-1 space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-stone-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{art.date}</span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#062C22] group-hover:text-[#2b705c] transition-colors leading-snug">
                    {art.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">{art.excerpt}</p>
                </div>

                <div className="pt-3 border-t border-stone-200/60">
                  <Link
                    to="/tours"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#0B3D2E] hover:text-[#176B52] transition-colors"
                  >
                    Read Guide & Matching Tours &rarr;
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
