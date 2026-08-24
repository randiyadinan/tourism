import React from 'react';
import { Star, ShieldCheck, Quote, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { INITIAL_REVIEWS } from '../../data/reviews';

export const VerifiedReviews: React.FC = () => {
  return (
    <section className="py-20 bg-[#FAF8F5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0D3B2E]/10 text-[#0D3B2E] text-xs font-bold uppercase tracking-wider">
              <Star className="w-3.5 h-3.5 fill-[#C5A059] text-[#C5A059]" />
              Guest Stories & Reviews
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#082F24]">
              Loved by Travelers from Around the Globe
            </h2>
            <p className="text-sm sm:text-base text-stone-600">
              Read authentic feedback from couples, solo explorers, and families who trusted LankaVoyage for their Sri Lankan holiday.
            </p>
          </div>

          <Link
            to="/reviews"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0D3B2E] hover:text-[#C5A059] transition-colors shrink-0"
          >
            <span>View All 1,200+ Reviews</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {INITIAL_REVIEWS.slice(0, 3).map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl p-7 border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between luxury-card"
            >
              <div className="space-y-4">
                {/* Rating & Quote Icon */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#C5A059] text-[#C5A059]" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-[#C5A059]/20" />
                </div>

                <h4 className="font-serif text-base font-bold text-[#082F24] line-clamp-1">
                  "{review.title}"
                </h4>

                <p className="text-xs text-stone-600 leading-relaxed line-clamp-4 italic">
                  "{review.content}"
                </p>

                {review.targetTitle && (
                  <div className="text-[11px] font-semibold text-[#8C6D2B] bg-[#C5A059]/10 px-2.5 py-1 rounded-md inline-block">
                    Tour: {review.targetTitle}
                  </div>
                )}
              </div>

              {/* Author Footer */}
              <div className="pt-4 mt-6 border-t border-stone-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={review.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                    alt={review.authorName}
                    className="w-10 h-10 rounded-full object-cover border border-[#C5A059]"
                  />
                  <div>
                    <h5 className="font-bold text-xs text-[#082F24]">{review.authorName}</h5>
                    <p className="text-[10px] text-stone-500">{review.authorCountry} • {review.tripType}</p>
                  </div>
                </div>

                {review.verifiedTraveler && (
                  <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full" title="Verified LankaVoyage Traveler">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Verified</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
