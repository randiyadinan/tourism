import React from 'react';
import { Star, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { INITIAL_REVIEWS } from '../../data/reviews';

export const VerifiedReviews: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-[#FAF8F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-14 gap-5">
          <div className="space-y-2.5 max-w-2xl">
            <span className="text-xs font-semibold text-[#1F6F54] uppercase tracking-wider">
              Traveler Stories
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#12372A]">
              Loved by Travelers from Around the Globe
            </h2>
            <p className="text-sm sm:text-base text-stone-600">
              Read authentic feedback from travelers who explored Sri Lanka with LankaVoyage.
            </p>
          </div>

          <Link
            to="/reviews"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#12372A] hover:text-[#1F6F54] transition-colors shrink-0"
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
              className="bg-white rounded-xl p-6 border border-stone-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3.5">
                {/* Rating */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#C8A45D] text-[#C8A45D]" />
                    ))}
                  </div>
                  {review.verifiedTraveler && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                      <ShieldCheck className="w-3 h-3 text-emerald-700" />
                      Verified
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-base font-bold text-[#12372A] line-clamp-1">
                  "{review.title}"
                </h3>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed line-clamp-4">
                  "{review.content}"
                </p>

                {review.targetTitle && (
                  <div className="text-[11px] font-medium text-[#1F6F54] bg-[#1F6F54]/10 px-2.5 py-1 rounded-md inline-block">
                    {review.targetTitle}
                  </div>
                )}
              </div>

              {/* Author Footer */}
              <div className="pt-4 mt-5 border-t border-stone-100 flex items-center gap-3">
                <img
                  src={review.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                  alt={review.authorName}
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-xs text-[#1F2933]">{review.authorName}</h4>
                  <p className="text-[11px] text-stone-500">{review.authorCountry} • {review.tripType}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
