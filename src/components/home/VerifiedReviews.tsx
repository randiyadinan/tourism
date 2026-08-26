import React from 'react';
import { Star, ShieldCheck, ArrowRight, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';
import { INITIAL_REVIEWS } from '../../data/reviews';

export const VerifiedReviews: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 bg-[#F6F1E7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <span className="text-xs font-semibold text-[#0B7A75] uppercase tracking-wider">
              TRAVELER STORIES
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#173238]">
              Memories made across the island.
            </h2>
            <p className="text-sm sm:text-base text-[#68736E]">
              Authentic feedback from international travelers who explored Sri Lanka with LankaVoyage.
            </p>
          </div>

          <Link
            to="/reviews"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#075E63] hover:text-[#0B7A75] transition-colors shrink-0"
          >
            <span>View All Reviews</span>
            <ArrowRight className="w-4 h-4 text-[#E98B6B]" />
          </Link>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {INITIAL_REVIEWS.slice(0, 3).map((review) => (
            <div
              key={review.id}
              className="relative bg-[#FCFEFD]/90 backdrop-blur-xl rounded-3xl p-7 sm:p-8 border border-white/80 shadow-[0_4px_20px_-4px_rgba(7,94,99,0.06)] hover:shadow-[0_20px_40px_-10px_rgba(7,94,99,0.12)] transition-all duration-300 flex flex-col justify-between"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-[#DDF5F0]" />

              <div className="space-y-4">
                {/* Rating */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#E98B6B] text-[#E98B6B]" />
                    ))}
                  </div>
                  {review.verifiedTraveler && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0B7A75] bg-[#DDF5F0] px-2.5 py-0.5 rounded-full">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#0B7A75]" />
                      Verified
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-lg font-bold text-[#173238] line-clamp-1">
                  "{review.title}"
                </h3>

                <p className="text-xs sm:text-sm text-[#68736E] leading-relaxed line-clamp-4">
                  "{review.content}"
                </p>

                {review.targetTitle && (
                  <div className="text-[11px] font-medium text-[#0B7A75] bg-[#DDF5F0]/60 px-3 py-1 rounded-full border border-[#0B7A75]/20 inline-block">
                    {review.targetTitle}
                  </div>
                )}
              </div>

              {/* Author Footer */}
              <div className="pt-4 mt-6 border-t border-stone-100 flex items-center gap-3">
                <img
                  src={review.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                  alt={review.authorName}
                  className="w-10 h-10 rounded-full object-cover border border-[#DDF5F0]"
                />
                <div>
                  <h4 className="font-semibold text-xs text-[#173238]">{review.authorName}</h4>
                  <p className="text-[11px] text-[#68736E]">{review.authorCountry} &bull; {review.tripType}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
