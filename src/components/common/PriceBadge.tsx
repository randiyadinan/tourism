import React from 'react';

interface PriceBadgeProps {
  price: number;
  originalPrice?: number;
  unit?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const PriceBadge: React.FC<PriceBadgeProps> = ({
  price,
  originalPrice,
  unit = 'per person',
  size = 'md',
  className = ''
}) => {
  const isLarge = size === 'lg';
  const isSmall = size === 'sm';

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-baseline gap-1.5">
        <span className="text-xs text-stone-500 font-medium">From</span>
        <span className={`font-serif font-bold text-[#062C22] ${
          isLarge ? 'text-3xl' : isSmall ? 'text-base' : 'text-xl'
        }`}>
          ${price.toLocaleString()}
        </span>
        {originalPrice && originalPrice > price && (
          <span className="text-xs text-stone-400 line-through">
            ${originalPrice.toLocaleString()}
          </span>
        )}
      </div>
      {unit && (
        <span className="text-[11px] text-stone-500 -mt-1">{unit}</span>
      )}
    </div>
  );
};
