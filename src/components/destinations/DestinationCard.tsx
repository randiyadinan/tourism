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
    <div className="group relative bg-white rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-[360px] border border-stone-200/80 transform hover:-translate-y-1">
      {/* Background Image */}
      <img
        src={destination.heroImage}
        alt={destination.name}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
        loading="lazy"
      />
      
      {/* Tropical Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

      {/* Top Details */}
      <div className="relative z-10 p-5 flex items-center justify-between">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-[#075E67] backdrop-blur-xs shadow-xs">
          {destination.province}
        </span>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`p-2.5 rounded-full backdrop-blur-md transition-colors shadow-xs ${
            isSaved 
              ? 'bg-rose-500 text-white' 
              : 'bg-black/30 text-white hover:bg-white hover:text-rose-500'
          }`}
          title={isSaved ? 'Remove from Saved' : 'Save to Wishlist'}
          aria-label="Save to Wishlist"
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Bottom Content on Image */}
      <div className="relative z-10 p-6 space-y-2 text-white">
        <div className="flex items-center gap-1 text-[#E7B85C] text-xs font-semibold">
          <Star className="w-3.5 h-3.5 fill-current" />
          <span>{destination.rating.toFixed(1)}</span>
          <span className="text-stone-300 font-normal">({destination.recommendedDuration})</span>
        </div>

        <h3 className="font-serif text-2xl font-bold leading-tight drop-shadow-xs">
          {destination.name}
        </h3>

        <p className="text-xs text-stone-200 line-clamp-2 leading-relaxed">
          {destination.shortDescription}
        </p>

        <div className="pt-2 flex items-center justify-between">
          <span className="text-xs font-medium text-[#F3D6A4]">
            {destination.popularActivities.length} Island Highlights
          </span>
          <Link
            to={`/destinations/${destination.slug}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/20 hover:bg-white text-white hover:text-[#075E67] text-xs font-semibold backdrop-blur-md transition-colors"
          >
            <span>Explore</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
