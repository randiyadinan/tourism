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
    <div className="group bg-white rounded-3xl border border-stone-200/70 overflow-hidden shadow-[0_4px_20px_-4px_rgba(7,94,99,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(7,94,99,0.12)] transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={activity.image}
          alt={activity.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#075E63]/85 via-transparent to-transparent" />

        {/* Category Badge */}
        <div className="absolute top-3.5 left-3.5">
          <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-[#075E63]/85 text-[#DDF5F0] backdrop-blur-md border border-white/20 shadow-xs">
            {activity.category}
          </span>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-3.5 right-3.5 p-2.5 rounded-full backdrop-blur-md transition-colors shadow-xs ${
            isSaved 
              ? 'bg-[#E98B6B] text-white' 
              : 'bg-black/30 text-white hover:bg-white hover:text-[#E98B6B]'
          }`}
          title={isSaved ? 'Remove from Saved' : 'Save to Wishlist'}
          aria-label="Save to Wishlist"
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {/* Location on image */}
        <div className="absolute bottom-3.5 left-3.5 flex items-center gap-1.5 text-white text-xs font-semibold drop-shadow-xs">
          <MapPin className="w-3.5 h-3.5 text-[#55C7C1]" />
          <span>{activity.destination}</span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-[#68736E]">
            <span className="flex items-center gap-1 font-medium text-[#0B7A75]">
              <Clock className="w-3.5 h-3.5" />
              {activity.duration}
            </span>
            <div className="flex items-center gap-1 font-semibold text-[#173238]">
              <Star className="w-3.5 h-3.5 fill-[#E98B6B] text-[#E98B6B]" />
              <span>{activity.rating.toFixed(1)}</span>
              <span className="text-[#68736E] font-normal">({activity.reviewCount})</span>
            </div>
          </div>

          <h3 className="font-serif text-lg font-bold text-[#173238] group-hover:text-[#0B7A75] transition-colors leading-snug line-clamp-1">
            {activity.title}
          </h3>
          <p className="text-xs sm:text-sm text-[#68736E] line-clamp-2 leading-relaxed">
            {activity.shortDescription}
          </p>
        </div>

        {/* Price & Action */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#68736E] block font-medium uppercase tracking-wider">From</span>
            <div className="flex items-baseline gap-1">
              <span className="font-serif text-xl font-bold text-[#075E63]">
                ${activity.pricePerPerson}
              </span>
              <span className="text-[11px] text-[#68736E]">/ person</span>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#0B7A75] group-hover:text-[#075E63] transition-colors">
            <span>Experience</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#55C7C1]" />
          </span>
        </div>
      </div>
    </div>
  );
};
