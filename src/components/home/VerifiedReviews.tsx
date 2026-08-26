import React from 'react';
import { Star, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { INITIAL_REVIEWS } from '../../data/reviews';

export const VerifiedReviews: React.FC = () => {
  return (
    <section className="py-20 sm:py-24 bg-[#FAF8F3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <span className="text-xs font-semibold text-[#1F6B50] uppercase tracking-wider">
              Traveler Reviews
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0D3B2E]">
              Loved by Travelers from Around the Globe
            </h2>
            <p className="text-sm sm:text-base text-[#66716C]">
              Read authentic feedback from travelers who explored Sri Lanka with LankaVoyage.
            </p>
          </div>

          <Link
            to="/reviews"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0D3B2E] hover:text-[#1F6B50] transition-colors shrink-0"
          >
            <span>View All Reviews</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {INITIAL_REVIEWS.slice(0, 3).map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-xl p-7 border border-stone-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Rating */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#C5A059] text-[#C5A059]" />
                    ))}
                  </div>
                  {review.verifiedTraveler && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                      Verified Traveler
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-lg font-bold text-[#0D3B2E] line-clamp-1">
                  "{review.title}"
                </h3>

                <p className="text-xs sm:text-sm text-[#66716C] leading-relaxed line-clamp-4">
                  "{review.content}"
                </p>

                {review.targetTitle && (
                  <div className="text-[11px] font-medium text-[#1F6B50] bg-[#EEF5F1] px-2.5 py-1 rounded-md inline-block">
                    {review.targetTitle}
                  </div>
                )}
              </div>

              {/* Author Footer */}
              <div className="pt-4 mt-6 border-t border-stone-100 flex items-center gap-3">
                <img
                  src={review.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                  alt={review.authorName}
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-xs text-[#17231F]">{review.authorName}</h4>
                  <p className="text-[11px] text-[#66716C]">{review.authorCountry} • {review.tripType}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
