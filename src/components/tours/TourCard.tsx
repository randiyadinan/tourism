import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, Star, Heart, ArrowRight, Sparkles, Users } from 'lucide-react';
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
      <div className="group bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row luxury-card">
        {/* Image */}
        <div className="relative md:w-2/5 h-64 md:h-auto overflow-hidden">
          <img
            src={tour.heroImage}
            alt={tour.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:hidden" />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {tour.featured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#0D3B2E] text-[#E5C378] border border-[#C5A059]/40 shadow-md">
                <Sparkles className="w-3 h-3 text-[#E5C378]" />
                Signature Luxury
              </span>
            )}
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-black/60 backdrop-blur-md text-white border border-white/20">
              {tour.category}
            </span>
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all shadow-md ${
              isSaved 
                ? 'bg-rose-500 text-white' 
                : 'bg-black/40 text-white hover:bg-white hover:text-rose-500'
            }`}
            title={isSaved ? 'Remove from Saved' : 'Save to Wishlist'}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:w-3/5 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-stone-500">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 font-semibold text-[#0D3B2E]">
                  <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
                  {tour.durationDays} Days / {tour.durationNights} Nights
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-stone-400" />
                  Max {tour.groupSizeMax}
                </span>
              </div>
              <div className="flex items-center gap-1 font-bold text-[#082F24]">
                <Star className="w-3.5 h-3.5 fill-[#C5A059] text-[#C5A059]" />
                {tour.rating.toFixed(1)} <span className="text-stone-400 font-normal">({tour.reviewCount})</span>
              </div>
            </div>

            <Link to={`/tours/${tour.slug}`}>
              <h3 className="font-serif text-xl font-bold text-[#082F24] group-hover:text-[#2b705c] transition-colors leading-tight">
                {tour.title}
              </h3>
            </Link>
            <p className="text-xs text-[#8C6D2B] font-medium line-clamp-1">{tour.subtitle}</p>
            <p className="text-sm text-stone-600 line-clamp-2 leading-relaxed">{tour.overview}</p>

            {/* Destinations list */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <MapPin className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
              <span className="text-xs text-stone-500 font-medium truncate">
                {tour.destinations.join(' • ')}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-stone-500 block">From</span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-2xl font-bold text-[#082F24]">
                  ${tour.pricePerPerson.toLocaleString()}
                </span>
                {tour.originalPrice && (
                  <span className="text-xs text-stone-400 line-through">
                    ${tour.originalPrice.toLocaleString()}
                  </span>
                )}
                <span className="text-xs text-stone-500">/ person</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to={`/customize?tourId=${tour.id}`}
                className="px-3.5 py-2 text-xs font-semibold rounded-xl text-[#0D3B2E] bg-[#0D3B2E]/10 hover:bg-[#0D3B2E]/20 transition-colors"
              >
                Customize
              </Link>
              <Link
                to={`/tours/${tour.slug}`}
                className="inline-flex items-center gap-1 px-4 py-2 text-xs font-bold rounded-xl bg-[#0D3B2E] text-white hover:bg-[#134E3F] transition-colors shadow-sm"
              >
                View Details
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default Grid Layout
  return (
    <div className="group bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between luxury-card">
      {/* Top Media */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={tour.heroImage}
          alt={tour.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {tour.featured && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#0D3B2E] text-[#E5C378] border border-[#C5A059]/40 shadow-md">
              <Sparkles className="w-3 h-3 text-[#E5C378]" />
              Signature Luxury
            </span>
          )}
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-black/60 backdrop-blur-md text-white border border-white/20">
            {tour.category}
          </span>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all shadow-md ${
            isSaved 
              ? 'bg-rose-500 text-white' 
              : 'bg-black/40 text-white hover:bg-white hover:text-rose-500'
          }`}
          title={isSaved ? 'Remove from Saved' : 'Save to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {/* Duration Pill */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-white text-xs font-semibold border border-white/10">
          <Clock className="w-3.5 h-3.5 text-[#E5C378]" />
          <span>{tour.durationDays} Days / {tour.durationNights} Nights</span>
        </div>

        {/* Rating */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-md text-[#082F24] text-xs font-bold shadow-sm">
          <Star className="w-3.5 h-3.5 fill-[#C5A059] text-[#C5A059]" />
          <span>{tour.rating.toFixed(1)}</span>
          <span className="text-stone-400 font-normal">({tour.reviewCount})</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col justify-between flex-1 space-y-3">
        <div className="space-y-1.5">
          <div className="flex items-center gap-1 text-[11px] text-stone-500 font-medium truncate">
            <MapPin className="w-3 h-3 text-[#C5A059] shrink-0" />
            <span className="truncate">{tour.destinations.join(' • ')}</span>
          </div>

          <Link to={`/tours/${tour.slug}`}>
            <h3 className="font-serif text-lg font-bold text-[#082F24] group-hover:text-[#2b705c] transition-colors leading-snug line-clamp-2">
              {tour.title}
            </h3>
          </Link>
          <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">{tour.tagline}</p>
        </div>

        {/* Price & Action */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold block">From</span>
            <div className="flex items-baseline gap-1">
              <span className="font-serif text-xl font-bold text-[#082F24]">
                ${tour.pricePerPerson.toLocaleString()}
              </span>
              {tour.originalPrice && (
                <span className="text-xs text-stone-400 line-through">
                  ${tour.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <Link
            to={`/tours/${tour.slug}`}
            className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-bold rounded-xl bg-[#0D3B2E] text-white hover:bg-[#134E3F] transition-all shadow-sm group-hover:bg-[#C5A059] group-hover:text-[#082F24]"
          >
            Explore
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
