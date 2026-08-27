import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Calendar, 
  CloudSun, 
  Sparkles, 
  Clock,
  ArrowLeft
} from 'lucide-react';
import { destinationService } from '../../services/destinationService';
import { tourService } from '../../services/tourService';
import { activityService } from '../../services/activityService';
import { TourCard } from '../../components/tours/TourCard';
import { ActivityCard } from '../../components/activities/ActivityCard';
import { StarRating } from '../../components/common/StarRating';
import { analytics } from '../../services/analytics';
import { handleImageError } from '../../utils/imageFallback';

export const DestinationDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [destination, setDestination] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      const dest = destinationService.getDestinationBySlug(slug);
      setDestination(dest || null);
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (destination) {
      document.title = `${destination.name} Travel Guide | LankaVoyage Sri Lanka`;
      analytics.viewDestination(destination.id, destination.name);
    }
  }, [destination]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F7F2]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#176B52] border-t-transparent" />
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#F8F7F2] p-8 text-center">
        <h2 className="font-serif text-3xl font-bold text-[#062C22] mb-4">Destination Not Found</h2>
        <p className="text-stone-600 mb-8 max-w-md">We could not locate the bespoke destination profile you were searching for.</p>
        <Link to="/destinations" className="px-6 py-3 bg-[#0B3D2E] text-white font-bold rounded-xl inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Return to Destinations
        </Link>
      </div>
    );
  }

  // Find tours that include this destination
  const matchingTours = tourService.getAllTours().filter(t => 
    t.destinations.some(d => d.toLowerCase().includes(destination.name.toLowerCase()))
  );

  // Find activities in this destination
  const matchingActivities = activityService.getAllActivities().filter(a =>
    a.destination.toLowerCase().includes(destination.name.toLowerCase())
  );

  return (
    <div className="bg-[#F8F7F2] min-h-screen pb-20">
      
      {/* Hero Header */}
      <div className="relative h-[65vh] min-h-[420px] flex items-end">
        <img
          src={destination.heroImage}
          alt={destination.name}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => handleImageError(e, 'destination')}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#062C22] via-[#062C22]/50 to-black/30" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full text-white space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#176B52] text-[#062C22]">
              {destination.province}
            </span>
            <span className="text-xs text-[#39A982] font-bold">
              {destination.sinhalaName}
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            {destination.name}
          </h1>
          <p className="text-lg sm:text-xl text-stone-200 font-light max-w-3xl">
            {destination.tagline}
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-medium text-stone-300">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#176B52]" />
              <span><strong>Best Season:</strong> {destination.bestTimeToVisit}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#176B52]" />
              <span><strong>Suggested Stay:</strong> {destination.recommendedDuration}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <StarRating rating={destination.rating} reviewCount={destination.reviewCount} size="sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-16">
        
        {/* Overview & Climate Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-8 bg-white p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <h3 className="font-serif text-2xl font-bold text-[#062C22]">About {destination.name}</h3>
            <p className="text-stone-600 leading-relaxed text-base">{destination.overview}</p>

            <div className="pt-4 border-t border-stone-100 flex flex-wrap gap-2">
              <span className="text-xs font-bold text-stone-400 block w-full mb-1">Top Recommended Highlights:</span>
              {destination.popularActivities.map((act: string, i: number) => (
                <span key={i} className="px-3 py-1 bg-[#F8F7F2] text-[#062C22] font-semibold text-xs rounded-xl border border-stone-200">
                  ★ {act}
                </span>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-[#0B3D2E] font-bold text-sm">
                <CloudSun className="w-5 h-5 text-[#176B52]" />
                <span>Climate & Weather Profile</span>
              </div>
              <div className="space-y-2 text-xs text-stone-600">
                <div className="flex justify-between py-1.5 border-b border-stone-100">
                  <span>Temperature:</span>
                  <strong className="text-[#062C22]">{destination.climate.temperature}</strong>
                </div>
                <div className="flex justify-between py-1.5 border-b border-stone-100">
                  <span>Rainfall Pattern:</span>
                  <strong className="text-[#062C22]">{destination.climate.rainfall}</strong>
                </div>
                <div className="flex justify-between py-1.5">
                  <span>GPS Coordinates:</span>
                  <strong className="text-[#062C22]">{destination.coordinates.lat.toFixed(4)}° N, {destination.coordinates.lng.toFixed(4)}° E</strong>
                </div>
              </div>
            </div>

            {/* Custom Trip Quick Banner */}
            <div className="bg-[#0B3D2E] p-6 rounded-3xl text-white space-y-3 shadow-lg">
              <h4 className="font-serif text-lg font-bold">Include {destination.name} in Your Custom Tour</h4>
              <p className="text-xs text-stone-300">Add private chauffeur pickup and luxury boutique villa reservations in {destination.name}.</p>
              <Link
                to={`/customize?destId=${destination.id}`}
                className="w-full inline-flex items-center justify-center gap-1.5 py-3 bg-[#176B52] text-[#062C22] font-bold text-xs rounded-xl hover:bg-[#39A982] transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Add to Custom Tour Wizard
              </Link>
            </div>
          </div>

        </div>

        {/* Major Attractions in this Destination */}
        {destination.attractions && destination.attractions.length > 0 && (
          <div className="space-y-6">
            <h3 className="font-serif text-3xl font-bold text-[#062C22]">Key Attractions & Monuments</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {destination.attractions.map((att: any, idx: number) => (
                <div key={idx} className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm flex flex-col justify-between">
                  <div className="h-44 overflow-hidden relative">
                    <img
                      src={att.image}
                      alt={att.name}
                      className="w-full h-full object-cover"
                      onError={(e) => handleImageError(e, 'destination')}
                    />
                    {att.entranceFee && (
                      <span className="absolute bottom-2 right-2 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-xs text-white text-[11px] font-semibold">
                        Fee: {att.entranceFee}
                      </span>
                    )}
                  </div>
                  <div className="p-5 space-y-2">
                    <h4 className="font-serif font-bold text-lg text-[#062C22]">{att.name}</h4>
                    <p className="text-xs text-stone-600 leading-relaxed">{att.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experiences & Activities in this Destination */}
        {matchingActivities.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-3xl font-bold text-[#062C22]">Activities in {destination.name}</h3>
              <Link to="/activities" className="text-xs font-bold text-[#0B3D2E] hover:underline">
                Explore All Activities &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {matchingActivities.map(act => (
                <ActivityCard key={act.id} activity={act} />
              ))}
            </div>
          </div>
        )}

        {/* Recommended Tours Passing Through this Destination */}
        {matchingTours.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-3xl font-bold text-[#062C22]">Tours Featuring {destination.name}</h3>
              <Link to="/tours" className="text-xs font-bold text-[#0B3D2E] hover:underline">
                Browse All Multi-Day Tours &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {matchingTours.slice(0, 3).map(tour => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
