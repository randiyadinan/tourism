import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
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
  ArrowRight,
  HelpCircle,
  CreditCard,
  CheckCircle2
} from 'lucide-react';
import { tourService } from '../../services/tourService';
import { reviewService } from '../../services/reviewService';
import { bookingService } from '../../services/bookingService';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { TourGallery } from '../../components/tours/TourGallery';
import { ItineraryTimeline } from '../../components/tours/ItineraryTimeline';
import { StickyBookingPanel } from '../../components/tours/StickyBookingPanel';
import { StarRating } from '../../components/common/StarRating';
import { Modal } from '../../components/common/Modal';

export const TourDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const tour = tourService.getTourBySlug(slug || '');
  const reviews = tour ? reviewService.getReviewsForTarget('tour', tour.id) : [];

  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingPayload, setBookingPayload] = useState<any>(null);

  // Instant Checkout Form state inside modal
  const [travelerName, setTravelerName] = useState(user?.name || 'Sarah Jenkins');
  const [travelerEmail, setTravelerEmail] = useState(user?.email || 'sarah.traveler@example.com');
  const [travelerPhone, setTravelerPhone] = useState(user?.phone || '+44 7700 900077');
  const [specialRequests, setSpecialRequests] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Credit / Debit Card' | 'PayPal' | 'Bank Wire Transfer' | 'Pay on Arrival / Deposit'>('Credit / Debit Card');
  const [isProcessing, setIsProcessing] = useState(false);

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
    setBookingPayload(details);
    setIsBookingModalOpen(true);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const newBooking = bookingService.createBooking({
        userId: user?.id || 'user-customer-1',
        customerName: travelerName,
        customerEmail: travelerEmail,
        customerPhone: travelerPhone,
        type: 'standard_tour',
        tourId: tour.id,
        tourTitle: tour.title,
        tourImage: tour.heroImage,
        startDate: bookingPayload?.startDate || '2026-10-15',
        endDate: new Date(new Date(bookingPayload?.startDate || '2026-10-15').getTime() + tour.durationDays * 86400000).toISOString().split('T')[0],
        adultsCount: bookingPayload?.adults || 2,
        childrenCount: bookingPayload?.children || 0,
        infantsCount: 0,
        destinationsCovered: tour.destinations,
        hotelTier: tour.accommodationType,
        vehicleType: tour.transportType,
        mealPlan: 'Half Board (Breakfast & Dinner)',
        airportPickup: bookingPayload?.airportPickup,
        travelers: [
          {
            title: 'Mr',
            fullName: travelerName,
            email: travelerEmail,
            phone: travelerPhone,
            nationality: 'United Kingdom',
            isLead: true,
            specialRequirements: specialRequests
          }
        ],
        basePrice: (bookingPayload?.adults || 2) * tour.pricePerPerson,
        customizationTotal: bookingPayload?.airportPickup ? 40 : 0,
        discountAmount: bookingPayload?.discountAmount || 0,
        discountCode: bookingPayload?.discountCode,
        taxAmount: 0,
        totalAmount: bookingPayload?.totalAmount || tour.pricePerPerson * 2,
        amountPaid: bookingPayload?.totalAmount || tour.pricePerPerson * 2,
        bookingStatus: 'Pending',
        paymentStatus: 'Fully Paid',
        paymentMethod: paymentMethod,
        notes: specialRequests
      });

      setIsProcessing(false);
      setIsBookingModalOpen(false);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // Safe confetti fallback
      }

      navigate(`/customer/bookings/${newBooking.id}`);
    }, 1000);
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

      {/* Instant Checkout Modal */}
      <Modal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        title="Complete Your Reservation • LankaVoyage"
        maxWidth="lg"
      >
        <form onSubmit={handleConfirmBooking} className="space-y-5">
          <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-stone-200 space-y-2">
            <h4 className="font-serif font-bold text-sm text-[#082F24]">{tour.title}</h4>
            <div className="flex items-center justify-between text-xs text-stone-600">
              <span>Dates: {bookingPayload?.startDate} ({tour.durationDays} Days)</span>
              <span className="font-bold text-[#082F24]">${bookingPayload?.totalAmount?.toLocaleString()} Total</span>
            </div>
          </div>

          {/* Traveler Details Form */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-[#082F24] uppercase tracking-wider block">
              Lead Traveler Contact Details
            </span>

            <div className="space-y-1">
              <label className="text-xs text-stone-600">Full Legal Name (as on Passport)</label>
              <input
                type="text"
                required
                value={travelerName}
                onChange={(e) => setTravelerName(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2 text-sm text-[#082F24]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-stone-600">Email Address</label>
                <input
                  type="email"
                  required
                  value={travelerEmail}
                  onChange={(e) => setTravelerEmail(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2 text-sm text-[#082F24]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-stone-600">Phone / WhatsApp</label>
                <input
                  type="tel"
                  required
                  value={travelerPhone}
                  onChange={(e) => setTravelerPhone(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2 text-sm text-[#082F24]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-stone-600">Special Dietary or Room Preferences</label>
              <textarea
                rows={2}
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="e.g. Vegetarian meals, high floor king suite, celebrating wedding anniversary..."
                className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2 text-xs text-[#082F24]"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2 pt-2 border-t border-stone-100">
            <span className="text-xs font-bold text-[#082F24] uppercase tracking-wider block">
              Payment Method (Demo Gateway)
            </span>
            <div className="grid grid-cols-2 gap-2">
              {(['Credit / Debit Card', 'PayPal', 'Bank Wire Transfer', 'Pay on Arrival / Deposit'] as const).map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setPaymentMethod(m)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                    paymentMethod === m 
                      ? 'bg-[#0D3B2E] text-white border-[#0D3B2E]' 
                      : 'bg-[#FAF8F5] text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Confirm Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 bg-gradient-to-r from-[#C5A059] to-[#A37F37] text-[#082F24] font-bold text-base rounded-2xl shadow-xl hover:from-[#E5C378] hover:to-[#C5A059] transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <span>Generating Digital Voucher...</span>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  <span>Confirm Booking • ${bookingPayload?.totalAmount?.toLocaleString()}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            <p className="text-[11px] text-stone-400 text-center mt-2">
              Instant PDF travel voucher and QR code generated upon confirmation.
            </p>
          </div>
        </form>
      </Modal>
    </div>
  );
};
