import React from 'react';
import { Clock, MapPin, Star, Heart, ArrowRight } from 'lucide-react';
import type { Activity } from '../../types';
import { useWishlist } from '../../context/WishlistContext';

interface ActivityCardProps {
  activity: Activity;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isSaved = isInWishlist(activity.id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      id: `wl-${activity.id}`,
      type: 'activity',
      targetId: activity.id,
      title: activity.title,
      subtitle: activity.destination,
      image: activity.image,
      price: activity.pricePerPerson,
      duration: activity.duration,
      slug: activity.id
    });
  };

  return (
    <div className="group bg-white rounded-xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between">
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={activity.image}
          alt={activity.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#0D3B2E]/90 text-white backdrop-blur-xs">
            {activity.category}
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

        {/* Location on image */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white text-xs font-semibold drop-shadow-xs">
          <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>{activity.destination}</span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-[#66716C]">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#1F6B50]" />
              {activity.duration}
            </span>
            <div className="flex items-center gap-1 font-semibold text-[#17231F]">
              <Star className="w-3.5 h-3.5 fill-[#C5A059] text-[#C5A059]" />
              <span>{activity.rating.toFixed(1)}</span>
              <span className="text-[#66716C] font-normal">({activity.reviewCount})</span>
            </div>
          </div>

          <h3 className="font-serif text-lg font-bold text-[#0D3B2E] group-hover:text-[#1F6B50] transition-colors leading-snug line-clamp-1">
            {activity.title}
          </h3>
          <p className="text-xs sm:text-sm text-[#66716C] line-clamp-2 leading-relaxed">
            {activity.shortDescription}
          </p>
        </div>

        {/* Price & Action */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#66716C] block font-medium uppercase tracking-wider">From</span>
            <div className="flex items-baseline gap-1">
              <span className="font-serif text-xl font-bold text-[#0D3B2E]">
                ${activity.pricePerPerson}
              </span>
              <span className="text-[11px] text-[#66716C]">/ person</span>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#0D3B2E] group-hover:text-[#1F6B50] transition-colors">
            <span>Experience</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
};
