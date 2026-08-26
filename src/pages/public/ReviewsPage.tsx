import React, { useState, useMemo } from 'react';
import { 
  Star, 
  ShieldCheck, 
  MessageSquarePlus, 
  X, 
  Search,
  CheckCircle2,
  Quote,
  Sparkles
} from 'lucide-react';
import { reviewService } from '../../services/reviewService';
import type { Review } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { EmptyState } from '../../components/common/EmptyState';

export const ReviewsPage: React.FC = () => {
  const { user } = useAuth();
  const [reviewsList, setReviewsList] = useState<Review[]>(() => reviewService.getAllReviews());
  const [selectedRating, setSelectedRating] = useState<number | 'All'>('All');
  const [selectedTripType, setSelectedTripType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Submit Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [formRating, setFormRating] = useState(5);
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formTripType, setFormTripType] = useState<'Couple / Honeymoon' | 'Family Vacation' | 'Solo Explorer' | 'Friends Group'>('Couple / Honeymoon');
  const [formAuthorName, setFormAuthorName] = useState(user?.name || '');
  const [formAuthorCountry, setFormAuthorCountry] = useState(user?.country || 'United Kingdom');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const tripTypes = ['All', 'Couple / Honeymoon', 'Family Vacation', 'Solo Explorer', 'Friends Group'];

  // Score statistics
  const stats = useMemo(() => {
    const total = reviewsList.length;
    const avg = total > 0 ? reviewsList.reduce((acc, r) => acc + r.rating, 0) / total : 5;
    const fiveStars = reviewsList.filter(r => r.rating === 5).length;
    const fourStars = reviewsList.filter(r => r.rating === 4).length;
    return { total, avg: avg.toFixed(2), fiveStars, fourStars };
  }, [reviewsList]);

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    return reviewsList.filter(r => {
      const matchRating = selectedRating === 'All' || r.rating === selectedRating;
      const matchTrip = selectedTripType === 'All' || r.tripType === selectedTripType;
      const matchSearch = !searchQuery || 
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.authorCountry.toLowerCase().includes(searchQuery.toLowerCase());
      return matchRating && matchTrip && matchSearch;
    });
  }, [reviewsList, selectedRating, selectedTripType, searchQuery]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) return;

    const newRev = reviewService.submitReview({
      targetType: 'tour',
      targetId: 'tour-ceylon-odyssey',
      targetTitle: 'LankaVoyage Bespoke Experience',
      authorName: formAuthorName.trim() || 'Anonymous Guest',
      authorCountry: formAuthorCountry.trim() || 'International Traveler',
      authorAvatar: user?.avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80`,
      rating: formRating,
      title: formTitle.trim(),
      content: formContent.trim(),
      tripType: formTripType
    });

    setReviewsList(prev => [newRev, ...prev]);
    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setModalOpen(false);
      setFormTitle('');
      setFormContent('');
    }, 2000);
  };

  return (
    <div className="bg-[#F8F7F2] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#176B52] border border-stone-200 text-xs font-semibold uppercase tracking-wider shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#39A982]" />
              <span>Traveler Memories</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#17231F]">
              Guest Experiences & Reviews
            </h1>
            <p className="text-sm sm:text-base text-[#68736E] leading-relaxed">
              Read verified testimonials from travelers who designed their Sri Lanka holidays and private chauffeur tours with LankaVoyage.
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#0B3D2E] hover:bg-[#176B52] text-white font-semibold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all shrink-0 border border-white/20"
          >
            <MessageSquarePlus className="w-4 h-4 text-[#DDEFE8]" />
            <span>Write a Review</span>
          </button>
        </div>

        {/* Scorecard Banner in Liquid Glass */}
        <div className="bg-white/85 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/80 shadow-[0_4px_20px_-4px_rgba(6,44,34,0.06)] grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#DDEFE8] flex flex-col items-center justify-center text-[#0B3D2E] shrink-0 border border-[#176B52]/20">
              <span className="font-serif text-2xl font-bold leading-none">{stats.avg}</span>
              <span className="text-[10px] text-[#176B52] font-semibold mt-1">/ 5.0</span>
            </div>
            <div>
              <div className="flex items-center gap-1 text-[#39A982]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-[#68736E] font-medium mt-1">Based on {stats.total} verified travelers</p>
            </div>
          </div>

          <div className="space-y-1.5 text-xs text-[#68736E]">
            <div className="flex items-center justify-between">
              <span>5 Stars</span>
              <div className="w-40 bg-stone-100 rounded-full h-2 overflow-hidden mx-2">
                <div 
                  className="bg-[#176B52] h-full rounded-full" 
                  style={{ width: `${(stats.fiveStars / stats.total) * 100}%` }} 
                />
              </div>
              <span className="font-semibold">{stats.fiveStars}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>4 Stars</span>
              <div className="w-40 bg-stone-100 rounded-full h-2 overflow-hidden mx-2">
                <div 
                  className="bg-[#176B52] h-full rounded-full" 
                  style={{ width: `${(stats.fourStars / stats.total) * 100}%` }} 
                />
              </div>
              <span className="font-semibold">{stats.fourStars}</span>
            </div>
          </div>

          <div className="bg-[#F8F7F2] p-4 rounded-2xl border border-stone-200 text-xs space-y-1 text-stone-700">
            <div className="flex items-center gap-1.5 font-bold text-[#176B52]">
              <ShieldCheck className="w-4 h-4 text-[#39A982]" />
              <span>100% Genuine Guest Feedback</span>
            </div>
            <p className="text-[11px] text-[#68736E]">All submissions are independently verified with authentic itinerary references.</p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white/85 backdrop-blur-xl p-4 sm:p-5 rounded-3xl border border-white/80 shadow-[0_4px_20px_-4px_rgba(6,44,34,0.06)] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keywords, author or country..."
              className="w-full pl-9 pr-3.5 py-2.5 bg-[#F8F7F2] border border-stone-300 rounded-xl text-xs sm:text-sm font-medium text-[#17231F] focus:outline-none focus:ring-2 focus:ring-[#176B52]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {tripTypes.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTripType(t)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedTripType === t
                    ? 'bg-[#0B3D2E] text-white shadow-xs font-semibold'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Reviews Grid */}
        {filteredReviews.length === 0 ? (
          <EmptyState
            title="No Reviews Found"
            description="Try changing your search keywords or resetting your trip type filter."
            actionText="View All Reviews"
            onAction={() => {
              setSearchQuery('');
              setSelectedTripType('All');
              setSelectedRating('All');
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredReviews.map((r) => (
              <div
                key={r.id}
                className="relative bg-white rounded-3xl p-7 border border-stone-200 shadow-[0_4px_20px_-4px_rgba(6,44,34,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(6,44,34,0.12)] transition-all duration-300 flex flex-col justify-between"
              >
                <Quote className="absolute top-6 right-6 w-8 h-8 text-[#DDEFE8]" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[#39A982]">
                      {[...Array(r.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    {r.verifiedTraveler && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#176B52] bg-[#DDEFE8] px-2.5 py-0.5 rounded-full">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#176B52]" />
                        Verified
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif text-lg font-bold text-[#17231F]">
                    "{r.title}"
                  </h3>

                  <p className="text-xs sm:text-sm text-[#68736E] leading-relaxed">
                    "{r.content}"
                  </p>

                  {r.targetTitle && (
                    <div className="text-[11px] font-medium text-[#176B52] bg-[#DDEFE8]/60 px-3 py-1 rounded-full border border-[#176B52]/20 inline-block">
                      {r.targetTitle}
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-6 border-t border-stone-100 flex items-center gap-3">
                  <img
                    src={r.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                    alt={r.authorName}
                    className="w-10 h-10 rounded-full object-cover border border-[#DDEFE8]"
                  />
                  <div>
                    <h4 className="font-semibold text-xs text-[#17231F]">{r.authorName}</h4>
                    <p className="text-[11px] text-[#68736E]">{r.authorCountry} &bull; {r.tripType}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Review Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-5 border border-stone-200">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h2 className="font-serif text-2xl font-bold text-[#17231F]">Write a Review</h2>
              <p className="text-xs text-[#68736E] mt-1">Share your Sri Lankan journey memories with future travelers.</p>
            </div>

            {submittedSuccess ? (
              <div className="p-6 text-center bg-[#DDEFE8]/60 rounded-2xl border border-[#176B52]/30 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-[#176B52] mx-auto" />
                <h3 className="font-serif text-lg font-bold text-[#17231F]">Thank You!</h3>
                <p className="text-xs text-[#68736E]">Your review has been published to the LankaVoyage community.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4 text-xs sm:text-sm">
                
                {/* Rating picker */}
                <div className="space-y-1">
                  <label className="font-semibold text-[#17231F] block">Overall Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setFormRating(star)}
                        className="p-1 focus:outline-none"
                      >
                        <Star 
                          className={`w-6 h-6 ${star <= formRating ? 'fill-[#39A982] text-[#39A982]' : 'text-stone-300'}`} 
                        />
                      </button>
                    ))}
                    <span className="text-xs text-[#176B52] font-semibold ml-2">{formRating} Stars</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#17231F]">Review Title *</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Unforgettable 10-Day Ceylon Discovery!"
                    className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl p-2.5 font-medium text-[#17231F] focus:outline-none focus:ring-2 focus:ring-[#176B52]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#17231F]">Trip Style</label>
                  <select
                    value={formTripType}
                    onChange={(e) => setFormTripType(e.target.value as any)}
                    className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl p-2.5 font-medium text-[#17231F] focus:outline-none focus:ring-2 focus:ring-[#176B52]"
                  >
                    <option value="Couple / Honeymoon">Couple / Honeymoon</option>
                    <option value="Family Vacation">Family Vacation</option>
                    <option value="Solo Explorer">Solo Explorer</option>
                    <option value="Friends Group">Friends Group</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#17231F]">Review Feedback *</label>
                  <textarea
                    required
                    rows={4}
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                    placeholder="Describe your chauffeur, vehicle comfort, destinations, and favorite moments..."
                    className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl p-2.5 font-medium text-[#17231F] focus:outline-none focus:ring-2 focus:ring-[#176B52]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-[#17231F]">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={formAuthorName}
                      onChange={(e) => setFormAuthorName(e.target.value)}
                      placeholder="e.g. David Miller"
                      className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl p-2.5 font-medium text-[#17231F] focus:outline-none focus:ring-2 focus:ring-[#176B52]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-[#17231F]">Home Country *</label>
                    <input
                      type="text"
                      required
                      value={formAuthorCountry}
                      onChange={(e) => setFormAuthorCountry(e.target.value)}
                      placeholder="e.g. Australia"
                      className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl p-2.5 font-medium text-[#17231F] focus:outline-none focus:ring-2 focus:ring-[#176B52]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#0B3D2E] hover:bg-[#176B52] text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-sm border border-white/20"
                >
                  Submit Verified Review
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
