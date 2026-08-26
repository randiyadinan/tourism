import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Star } from 'lucide-react';
import type { Destination } from '../../types';
import { useWishlist } from '../../context/WishlistContext';

interface DestinationCardProps {
  destination: Destination;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({ destination }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isSaved = isInWishlist(destination.id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      id: `wl-${destination.id}`,
      type: 'destination',
      targetId: destination.id,
      title: destination.name,
      subtitle: destination.tagline,
      image: destination.heroImage,
      price: destination.startingPrice,
      slug: destination.slug
    });
  };

  return (
    <div className="group bg-white rounded-xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={destination.heroImage}
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-white/90 text-[#12372A] shadow-xs">
            {destination.province}
          </span>
        </div>

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

        {/* Destination Name on Image */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-serif text-xl font-bold text-white leading-snug drop-shadow-xs">
            {destination.name}
          </h3>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>{destination.recommendedDuration}</span>
            <div className="flex items-center gap-1 font-semibold text-[#1F2933]">
              <Star className="w-3.5 h-3.5 fill-[#C8A45D] text-[#C8A45D]" />
              <span>{destination.rating.toFixed(1)}</span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed">
            {destination.shortDescription}
          </p>
        </div>

        {/* Explore Button */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
          <span className="text-xs font-semibold text-[#1F6F54]">
            {destination.popularActivities.length} Key Highlights
          </span>
          <Link
            to={`/destinations/${destination.slug}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#12372A] hover:text-[#1F6F54] transition-colors"
          >
            <span>Explore</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
