import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Star, Heart, ArrowRight } from 'lucide-react';
import type { Tour } from '../../types';
import { useWishlist } from '../../context/WishlistContext';

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
      <div className="group bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col md:flex-row">
        {/* Image */}
        <div className="relative md:w-2/5 h-60 md:h-auto overflow-hidden">
          <img
            src={tour.heroImage}
            alt={tour.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors shadow-xs ${
              isSaved 
                ? 'bg-rose-600 text-white' 
                : 'bg-black/40 text-white hover:bg-white hover:text-rose-600'
            }`}
            title={isSaved ? 'Remove from Saved' : 'Save to Wishlist'}
            aria-label="Save to Wishlist"
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 md:p-6 md:w-3/5 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span className="flex items-center gap-1 font-semibold text-[#1F6F54]">
                <Clock className="w-3.5 h-3.5" />
                {tour.durationDays} Days / {tour.durationNights} Nights
              </span>
              <div className="flex items-center gap-1 font-semibold text-[#1F2933]">
                <Star className="w-3.5 h-3.5 fill-[#C8A45D] text-[#C8A45D]" />
                <span>{tour.rating.toFixed(1)}</span>
                <span className="text-stone-400 font-normal">({tour.reviewCount})</span>
              </div>
            </div>

            <Link to={`/tours/${tour.slug}`}>
              <h3 className="font-serif text-xl font-bold text-[#12372A] group-hover:text-[#1F6F54] transition-colors leading-snug">
                {tour.title}
              </h3>
            </Link>
            <p className="text-xs text-stone-500 font-medium line-clamp-1">{tour.subtitle}</p>
            <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed">{tour.overview}</p>
          </div>

          {/* Pricing & CTA */}
          <div className="flex items-center justify-between pt-3 border-t border-stone-100">
            <div>
              <span className="text-[11px] text-stone-400 block font-medium uppercase tracking-wider">From</span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-2xl font-bold text-[#12372A]">
                  ${tour.pricePerPerson.toLocaleString()}
                </span>
                <span className="text-xs text-stone-500">/ person</span>
              </div>
            </div>

            <Link
              to={`/tours/${tour.slug}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-[#12372A] hover:bg-[#1F6F54] text-white transition-colors"
            >
              <span>View Tour</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Grid Layout (Default)
  return (
    <div className="group bg-white rounded-xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Card Image */}
        <div className="relative h-56 overflow-hidden">
          <img
            src={tour.heroImage}
            alt={tour.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors shadow-xs ${
              isSaved 
                ? 'bg-rose-600 text-white' 
                : 'bg-black/40 text-white hover:bg-white hover:text-rose-600'
            }`}
            title={isSaved ? 'Remove from Saved' : 'Save to Wishlist'}
            aria-label="Save to Wishlist"
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>

          <div className="absolute bottom-3 left-3">
            <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#12372A]/90 text-white backdrop-blur-xs">
              {tour.durationDays} Days
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 space-y-2.5">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="text-stone-500 font-medium">{tour.category}</span>
            <div className="flex items-center gap-1 font-semibold text-[#1F2933]">
              <Star className="w-3.5 h-3.5 fill-[#C8A45D] text-[#C8A45D]" />
              <span>{tour.rating.toFixed(1)}</span>
              <span className="text-stone-400 font-normal">({tour.reviewCount})</span>
            </div>
          </div>

          <Link to={`/tours/${tour.slug}`}>
            <h3 className="font-serif text-lg font-bold text-[#12372A] group-hover:text-[#1F6F54] transition-colors leading-snug line-clamp-1">
              {tour.title}
            </h3>
          </Link>
          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">{tour.tagline || tour.overview}</p>
        </div>
      </div>

      {/* Footer / Price & Button */}
      <div className="px-5 pb-5 pt-3 border-t border-stone-100 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-stone-400 block font-medium uppercase tracking-wider">From</span>
          <div className="flex items-baseline gap-1">
            <span className="font-serif text-xl font-bold text-[#12372A]">
              ${tour.pricePerPerson.toLocaleString()}
            </span>
            <span className="text-[11px] text-stone-500">/ person</span>
          </div>
        </div>

        <Link
          to={`/tours/${tour.slug}`}
          className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#12372A] hover:bg-[#1F6F54] text-white transition-colors"
        >
          <span>View Tour</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
