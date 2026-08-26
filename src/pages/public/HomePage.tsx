import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Compass, 
  MapPin, 
  Plane, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  Star,
  Car
} from 'lucide-react';
import { Hero } from '../../components/home/Hero';
import { tourService } from '../../services/tourService';

export const HomePage: React.FC = () => {
  // Show 4 curated tours
  const featuredTours = tourService.getAllTours().slice(0, 4);

  // 8 visual Sri Lankan destinations: Colombo, Kandy, Sigiriya, Ella, Nuwara Eliya, Galle, Yala, Mirissa
  const destinations = [
    {
      name: 'Sigiriya',
      title: 'Ancient Lion Rock Citadel',
      image: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=800&q=80',
      region: 'Central Cultural Triangle'
    },
    {
      name: 'Kandy',
      title: 'Sacred Temple of the Tooth',
      image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80',
      region: 'Central Highlands'
    },
    {
      name: 'Ella',
      title: 'Nine Arches Bridge & Tea Hills',
      image: 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=800&q=80',
      region: 'Uva Mountain Range'
    },
    {
      name: 'Nuwara Eliya',
      title: 'Misty Tea Trails & Waterfalls',
      image: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80',
      region: 'Highland Tea Valleys'
    },
    {
      name: 'Galle',
      title: 'UNESCO Dutch Fort Ramparts',
      image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80',
      region: 'South Coast'
    },
    {
      name: 'Yala',
      title: 'Leopard & Wild Elephant Safari',
      image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80',
      region: 'Southern Wildlife Reserve'
    },
    {
      name: 'Colombo',
      title: 'Heritage, Dining & Ocean Promenade',
      image: 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80',
      region: 'Western Province Hub'
    },
    {
      name: 'Mirissa',
      title: 'Golden Surf & Whale Coast',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      region: 'Southern Beachline'
    }
  ];

  return (
    <div className="space-y-0 bg-[#F8F7F2]">
      
      {/* 1. HERO SECTION (Only 1 primary button: Explore Tours) */}
      <Hero />

      {/* 2. QUICK BOOKING / EXPLORE SECTION (Airport Transfers vs Guided Tours) */}
      <section className="py-20 sm:py-28 bg-white border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-[#176B52] uppercase tracking-wider inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#DDEFE8] border border-stone-200">
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
            
            {/* Service A: Airport Transfers */}
            <div className="bg-[#F8F7F2] rounded-3xl p-8 sm:p-10 border border-stone-200 shadow-[0_4px_20px_-4px_rgba(6,44,34,0.05)] hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-8 group">
              <div className="space-y-5">
                <div className="w-14 h-14 rounded-2xl bg-[#0B3D2E] text-white flex items-center justify-center shadow-md">
                  <Plane className="w-7 h-7 text-[#39A982]" />
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
                className="inline-flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-[#0B3D2E] hover:bg-[#176B52] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
              >
                <span>Plan Your Transfer</span>
                <ArrowRight className="w-4 h-4 text-[#DDEFE8]" />
              </Link>
            </div>

            {/* Service B: Guided Tours */}
            <div className="bg-[#F8F7F2] rounded-3xl p-8 sm:p-10 border border-stone-200 shadow-[0_4px_20px_-4px_rgba(6,44,34,0.05)] hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-8 group">
              <div className="space-y-5">
                <div className="w-14 h-14 rounded-2xl bg-[#176B52] text-white flex items-center justify-center shadow-md">
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
                    <span><strong>Car or Van selection</strong> (Rs. 15,000/day vs Rs. 20,000/day)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#39A982] shrink-0" />
                    <span><strong>Price calculated based on vehicle daily rate × fixed tour days</strong></span>
                  </li>
                </ul>
              </div>

              <Link
                to="/transfers"
                className="inline-flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-[#39A982] hover:bg-[#176B52] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
              >
                <span>Explore Tours</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* 3. FEATURED TOURS SECTION (Single View Tour button per card - NO Duplicate CTAs) */}
      <section className="py-20 sm:py-28 bg-[#F8F7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="max-w-2xl space-y-2.5">
            <span className="text-xs font-bold text-[#176B52] uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#39A982]" />
              FEATURED SRI LANKA TOURS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#17231F]">
              Journeys worth remembering.
            </h2>
            <p className="text-sm sm:text-base text-[#68736E] leading-relaxed">
              Explore our signature chauffeured itineraries. Open any tour to view fixed day-by-day itineraries with photos, select your Car or Van, and calculate your total price.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {featuredTours.map((tour) => (
              <div 
                key={tour.id}
                className="group bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-[0_4px_20px_-4px_rgba(6,44,34,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(6,44,34,0.12)] transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-1"
              >
                <div>
                  {/* Tour Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={tour.heroImage}
                      alt={tour.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-[11px] font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#39A982]" />
                      <span>{tour.durationDays} Days</span>
                    </div>
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[#0B3D2E] text-[10px] font-bold">
                      {tour.category}
                    </div>
                  </div>

                  {/* Tour Body */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#176B52] uppercase tracking-wider text-[10px]">
                        Fixed {tour.durationDays}-Day Route
                      </span>
                      <div className="flex items-center gap-1 font-semibold text-[#17231F]">
                        <Star className="w-3.5 h-3.5 fill-[#39A982] text-[#39A982]" />
                        <span>{tour.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-[#17231F] group-hover:text-[#176B52] transition-colors leading-snug line-clamp-1">
                      {tour.title}
                    </h3>
                    <p className="text-xs text-[#68736E] line-clamp-2 leading-relaxed">
                      {tour.overview || tour.subtitle}
                    </p>

                    {/* Main Destinations Covered */}
                    <div className="space-y-1 pt-2 border-t border-stone-100">
                      <span className="text-[10px] font-bold text-[#68736E] uppercase tracking-wider block">
                        Destinations
                      </span>
                      <p className="text-xs text-[#0B3D2E] font-medium line-clamp-1">
                        {tour.destinations.join(' • ')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Action: Exactly ONE View Tour Button (NO extra book now / explore buttons) */}
                <div className="px-6 pb-6 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] text-[#68736E] font-medium">
                    Fixed Itinerary
                  </span>
                  <Link
                    to="/transfers"
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-[#0B3D2E] hover:bg-[#176B52] text-white shadow-xs hover:shadow-md transition-all"
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

      {/* 4. HOW IT WORKS (Informational ONLY - NO Buttons) */}
      <section className="py-20 sm:py-28 bg-white border-y border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2.5">
            <span className="text-xs font-bold text-[#176B52] uppercase tracking-wider flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#39A982]" />
              SIMPLE 4-STEP PROCESS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#17231F]">
              How It Works
            </h2>
            <p className="text-sm text-[#68736E]">
              From browsing handcrafted routes to meeting your private chauffeur at the airport, booking is transparent and seamless.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Step 1 */}
            <div className="bg-[#F8F7F2] rounded-3xl p-6 sm:p-7 border border-stone-200 space-y-4">
              <span className="w-10 h-10 rounded-2xl bg-[#0B3D2E] text-white flex items-center justify-center font-serif text-lg font-bold shadow-sm">
                1
              </span>
              <div className="space-y-1.5">
                <h3 className="font-serif font-bold text-base text-[#17231F]">Choose Your Tour</h3>
                <p className="text-xs text-[#68736E] leading-relaxed">
                  Browse our curated Sri Lanka tours covering ancient kingdoms, tea highlands, and coastal surf zones.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-[#F8F7F2] rounded-3xl p-6 sm:p-7 border border-stone-200 space-y-4">
              <span className="w-10 h-10 rounded-2xl bg-[#176B52] text-white flex items-center justify-center font-serif text-lg font-bold shadow-sm">
                2
              </span>
              <div className="space-y-1.5">
                <h3 className="font-serif font-bold text-base text-[#17231F]">Explore the Fixed Itinerary</h3>
                <p className="text-xs text-[#68736E] leading-relaxed">
                  Review the predefined destinations with real high-resolution photos and included activity highlights.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-[#F8F7F2] rounded-3xl p-6 sm:p-7 border border-stone-200 space-y-4">
              <span className="w-10 h-10 rounded-2xl bg-[#39A982] text-white flex items-center justify-center font-serif text-lg font-bold shadow-sm">
                3
              </span>
              <div className="space-y-1.5">
                <h3 className="font-serif font-bold text-base text-[#17231F]">Select Car or Van</h3>
                <p className="text-xs text-[#68736E] leading-relaxed">
                  Pick a Private Sedan or Spacious Van. Daily rates (Rs. 15k / 20k) calculate your total price instantly.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-[#F8F7F2] rounded-3xl p-6 sm:p-7 border border-stone-200 space-y-4">
              <span className="w-10 h-10 rounded-2xl bg-[#062C22] text-white flex items-center justify-center font-serif text-lg font-bold shadow-sm">
                4
              </span>
              <div className="space-y-1.5">
                <h3 className="font-serif font-bold text-base text-[#17231F]">Confirm Your Booking</h3>
                <p className="text-xs text-[#68736E] leading-relaxed">
                  Provide your travel dates and passenger counts to reserve your dedicated chauffeur and vehicle.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. WHY TRAVEL WITH US (Informational ONLY - NO CTA Buttons) */}
      <section className="py-20 sm:py-28 bg-[#062C22] text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2.5">
            <span className="text-xs font-bold text-[#39A982] uppercase tracking-wider">
              AUTHENTIC CEYLON EXCELLENCE
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              Why Travel With LankaVoyage
            </h2>
            <p className="text-sm text-stone-200">
              We make exploring Sri Lanka relaxing, reliable, and authentic with private chauffeured vehicles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 space-y-3">
              <Compass className="w-6 h-6 text-[#39A982]" />
              <h3 className="font-serif font-bold text-base">Carefully Planned Tours</h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Thoughtfully sequenced itineraries balancing iconic highlights with relaxing resort stays.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 space-y-3">
              <Car className="w-6 h-6 text-[#39A982]" />
              <h3 className="font-serif font-bold text-base">Comfortable Car & Van Travel</h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Modern air-conditioned vehicles (Sedans & KDH High-Roofs) with daily chauffeur service.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 space-y-3">
              <Plane className="w-6 h-6 text-[#39A982]" />
              <h3 className="font-serif font-bold text-base">Airport Pickup from CMB</h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Warm welcome at Bandaranaike International Airport with flight tracking and delay waiting.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 space-y-3">
              <MapPin className="w-6 h-6 text-[#39A982]" />
              <h3 className="font-serif font-bold text-base">Real Driving Routes & Distance</h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Google Maps powered road routing giving accurate drive times across Sri Lankan highways.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 space-y-3">
              <Sparkles className="w-6 h-6 text-[#39A982]" />
              <h3 className="font-serif font-bold text-base">Local Sri Lanka Experiences</h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                English-speaking national chauffeurs offering insider local knowledge and dining tips.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 6. DESTINATION SECTION (Clickable Cards - NO redundant button tags) */}
      <section className="py-20 sm:py-28 bg-[#F8F7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="max-w-2xl space-y-2.5">
            <span className="text-xs font-bold text-[#176B52] uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#39A982]" />
              DESTINATION INSPIRATION
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#17231F]">
              Iconic Destinations of Sri Lanka
            </h2>
            <p className="text-sm sm:text-base text-[#68736E] leading-relaxed">
              From ancient rock citadels to misty tea estates and sun-drenched surf bays. Click any destination to plan your transfer or view matching tours.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((dest, idx) => (
              <Link
                key={idx}
                to="/transfers"
                className="group relative h-72 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 block transform hover:-translate-y-1"
              >
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                
                <div className="absolute top-3.5 left-3.5">
                  <span className="text-[10px] font-bold bg-[#0B3D2E]/80 text-[#DDEFE8] backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/15">
                    {dest.region}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                  <h3 className="font-serif text-xl font-bold group-hover:text-[#39A982] transition-colors">
                    {dest.name}
                  </h3>
                  <p className="text-xs text-stone-200 line-clamp-1">{dest.title}</p>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* 7. FINAL CTA (Only ONE Strong Action: Start Your Journey) */}
      <section className="py-20 sm:py-24 bg-[#0B3D2E] text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
          
          <div className="space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-bold text-[#39A982] uppercase tracking-wider inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20">
              <Compass className="w-3.5 h-3.5 text-[#39A982]" />
              START YOUR SRI LANKA ADVENTURE
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold">
              Ready to Explore Sri Lanka?
            </h2>
            <p className="text-base sm:text-lg text-stone-200 leading-relaxed">
              Choose your tour, explore the planned itinerary, select your Car or Van, and start your journey.
            </p>
          </div>

          <div className="flex justify-center">
            <Link
              to="/transfers"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 text-sm font-bold rounded-2xl bg-[#39A982] hover:bg-[#176B52] text-white shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
            >
              <span>Start Your Journey</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
};
