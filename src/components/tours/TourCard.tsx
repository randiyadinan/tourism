import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Star, Heart, ArrowRight } from 'lucide-react';
import type { Tour } from '../../types';
import { useWishlist } from '../../context/WishlistContext';

import { handleImageError } from '../../utils/imageFallback';

interface TourCardProps {
  tour: Tour;
  layout?: 'grid' | 'horizontal';
}

export const TourCard: React.FC<TourCardProps> = ({ tour, layout = 'grid' }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isSaved = isInWishlist(tour.id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      id: `wl-${tour.id}`,
      type: 'tour',
      targetId: tour.id,
      title: tour.title,
      subtitle: tour.subtitle,
      image: tour.heroImage,
      price: tour.pricePerPerson,
      duration: `${tour.durationDays} Days`,
      slug: tour.slug
    });
  };

  if (layout === 'horizontal') {
    return (
      <div className="glass-card-interactive liquid-glass-white rounded-3xl border border-white/80 overflow-hidden shadow-[0_10px_30px_-10px_rgba(6,44,34,0.08)] flex flex-col md:flex-row group">
        {/* Image */}
        <div className="relative md:w-2/5 h-64 md:h-auto overflow-hidden">
          <img
            src={tour.heroImage}
            alt={tour.title}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
            loading="lazy"
            onError={(e) => handleImageError(e, 'tour')}
          />
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-3.5 right-3.5 p-2.5 rounded-full backdrop-blur-md transition-colors shadow-xs ${
              isSaved 
                ? 'bg-[#39A982] text-white' 
                : 'bg-black/35 text-white hover:bg-white hover:text-[#176B52]'
            }`}
            title={isSaved ? 'Remove from Saved' : 'Save to Wishlist'}
            aria-label="Save to Wishlist"
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 md:w-3/5 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-1 font-semibold text-[#176B52] bg-[#DDEFE8]/80 backdrop-blur-md px-3 py-1 rounded-full border border-[#39A982]/20">
                <Clock className="w-3.5 h-3.5" />
                {tour.durationDays} Days / {tour.durationNights} Nights
              </span>
              <div className="flex items-center gap-1 font-semibold text-[#17231F]">
                <Star className="w-3.5 h-3.5 fill-[#39A982] text-[#39A982]" />
                <span>{tour.rating.toFixed(1)}</span>
                <span className="text-[#68736E] font-normal">({tour.reviewCount})</span>
              </div>
            </div>

            <Link to="/transfers">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#17231F] group-hover:text-[#176B52] transition-colors leading-snug">
                {tour.title}
              </h3>
            </Link>
            <p className="text-xs text-[#176B52] font-medium line-clamp-1">{tour.subtitle}</p>
            <p className="text-xs sm:text-sm text-[#68736E] line-clamp-2 leading-relaxed">{tour.overview}</p>
          </div>

          {/* Pricing & CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-stone-200/60">
            <div>
              <span className="text-[10px] text-[#68736E] block font-medium uppercase tracking-wider">Fixed Duration</span>
              <div className="flex items-baseline gap-1">
                <span className="font-serif text-2xl font-bold text-[#0B3D2E]">
                  {tour.durationDays} Days
                </span>
                <span className="text-xs text-[#68736E]">Private Tour</span>
              </div>
            </div>

            <Link
              to="/transfers"
              className="glass-btn-primary inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold rounded-xl text-white shadow-sm"
            >
              <span>View Tour</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#DDEFE8]" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Default Grid Layout
  return (
    <div className="glass-card-interactive liquid-glass-white rounded-3xl border border-white/80 overflow-hidden shadow-[0_10px_30px_-10px_rgba(6,44,34,0.08)] flex flex-col justify-between group">
      <div>
        {/* Card Image */}
        <div className="relative h-60 overflow-hidden">
          <img
            src={tour.heroImage}
            alt={tour.title}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
            loading="lazy"
            onError={(e) => handleImageError(e, 'tour')}
          />
          
          {/* Emerald Pill Badge */}
          <div className="absolute top-3.5 left-3.5">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#062C22]/80 text-[#DDEFE8] backdrop-blur-md border border-white/20 shadow-xs">
              {tour.featured ? 'SIGNATURE EXPERIENCE' : 'PRIVATE ITINERARY'}
            </span>
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-3.5 right-3.5 p-2.5 rounded-full backdrop-blur-md transition-colors shadow-xs ${
              isSaved 
                ? 'bg-[#39A982] text-white' 
                : 'bg-black/35 text-white hover:bg-white hover:text-[#176B52]'
            }`}
            title={isSaved ? 'Remove from Saved' : 'Save to Wishlist'}
            aria-label="Save to Wishlist"
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>

          {/* Duration Badge */}
          <div className="absolute bottom-3.5 left-3.5">
            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/90 text-[#0B3D2E] backdrop-blur-md shadow-xs">
              {tour.durationDays} Days / {tour.durationNights} Nights
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#176B52] uppercase tracking-wider text-[11px]">{tour.category}</span>
            <div className="flex items-center gap-1 font-semibold text-[#17231F]">
              <Star className="w-3.5 h-3.5 fill-[#39A982] text-[#39A982]" />
              <span>{tour.rating.toFixed(1)}</span>
              <span className="text-[#68736E] font-normal">({tour.reviewCount})</span>
            </div>
          </div>

          <Link to="/transfers">
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#17231F] group-hover:text-[#176B52] transition-colors leading-snug line-clamp-1">
              {tour.title}
            </h3>
          </Link>
          <p className="text-xs text-[#68736E] line-clamp-2 leading-relaxed">{tour.tagline || tour.overview}</p>
        </div>
      </div>

      {/* Footer / Price & Button */}
      <div className="px-6 pb-6 pt-3 border-t border-stone-200/60 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-[#68736E] block font-medium uppercase tracking-wider">Fixed Duration</span>
          <div className="flex items-baseline gap-1">
            <span className="font-serif text-xl sm:text-2xl font-bold text-[#0B3D2E]">
              {tour.durationDays} Days
            </span>
            <span className="text-[11px] text-[#68736E]">Private Tour</span>
          </div>
        </div>

        <Link
          to="/transfers"
          className="glass-btn-primary inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl text-white shadow-sm"
        >
          <span>View Tour</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#DDEFE8]" />
        </Link>
      </div>
    </div>
  );
};
