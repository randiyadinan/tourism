import React, { useState } from 'react';
import { 
  Star, 
  ShieldCheck, 
  Plus, 
  CheckCircle2 
} from 'lucide-react';
import { reviewService } from '../../services/reviewService';
import { tourService } from '../../services/tourService';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../../components/common/Modal';

export const ReviewsPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedTripType, setSelectedTripType] = useState('All');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Review submission state
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newTripType, setNewTripType] = useState<'Couple / Honeymoon' | 'Family Vacation' | 'Solo Explorer' | 'Friends Group'>('Couple / Honeymoon');
  const [newTargetTourId, setNewTargetTourId] = useState('');

  const allApproved = reviewService.getApprovedReviews();
  const allTours = tourService.getAllTours();

  const filteredReviews = selectedTripType === 'All'
    ? allApproved
    : allApproved.filter(r => r.tripType === selectedTripType);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    const tour = allTours.find(t => t.id === newTargetTourId);

    reviewService.submitReview({
      targetType: 'tour',
      targetId: newTargetTourId || undefined,
      targetTitle: tour ? tour.title : undefined,
      authorName: user?.name || 'Anonymous Traveler',
      authorCountry: user?.country || 'International',
      authorAvatar: user?.avatar,
      rating: newRating,
      title: newTitle,
      content: newContent,
      tripType: newTripType
    });

    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setIsSubmitModalOpen(false);
      setNewTitle('');
      setNewContent('');
    }, 2000);
  };

  return (
    <div className="bg-[#FAF8F2] min-h-screen py-10 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 border-b border-stone-200/80 pb-6">
          <div className="space-y-2.5 max-w-2xl">
            <span className="text-xs font-semibold text-[#1F6F54] uppercase tracking-wider">
              Traveler Feedback
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#12372A]">
              Guest Reviews & Stories
            </h1>
            <p className="text-sm sm:text-base text-stone-600">
              Read authentic feedback from travelers who explored Sri Lanka with LankaVoyage.
            </p>
          </div>

          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#12372A] text-white hover:bg-[#1F6F54] text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4 text-[#C8A45D]" />
            <span>Write a Review</span>
          </button>
        </div>

        {/* Aggregate Ratings Scoreboard */}
        <div className="bg-white p-6 sm:p-7 rounded-xl border border-stone-200/80 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Big Score (4 cols) */}
          <div className="md:col-span-4 text-center md:text-left space-y-1.5 border-b md:border-b-0 md:border-r border-stone-100 pb-5 md:pb-0 md:pr-6">
            <span className="font-serif text-5xl font-bold text-[#12372A]">4.96</span>
            <div className="flex items-center justify-center md:justify-start gap-1 text-[#C8A45D]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-stone-500 font-medium">Average Traveler Rating</p>
          </div>

          {/* Rating Pillars (8 cols) */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-[#FAF8F2] rounded-lg space-y-1">
              <span className="font-serif text-lg font-bold text-[#12372A]">5.0</span>
              <span className="text-xs text-stone-500 block font-medium">Chauffeur Service</span>
            </div>
            <div className="p-3 bg-[#FAF8F2] rounded-lg space-y-1">
              <span className="font-serif text-lg font-bold text-[#12372A]">4.9</span>
              <span className="text-xs text-stone-500 block font-medium">Hotel Comfort</span>
            </div>
            <div className="p-3 bg-[#FAF8F2] rounded-lg space-y-1">
              <span className="font-serif text-lg font-bold text-[#12372A]">5.0</span>
              <span className="text-xs text-stone-500 block font-medium">Itinerary Design</span>
            </div>
            <div className="p-3 bg-[#FAF8F2] rounded-lg space-y-1">
              <span className="font-serif text-lg font-bold text-[#12372A]">4.9</span>
              <span className="text-xs text-stone-500 block font-medium">Wildlife Encounters</span>
            </div>
          </div>

        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['All', 'Couple / Honeymoon', 'Family Vacation', 'Solo Explorer', 'Friends Group'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedTripType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedTripType === type
                    ? 'bg-[#12372A] text-white shadow-xs'
                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <span className="text-xs text-stone-500 font-medium">
            Showing {filteredReviews.length} Verified Reviews
          </span>
        </div>

        {/* Reviews Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-xl p-6 border border-stone-200/80 shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#C8A45D]">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>

                  {review.verifiedTraveler && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                      <ShieldCheck className="w-3 h-3 text-emerald-700" />
                      Verified Traveler
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-lg font-bold text-[#12372A]">
                  "{review.title}"
                </h3>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {review.content}
                </p>

                {review.targetTitle && (
                  <div className="text-xs font-medium text-[#1F6F54] bg-[#1F6F54]/10 px-2.5 py-1 rounded-md inline-block">
                    Tour: {review.targetTitle}
                  </div>
                )}
              </div>

              {/* Author and Date Footer */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <img
                    src={review.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                    alt={review.authorName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-stone-800">{review.authorName}</h4>
                    <span className="text-[11px] text-stone-400">{review.authorCountry} • {review.tripType}</span>
                  </div>
                </div>

                <span className="text-stone-400 text-[11px]">{review.date}</span>
              </div>

              {/* Management Response if present */}
              {review.replyFromManagement && (
                <div className="p-3.5 bg-[#FAF8F2] rounded-lg border border-stone-200/70 text-xs space-y-1 text-stone-700">
                  <div className="flex items-center justify-between font-semibold text-[#12372A]">
                    <span>Reply from {review.replyFromManagement.responderName}</span>
                    <span className="text-[10px] text-stone-400">{review.replyFromManagement.date}</span>
                  </div>
                  <p className="text-stone-600 italic leading-relaxed">
                    "{review.replyFromManagement.text}"
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Submit Review Modal */}
        <Modal
          isOpen={isSubmitModalOpen}
          onClose={() => setIsSubmitModalOpen(false)}
          title="Share Your LankaVoyage Experience"
        >
          {submitSuccess ? (
            <div className="py-8 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="font-serif text-xl font-bold text-[#12372A]">Review Submitted</h3>
              <p className="text-xs text-stone-600">
                Thank you for sharing your experience! Your review will be published shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-[#1F2933]">Tour Experience (Optional)</label>
                <select
                  value={newTargetTourId}
                  onChange={(e) => setNewTargetTourId(e.target.value)}
                  className="w-full bg-[#FAF8F2] border border-stone-300 rounded-lg p-2.5 font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#1F6F54]"
                >
                  <option value="">General LankaVoyage Review</option>
                  {allTours.map(t => (
                    <option key={t.id} value={t.id}>{t.title}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#1F2933]">Your Rating (1 - 5 Stars)</label>
                  <select
                    value={newRating}
                    onChange={(e) => setNewRating(Number(e.target.value))}
                    className="w-full bg-[#FAF8F2] border border-stone-300 rounded-lg p-2.5 font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#1F6F54]"
                  >
                    <option value={5}>5 Stars - Outstanding</option>
                    <option value={4}>4 Stars - Very Good</option>
                    <option value={3}>3 Stars - Average</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#1F2933]">Trip Type</label>
                  <select
                    value={newTripType}
                    onChange={(e) => setNewTripType(e.target.value as any)}
                    className="w-full bg-[#FAF8F2] border border-stone-300 rounded-lg p-2.5 font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#1F6F54]"
                  >
                    <option value="Couple / Honeymoon">Couple / Honeymoon</option>
                    <option value="Family Vacation">Family Vacation</option>
                    <option value="Solo Explorer">Solo Explorer</option>
                    <option value="Friends Group">Friends Group</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#1F2933]">Review Headline *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Unforgettable wildlife encounters and 5-star service"
                  className="w-full bg-[#FAF8F2] border border-stone-300 rounded-lg p-2.5 font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#1F6F54]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#1F2933]">Your Review Details *</label>
                <textarea
                  required
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Describe your tour, chauffeur experience, hotel highlights, or special moments..."
                  className="w-full bg-[#FAF8F2] border border-stone-300 rounded-lg p-2.5 font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#1F6F54]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#12372A] hover:bg-[#1F6F54] text-white font-semibold rounded-lg shadow-xs"
                >
                  Submit Review
                </button>
              </div>
            </form>
          )}
        </Modal>

      </div>
    </div>
  );
};
