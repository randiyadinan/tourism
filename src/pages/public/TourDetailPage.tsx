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

export const TourDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { isInWishlist, toggleWishlist } = useWishlist();

  const tour = tourService.getTourBySlug(slug || '');
  const reviews = tour ? reviewService.getReviewsForTarget('tour', tour.id) : [];

  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  if (!tour) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <h2 className="font-serif text-3xl font-bold text-[#082F24] mb-4">Tour Not Found</h2>
        <p className="text-stone-600 mb-6">We could not find the requested tour itinerary.</p>
        <Link to="/tours" className="px-6 py-3 bg-[#0D3B2E] text-white font-bold rounded-xl">
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
    <div className="bg-[#FAF8F5] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Breadcrumbs & Actions Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-4">
          <div className="flex items-center gap-2 text-xs text-stone-500 font-medium flex-wrap">
            <Link to="/" className="hover:text-[#0D3B2E]">Home</Link>
            <span>/</span>
            <Link to="/tours" className="hover:text-[#0D3B2E]">Tours</Link>
            <span>/</span>
            <span className="text-[#8C6D2B] font-bold">{tour.title}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleWishlistToggle}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                isSaved
                  ? 'bg-rose-500 text-white border-rose-500'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
              <span>{isSaved ? 'Saved to Wishlist' : 'Save Tour'}</span>
            </button>
            <button
              onClick={() => navigator.clipboard?.writeText(window.location.href)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white text-stone-700 border border-stone-300 hover:bg-stone-50 transition-all"
              title="Copy link to clipboard"
            >
              <Share2 className="w-3.5 h-3.5 text-stone-500" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Title & Key Highlights Meta */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#0D3B2E] text-[#E5C378]">
              {tour.category}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white border border-stone-300 text-stone-700">
              {tour.difficulty} Pace
            </span>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-stone-300 text-xs font-bold text-[#082F24]">
              <StarRating rating={tour.rating} reviewCount={tour.reviewCount} size="sm" />
            </div>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#082F24] leading-tight">
            {tour.title}
          </h1>
          <p className="text-base text-[#8C6D2B] font-semibold">{tour.subtitle}</p>

          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-medium text-stone-600">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#C5A059]" />
              <span>{tour.durationDays} Days / {tour.durationNights} Nights</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#C5A059]" />
              <span>Starts & Ends in {tour.startLocation}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
              <span>Private Chauffeur-Guide Included</span>
            </div>
          </div>
        </div>

        {/* Photo Gallery Grid with Lightbox */}
        <TourGallery
          heroImage={tour.heroImage}
          gallery={tour.gallery}
          title={tour.title}
        />

        {/* Main 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Comprehensive Details (8 Cols) */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Overview */}
            <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm space-y-4">
              <h3 className="font-serif text-2xl font-bold text-[#082F24]">Tour Overview</h3>
              <p className="text-stone-600 leading-relaxed">{tour.overview}</p>

              {/* Key Highlights Bullets */}
              <div className="pt-4 space-y-3">
                <h4 className="font-serif font-bold text-base text-[#082F24]">Key Experience Highlights</h4>
                <div className="grid grid-cols-1 gap-2.5">
                  {tour.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-sm text-stone-700">
                      <div className="w-5 h-5 rounded-full bg-[#0D3B2E]/10 flex items-center justify-center text-[#0D3B2E] shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Interactive Day-by-Day Itinerary */}
            <ItineraryTimeline days={tour.itinerary} />

            {/* Inclusions & Exclusions */}
            <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm space-y-6">
              <h3 className="font-serif text-2xl font-bold text-[#082F24]">What’s Included & Excluded</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Inclusions */}
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Included with LankaVoyage
                  </span>
                  <ul className="space-y-2 text-xs text-stone-700">
                    {tour.inclusions.map((inc, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Exclusions */}
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                    <X className="w-4 h-4 text-rose-600" />
                    Not Included
                  </span>
                  <ul className="space-y-2 text-xs text-stone-700">
                    {tour.exclusions.map((exc, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <X className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                        <span>{exc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Accommodation & Transportation Specs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#0D3B2E]/10 flex items-center justify-center text-[#0D3B2E]">
                  <Hotel className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-lg font-bold text-[#082F24]">Accommodation Standards</h4>
                <p className="text-xs text-stone-600 leading-relaxed">{tour.accommodationType}</p>
                <span className="text-[11px] text-[#8C6D2B] font-semibold block">5-Star Resorts, Tea Bungalows & Heritage Boutique Mansions</span>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#0D3B2E]/10 flex items-center justify-center text-[#0D3B2E]">
                  <Car className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-lg font-bold text-[#082F24]">Private Transport & Chauffeur</h4>
                <p className="text-xs text-stone-600 leading-relaxed">{tour.transportType}</p>
                <span className="text-[11px] text-[#8C6D2B] font-semibold block">Complimentary Wi-Fi, Chilled King Coconuts & Air Conditioning</span>
              </div>
            </div>

            {/* FAQs Accordion */}
            {tour.faqs && tour.faqs.length > 0 && (
              <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm space-y-6">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-[#C5A059]" />
                  <h3 className="font-serif text-2xl font-bold text-[#082F24]">Frequently Asked Questions</h3>
                </div>

                <div className="space-y-3">
                  {tour.faqs.map((faq, idx) => {
                    const isOpen = openFaqIdx === idx;
                    return (
                      <div key={idx} className="border border-stone-200 rounded-2xl overflow-hidden">
                        <button
                          onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                          className="w-full p-4 text-left font-bold text-sm text-[#082F24] flex items-center justify-between gap-4 hover:bg-[#FAF8F5] transition-colors"
                        >
                          <span>{faq.question}</span>
                          <ChevronDown className={`w-4 h-4 text-stone-400 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-[#0D3B2E]' : ''}`} />
                        </button>
                        {isOpen && (
                          <div className="px-4 pb-4 text-xs text-stone-600 leading-relaxed border-t border-stone-100 pt-2 animate-fadeIn">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Verified Customer Reviews for this tour */}
            {reviews.length > 0 && (
              <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-2xl font-bold text-[#082F24]">Guest Reviews for this Tour</h3>
                  <div className="flex items-center gap-1 font-bold text-[#082F24] text-sm">
                    <Star className="w-4 h-4 fill-[#C5A059] text-[#C5A059]" />
                    <span>{tour.rating.toFixed(1)} / 5</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {reviews.map((r) => (
                    <div key={r.id} className="p-4 bg-[#FAF8F5] rounded-2xl border border-stone-200/70 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={r.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80'}
                            alt={r.authorName}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <span className="font-bold text-xs text-[#082F24]">{r.authorName}</span>
                          <span className="text-[11px] text-stone-400">({r.authorCountry})</span>
                        </div>
                        <div className="flex items-center gap-0.5 text-[#C5A059]">
                          {[...Array(r.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs font-bold text-[#082F24]">"{r.title}"</p>
                      <p className="text-xs text-stone-600 leading-relaxed">{r.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Sticky Booking Calculation Panel (4 Cols) */}
          <div className="lg:col-span-4">
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
