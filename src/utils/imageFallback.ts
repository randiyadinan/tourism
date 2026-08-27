import React from 'react';

export const DEFAULT_FALLBACK_IMAGES = {
  tour: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1200&q=80',
  destination: 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1200&q=80',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  activity: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
  hotel: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
  vehicle: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'
};

export function handleImageError(
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackType: keyof typeof DEFAULT_FALLBACK_IMAGES = 'tour'
) {
  const target = event.currentTarget;
  const fallback = DEFAULT_FALLBACK_IMAGES[fallbackType] || DEFAULT_FALLBACK_IMAGES.tour;
  if (target.src !== fallback) {
    target.onerror = null; // Prevent loop
    target.src = fallback;
  }
}
