import React from 'react';
import { Link } from 'react-router-dom';
import {  Calendar, ArrowRight, Heart, Star, Compass } from 'lucide-react';
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
    <div className="group bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between luxury-card">
      {/* Image Container */}
      <div className="relative h-60 overflow-hidden">
        <img
          src={destination.heroImage}
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#082F24]/90 via-[#082F24]/30 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-md text-[#0D3B2E] border border-white/40 shadow-sm">
            {destination.province}
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

        {/* Name & Sinhala Script on Image */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="flex items-baseline gap-2">
            <h3 className="font-serif text-2xl font-bold tracking-wide">{destination.name}</h3>
            {destination.sinhalaName && (
              <span className="text-xs text-[#E5C378] font-medium tracking-normal opacity-90">
                {destination.sinhalaName}
              </span>
            )}
          </div>
          <p className="text-xs text-stone-200 line-clamp-1 font-medium mt-0.5">{destination.tagline}</p>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col justify-between flex-1 space-y-4">
        <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">{destination.shortDescription}</p>

        {/* Quick Meta */}
        <div className="space-y-2 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
            <span className="truncate"><strong>Best Season:</strong> {destination.bestTimeToVisit}</span>
          </div>
          <div className="flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
            <span><strong>Suggested Stay:</strong> {destination.recommendedDuration}</span>
          </div>
        </div>

        {/* Footer with Price and Link */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs font-bold text-[#082F24]">
            <Star className="w-3.5 h-3.5 fill-[#C5A059] text-[#C5A059]" />
            <span>{destination.rating.toFixed(1)}</span>
            <span className="text-stone-400 font-normal">({destination.reviewCount})</span>
          </div>

          <Link
            to={`/destinations/${destination.slug}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-[#0D3B2E] text-white hover:bg-[#134E3F] transition-all shadow-sm group-hover:bg-[#C5A059] group-hover:text-[#082F24]"
          >
            Explore Region
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
