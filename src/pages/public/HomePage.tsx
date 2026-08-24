import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Sparkles, ArrowRight, MapPin } from 'lucide-react';
import { Hero } from '../../components/home/Hero';
import { WhyLankaVoyage } from '../../components/home/WhyLankaVoyage';
import { HowItWorks } from '../../components/home/HowItWorks';
import { CustomTripCTA } from '../../components/home/CustomTripCTA';
import { VerifiedReviews } from '../../components/home/VerifiedReviews';
import { TravelInspiration } from '../../components/home/TravelInspiration';
import { Newsletter } from '../../components/home/Newsletter';
import { TourCard } from '../../components/tours/TourCard';
import { DestinationCard } from '../../components/destinations/DestinationCard';
import { ActivityCard } from '../../components/activities/ActivityCard';
import { tourService } from '../../services/tourService';
import { destinationService } from '../../services/destinationService';
import { activityService } from '../../services/activityService';

export const HomePage: React.FC = () => {
  const featuredTours = tourService.getFeaturedTours().slice(0, 4);
  const featuredDestinations = destinationService.getFeaturedDestinations().slice(0, 6);
  const featuredActivities = activityService.getFeaturedActivities().slice(0, 4);

  return (
    <div className="space-y-0">
      
      {/* 1. Hero with Floating Trip Planner */}
      <Hero />

      {/* 2. Popular Destinations Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0D3B2E]/10 text-[#0D3B2E] text-xs font-bold uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                Explore Sri Lanka
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#082F24]">
                Iconic Regions & Ancient Wonders
              </h2>
              <p className="text-sm sm:text-base text-stone-600">
                From UNESCO rock fortresses in Sigiriya to mist-covered tea mountains in Ella and azure whale sanctuaries in Mirissa.
              </p>
            </div>

            <Link
              to="/destinations"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0D3B2E] hover:text-[#C5A059] transition-colors shrink-0"
            >
              <span>Explore All 12 Destinations</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredDestinations.map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>

        </div>
      </section>

      {/* 3. Curated Featured Luxury Tours */}
      <section className="py-20 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A059]/20 text-[#8C6D2B] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Signature Journeys
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#082F24]">
                Hand-Crafted Luxury Itineraries
              </h2>
              <p className="text-sm sm:text-base text-stone-600">
                Impeccably planned, fully customizable multi-day private tours with luxury transport and boutique stays.
              </p>
            </div>

            <Link
              to="/tours"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0D3B2E] hover:text-[#C5A059] transition-colors shrink-0"
            >
              <span>View All Tours</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredTours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>

        </div>
      </section>

      {/* 4. Why Travel With LankaVoyage */}
      <WhyLankaVoyage />

      {/* 5. Signature Activities Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0D3B2E]/10 text-[#0D3B2E] text-xs font-bold uppercase tracking-wider">
                <Compass className="w-3.5 h-3.5 text-[#C5A059]" />
                Extraordinary Encounters
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#082F24]">
                Curated Sri Lankan Experiences
              </h2>
              <p className="text-sm sm:text-base text-stone-600">
                Add private leopard tracking, blue train rides, whale watching on catamarans, and Ceylon tea cupping to your journey.
              </p>
            </div>

            <Link
              to="/activities"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0D3B2E] hover:text-[#C5A059] transition-colors shrink-0"
            >
              <span>Discover All Activities</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredActivities.map((act) => (
              <ActivityCard key={act.id} activity={act} />
            ))}
          </div>

        </div>
      </section>

      {/* 6. How It Works (4 Steps) */}
      <HowItWorks />

      {/* 7. Custom Trip Interactive CTA */}
      <CustomTripCTA />

      {/* 8. Verified Customer Reviews */}
      <VerifiedReviews />

      {/* 9. Travel Inspiration Journal */}
      <TravelInspiration />

      {/* 10. Luxury Newsletter */}
      <Newsletter />

    </div>
  );
};
