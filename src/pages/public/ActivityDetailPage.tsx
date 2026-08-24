import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  Clock, 
  MapPin, 
  Check, 
  Heart, 
  Sparkles, 
  ShieldCheck, 
  CreditCard, 
  Info
} from 'lucide-react';
import { activityService } from '../../services/activityService';
import { bookingService } from '../../services/bookingService';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { Modal } from '../../components/common/Modal';

export const ActivityDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const activity = activityService.getActivityBySlug(slug || '');
  const { user } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const navigate = useNavigate();

  const [date, setDate] = useState('2026-10-18');
  const [participants, setParticipants] = useState(2);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!activity) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <h2 className="font-serif text-3xl font-bold text-[#082F24] mb-4">Activity Not Found</h2>
        <Link to="/activities" className="px-6 py-3 bg-[#0D3B2E] text-white font-bold rounded-xl">
          Browse All Activities
        </Link>
      </div>
    );
  }

  const isSaved = isInWishlist(activity.id);

  const handleWishlistToggle = () => {
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

  const totalPrice = participants * activity.pricePerPerson;

  const handleConfirmActivityBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const newBooking = bookingService.createBooking({
        userId: user?.id || 'user-customer-1',
        customerName: user?.name || 'Sarah Jenkins',
        customerEmail: user?.email || 'sarah.traveler@example.com',
        customerPhone: user?.phone || '+44 7700 900077',
        type: 'activity_only',
        tourTitle: activity.title,
        tourImage: activity.image,
        startDate: date,
        endDate: date,
        adultsCount: participants,
        childrenCount: 0,
        infantsCount: 0,
        destinationsCovered: [activity.destination],
        travelers: [
          {
            title: 'Mr',
            fullName: user?.name || 'Sarah Jenkins',
            email: user?.email || 'sarah.traveler@example.com',
            phone: user?.phone || '+44 7700 900077',
            nationality: 'United Kingdom',
            isLead: true
          }
        ],
        basePrice: totalPrice,
        customizationTotal: 0,
        discountAmount: 0,
        taxAmount: 0,
        totalAmount: totalPrice,
        amountPaid: totalPrice,
        bookingStatus: 'Pending',
        paymentStatus: 'Fully Paid',
        paymentMethod: 'Credit / Debit Card'
      });

      setIsProcessing(false);
      setIsModalOpen(false);

      try {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}

      navigate(`/customer/bookings/${newBooking.id}`);
    }, 1000);
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header Breadcrumbs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-4">
          <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
            <Link to="/" className="hover:text-[#0D3B2E]">Home</Link>
            <span>/</span>
            <Link to="/activities" className="hover:text-[#0D3B2E]">Activities</Link>
            <span>/</span>
            <span className="text-[#8C6D2B] font-bold">{activity.title}</span>
          </div>

          <button
            onClick={handleWishlistToggle}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isSaved
                ? 'bg-rose-500 text-white border-rose-500'
                : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
            <span>{isSaved ? 'Saved to Wishlist' : 'Save Experience'}</span>
          </button>
        </div>

        {/* 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Media & Specs (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            
            <div className="relative h-96 rounded-3xl overflow-hidden shadow-md">
              <img
                src={activity.image}
                alt={activity.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-[#0D3B2E] text-[#E5C378]">
                {activity.category}
              </span>
            </div>

            <div className="space-y-3">
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#082F24]">
                {activity.title}
              </h1>
              <div className="flex items-center gap-4 text-xs font-medium text-stone-600">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#C5A059]" /> {activity.destination}</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-[#C5A059]" /> {activity.duration}</span>
                <span className="px-2 py-0.5 rounded-md bg-stone-100 font-bold">{activity.difficulty} Pace</span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-3">
              <h3 className="font-serif text-xl font-bold text-[#082F24]">Experience Description</h3>
              <p className="text-stone-600 leading-relaxed text-sm">{activity.description}</p>
            </div>

            {/* Highlights */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-3">
              <h3 className="font-serif text-xl font-bold text-[#082F24]">Highlights</h3>
              <div className="grid grid-cols-1 gap-2 text-sm text-stone-700">
                {activity.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#0D3B2E] shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Inclusions & What to bring */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-3">
                <h4 className="font-serif font-bold text-base text-[#082F24]">What’s Included</h4>
                <ul className="space-y-2 text-xs text-stone-600">
                  {activity.included.map((item, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-3">
                <h4 className="font-serif font-bold text-base text-[#082F24]">What to Bring</h4>
                <ul className="space-y-2 text-xs text-stone-600">
                  {activity.whatToBring.map((item, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <Info className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>

          {/* Right Column: Sticky Booking Widget (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xl space-y-6 sticky top-24">
              
              <div className="flex items-baseline justify-between border-b border-stone-100 pb-4">
                <div>
                  <span className="text-xs text-stone-400 font-semibold block uppercase">Price</span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-serif text-3xl font-bold text-[#082F24]">
                      ${activity.pricePerPerson}
                    </span>
                    <span className="text-xs text-stone-500">/ person</span>
                  </div>
                </div>
                <div className="text-xs font-bold text-[#0D3B2E]">
                  ★ {activity.rating.toFixed(1)} ({activity.reviewCount} reviews)
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#082F24] uppercase">Date of Activity</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm text-[#082F24]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#082F24] uppercase">Participants</label>
                  <select
                    value={participants}
                    onChange={(e) => setParticipants(Number(e.target.value))}
                    className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm text-[#082F24]"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                      <option key={n} value={n}>{n} Participant{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-stone-200/80 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>{participants} x ${activity.pricePerPerson}</span>
                  <span className="font-bold text-[#082F24]">${totalPrice}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#082F24] pt-2 border-t border-stone-200">
                  <span>Total Amount</span>
                  <span className="font-serif text-2xl text-[#0D3B2E]">${totalPrice}</span>
                </div>
              </div>

              <div className="space-y-2.5">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full py-4 bg-[#0D3B2E] hover:bg-[#134E3F] text-white font-bold text-sm rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4 text-[#E5C378]" />
                  <span>Book This Experience</span>
                </button>

                <Link
                  to={`/customize?activityId=${activity.id}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 bg-[#C5A059]/20 hover:bg-[#C5A059]/30 text-[#8C6D2B] font-bold text-xs rounded-xl transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Add to Custom Sri Lanka Trip</span>
                </Link>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-stone-500">
                <ShieldCheck className="w-4 h-4 text-[#0D3B2E] shrink-0" />
                <span>Instant booking confirmation with mobile digital voucher.</span>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Activity Booking Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Reserve Experience • Instant Confirmation"
        maxWidth="md"
      >
        <form onSubmit={handleConfirmActivityBooking} className="space-y-4">
          <div className="bg-[#FAF8F5] p-4 rounded-xl border border-stone-200 space-y-1">
            <h4 className="font-serif font-bold text-sm text-[#082F24]">{activity.title}</h4>
            <p className="text-xs text-stone-500">{date} • {participants} Participants • ${totalPrice} Total</p>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs text-stone-600">Lead Guest Name</label>
              <input
                type="text"
                required
                defaultValue={user?.name || 'Sarah Jenkins'}
                className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2 text-sm text-[#082F24]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-stone-600">Email Address</label>
              <input
                type="email"
                required
                defaultValue={user?.email || 'sarah.traveler@example.com'}
                className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2 text-sm text-[#082F24]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-stone-600">Phone / WhatsApp</label>
              <input
                type="tel"
                required
                defaultValue={user?.phone || '+44 7700 900077'}
                className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2 text-sm text-[#082F24]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-3.5 bg-[#0D3B2E] text-white font-bold text-sm rounded-xl shadow-lg hover:bg-[#134E3F] transition-all flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <span>Confirming Booking...</span>
            ) : (
              <>
                <CreditCard className="w-4 h-4 text-[#E5C378]" />
                <span>Confirm & Generate Voucher • ${totalPrice}</span>
              </>
            )}
          </button>
        </form>
      </Modal>
    </div>
  );
};
