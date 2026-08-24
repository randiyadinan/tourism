import React, { useState } from 'react';
import { 
  Star, 
  ShieldCheck, 
  Plus, 
  CheckCircle2, 
  Filter 
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
    <div className="bg-[#FAF8F5] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200/80 pb-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0D3B2E]/10 text-[#0D3B2E] text-xs font-bold uppercase tracking-wider">
              <Star className="w-3.5 h-3.5 fill-[#C5A059] text-[#C5A059]" />
              Verified Guest Experiences
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#082F24]">
              Customer Reviews & Stories
            </h1>
            <p className="text-sm sm:text-base text-stone-600">
              Read transparent reviews from travelers who explored Sri Lanka with LankaVoyage.
            </p>
          </div>

          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#0D3B2E] text-white hover:bg-[#134E3F] text-xs font-bold rounded-xl shadow-lg transition-all"
          >
            <Plus className="w-4 h-4 text-[#E5C378]" />
            <span>Write a Guest Review</span>
          </button>
        </div>

        {/* Aggregate Ratings Scoreboard */}
        <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Big Score (4 cols) */}
          <div className="md:col-span-4 text-center md:text-left space-y-2 border-b md:border-b-0 md:border-r border-stone-100 pb-6 md:pb-0 md:pr-8">
            <span className="font-serif text-6xl font-bold text-[#082F24]">4.96</span>
            <div className="flex items-center justify-center md:justify-start gap-1 text-[#C5A059]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <p className="text-xs text-stone-500 font-medium">Based on 1,240+ verified traveler ratings</p>
          </div>

          {/* Rating Breakdown Bars (8 cols) */}
          <div className="md:col-span-8 space-y-2 text-xs">
            {[
              { stars: 5, pct: 96, count: '1,190' },
              { stars: 4, pct: 4, count: '48' },
              { stars: 3, pct: 0, count: '2' },
              { stars: 2, pct: 0, count: '0' },
              { stars: 1, pct: 0, count: '0' }
            ].map(row => (
              <div key={row.stars} className="flex items-center gap-3">
                <span className="w-12 font-bold text-stone-700">{row.stars} Stars</span>
                <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#C5A059] rounded-full" style={{ width: `${row.pct}%` }} />
                </div>
                <span className="w-12 text-right text-stone-400 font-medium">{row.count}</span>
              </div>
            ))}
          </div>

        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <span className="text-xs font-bold text-stone-500 uppercase flex items-center gap-1 mr-2">
            <Filter className="w-3.5 h-3.5 text-[#C5A059]" />
            Trip Style:
          </span>
          {['All', 'Couple / Honeymoon', 'Family Vacation', 'Solo Explorer', 'Friends Group'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedTripType(type)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedTripType === type
                  ? 'bg-[#0D3B2E] text-white shadow-sm'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Reviews List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white p-7 rounded-3xl border border-stone-200 shadow-sm space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Stars and Date */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#C5A059]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs text-stone-400 font-medium">{rev.date}</span>
                </div>

                <h3 className="font-serif text-lg font-bold text-[#082F24]">
                  "{rev.title}"
                </h3>

                <p className="text-xs text-stone-600 leading-relaxed italic">
                  "{rev.content}"
                </p>

                {rev.photos && rev.photos.length > 0 && (
                  <div className="flex items-center gap-2 pt-1">
                    {rev.photos.map((p, i) => (
                      <img
                        key={i}
                        src={p}
                        alt="Guest photo"
                        className="w-16 h-16 rounded-xl object-cover border border-stone-200"
                      />
                    ))}
                  </div>
                )}

                {rev.targetTitle && (
                  <div className="text-[11px] font-semibold text-[#8C6D2B] bg-[#C5A059]/10 px-3 py-1 rounded-lg inline-block">
                    Tour: {rev.targetTitle}
                  </div>
                )}

                {/* Management Response */}
                {rev.replyFromManagement && (
                  <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-stone-200/80 space-y-1 text-xs">
                    <div className="flex items-center justify-between text-[#0D3B2E] font-bold">
                      <span>{rev.replyFromManagement.responderName}</span>
                      <span className="text-stone-400 font-normal">{rev.replyFromManagement.date}</span>
                    </div>
                    <p className="text-stone-600 leading-relaxed">{rev.replyFromManagement.text}</p>
                  </div>
                )}
              </div>

              {/* Author Footer */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={rev.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                    alt={rev.authorName}
                    className="w-10 h-10 rounded-full object-cover border border-[#C5A059]"
                  />
                  <div>
                    <h5 className="font-bold text-xs text-[#082F24]">{rev.authorName}</h5>
                    <p className="text-[10px] text-stone-500">{rev.authorCountry} • {rev.tripType}</p>
                  </div>
                </div>

                {rev.verifiedTraveler && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Verified Traveler
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Review Submission Modal */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title="Share Your LankaVoyage Experience"
        maxWidth="md"
      >
        {submitSuccess ? (
          <div className="text-center py-6 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="font-serif text-lg font-bold text-[#082F24]">Review Submitted for Approval</h4>
            <p className="text-xs text-stone-500">Thank you for sharing your experience! Your review will appear after quality verification.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmitReview} className="space-y-4">
            
            {/* Rating Stars */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Overall Rating</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star className={`w-6 h-6 ${star <= newRating ? 'fill-[#C5A059] text-[#C5A059]' : 'text-stone-300'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Which Tour Did You Experience?</label>
              <select
                value={newTargetTourId}
                onChange={(e) => setNewTargetTourId(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2 text-xs text-[#082F24]"
              >
                <option value="">General LankaVoyage Experience</option>
                {allTours.map(t => (
                  <option key={t.id} value={t.id}>{t.title}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Travel Style</label>
              <select
                value={newTripType}
                onChange={(e) => setNewTripType(e.target.value as any)}
                className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2 text-xs text-[#082F24]"
              >
                <option value="Couple / Honeymoon">Couple / Honeymoon</option>
                <option value="Family Vacation">Family Vacation</option>
                <option value="Solo Explorer">Solo Explorer</option>
                <option value="Friends Group">Friends Group</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Review Headline</label>
              <input
                type="text"
                required
                placeholder="e.g. Unforgettable wildlife encounters and 5-star service"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2 text-xs text-[#082F24]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Your Detailed Experience</label>
              <textarea
                rows={4}
                required
                placeholder="Tell other travelers about your chauffeur, hotels, and memorable moments..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2 text-xs text-[#082F24]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#0D3B2E] text-white font-bold text-xs rounded-xl shadow-md hover:bg-[#134E3F] transition-colors"
            >
              Submit Review for Verification
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
};
