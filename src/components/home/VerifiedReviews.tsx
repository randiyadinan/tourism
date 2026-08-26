import React from 'react';
import { Star, ShieldCheck, ArrowRight, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';
import { INITIAL_REVIEWS } from '../../data/reviews';

export const VerifiedReviews: React.FC = () => {
  return (
    <section className="py-20 sm:py-24 bg-[#FFF9EF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <span className="text-xs font-semibold text-[#087F8C] uppercase tracking-wider">
              Traveler Memories
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#193238]">
              Stories from Sri Lanka
            </h2>
            <p className="text-sm sm:text-base text-stone-600">
              Read authentic feedback from travelers who explored the island with LankaVoyage.
            </p>
          </div>

          <Link
            to="/reviews"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#087F8C] hover:text-[#075E67] transition-colors shrink-0"
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
              className="relative bg-white rounded-3xl p-7 sm:p-8 border border-stone-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-[#F3D6A4]/40" />

              <div className="space-y-4">
                {/* Rating */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#E7B85C] text-[#E7B85C]" />
                    ))}
                  </div>
                  {review.verifiedTraveler && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                      Verified
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-lg font-bold text-[#193238] line-clamp-1">
                  "{review.title}"
                </h3>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed line-clamp-4">
                  "{review.content}"
                </p>

                {review.targetTitle && (
                  <div className="text-[11px] font-medium text-[#087F8C] bg-[#FFF9EF] px-3 py-1 rounded-full border border-[#F3D6A4]/60 inline-block">
                    {review.targetTitle}
                  </div>
                )}
              </div>

              {/* Author Footer */}
              <div className="pt-4 mt-6 border-t border-stone-100 flex items-center gap-3">
                <img
                  src={review.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                  alt={review.authorName}
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#F3D6A4]"
                />
                <div>
                  <h4 className="font-semibold text-xs text-[#193238]">{review.authorName}</h4>
                  <p className="text-[11px] text-stone-500">{review.authorCountry} &bull; {review.tripType}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
