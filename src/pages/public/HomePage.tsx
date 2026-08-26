import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, MapPin, Sparkles } from 'lucide-react';
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
              to="/tours"
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
                EXPLORE SRI LANKA
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#17231F]">
                Iconic Destinations
              </h2>
              <p className="text-sm sm:text-base text-[#68736E]">
                From the ancient UNESCO rock citadel of Sigiriya to the misty tea country in Ella and wild coastlines in Yala.
              </p>
            </div>

            <Link
              to="/tours"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white border border-stone-200 text-xs sm:text-sm font-semibold text-[#0B3D2E] hover:bg-stone-50 transition-all shrink-0 shadow-2xs"
            >
              <span>Explore Island Routes</span>
              <ArrowRight className="w-4 h-4 text-[#39A982]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredDestinations.map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 5: Travel Experiences on White */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div className="space-y-2.5 max-w-2xl">
              <span className="text-xs font-semibold text-[#176B52] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#39A982]" />
                TRAVEL EXPERIENCES
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#17231F]">
                Unique Island Encounters
              </h2>
              <p className="text-sm sm:text-base text-[#68736E]">
                Private leopard game drives, tea sommelier masterclasses, and scenic hill country train journeys.
              </p>
            </div>

            <Link
              to="/tours"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#F8F7F2] border border-stone-200 text-xs sm:text-sm font-semibold text-[#0B3D2E] hover:bg-[#DDEFE8] transition-all shrink-0 shadow-2xs"
            >
              <span>View Experiences</span>
              <ArrowRight className="w-4 h-4 text-[#39A982]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredActivities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 6: Why LankaVoyage (Ivory) */}
      <WhyLankaVoyage />

      {/* SECTION 7: Final CTA (Deep Forest Green) */}
      <section className="py-20 sm:py-28 relative overflow-hidden bg-[#062C22] text-white">
        <div className="absolute inset-0 z-0 opacity-25">
          <img
            src="https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=2000&q=85"
            alt="Sri Lanka Sigiriya & Nature"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#062C22] via-[#062C22]/90 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-[#DDEFE8] text-xs font-semibold uppercase tracking-wider">
            <span>BESPOKE SRI LANKAN JOURNEYS</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            Your Sri Lankan journey starts here.
          </h2>

          <p className="text-base sm:text-lg text-stone-200 max-w-xl mx-auto leading-relaxed">
            Explore our tours or create a journey that fits your time and style with dedicated chauffeur guidance.
          </p>

          <div className="pt-3">
            <Link
              to="/tours"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#176B52] hover:bg-[#0B3D2E] text-white font-semibold text-sm transition-all border border-white/20 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <span>Plan Your Journey</span>
              <ArrowRight className="w-4 h-4 text-[#DDEFE8]" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
