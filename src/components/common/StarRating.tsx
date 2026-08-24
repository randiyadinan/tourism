import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  reviewCount,
  showText = true,
  size = 'md',
  className = ''
}) => {
  const starSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.3;

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center text-[#C5A059]">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`${starSizes[size]} ${
              i < fullStars
                ? 'fill-[#C5A059] text-[#C5A059]'
                : i === fullStars && hasHalfStar
                ? 'fill-[#C5A059]/60 text-[#C5A059]'
                : 'text-stone-300 fill-transparent'
            }`}
          />
        ))}
      </div>
      {showText && (
        <span className={`font-bold text-[#082F24] ${textSizes[size]}`}>
          {rating.toFixed(1)}
          {reviewCount !== undefined && (
            <span className="text-stone-500 font-normal ml-1 text-xs">
              ({reviewCount})
            </span>
          )}
        </span>
      )}
    </div>
  );
};
