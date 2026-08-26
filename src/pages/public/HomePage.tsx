import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Hero } from '../../components/home/Hero';
import { WhyLankaVoyage } from '../../components/home/WhyLankaVoyage';
import { CustomTripCTA } from '../../components/home/CustomTripCTA';
import { VerifiedReviews } from '../../components/home/VerifiedReviews';
import { TropicalBeachSection } from '../../components/home/TropicalBeachSection';
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
  const featuredActivities = activityService.getAllActivities().slice(0, 3);

  return (
    <div className="space-y-0">
      
      {/* 1. Hero with Tropical Vibe & Quick Trip Planner */}
      <Hero />

      {/* 2. Featured Signature Tours */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div className="space-y-2.5 max-w-2xl">
              <span className="text-xs font-semibold text-[#087F8C] uppercase tracking-wider">
                Explore the Island
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#193238]">
                Where will Sri Lanka take you?
              </h2>
              <p className="text-sm sm:text-base text-stone-600">
                Private, fully customizable tropical journeys with dedicated chauffeur-guides and handpicked boutique resorts.
              </p>
            </div>

            <Link
              to="/tours"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#FFF9EF] border border-[#F3D6A4] text-xs sm:text-sm font-semibold text-[#087F8C] hover:bg-[#F3D6A4]/40 transition-all shrink-0 shadow-2xs"
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

      {/* 3. Popular Destinations (Instagram-style travel gallery) */}
      <section className="py-20 sm:py-28 bg-[#FFF9EF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div className="space-y-2.5 max-w-2xl">
              <span className="text-xs font-semibold text-[#3E8E5B] uppercase tracking-wider">
                Save These Places
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#193238]">
                Iconic Sri Lankan Destinations
              </h2>
              <p className="text-sm sm:text-base text-stone-600">
                From ancient rock citadels in Sigiriya to golden surf beaches in Mirissa and tea country hills in Ella.
              </p>
            </div>

            <Link
              to="/destinations"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white border border-stone-200 text-xs sm:text-sm font-semibold text-[#087F8C] hover:bg-stone-50 transition-all shrink-0 shadow-2xs"
            >
              <span>Explore All Destinations</span>
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

      {/* 4. Tropical Beach Feature ("Life is better by the ocean") */}
      <TropicalBeachSection />

      {/* 5. Unique Experiences (Wildlife, Train, Whale Watching) */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div className="space-y-2.5 max-w-2xl">
              <span className="text-xs font-semibold text-[#087F8C] uppercase tracking-wider">
                Island Adventures
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#193238]">
                Unique Sri Lanka Experiences
              </h2>
              <p className="text-sm sm:text-base text-stone-600">
                Private leopard game drives, tea sommelier masterclasses, and scenic blue train hill climbs.
              </p>
            </div>

            <Link
              to="/activities"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#FFF9EF] border border-[#F3D6A4] text-xs sm:text-sm font-semibold text-[#087F8C] hover:bg-[#F3D6A4]/40 transition-all shrink-0 shadow-2xs"
            >
              <span>View All Experiences</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredActivities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>

        </div>
      </section>

      {/* 6. Why Choose LankaVoyage */}
      <WhyLankaVoyage />

      {/* 7. Final Tropical Story CTA */}
      <CustomTripCTA />

      {/* 8. Traveler Reviews */}
      <VerifiedReviews />

      {/* 9. Newsletter */}
      <Newsletter />

    </div>
  );
};
