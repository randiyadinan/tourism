import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Clock, 
  MapPin, 
  Star, 
  ShieldCheck, 
  Check, 
  X, 
  Car, 
  Hotel, 
  ChevronDown, 
  Heart, 
  Share2, 
  HelpCircle,
  CheckCircle2
} from 'lucide-react';
import { tourService } from '../../services/tourService';
import { reviewService } from '../../services/reviewService';

import { useWishlist } from '../../context/WishlistContext';
import { TourGallery } from '../../components/tours/TourGallery';
import { ItineraryTimeline } from '../../components/tours/ItineraryTimeline';
import { StickyBookingPanel } from '../../components/tours/StickyBookingPanel';
import { StarRating } from '../../components/common/StarRating';
import { analytics } from '../../services/analytics';

export const TourDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { isInWishlist, toggleWishlist } = useWishlist();

  const tour = tourService.getTourBySlug(slug || '');
  const reviews = tour ? reviewService.getReviewsForTarget('tour', tour.id) : [];

  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  React.useEffect(() => {
    if (tour) {
      document.title = `${tour.title} | Sri Lanka Tours | LankaVoyage`;
      analytics.viewTour(tour.id, tour.title, tour.pricePerPerson);
    }
  }, [tour]);

  if (!tour) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <h2 className="font-serif text-3xl font-bold text-[#173238] mb-4">Tour Not Found</h2>
        <p className="text-[#68736E] mb-6">We could not find the requested tour itinerary.</p>
        <Link to="/tours" className="px-6 py-3 bg-[#075E63] text-white font-semibold rounded-2xl">
          Browse All Tours
        </Link>
      </div>
    );
  }

  const isSaved = isInWishlist(tour.id);

  const handleWishlistToggle = () => {
    toggleWishlist({
      id: `wl-${tour.id}`,
      type: 'tour',
      targetId: tour.id,
      title: tour.title,
      subtitle: tour.subtitle,
      image: tour.heroImage,
      price: tour.pricePerPerson,
      duration: `${tour.durationDays} Days`,
      slug: tour.slug
    });
  };

  const handleBookNowTrigger = (details: any) => {
    navigate('/checkout', {
      state: {
        tourId: tour.id,
        tourTitle: tour.title,
        tourImage: tour.heroImage,
        durationDays: tour.durationDays,
        startDate: details.startDate,
        adults: details.adults,
        children: details.children,
        airportPickup: details.airportPickup,
        discountCode: details.discountCode,
        discountAmount: details.discountAmount,
        totalAmount: details.totalAmount,
        destinations: tour.destinations,
        vehicleType: tour.transportType
      }
    });
  };

  return (
    <div className="bg-[#F6F1E7] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumbs & Actions Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-200/80 pb-4">
          <div className="flex items-center gap-2 text-xs text-[#68736E] font-medium flex-wrap">
            <Link to="/" className="hover:text-[#0B7A75]">Home</Link>
            <span>/</span>
            <Link to="/tours" className="hover:text-[#0B7A75]">Tours</Link>
            <span>/</span>
            <span className="text-[#0B7A75] font-semibold">{tour.title}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleWishlistToggle}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors shadow-2xs ${
                isSaved
                  ? 'bg-[#E98B6B] text-white border-[#E98B6B]'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
            <button
              onClick={() => navigator.clipboard?.writeText(window.location.href)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white text-stone-700 border border-stone-300 hover:bg-stone-50 transition-colors shadow-2xs"
              title="Copy link to clipboard"
            >
              <Share2 className="w-3.5 h-3.5 text-stone-500" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Title & Key Meta */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#075E63] text-white">
              {tour.category}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-white border border-stone-200 text-stone-700">
              {tour.difficulty} Pace
            </span>
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-stone-200 text-xs font-semibold text-[#173238]">
              <StarRating rating={tour.rating} reviewCount={tour.reviewCount} size="sm" />
            </div>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#173238] leading-tight">
            {tour.title}
          </h1>
          <p className="text-sm sm:text-base text-[#68736E] font-medium">{tour.subtitle}</p>

          <div className="flex flex-wrap items-center gap-6 pt-1 text-xs font-medium text-[#68736E]">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#0B7A75]" />
              <span>{tour.durationDays} Days / {tour.durationNights} Nights</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#0B7A75]" />
              <span>Starts & Ends in {tour.startLocation}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#0B7A75]" />
              <span>Private Chauffeur Included</span>
            </div>
          </div>
        </div>

        {/* Photo Gallery Grid */}
        <TourGallery
          heroImage={tour.heroImage}
          gallery={tour.gallery}
          title={tour.title}
        />

        {/* Main 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Comprehensive Details (8 Cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Overview on White */}
            <div className="bg-white rounded-3xl p-7 sm:p-8 border border-stone-200/80 shadow-[0_4px_20px_-4px_rgba(7,94,99,0.05)] space-y-4">
              <h2 className="font-serif text-2xl font-bold text-[#173238]">Tour Overview</h2>
              <p className="text-sm sm:text-base text-[#68736E] leading-relaxed">{tour.overview}</p>

              {/* Key Highlights Bullets */}
              <div className="pt-3 space-y-2.5">
                <h3 className="font-serif font-bold text-base text-[#173238]">Experience Highlights</h3>
                <div className="grid grid-cols-1 gap-2.5">
                  {tour.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700">
                      <div className="w-5 h-5 rounded-full bg-[#DDF5F0] flex items-center justify-center text-[#0B7A75] shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Day-by-Day Detailed Itinerary */}
            <div className="bg-white rounded-3xl p-7 sm:p-8 border border-stone-200/80 shadow-[0_4px_20px_-4px_rgba(7,94,99,0.05)] space-y-6">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <h2 className="font-serif text-2xl font-bold text-[#173238]">Day-by-Day Itinerary</h2>
                <span className="text-xs text-[#68736E] font-medium">{tour.durationDays} Days Complete Plan</span>
              </div>

              <ItineraryTimeline days={tour.itinerary} />
            </div>

            {/* Inclusions & Exclusions */}
            <div className="bg-white rounded-3xl p-7 sm:p-8 border border-stone-200/80 shadow-[0_4px_20px_-4px_rgba(7,94,99,0.05)] space-y-6">
              <h2 className="font-serif text-2xl font-bold text-[#173238]">What’s Included</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Inclusions */}
                <div className="space-y-3">
                  <span className="text-xs font-semibold text-[#0B7A75] uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#0B7A75]" />
                    Included in this Tour
                  </span>
                  <ul className="space-y-2">
                    {tour.inclusions.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-stone-700">
                        <Check className="w-3.5 h-3.5 text-[#0B7A75] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Exclusions */}
                <div className="space-y-3">
                  <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
                    <X className="w-4 h-4 text-stone-400" />
                    Not Included
                  </span>
                  <ul className="space-y-2">
                    {tour.exclusions.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-stone-500">
                        <X className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Accommodation & Vehicle Summary */}
            <div className="bg-white rounded-3xl p-7 sm:p-8 border border-stone-200/80 shadow-[0_4px_20px_-4px_rgba(7,94,99,0.05)] space-y-4">
              <h2 className="font-serif text-2xl font-bold text-[#173238]">Transport & Stays</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="p-4 bg-[#F6F1E7] rounded-2xl border border-stone-200/70 space-y-1.5">
                  <div className="flex items-center gap-2 font-semibold text-[#173238]">
                    <Hotel className="w-4 h-4 text-[#0B7A75]" />
                    <span>Accommodation Style</span>
                  </div>
                  <p className="text-xs text-[#68736E]">{tour.accommodationType}</p>
                </div>

                <div className="p-4 bg-[#F6F1E7] rounded-2xl border border-stone-200/70 space-y-1.5">
                  <div className="flex items-center gap-2 font-semibold text-[#173238]">
                    <Car className="w-4 h-4 text-[#0B7A75]" />
                    <span>Private Chauffeur Fleet</span>
                  </div>
                  <p className="text-xs text-[#68736E]">{tour.transportType}</p>
                </div>
              </div>
            </div>

            {/* FAQs Accordion */}
            {tour.faqs && tour.faqs.length > 0 && (
              <div className="bg-white rounded-3xl p-7 sm:p-8 border border-stone-200/80 shadow-[0_4px_20px_-4px_rgba(7,94,99,0.05)] space-y-4">
                <h2 className="font-serif text-2xl font-bold text-[#173238]">Frequently Asked Questions</h2>

                <div className="divide-y divide-stone-100">
                  {tour.faqs.map((faq, idx) => {
                    const isOpen = openFaqIdx === idx;
                    return (
                      <div key={idx} className="py-3.5">
                        <button
                          onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                          className="flex items-center justify-between w-full text-left font-semibold text-xs sm:text-sm text-[#173238] hover:text-[#0B7A75] transition-colors"
                        >
                          <span className="flex items-center gap-2">
                            <HelpCircle className="w-4 h-4 text-[#0B7A75] shrink-0" />
                            {faq.question}
                          </span>
                          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isOpen && (
                          <p className="pt-2 text-xs sm:text-sm text-[#68736E] leading-relaxed pl-6">
                            {faq.answer}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Verified Customer Reviews */}
            {reviews.length > 0 && (
              <div className="bg-white rounded-3xl p-7 sm:p-8 border border-stone-200/80 shadow-[0_4px_20px_-4px_rgba(7,94,99,0.05)] space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                  <h2 className="font-serif text-2xl font-bold text-[#173238]">Guest Reviews for this Tour</h2>
                  <div className="flex items-center gap-1 font-semibold text-[#173238] text-xs sm:text-sm">
                    <Star className="w-4 h-4 fill-[#E98B6B] text-[#E98B6B]" />
                    <span>{tour.rating.toFixed(1)} / 5</span>
                  </div>
                </div>

                <div className="space-y-3.5">
                  {reviews.map((r) => (
                    <div key={r.id} className="p-4 bg-[#F6F1E7] rounded-2xl border border-stone-200/70 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={r.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80'}
                            alt={r.authorName}
                            className="w-8 h-8 rounded-full object-cover border border-[#DDF5F0]"
                          />
                          <span className="font-semibold text-xs text-[#173238]">{r.authorName}</span>
                          <span className="text-[11px] text-stone-400">({r.authorCountry})</span>
                        </div>
                        <div className="flex items-center gap-0.5 text-[#E98B6B]">
                          {[...Array(r.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs font-semibold text-[#173238]">"{r.title}"</p>
                      <p className="text-xs text-[#68736E] leading-relaxed">{r.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Sticky Booking Panel (4 Cols) */}
          <div className="lg:col-span-4 sticky top-24">
            <StickyBookingPanel
              tour={tour}
              onBookNow={handleBookNowTrigger}
            />
          </div>

        </div>

      </div>
    </div>
  );
};
