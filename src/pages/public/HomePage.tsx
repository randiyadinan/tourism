import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Hero } from '../../components/home/Hero';
import { WhyLankaVoyage } from '../../components/home/WhyLankaVoyage';
import { CustomTripCTA } from '../../components/home/CustomTripCTA';
import { VerifiedReviews } from '../../components/home/VerifiedReviews';
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
      
      {/* 1. Hero with Quick Trip Planner */}
      <Hero />

      {/* 2. Featured Signature Tours */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div className="space-y-2.5 max-w-2xl">
              <span className="text-xs font-semibold text-[#1F6B50] uppercase tracking-wider">
                Featured Tours
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0D3B2E]">
                Hand-Crafted Sri Lanka Itineraries
              </h2>
              <p className="text-sm sm:text-base text-[#66716C]">
                Private, fully customizable multi-day journeys with dedicated chauffeur-guides and boutique stays.
              </p>
            </div>

            <Link
              to="/tours"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0D3B2E] hover:text-[#1F6B50] transition-colors shrink-0"
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

      {/* 3. Popular Destinations */}
      <section className="py-20 sm:py-24 bg-[#FAF8F3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div className="space-y-2.5 max-w-2xl">
              <span className="text-xs font-semibold text-[#1F6B50] uppercase tracking-wider">
                Discover Sri Lanka
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0D3B2E]">
                Popular Destinations
              </h2>
              <p className="text-sm sm:text-base text-[#66716C]">
                From UNESCO ancient citadels in Sigiriya to misty tea trails in Ella and sandy southern shores in Mirissa.
              </p>
            </div>

            <Link
              to="/destinations"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0D3B2E] hover:text-[#1F6B50] transition-colors shrink-0"
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

      {/* 4. Unique Experiences / Activities */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div className="space-y-2.5 max-w-2xl">
              <span className="text-xs font-semibold text-[#1F6B50] uppercase tracking-wider">
                Unique Experiences
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0D3B2E]">
                Curated Island Encounters
              </h2>
              <p className="text-sm sm:text-base text-[#66716C]">
                Private leopard game drives, tea sommelier masterclasses, and scenic hill country blue train journeys.
              </p>
            </div>

            <Link
              to="/activities"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0D3B2E] hover:text-[#1F6B50] transition-colors shrink-0"
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

      {/* 5. Why Choose LankaVoyage */}
      <WhyLankaVoyage />

      {/* 6. Custom Trip Final CTA */}
      <CustomTripCTA />

      {/* 7. Traveler Reviews */}
      <VerifiedReviews />

      {/* 8. Newsletter */}
      <Newsletter />

    </div>
  );
};
