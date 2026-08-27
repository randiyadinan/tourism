import React, { useState } from 'react';
import { Camera, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { handleImageError } from '../../utils/imageFallback';

interface TourGalleryProps {
  heroImage: string;
  gallery: string[];
  title: string;
}

export const TourGallery: React.FC<TourGalleryProps> = ({ heroImage, gallery, title }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

  // Compile unique array of all images
  const allImages = [heroImage, ...(gallery || [])].filter((v, i, a) => a.indexOf(v) === i && !!v);

  const openLightbox = (index: number) => {
    setCurrentIdx(index);
    setLightboxOpen(true);
  };

  const nextImage = () => {
    setCurrentIdx((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentIdx((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <div className="space-y-3">
      {/* 5-Image Luxury Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 h-[380px] md:h-[480px] rounded-3xl overflow-hidden">
        
        {/* Main Large Image */}
        <div 
          onClick={() => openLightbox(0)}
          className="md:col-span-2 relative h-full cursor-pointer group overflow-hidden"
        >
          <img
            src={allImages[0]}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            onError={(e) => handleImageError(e, 'tour')}
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
        </div>

        {/* 2 Middle Stacked Images */}
        <div className="hidden md:grid grid-rows-2 gap-3 h-full">
          {allImages.slice(1, 3).map((img, i) => (
            <div 
              key={i} 
              onClick={() => openLightbox(i + 1)}
              className="relative h-full cursor-pointer group overflow-hidden"
            >
              <img
                src={img}
                alt={`${title} - ${i + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                onError={(e) => handleImageError(e, 'tour')}
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
            </div>
          ))}
        </div>

        {/* 2 Right Stacked Images with "View All" Button on last */}
        <div className="hidden md:grid grid-rows-2 gap-3 h-full">
          {allImages.slice(3, 5).map((img, i) => (
            <div 
              key={i} 
              onClick={() => openLightbox(i + 3)}
              className="relative h-full cursor-pointer group overflow-hidden"
            >
              <img
                src={img}
                alt={`${title} - ${i + 3}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                onError={(e) => handleImageError(e, 'tour')}
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
              {i === 1 && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center text-white font-bold text-sm gap-2">
                  <Camera className="w-4 h-4 text-[#39A982]" />
                  <span>+{allImages.length} Photos</span>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextImage}
            className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="max-w-5xl max-h-[85vh] overflow-hidden rounded-2xl">
            <img
              src={allImages[currentIdx]}
              alt={title}
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
              onError={(e) => handleImageError(e, 'tour')}
            />
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 text-xs font-semibold bg-black/50 px-4 py-1.5 rounded-full border border-white/20">
            {currentIdx + 1} / {allImages.length}
          </div>
        </div>
      )}
    </div>
  );
};
