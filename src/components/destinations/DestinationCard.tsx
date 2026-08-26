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
    <div className="group relative bg-white rounded-3xl overflow-hidden shadow-[0_4px_20px_-4px_rgba(6,44,34,0.08)] hover:shadow-[0_20px_40px_-10px_rgba(6,44,34,0.18)] transition-all duration-300 flex flex-col justify-between h-[360px] border border-stone-200/70 transform hover:-translate-y-1">
      {/* Background Image */}
      <img
        src={destination.heroImage}
        alt={destination.name}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
        loading="lazy"
      />
      
      {/* Deep Forest Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#062C22]/92 via-[#062C22]/30 to-transparent" />

      {/* Top Details */}
      <div className="relative z-10 p-5 flex items-center justify-between">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/85 backdrop-blur-md text-[#0B3D2E] shadow-xs border border-white/60">
          {destination.province}
        </span>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`p-2.5 rounded-full backdrop-blur-md transition-colors shadow-xs ${
            isSaved 
              ? 'bg-[#39A982] text-white' 
              : 'bg-black/30 text-white hover:bg-white hover:text-[#176B52]'
          }`}
          title={isSaved ? 'Remove from Saved' : 'Save to Wishlist'}
          aria-label="Save to Wishlist"
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Bottom Content on Image */}
      <div className="relative z-10 p-6 space-y-2 text-white">
        <div className="flex items-center gap-1 text-[#39A982] text-xs font-semibold">
          <Star className="w-3.5 h-3.5 fill-current" />
          <span>{destination.rating.toFixed(1)}</span>
          <span className="text-stone-200 font-normal">({destination.recommendedDuration})</span>
        </div>

        <h3 className="font-serif text-2xl font-bold leading-tight drop-shadow-xs">
          {destination.name}
        </h3>

        <p className="text-xs text-stone-200 line-clamp-2 leading-relaxed">
          {destination.shortDescription}
        </p>

        <div className="pt-2 flex items-center justify-between">
          <span className="text-xs font-medium text-[#DDEFE8]">
            {destination.popularActivities.length} Island Highlights
          </span>
          <Link
            to={`/destinations/${destination.slug}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/20 hover:bg-white text-white hover:text-[#0B3D2E] text-xs font-semibold backdrop-blur-md transition-colors border border-white/30"
          >
            <span>Explore</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
