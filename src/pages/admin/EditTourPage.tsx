import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Save, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Clock, 
  Calendar,
  MapPin
} from 'lucide-react';
import { tourService } from '../../services/tourService';
import { adminService } from '../../services/adminService';
import type { TourCategory, TourDifficulty, ItineraryDay } from '../../types';
import { handleImageError } from '../../utils/imageFallback';

export const EditTourPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = !id || id === 'new';

  const existing = !isNew ? tourService.getTourById(id!) : undefined;

  const [title, setTitle] = useState(existing?.title || '');
  const [subtitle, setSubtitle] = useState(existing?.subtitle || '');
  const [tagline, setTagline] = useState(existing?.tagline || '');
  const [category, setCategory] = useState<TourCategory>(existing?.category || 'Cultural & Heritage');
  const [durationDays, setDurationDays] = useState(existing?.durationDays || 5);
  const [durationNights, setDurationNights] = useState(existing?.durationNights || 4);
  const [difficulty, setDifficulty] = useState<TourDifficulty>(existing?.difficulty || 'Moderate');
  const [heroImage, setHeroImage] = useState(existing?.heroImage || 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1200&q=80');
  const [overview, setOverview] = useState(existing?.overview || '');
  const [featured, setFeatured] = useState<boolean>(existing?.featured || false);
  const [published, setPublished] = useState<boolean>(existing?.published || true);
  const [destinationsStr, setDestinationsStr] = useState(existing?.destinations.join(', ') || 'Sigiriya, Kandy, Ella');

  const [itinerary, setItinerary] = useState<ItineraryDay[]>(existing?.itinerary || [
    {
      day: 1,
      title: 'Arrival & Welcome to Ceylon',
      destination: 'Colombo / Negombo',
      description: 'VIP airport meet & greet with fresh jasmine garlands and transfer to oceanfront luxury resort.',
      highlights: ['VIP airport meet & greet', 'Welcome dinner', 'Beachside relaxation'],
      mealsIncluded: ['Dinner'],
      accommodation: 'Jetwing Beach Hotel (5-Star)'
    },
    {
      day: 2,
      title: 'Ancient Lion Rock Citadel of Sigiriya',
      destination: 'Sigiriya',
      description: 'Ascend the 5th-century UNESCO fortress rock, admire ancient frescoes, and explore royal water gardens.',
      highlights: ['Sigiriya Lion Rock climb', 'Mirror wall & frescoes', 'Village bullock cart tour'],
      mealsIncluded: ['Breakfast', 'Dinner'],
      accommodation: 'Aliya Resort & Spa (5-Star Boutique)'
    }
  ]);

  const handleAddDay = () => {
    const nextDayNum = itinerary.length + 1;
    const updated: ItineraryDay[] = [
      ...itinerary,
      {
        day: nextDayNum,
        title: `Day ${nextDayNum} Exploration`,
        destination: 'Kandy',
        description: 'Chauffeured sightseeing and cultural exploration with your private guide.',
        highlights: ['Guided sightseeing', 'Scenic photography'],
        mealsIncluded: ['Breakfast', 'Dinner'],
        accommodation: 'Luxury Boutique Resort'
      }
    ];
    setItinerary(updated);
    setDurationDays(updated.length);
    setDurationNights(Math.max(1, updated.length - 1));
  };

  const handleRemoveDay = (idx: number) => {
    const list = itinerary.filter((_, i) => i !== idx).map((d, i) => ({ ...d, day: i + 1 }));
    setItinerary(list);
    setDurationDays(list.length);
    setDurationNights(Math.max(1, list.length - 1));
  };

  const handleDayChange = (idx: number, field: keyof ItineraryDay, value: any) => {
    const list = [...itinerary];
    list[idx] = {
      ...list[idx],
      [field]: value
    };
    setItinerary(list);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const destList = destinationsStr.split(',').map(s => s.trim()).filter(Boolean);

    const tourData = {
      title,
      subtitle,
      tagline,
      category,
      durationDays: Number(durationDays),
      durationNights: Number(durationNights),
      pricePerPerson: 950, // Reference rate
      featured,
      published,
      difficulty,
      groupSizeMax: 8,
      startLocation: 'Bandaranaike Intl Airport (CMB)',
      endLocation: 'Colombo / Airport (CMB)',
      heroImage,
      gallery: [heroImage],
      overview,
      highlights: itinerary.flatMap(d => d.highlights || []),
      destinations: destList,
      itinerary,
      inclusions: [
        'Dedicated SLTDA-Certified Chauffeur Guide',
        'Modern Air-Conditioned Vehicle (Car or Van)',
        'All Fuel, Expressway Tolls & Parking Fees',
        'Complimentary CMB Airport Pickup & Drop',
        'Bottled Mineral Water Daily'
      ],
      exclusions: [
        'International flights & visa fees',
        'Optional monument entrance tickets',
        'Personal gratuities & expenses'
      ],
      accommodationType: '5-Star Luxury & Heritage Boutique',
      transportType: 'Private Luxury Sedan / Van',
      importantInfo: ['Modest attire required for sacred temples.'],
      faqs: [{ question: 'Is the itinerary fixed?', answer: 'Yes, all days and destinations follow the expertly curated itinerary.' }]
    };

    try {
      if (isNew) {
        tourService.createTour(tourData as any);
        await adminService.createTour(tourData as any).catch((_e: any) => console.warn('Admin API tour creation note:', _e));
      } else {
        tourService.updateTour(id!, tourData);
        await adminService.updateTour(id!, tourData).catch((_e: any) => console.warn('Admin API tour update note:', _e));
      }
      navigate('/admin/tours');
    } catch (err: any) {
      alert(err.message || 'Failed to save tour.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/tours"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-[#0B3D2E]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Tours Manager</span>
        </Link>
        <span className="text-xs text-stone-500 font-semibold">{isNew ? 'Creating New Tour' : `Editing: ${title}`}</span>
      </div>

      <form onSubmit={handleSave} className="bg-white p-8 sm:p-10 rounded-3xl border border-stone-200 shadow-sm space-y-8 text-xs">
        
        <div className="border-b border-stone-100 pb-4">
          <h2 className="font-serif text-2xl font-bold text-[#062C22]">
            {isNew ? 'Create New Signature Tour' : 'Edit Tour & Fixed Itinerary'}
          </h2>
          <p className="text-xs text-stone-500">
            Set fixed tour duration, day-by-day destinations, photos, and published status. Customers cannot modify days or itinerary sequence.
          </p>
        </div>

        {/* 1. General Information */}
        <div className="space-y-4">
          <h3 className="font-serif font-bold text-sm text-[#062C22] uppercase tracking-wider">
            1. Tour General Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-stone-700">Tour Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Sri Lanka Highlights & Heritage"
                className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-[#062C22]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-stone-700">Route Subtitle</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. Sigiriya, Kandy, Nuwara Eliya & Galle"
                className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-[#062C22]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-stone-700">Tagline (Hero Pitch)</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. The definitive chauffeured journey across Sri Lanka's cultural heartland."
              className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-[#062C22]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-stone-700">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl px-3 py-2 text-xs text-[#062C22]"
              >
                <option value="Cultural & Heritage">Cultural & Heritage</option>
                <option value="Wildlife & Safari">Wildlife & Safari</option>
                <option value="Hill Country & Nature">Hill Country & Nature</option>
                <option value="Beach & Coastal">Beach & Coastal</option>
                <option value="Luxury & Honeymoon">Luxury & Honeymoon</option>
                <option value="Active Adventure">Active Adventure</option>
                <option value="Ayurveda & Wellness">Ayurveda & Wellness</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#0B3D2E] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#176B52]" />
                Fixed Duration (Days)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={durationDays}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setDurationDays(val);
                  setDurationNights(Math.max(1, val - 1));
                }}
                className="w-full bg-white border-2 border-[#0B3D2E] rounded-xl px-3 py-2 text-xs font-bold text-[#0B3D2E]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-stone-700">Nights</label>
              <input
                type="number"
                value={durationNights}
                onChange={(e) => setDurationNights(Number(e.target.value))}
                className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl px-3 py-2 text-xs text-[#062C22]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-stone-700">Pace / Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl px-3 py-2 text-xs text-[#062C22]"
              >
                <option value="Easy">Easy</option>
                <option value="Moderate">Moderate</option>
                <option value="Challenging">Challenging</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-stone-700">Destinations Covered (Comma-separated)</label>
            <input
              type="text"
              value={destinationsStr}
              onChange={(e) => setDestinationsStr(e.target.value)}
              placeholder="Sigiriya, Kandy, Ella, Yala, Galle"
              className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-[#062C22]"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-stone-700">Hero Image URL</label>
            <input
              type="url"
              value={heroImage}
              onChange={(e) => setHeroImage(e.target.value)}
              className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-[#062C22]"
            />
            {heroImage && (
              <div className="mt-2 relative w-full h-36 max-w-sm rounded-xl overflow-hidden border border-stone-200 shadow-inner">
                <img
                  src={heroImage}
                  alt="Tour Hero Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => handleImageError(e, 'tour')}
                />
                <span className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-black/60 text-white backdrop-blur-xs">
                  Hero Preview
                </span>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="font-bold text-stone-700">Overview Text</label>
            <textarea
              rows={3}
              value={overview}
              onChange={(e) => setOverview(e.target.value)}
              className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-[#062C22]"
            />
          </div>
        </div>

        {/* 2. Fixed Day-by-Day Itinerary Management */}
        <div className="space-y-4 pt-4 border-t border-stone-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-sm text-[#062C22] uppercase tracking-wider">
                2. Fixed Day-by-Day Itinerary Schedule ({itinerary.length} Days)
              </h3>
              <p className="text-stone-500 text-[11px]">
                Manage destinations, photos, descriptions, and highlights for every fixed day.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddDay}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#0B3D2E] text-white font-bold rounded-xl text-xs shadow-xs hover:bg-[#176B52] transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-[#39A982]" />
              <span>Add Day {itinerary.length + 1}</span>
            </button>
          </div>

          <div className="space-y-4">
            {itinerary.map((day, idx) => (
              <div key={idx} className="bg-[#F8F7F2] p-5 sm:p-6 rounded-3xl border border-stone-200 space-y-4">
                <div className="flex items-center justify-between border-b border-stone-200/80 pb-3">
                  <span className="font-serif font-bold text-sm text-[#176B52] flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#39A982]" />
                    DAY {day.day} SCHEDULE
                  </span>
                  {itinerary.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveDay(idx)}
                      className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-800 font-bold"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Day</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Day Title</label>
                    <input
                      type="text"
                      value={day.title}
                      onChange={(e) => handleDayChange(idx, 'title', e.target.value)}
                      placeholder="e.g. Ancient Rock Fortress & Royal Gardens"
                      className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#176B52]" />
                      Destination
                    </label>
                    <input
                      type="text"
                      value={day.destination}
                      onChange={(e) => handleDayChange(idx, 'destination', e.target.value)}
                      placeholder="e.g. Sigiriya"
                      className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Day Description</label>
                  <textarea
                    rows={2}
                    value={day.description}
                    onChange={(e) => handleDayChange(idx, 'description', e.target.value)}
                    placeholder="Day narrative and excursion details..."
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Overnight Accommodation</label>
                    <input
                      type="text"
                      value={day.accommodation || ''}
                      onChange={(e) => handleDayChange(idx, 'accommodation', e.target.value)}
                      placeholder="e.g. Aliya Resort & Spa (5-Star)"
                      className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Estimated Drive Time</label>
                    <input
                      type="text"
                      value={day.driveTime || ''}
                      onChange={(e) => handleDayChange(idx, 'driveTime', e.target.value)}
                      placeholder="e.g. 2 hrs 30 mins"
                      className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* 3. Published & Featured Switches */}
        <div className="flex items-center gap-6 pt-4 border-t border-stone-100">
          <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-700">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="w-4 h-4 accent-[#0B3D2E]"
            />
            <span>Published on Customer Website</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-700">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-4 h-4 accent-[#0B3D2E]"
            />
            <span>Featured Tour on Home Page</span>
          </label>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-stone-100 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#0B3D2E] text-white hover:bg-[#134E3F] font-bold text-xs rounded-2xl shadow-md transition-all transform hover:-translate-y-0.5"
          >
            <Save className="w-4 h-4 text-[#39A982]" />
            <span>Save Tour & Fixed Itinerary</span>
          </button>
        </div>

      </form>
    </div>
  );
};
