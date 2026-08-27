import React, { useState, useMemo } from 'react';
import { 
  Star, 
  ShieldCheck, 
  MessageSquarePlus, 
  X, 
  Search,
  CheckCircle2,
  Quote,
  Sparkles,
  Camera,
  Compass
} from 'lucide-react';
import { reviewService } from '../../services/reviewService';
import { tourService } from '../../services/tourService';
import type { Review } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { EmptyState } from '../../components/common/EmptyState';

export const ReviewsPage: React.FC = () => {
  const { user } = useAuth();
  const [reviewsList, setReviewsList] = useState<Review[]>(() => reviewService.getAllReviews());
  const [selectedRating, setSelectedRating] = useState<number | 'All'>('All');
  const [selectedTripType, setSelectedTripType] = useState<string>('All');
  const [selectedTourFilter, setSelectedTourFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Available tours from tourService
  const allTours = useMemo(() => tourService.getAllTours(), []);

  // Gallery Active Filter
  const [galleryCategory, setGalleryCategory] = useState<string>('All');
  const [activePhotoModal, setActivePhotoModal] = useState<string | null>(null);

  // Submit Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [formRating, setFormRating] = useState(5);
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formSelectedTourId, setFormSelectedTourId] = useState(allTours[0]?.id || 'tour-ceylon-odyssey');
  const [formTripType, setFormTripType] = useState<'Couple / Honeymoon' | 'Family Vacation' | 'Solo Explorer' | 'Friends Group'>('Couple / Honeymoon');
  const [formAuthorName, setFormAuthorName] = useState(user?.name || '');
  const [formAuthorCountry, setFormAuthorCountry] = useState(user?.country || 'United Kingdom');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const tripTypes = ['All', 'Couple / Honeymoon', 'Family Vacation', 'Solo Explorer', 'Friends Group'];

  // Sri Lanka Travel Photography Gallery Data
  const galleryItems = [
    {
      id: 'gal-sigiriya-1',
      title: 'Sigiriya Lion Rock Citadel',
      category: 'Sigiriya',
      image: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1200&q=85',
      caption: 'The ancient 5th-century palace rock fortress rising above emerald jungle.'
    },
    {
      id: 'gal-ella-train-1',
      title: 'Demodara Nine Arches Bridge',
      category: 'Ella & Train',
      image: 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1200&q=85',
      caption: 'Scenic blue train curving through mist-clad mountain tea estates.'
    },
    {
      id: 'gal-tea-1',
      title: 'Ceylon High-Grown Tea Plantations',
      category: 'Tea Country',
      image: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1200&q=85',
      caption: 'Rolling green tea valleys and mountain slopes of Nuwara Eliya.'
    },
    {
      id: 'gal-yala-safari-1',
      title: 'Sri Lankan Leopard on Safari',
      category: 'Wildlife',
      image: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1200&q=85',
      caption: 'Private 4x4 game drive through Yala National Park coastal plains.'
    },
    {
      id: 'gal-galle-1',
      title: 'Galle Dutch Fort Lighthouse',
      category: 'Culture & Galle',
      image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1200&q=85',
      caption: '17th-century UNESCO ocean ramparts and historic cobbled streets.'
    },
    {
      id: 'gal-beach-1',
      title: 'Mirissa Palm Grove Coastline',
      category: 'Beaches',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85',
      caption: 'Golden sand beaches and turquoise Indian Ocean waves.'
    },
    {
      id: 'gal-kandy-1',
      title: 'Temple of the Sacred Tooth Relic',
      category: 'Culture & Galle',
      image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=85',
      caption: 'Sacred UNESCO sanctuary in the heart of royal Kandy.'
    },
    {
      id: 'gal-pidurangala-1',
      title: 'Pidurangala Sunrise Vista',
      category: 'Sigiriya',
      image: 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=1200&q=85',
      caption: 'Dawn panoramic view of Sigiriya monolith emerging from mist.'
    },
    {
      id: 'gal-elephants-1',
      title: 'Minneriya Wild Elephant Gathering',
      category: 'Wildlife',
      image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=85',
      caption: 'Hundreds of Asian elephants gathered across the ancient reservoir banks.'
    }
  ];

  const galleryCategories = ['All', 'Sigiriya', 'Ella & Train', 'Tea Country', 'Wildlife', 'Culture & Galle', 'Beaches'];

  const filteredGallery = useMemo(() => {
    if (galleryCategory === 'All') return galleryItems;
    return galleryItems.filter(item => item.category === galleryCategory);
  }, [galleryCategory]);

  // Overall Statistics
  const stats = useMemo(() => {
    const total = reviewsList.length;
    const avg = total > 0 
      ? (reviewsList.reduce((acc, r) => acc + r.rating, 0) / total).toFixed(1)
      : '5.0';
    const fiveStars = reviewsList.filter(r => r.rating === 5).length;
    const fourStars = reviewsList.filter(r => r.rating === 4).length;
    return { total, avg, fiveStars, fourStars };
  }, [reviewsList]);

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    return reviewsList.filter(r => {
      const matchRating = selectedRating === 'All' || r.rating === selectedRating;
      const matchTrip = selectedTripType === 'All' || r.tripType === selectedTripType;
      const matchTour = selectedTourFilter === 'All' || r.targetId === selectedTourFilter;
      const matchSearch = !searchQuery || 
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.authorCountry.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.targetTitle && r.targetTitle.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchRating && matchTrip && matchTour && matchSearch;
    });
  }, [reviewsList, selectedRating, selectedTripType, selectedTourFilter, searchQuery]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) return;

    const chosenTour = allTours.find(t => t.id === formSelectedTourId);

    const newRev = reviewService.submitReview({
      targetType: 'tour',
      targetId: formSelectedTourId,
      targetTitle: chosenTour ? chosenTour.title : 'LankaVoyage Guided Tour',
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
    }, 1800);
  };

  return (
    <div className="bg-[#F8F7F2] min-h-screen py-10 sm:py-16 relative overflow-hidden">
      
      {/* Ambient background glows */}
      <div className="ambient-glow-orb w-96 h-96 bg-[#39A982] top-20 -left-20 opacity-15" />
      <div className="ambient-glow-orb w-96 h-96 bg-[#C5A059] top-[800px] -right-20 opacity-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full liquid-glass-white text-[#176B52] border border-[#39A982]/20 text-xs font-semibold uppercase tracking-wider shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#39A982]" />
              <span>TRAVELER VOICES & MOMENTS</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#17231F]">
              Guest Reviews & Travel Gallery
            </h1>
            <p className="text-sm sm:text-base text-[#68736E] leading-relaxed">
              Authentic feedback and cinematic photography from international travelers who experienced Sri Lanka with LankaVoyage.
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="glass-btn-primary inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl text-white font-semibold text-xs sm:text-sm shadow-md shrink-0"
          >
            <MessageSquarePlus className="w-4 h-4 text-[#DDEFE8]" />
            <span>Write a Review</span>
          </button>
        </div>

        {/* SECTION 1: REVIEWS SCORECARD & LIST */}
        <div className="space-y-8">
          
          {/* Scorecard Banner */}
          <div className="liquid-glass-white rounded-3xl p-6 sm:p-8 border border-white/80 shadow-[0_4px_20px_-4px_rgba(6,44,34,0.06)] grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#DDEFE8] flex flex-col items-center justify-center text-[#0B3D2E] shrink-0 border border-[#176B52]/20 shadow-xs">
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

            <div className="bg-white/70 backdrop-blur-md p-4 rounded-2xl border border-stone-200 text-xs space-y-1 text-stone-700">
              <div className="flex items-center gap-1.5 font-bold text-[#176B52]">
                <ShieldCheck className="w-4 h-4 text-[#39A982]" />
                <span>100% Genuine Guest Feedback</span>
              </div>
              <p className="text-[11px] text-[#68736E]">All submissions are independently verified with authentic tour references.</p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="liquid-glass-white p-4 sm:p-5 rounded-3xl border border-white/80 shadow-[0_4px_20px_-4px_rgba(6,44,34,0.06)] flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search reviews (e.g. Chauffeur, Yala, Sigiriya)..."
                  className="w-full pl-9 pr-3.5 py-2.5 bg-white/80 border border-stone-300 rounded-xl text-xs sm:text-sm font-medium text-[#17231F] focus:outline-none focus:ring-2 focus:ring-[#176B52]"
                />
              </div>

              {/* Tour Selector Filter */}
              <div className="w-full sm:w-64">
                <select
                  value={selectedTourFilter}
                  onChange={(e) => setSelectedTourFilter(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white/80 border border-stone-300 rounded-xl text-xs font-semibold text-[#17231F] focus:outline-none focus:ring-2 focus:ring-[#176B52]"
                  aria-label="Filter reviews by tour"
                >
                  <option value="All">All Tours & Experiences</option>
                  {allTours.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title} ({t.durationDays} Days)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
              {tripTypes.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTripType(t)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedTripType === t
                      ? 'bg-[#0B3D2E] text-white shadow-xs font-semibold'
                      : 'bg-white/80 text-stone-600 hover:bg-white border border-stone-200'
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
                setSelectedRating('All');
                setSelectedTripType('All');
                setSelectedTourFilter('All');
              }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReviews.map((r) => (
                <div
                  key={r.id}
                  className="glass-card-interactive liquid-glass-white rounded-3xl p-7 border border-white/80 shadow-[0_4px_20px_-4px_rgba(6,44,34,0.05)] flex flex-col justify-between"
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
                      <div className="text-[11px] font-medium text-[#176B52] bg-[#DDEFE8]/60 px-3 py-1 rounded-full border border-[#176B52]/20 inline-flex items-center gap-1.5">
                        <Compass className="w-3 h-3 text-[#39A982]" />
                        <span>{r.targetTitle}</span>
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

        {/* SECTION 2: SRI LANKAN TRAVEL GALLERY */}
        <div className="space-y-8 pt-8 border-t border-stone-200">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-[#176B52] uppercase tracking-wider flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-[#39A982]" />
                ISLAND PHOTOGRAPHY
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#17231F]">
                Sri Lanka Travel Gallery
              </h2>
              <p className="text-xs sm:text-sm text-[#68736E] max-w-xl">
                Glimpse the breathtaking scenery, wildlife encounters, and colonial heritage of Ceylon.
              </p>
            </div>

            {/* Gallery Category Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {galleryCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setGalleryCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                    galleryCategory === cat
                      ? 'bg-[#0B3D2E] text-white font-semibold'
                      : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGallery.map((photo) => (
              <div
                key={photo.id}
                onClick={() => setActivePhotoModal(photo.image)}
                className="group relative h-72 rounded-3xl overflow-hidden cursor-pointer shadow-[0_4px_20px_-4px_rgba(6,44,34,0.06)] hover:shadow-xl transition-all duration-500 border border-stone-200/80"
              >
                <img
                  src={photo.image}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#062C22]/90 via-[#062C22]/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-white/85 text-[#0B3D2E] backdrop-blur-md">
                    {photo.category}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                  <h3 className="font-serif text-lg font-bold leading-snug">{photo.title}</h3>
                  <p className="text-xs text-stone-200 line-clamp-1">{photo.caption}</p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* Fullscreen Photo Modal */}
      {activePhotoModal && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActivePhotoModal(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl">
            <button
              onClick={() => setActivePhotoModal(null)}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={activePhotoModal}
              alt="Sri Lanka Gallery Large"
              className="w-full h-auto max-h-[85vh] object-contain rounded-2xl"
            />
          </div>
        </div>
      )}

      {/* Review Submit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="liquid-glass-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-5 border border-white/80">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h2 className="font-serif text-2xl font-bold text-[#17231F]">Write a Review</h2>
              <p className="text-xs text-[#68736E] mt-1">Share your Sri Lankan journey memories with future travelers.</p>
            </div>

            {submittedSuccess ? (
              <div className="p-6 text-center bg-[#DDEFE8]/80 backdrop-blur-md rounded-2xl border border-[#176B52]/30 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-[#176B52] mx-auto" />
                <h3 className="font-serif text-lg font-bold text-[#17231F]">Thank You!</h3>
                <p className="text-xs text-[#68736E]">Your review has been published to the LankaVoyage community.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4 text-xs sm:text-sm">
                
                {/* 1. Tour Selection Dropdown */}
                <div className="space-y-1">
                  <label className="font-bold text-[#17231F] flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-[#176B52]" />
                    Select Tour Experienced *
                  </label>
                  <select
                    required
                    value={formSelectedTourId}
                    onChange={(e) => setFormSelectedTourId(e.target.value)}
                    className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl p-2.5 font-medium text-[#17231F] focus:outline-none focus:ring-2 focus:ring-[#176B52]"
                  >
                    {allTours.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title} ({t.durationDays} Days &bull; {t.category})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Rating picker */}
                <div className="space-y-1">
                  <label className="font-bold text-[#17231F] block">Overall Rating</label>
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
                  <label className="font-bold text-[#17231F]">Review Title *</label>
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
                  <label className="font-bold text-[#17231F]">Trip Style</label>
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
                  <label className="font-bold text-[#17231F]">Review Feedback *</label>
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
                    <label className="font-bold text-[#17231F]">Your Name *</label>
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
                    <label className="font-bold text-[#17231F]">Home Country *</label>
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
                  className="glass-btn-primary w-full py-3.5 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md"
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
