import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, MapPin, Sparkles, Car } from 'lucide-react';
import { Hero } from '../../components/home/Hero';
import { WhyLankaVoyage } from '../../components/home/WhyLankaVoyage';
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
      
      {/* SECTION 1 & 2: Hero with Sigiriya + Floating Quick Travel Planner */}
      <Hero />

      {/* SECTION 3: Featured Tours on White */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div className="space-y-2.5 max-w-2xl">
              <span className="text-xs font-semibold text-[#176B52] uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#39A982]" />
                FEATURED TOURS
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#17231F]">
                Journeys worth remembering.
              </h2>
              <p className="text-sm sm:text-base text-[#68736E]">
                Private, chauffeured multi-day journeys designed for couples, families, and boutique travel lovers.
              </p>
            </div>

            <Link
              to="/transfers"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#F8F7F2] border border-stone-200 text-xs sm:text-sm font-semibold text-[#0B3D2E] hover:bg-[#DDEFE8] transition-all shrink-0 shadow-2xs"
            >
              <span>View All Tours & Transfers</span>
              <ArrowRight className="w-4 h-4 text-[#39A982]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredTours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 4: Explore Sri Lanka on Ivory */}
      <section className="py-20 sm:py-28 bg-[#F8F7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div className="space-y-2.5 max-w-2xl">
              <span className="text-xs font-semibold text-[#176B52] uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#39A982]" />
                DESTINATION INSPIRATION
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#17231F]">
                Iconic destinations of Ceylon.
              </h2>
              <p className="text-sm sm:text-base text-[#68736E]">
                From mist-covered tea plantations in Nuwara Eliya to golden surf beaches in Mirissa and ancient citadel fortresses.
              </p>
            </div>

            <Link
              to="/transfers"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white border border-stone-200 text-xs sm:text-sm font-semibold text-[#0B3D2E] hover:bg-[#DDEFE8] transition-all shrink-0 shadow-2xs"
            >
              <span>Plan Airport Transfer to Any Destination</span>
              <ArrowRight className="w-4 h-4 text-[#39A982]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredDestinations.map((destination) => (
              <DestinationCard key={destination.id} destination={destination} />
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 5: Why LankaVoyage (Value Proposition on Forest Green) */}
      <WhyLankaVoyage />

      {/* SECTION 6: Unforgettable Signature Experiences */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-2.5">
            <span className="text-xs font-semibold text-[#176B52] uppercase tracking-wider inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#39A982]" />
              AUTHENTIC EXPERIENCES
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#17231F]">
              Handcrafted Sri Lankan Moments
            </h2>
            <p className="text-sm sm:text-base text-[#68736E]">
              Private encounters curated to connect you deeply with Sri Lanka's heritage, wilderness, and coastal splendor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredActivities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 7: Airport Transfer Banner CTA on Soft Mint */}
      <section className="py-16 bg-[#DDEFE8]/60 border-t border-stone-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200/90 shadow-[0_15px_40px_-10px_rgba(6,44,34,0.08)] flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <span className="text-xs font-bold text-[#176B52] uppercase tracking-wider flex items-center gap-2">
                <Car className="w-4 h-4 text-[#39A982]" />
                PRIVATE CHAUFFEURED FLEET
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#17231F]">
                Need a private airport transfer from Bandaranaike (CMB)?
              </h3>
              <p className="text-sm text-[#68736E] leading-relaxed">
                Enjoy transparent distance-based pricing across any hotel, resort or villa in Sri Lanka with dedicated English-speaking chauffeurs and meet & greet included.
              </p>
            </div>

            <Link
              to="/transfers"
              className="px-6 py-3.5 rounded-2xl bg-[#0B3D2E] hover:bg-[#176B52] text-white text-xs sm:text-sm font-semibold shadow-sm hover:shadow-md transition-all shrink-0 flex items-center gap-2"
            >
              <span>Calculate Transfer & Explore Tours</span>
              <ArrowRight className="w-4 h-4 text-[#DDEFE8]" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
