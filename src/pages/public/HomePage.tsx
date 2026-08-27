import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Compass, 
  MapPin, 
  Plane, 
  CheckCircle2, 
  Sparkles, 
  Star
} from 'lucide-react';
import { Hero } from '../../components/home/Hero';
import { tourService } from '../../services/tourService';
import { destinationTicketService, type DestinationTicketRecord } from '../../services/destinationTicketService';
import { DestinationTicketCard } from '../../components/destinations/DestinationTicketCard';

export const HomePage: React.FC = () => {
  // Show 4 curated tours from tourService
  const featuredTours = tourService.getAllTours().filter(t => t.published).slice(0, 4);

  // Destinations with prices fetched from admin-managed destinationTicketService
  const [destinations, setDestinations] = useState<DestinationTicketRecord[]>(() => destinationTicketService.getActiveDestinations());

  useEffect(() => {
    setDestinations(destinationTicketService.getActiveDestinations());
  }, []);

  return (
    <div className="space-y-0 bg-[#F8F7F2] relative overflow-hidden">
      
      {/* Ambient background blur lights */}
      <div className="ambient-glow-orb w-[500px] h-[500px] bg-[#39A982] top-96 -left-48 opacity-15" />
      <div className="ambient-glow-orb w-[600px] h-[600px] bg-[#C5A059] top-[1400px] -right-48 opacity-10" />

      {/* 1. HERO SECTION */}
      <Hero />

      {/* 2. ICONIC DESTINATIONS OF SRI LANKA */}
      <section className="py-20 sm:py-28 relative z-10 border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold text-[#176B52] uppercase tracking-wider inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full liquid-glass-white border border-[#39A982]/20 shadow-xs">
              <MapPin className="w-3.5 h-3.5 text-[#39A982]" />
              ICONIC DESTINATIONS & ATTRACTION TICKETS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#17231F]">
              Iconic Destinations of Sri Lanka
            </h2>
            <p className="text-sm sm:text-base text-[#68736E] leading-relaxed">
              Check entrance ticket rates across premier Sri Lankan attractions. Select your adult and child ticket quantities below to instantly calculate total ticket estimates for your group.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((dest) => (
              <DestinationTicketCard
                key={dest.id}
                destination={dest}
              />
            ))}
          </div>

        </div>
      </section>

      {/* 3. AIRPORT TRANSFERS / GUIDED TOURS (Two Core Travel Services) */}
      <section className="py-20 sm:py-28 relative z-10 bg-white/70 backdrop-blur-md border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-[#176B52] uppercase tracking-wider inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full liquid-glass-white border border-[#39A982]/20 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#39A982]" />
              TWO SEAMLESS SERVICES
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#17231F]">
              How would you like to travel?
            </h2>
            <p className="text-sm sm:text-base text-[#68736E] leading-relaxed">
              Whether you need a direct private airport pickup from Bandaranaike (CMB) with live road-distance pricing, or a fully guided multi-day chauffeured tour, LankaVoyage ensures seamless Sri Lankan hospitality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            
            {/* Service A: Airport Transfers -> /transfers */}
            <div className="glass-card-interactive liquid-glass-white rounded-3xl p-8 sm:p-10 border border-white/80 shadow-[0_10px_30px_-10px_rgba(6,44,34,0.08)] flex flex-col justify-between space-y-8 group">
              <div className="space-y-5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0B3D2E] to-[#176B52] text-white flex items-center justify-center shadow-lg">
                  <Plane className="w-7 h-7 text-[#DDEFE8]" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#17231F] group-hover:text-[#176B52] transition-colors">
                    Airport Transfers
                  </h3>
                  <p className="text-sm text-[#68736E] leading-relaxed">
                    Direct VIP chauffeur pickup from Bandaranaike International Airport (CMB) to any hotel, resort, or villa across Sri Lanka.
                  </p>
                </div>

                <ul className="space-y-3 pt-2 text-xs sm:text-sm text-[#17231F]">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#39A982] shrink-0" />
                    <span><strong>Bandaranaike International Airport (CMB)</strong> origin</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#39A982] shrink-0" />
                    <span><strong>Choose your destination</strong> with Google Places search</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#39A982] shrink-0" />
                    <span><strong>Google Maps actual driving route</strong> following real roads</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#39A982] shrink-0" />
                    <span><strong>Distance and estimated driving time</strong> calculated instantly</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#39A982] shrink-0" />
                    <span><strong>Car or Van transfer options</strong> with transparent distance rates</span>
                  </li>
                </ul>
              </div>

              <Link
                to="/transfers"
                className="glass-btn-primary inline-flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-white font-bold text-sm shadow-md"
              >
                <span>Plan Your Airport Transfer</span>
                <ArrowRight className="w-4 h-4 text-[#DDEFE8]" />
              </Link>
            </div>

            {/* Service B: Guided Tours -> /transfers */}
            <div className="glass-card-interactive liquid-glass-white rounded-3xl p-8 sm:p-10 border border-white/80 shadow-[0_10px_30px_-10px_rgba(6,44,34,0.08)] flex flex-col justify-between space-y-8 group">
              <div className="space-y-5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#176B52] to-[#39A982] text-white flex items-center justify-center shadow-lg">
                  <Compass className="w-7 h-7 text-[#DDEFE8]" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#17231F] group-hover:text-[#176B52] transition-colors">
                    Guided Tours
                  </h3>
                  <p className="text-sm text-[#68736E] leading-relaxed">
                    Handcrafted multi-day itineraries with private chauffeured travel, authentic cultural experiences, and pristine hill country landscapes.
                  </p>
                </div>

                <ul className="space-y-3 pt-2 text-xs sm:text-sm text-[#17231F]">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#39A982] shrink-0" />
                    <span><strong>Pre-designed Sri Lanka tours</strong> curated by local experts</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#39A982] shrink-0" />
                    <span><strong>Fixed duration & fixed day-by-day destinations</strong></span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#39A982] shrink-0" />
                    <span><strong>Destination photos</strong> for every day of the tour</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#39A982] shrink-0" />
                    <span><strong>Car or Van selection</strong> (LKR 15,000/day vs LKR 20,000/day)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#39A982] shrink-0" />
                    <span><strong>Transparent pricing based on vehicle daily rate × fixed days</strong></span>
                  </li>
                </ul>
              </div>

              <Link
                to="/transfers"
                className="glass-btn-emerald inline-flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-white font-bold text-sm shadow-md"
              >
                <span>Explore Tours in Airport Transfer & Tours Page</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* 4. FEATURED PRE-DESIGNED TOURS */}
      <section className="py-20 sm:py-28 relative z-10 border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <span className="text-xs font-bold text-[#176B52] uppercase tracking-wider inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full liquid-glass-white border border-[#39A982]/20 shadow-xs">
                <Compass className="w-3.5 h-3.5 text-[#39A982]" />
                FEATURED ITINERARIES
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#17231F]">
                Handcrafted Journeys Across Ceylon
              </h2>
              <p className="text-sm sm:text-base text-[#68736E]">
                Discover our signature multi-day itineraries designed for culture, wildlife, and tea country serenity.
              </p>
            </div>

            <Link
              to="/transfers"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/80 hover:bg-white text-[#0B3D2E] font-bold text-xs border border-stone-200 shadow-xs transition-all shrink-0"
            >
              <span>View All Tours in Transfers & Tours</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#176B52]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredTours.map((tour) => (
              <div 
                key={tour.id}
                className="glass-card-interactive liquid-glass-white rounded-3xl border border-white/80 overflow-hidden shadow-[0_10px_30px_-10px_rgba(6,44,34,0.08)] flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={tour.heroImage}
                      alt={tour.title}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#062C22]/80 text-[#DDEFE8] backdrop-blur-md border border-white/20">
                        {tour.durationDays} Days / {tour.durationNights} Nights
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#176B52]">{tour.category}</span>
                      <div className="flex items-center gap-1 font-bold text-[#17231F]">
                        <Star className="w-3.5 h-3.5 fill-[#39A982] text-[#39A982]" />
                        <span>{tour.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    <h3 className="font-serif text-base font-bold text-[#17231F] group-hover:text-[#176B52] transition-colors line-clamp-1">
                      {tour.title}
                    </h3>
                    <p className="text-xs text-[#68736E] line-clamp-2">{tour.tagline || tour.overview}</p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    to="/transfers"
                    className="glass-btn-primary w-full py-2.5 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>View Tour</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#DDEFE8]" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
};
