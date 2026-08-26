import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Save, 
  ArrowLeft, 
  Plus, 
  Trash2
} from 'lucide-react';
import { tourService } from '../../services/tourService';
import type {  TourCategory, TourDifficulty, ItineraryDay } from '../../types';

export const EditTourPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = !id || id === 'new';

  const existing = !isNew ? tourService.getTourById(id!) : undefined;

  const [title, setTitle] = useState(existing?.title || '');
  const [subtitle, setSubtitle] = useState(existing?.subtitle || '');
  const [tagline, setTagline] = useState(existing?.tagline || '');
  const [category, setCategory] = useState<TourCategory>(existing?.category || 'Cultural & Heritage');
  const [durationDays, setDurationDays] = useState(existing?.durationDays || 7);
  const [durationNights, ] = useState(existing?.durationNights || 6);
  const [pricePerPerson, setPricePerPerson] = useState(existing?.pricePerPerson || 950);
  const [originalPrice, ] = useState(existing?.originalPrice || 1100);
  const [difficulty, setDifficulty] = useState<TourDifficulty>(existing?.difficulty || 'Moderate');
  const [heroImage, setHeroImage] = useState(existing?.heroImage || 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1200&q=80');
  const [overview, setOverview] = useState(existing?.overview || '');
  const [featured, setFeatured] = useState<boolean>(existing?.featured || false);
  const [published, setPublished] = useState<boolean>(existing?.published || true);
  const [destinationsStr, ] = useState(existing?.destinations.join(', ') || 'Sigiriya, Kandy, Ella');
  const [inclusionsStr, ] = useState(existing?.inclusions.join('\n') || '5-Star Luxury Hotels\nDaily Gourmet Breakfast\nPrivate AC Vehicle & Chauffeur');
  const [exclusionsStr, ] = useState(existing?.exclusions.join('\n') || 'International airfare\nVisa fee');

  const [itinerary, setItinerary] = useState<ItineraryDay[]>(existing?.itinerary || [
    {
      day: 1,
      title: 'Arrival & Welcome to Ceylon',
      destination: 'Colombo / Negombo',
      description: 'VIP airport meet & greet with fresh jasmine garlands and transfer to oceanfront luxury resort.',
      highlights: ['VIP airport meet & greet', 'Welcome dinner'],
      mealsIncluded: ['Dinner'],
      accommodation: 'Jetwing Beach Hotel (5-Star)'
    }
  ]);

  const handleAddDay = () => {
    const nextDayNum = itinerary.length + 1;
    setItinerary([
      ...itinerary,
      {
        day: nextDayNum,
        title: `Day ${nextDayNum} Exploration`,
        destination: 'Sigiriya',
        description: 'Guided excursion with your private chauffeur guide.',
        highlights: ['Guided sightseeing'],
        mealsIncluded: ['Breakfast', 'Dinner'],
        accommodation: 'Luxury Boutique Resort'
      }
    ]);
  };

  const handleRemoveDay = (idx: number) => {
    const list = itinerary.filter((_, i) => i !== idx).map((d, i) => ({ ...d, day: i + 1 }));
    setItinerary(list);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const destList = destinationsStr.split(',').map(s => s.trim()).filter(Boolean);
    const incList = inclusionsStr.split('\n').map(s => s.trim()).filter(Boolean);
    const excList = exclusionsStr.split('\n').map(s => s.trim()).filter(Boolean);

    const tourData = {
      title,
      subtitle,
      tagline,
      category,
      durationDays: Number(durationDays),
      durationNights: Number(durationNights),
      pricePerPerson: Number(pricePerPerson),
      originalPrice: Number(originalPrice),
      featured,
      published,
      difficulty,
      groupSizeMax: 8,
      startLocation: 'Bandaranaike Intl Airport (CMB)',
      endLocation: 'Colombo / Airport (CMB)',
      heroImage,
      gallery: [heroImage],
      overview,
      highlights: itinerary.flatMap(d => d.highlights),
      destinations: destList,
      itinerary,
      inclusions: incList,
      exclusions: excList,
      accommodationType: '5-Star Luxury & Heritage Boutique',
      transportType: 'Private Luxury Sedan / Van',
      importantInfo: ['Modest attire required for sacred temples.'],
      faqs: [{ question: 'Can this be customized?', answer: 'Yes, all parameters can be tailored.' }]
    };

    if (isNew) {
      tourService.createTour(tourData as any);
    } else {
      tourService.updateTour(id!, tourData);
    }

    navigate('/admin/tours');
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
          <span>Back to Manager</span>
        </Link>
        <span className="text-xs text-stone-500 font-semibold">{isNew ? 'Creating New ' : `Editing: ${title}`}</span>
      </div>

      <form onSubmit={handleSave} className="bg-white p-8 sm:p-10 rounded-3xl border border-stone-200 shadow-sm space-y-8 text-xs">
        
        <div className="border-b border-stone-100 pb-4">
          <h2 className="font-serif text-2xl font-bold text-[#062C22]">
            {isNew ? 'Create New Signature ' : 'Edit Details'}
          </h2>
          <p className="text-xs text-stone-500">Configure itinerary pricing, day schedules, and publish controls.</p>
        </div>

        {/* Basic Metadata */}
        <div className="space-y-4">
          <h3 className="font-serif font-bold text-sm text-[#062C22] uppercase tracking-wider">General Information</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-stone-700">Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Sri Lanka Grand Highlights & Heritage"
                className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-[#062C22]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-stone-700">Subtitle / Route</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. Sigiriya, Kandy, Nuwara Eliya, Ella, Yala & Galle"
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
              placeholder="e.g. The definitive 10-day luxury journey across the Pearl of the Indian Ocean."
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
              <label className="font-bold text-stone-700">Duration Days</label>
              <input
                type="number"
                value={durationDays}
                onChange={(e) => setDurationDays(Number(e.target.value))}
                className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl px-3 py-2 text-xs text-[#062C22]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-stone-700">Price ($ USD/person)</label>
              <input
                type="number"
                value={pricePerPerson}
                onChange={(e) => setPricePerPerson(Number(e.target.value))}
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
            <label className="font-bold text-stone-700">Hero Image URL</label>
            <input
              type="url"
              value={heroImage}
              onChange={(e) => setHeroImage(e.target.value)}
              className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-[#062C22]"
            />
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

        {/* Day-by-Day Itinerary Builder */}
        <div className="space-y-4 pt-4 border-t border-stone-100">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-sm text-[#062C22] uppercase tracking-wider">
              Day-by-Day Itinerary Schedule ({itinerary.length} Days)
            </h3>
            <button
              type="button"
              onClick={handleAddDay}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#0B3D2E] text-white font-bold rounded-lg text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Day</span>
            </button>
          </div>

          <div className="space-y-4">
            {itinerary.map((day, idx) => (
              <div key={idx} className="bg-[#F8F7F2] p-5 rounded-2xl border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#176B52]">Day {day.day}</span>
                  {itinerary.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveDay(idx)}
                      className="text-rose-600 hover:text-rose-800"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={day.title}
                    onChange={(e) => {
                      const list = [...itinerary];
                      list[idx].title = e.target.value;
                      setItinerary(list);
                    }}
                    placeholder="Day title"
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold"
                  />
                  <input
                    type="text"
                    value={day.destination}
                    onChange={(e) => {
                      const list = [...itinerary];
                      list[idx].destination = e.target.value;
                      setItinerary(list);
                    }}
                    placeholder="Destination (e.g. Sigiriya)"
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <textarea
                  rows={2}
                  value={day.description}
                  onChange={(e) => {
                    const list = [...itinerary];
                    list[idx].description = e.target.value;
                    setItinerary(list);
                  }}
                  placeholder="Day description and activities..."
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Switches */}
        <div className="flex items-center gap-6 pt-4 border-t border-stone-100">
          <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-700">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="w-4 h-4 accent-[#0B3D2E]"
            />
            <span>Published on Website</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-700">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked as any)}
              className="w-4 h-4 accent-[#0B3D2E]"
            />
            <span>Mark as Featured Luxury </span>
          </label>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-stone-100 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-7 py-3 bg-[#0B3D2E] text-white hover:bg-[#134E3F] font-bold text-xs rounded-xl shadow-md transition-all"
          >
            <Save className="w-4 h-4 text-[#39A982]" />
            <span>Save Itinerary</span>
          </button>
        </div>

      </form>
    </div>
  );
};
