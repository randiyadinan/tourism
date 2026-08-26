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
      
      {/* 1. Hero with Coastal Sri Lanka Visuals & Liquid Glass Quick Trip Planner */}
      <Hero />

      {/* 2. Featured Signature Tours on Warm White */}
      <section className="py-20 sm:py-28 bg-[#FCFEFD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div className="space-y-2.5 max-w-2xl">
              <span className="text-xs font-semibold text-[#0B7A75] uppercase tracking-wider">
                EXPLORE THE ISLAND
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#173238]">
                Journeys worth remembering.
              </h2>
              <p className="text-sm sm:text-base text-[#68736E]">
                Private, chauffeured multi-day journeys designed for couples, families, and boutique travel lovers.
              </p>
            </div>

            <Link
              to="/tours"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F6F1E7] border border-stone-200 text-xs sm:text-sm font-semibold text-[#075E63] hover:bg-[#DDF5F0] transition-all shrink-0 shadow-2xs"
            >
              <span>View All Tours</span>
              <ArrowRight className="w-4 h-4 text-[#E98B6B]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredTours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>

        </div>
      </section>

      {/* 3. Popular Destinations on Soft Sand */}
      <section className="py-20 sm:py-28 bg-[#F6F1E7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div className="space-y-2.5 max-w-2xl">
              <span className="text-xs font-semibold text-[#0B7A75] uppercase tracking-wider">
                DISCOVER SRI LANKA
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#173238]">
                Iconic Destinations
              </h2>
              <p className="text-sm sm:text-base text-[#68736E]">
                From the ancient UNESCO rock citadel of Sigiriya to the turquoise surf in Mirissa and wild coastlines in Yala.
              </p>
            </div>

            <Link
              to="/destinations"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-stone-200 text-xs sm:text-sm font-semibold text-[#075E63] hover:bg-stone-50 transition-all shrink-0 shadow-2xs"
            >
              <span>Explore All Destinations</span>
              <ArrowRight className="w-4 h-4 text-[#E98B6B]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredDestinations.map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>

        </div>
      </section>

      {/* 4. Featured Experiences on Warm White */}
      <section className="py-20 sm:py-28 bg-[#FCFEFD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div className="space-y-2.5 max-w-2xl">
              <span className="text-xs font-semibold text-[#0B7A75] uppercase tracking-wider">
                CURATED ENCOUNTERS
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#173238]">
                Unique Island Experiences
              </h2>
              <p className="text-sm sm:text-base text-[#68736E]">
                Private leopard game drives, tea sommelier masterclasses, and scenic hill country train journeys.
              </p>
            </div>

            <Link
              to="/activities"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F6F1E7] border border-stone-200 text-xs sm:text-sm font-semibold text-[#075E63] hover:bg-[#DDF5F0] transition-all shrink-0 shadow-2xs"
            >
              <span>View All Experiences</span>
              <ArrowRight className="w-4 h-4 text-[#E98B6B]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredActivities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>

        </div>
      </section>

      {/* 5. Why Choose LankaVoyage (Soft Sand) */}
      <WhyLankaVoyage />

      {/* 6. Traveler Reviews (Warm White) */}
      <VerifiedReviews />

      {/* 7. Final Custom Journey CTA (Deep Ocean Teal) */}
      <CustomTripCTA />

      {/* 8. Newsletter (Tropical Teal) */}
      <Newsletter />

    </div>
  );
};
