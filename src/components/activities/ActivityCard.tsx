import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin,  Heart, ArrowRight, Plus } from 'lucide-react';
import type { Activity } from '../../types';
import { useWishlist } from '../../context/WishlistContext';

interface ActivityCardProps {
  activity: Activity;
  onAddToTrip?: (activity: Activity) => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onAddToTrip }) => {
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
      image: activity.image,
      price: activity.pricePerPerson,
      duration: activity.duration,
      location: activity.destination,
      slug: activity.slug
    });
  };

  return (
    <div className="group bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between luxury-card">
      {/* Top Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={activity.image}
          alt={activity.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Category Pill */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#0D3B2E] text-[#E5C378] border border-[#C5A059]/40 shadow-sm">
            {activity.category}
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

        {/* Duration & Difficulty */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white text-[11px]">
            <Clock className="w-3 h-3 text-[#E5C378]" />
            <span>{activity.duration}</span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-white text-[11px] font-medium border border-white/20">
            {activity.difficulty}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col justify-between flex-1 space-y-3">
        <div className="space-y-1.5">
          <div className="flex items-center gap-1 text-xs text-stone-500 font-medium">
            <MapPin className="w-3 h-3 text-[#C5A059] shrink-0" />
            <span>{activity.destination}</span>
          </div>

          <Link to={`/activities/${activity.slug}`}>
            <h3 className="font-serif text-lg font-bold text-[#082F24] group-hover:text-[#2b705c] transition-colors leading-snug line-clamp-2">
              {activity.title}
            </h3>
          </Link>
          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">{activity.shortDescription}</p>
        </div>

        {/* Actions */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-[#8C6D2B]">
            <span>Experience</span>
          </div>

          <div className="flex items-center gap-1.5">
            {onAddToTrip ? (
              <button
                onClick={() => onAddToTrip(activity)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#134E3F] text-white hover:bg-[#0D3B2E] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Select
              </button>
            ) : (
              <Link
                to={`/customize?activityId=${activity.id}`}
                className="px-2.5 py-1.5 text-[11px] font-semibold rounded-lg bg-[#0D3B2E]/10 text-[#0D3B2E] hover:bg-[#0D3B2E] hover:text-white transition-colors"
              >
                + Add to Trip
              </Link>
            )}

            <Link
              to={`/activities/${activity.slug}`}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg bg-[#0D3B2E] text-white hover:bg-[#C5A059] hover:text-[#082F24] transition-colors shadow-sm"
            >
              Details
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
