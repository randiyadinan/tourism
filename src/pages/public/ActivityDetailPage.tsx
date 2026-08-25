import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Clock, 
  MapPin, 
  Check, 
  Heart, 
  Sparkles, 
  ShieldCheck, 
  Info
} from 'lucide-react';
import { activityService } from '../../services/activityService';
import { useWishlist } from '../../context/WishlistContext';

export const ActivityDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const activity = activityService.getActivityBySlug(slug || '');
  const { isInWishlist, toggleWishlist } = useWishlist();

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

          {/* Right Column: Experience Info & Trip Action Widget (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xl space-y-6 sticky top-24">
              
              <div className="border-b border-stone-100 pb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0D3B2E]/10 text-[#0D3B2E] text-xs font-bold uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                  Sri Lanka Experience
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#082F24]">{activity.title}</h3>
                <p className="text-xs text-stone-500 mt-1">{activity.destination} • {activity.duration} • {activity.difficulty} Pace</p>
              </div>

              <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-stone-200/80 space-y-3 text-xs text-stone-600">
                <div className="flex items-center gap-2 font-bold text-[#082F24]">
                  <Clock className="w-4 h-4 text-[#C5A059]" />
                  <span>Duration: {activity.duration}</span>
                </div>
                <div className="flex items-center gap-2 font-bold text-[#082F24]">
                  <MapPin className="w-4 h-4 text-[#C5A059]" />
                  <span>Location: {activity.destination}</span>
                </div>
                <p className="text-stone-500 pt-1 leading-relaxed">
                  Select and include this experience in your customized Sri Lanka tour itinerary with dedicated chauffeur transport.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <Link
                  to={`/customize?activityId=${activity.id}`}
                  className="w-full py-4 bg-gradient-to-r from-[#0D3B2E] to-[#134E3F] hover:from-[#134E3F] hover:to-[#0D3B2E] text-white font-bold text-sm rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#E5C378]" />
                  <span>Select & Add to Custom Tour</span>
                </Link>

                <Link
                  to="/tours"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl transition-colors"
                >
                  <span>Browse All Tours & Itineraries</span>
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
    </div>
  );
};
