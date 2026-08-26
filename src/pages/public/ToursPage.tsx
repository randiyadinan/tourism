import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Plane, 
  MapPin, 
  Calendar, 
  Users, 
  Car, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  Search,
  Compass
} from 'lucide-react';
import { tourService } from '../../services/tourService';
import { TourCard } from '../../components/tours/TourCard';
import { DESTINATION_DISTANCES, calculateDistanceTransferRate } from '../../data/destinationDistances';

export const ToursPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Active section tab: 'transfers' | 'tours'
  const [activeTab, setActiveTab] = useState<'transfers' | 'tours'>('transfers');

  // --- AIRPORT TRANSFER STATE ---
  const [selectedDestId, setSelectedDestId] = useState<string>(
    searchParams.get('destination') ? 
      (DESTINATION_DISTANCES.find(d => d.name.toLowerCase().includes((searchParams.get('destination') || '').toLowerCase()))?.id || 'dest-sigiriya')
      : 'dest-sigiriya'
  );
  const [travelDate, setTravelDate] = useState<string>('2026-10-15');
  const [passengers, setPassengers] = useState<number>(2);
  const [vehicleType, setVehicleType] = useState<'Standard Car' | 'Luxury Car' | 'Van' | 'Safari SUV'>('Standard Car');
  const [tripType] = useState<'One Way: Airport to Hotel' | 'One Way: Hotel to Airport' | 'Round Trip'>('One Way: Airport to Hotel');

  // --- SIMPLE TOUR CUSTOMIZATION STATE ---
  const [tourSearchQuery, setTourSearchQuery] = useState<string>('');

  const selectedDestination = useMemo(() => {
    return DESTINATION_DISTANCES.find(d => d.id === selectedDestId) || DESTINATION_DISTANCES[0];
  }, [selectedDestId]);

  const isRoundTrip = tripType === 'Round Trip';
  const calculatedTransferPrice = useMemo(() => {
    return calculateDistanceTransferRate(selectedDestination.distanceKm, vehicleType, isRoundTrip);
  }, [selectedDestination, vehicleType, isRoundTrip]);

  // All tours from service
  const allTours = useMemo(() => {
    return tourService.getAllTours();
  }, []);

  const filteredTours = useMemo(() => {
    return allTours.filter(tour => {
      const matchesSearch = !tourSearchQuery || 
        tour.title.toLowerCase().includes(tourSearchQuery.toLowerCase()) ||
        tour.destinations.some(d => d.toLowerCase().includes(tourSearchQuery.toLowerCase())) ||
        tour.category.toLowerCase().includes(tourSearchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [allTours, tourSearchQuery]);

  // Handle Transfer & Connect to Tour
  const handleContinueToTour = () => {
    if (selectedDestination.matchingTourSlug) {
      navigate(`/tours/${selectedDestination.matchingTourSlug}?transferDest=${encodeURIComponent(selectedDestination.name)}&vehicle=${encodeURIComponent(vehicleType)}`);
    } else {
      // Scroll to tours section
      setActiveTab('tours');
      window.scrollTo({ top: 750, behavior: 'smooth' });
    }
  };

  const handleBookTransferOnly = () => {
    navigate('/checkout', {
      state: {
        tourId: 'transfer-cmb-direct',
        tourTitle: `VIP Airport Transfer: CMB Airport to ${selectedDestination.name}`,
        tourImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
        durationDays: isRoundTrip ? 2 : 1,
        startDate: travelDate,
        adults: passengers,
        children: 0,
        airportPickup: true,
        totalAmount: calculatedTransferPrice,
        destinations: [selectedDestination.name],
        vehicleType: vehicleType
      }
    });
  };

  return (
    <div className="bg-[#F8F7F2] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Page Top Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white text-[#176B52] border border-stone-200 text-xs font-semibold uppercase tracking-wider shadow-2xs">
            <Compass className="w-3.5 h-3.5 text-[#39A982]" />
            <span>START YOUR SRI LANKAN JOURNEY</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#17231F]">
            Airport Transfers & Signature Tours
          </h1>
          <p className="text-sm sm:text-base text-[#68736E] leading-relaxed">
            Book private airport transfers from Bandaranaike International Airport (CMB) with transparent distance-based rates, and explore our hand-crafted chauffeured island itineraries.
          </p>
        </div>

        {/* Section Tabs Switcher */}
        <div className="flex justify-center">
          <div className="bg-stone-200/80 p-1 rounded-2xl inline-flex gap-1">
            <button
              onClick={() => setActiveTab('transfers')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'transfers'
                  ? 'bg-[#0B3D2E] text-white shadow-xs'
                  : 'text-stone-700 hover:text-[#0B3D2E]'
              }`}
            >
              <Plane className="w-4 h-4" />
              <span>1. Airport Transfer (CMB)</span>
            </button>

            <button
              onClick={() => setActiveTab('tours')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'tours'
                  ? 'bg-[#0B3D2E] text-white shadow-xs'
                  : 'text-stone-700 hover:text-[#0B3D2E]'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>2. Explore All Tours</span>
            </button>
          </div>
        </div>

        {/* SECTION 1: AIRPORT TRANSFER BOOKER */}
        <div className={`space-y-8 ${activeTab === 'tours' ? 'hidden md:block' : ''}`}>
          
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 sm:p-10 border border-white/80 shadow-[0_10px_35px_-10px_rgba(6,44,34,0.08)] space-y-8">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
              <div>
                <span className="text-xs font-semibold text-[#176B52] uppercase tracking-wider block">
                  BANDARANAIKE INTERNATIONAL AIRPORT (CMB)
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#17231F]">
                  Private Chauffeur Airport Transfer
                </h2>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#176B52] font-semibold bg-[#DDEFE8] px-3.5 py-1.5 rounded-full self-start">
                <ShieldCheck className="w-4 h-4 text-[#176B52]" />
                <span>SLTDA Certified Chauffeur & All Expressway Tolls Included</span>
              </div>
            </div>

            {/* Transfer Setup Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              
              {/* Pickup Airport (Fixed to CMB) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#17231F] flex items-center gap-1.5">
                  <Plane className="w-3.5 h-3.5 text-[#176B52]" />
                  Pickup / Drop Airport
                </label>
                <div className="p-3 bg-[#F8F7F2] border border-stone-300 rounded-xl text-xs font-medium text-[#17231F]">
                  CMB Colombo Airport
                </div>
              </div>

              {/* Destination Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#17231F] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#176B52]" />
                  Select Destination
                </label>
                <select
                  value={selectedDestId}
                  onChange={(e) => setSelectedDestId(e.target.value)}
                  className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl p-3 text-xs font-medium text-[#17231F] focus:outline-none focus:ring-2 focus:ring-[#176B52]"
                >
                  {DESTINATION_DISTANCES.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.distanceKm} km)
                    </option>
                  ))}
                </select>
              </div>

              {/* Travel Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#17231F] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#176B52]" />
                  Flight Arrival Date
                </label>
                <input
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl p-2.5 text-xs font-medium text-[#17231F] focus:outline-none focus:ring-2 focus:ring-[#176B52]"
                />
              </div>

              {/* Passengers */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#17231F] flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#176B52]" />
                  Passengers
                </label>
                <select
                  value={passengers}
                  onChange={(e) => setPassengers(Number(e.target.value))}
                  className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl p-3 text-xs font-medium text-[#17231F] focus:outline-none focus:ring-2 focus:ring-[#176B52]"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <option key={num} value={num}>{num} Passenger{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* Vehicle Selection Row */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-[#17231F] flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-[#176B52]" />
                Select Vehicle Type
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    id: 'Standard Car',
                    title: 'Standard Car',
                    subtitle: 'Toyota Allion / Axio Sedan (1-3 Pax)',
                    desc: 'Comfortable private transfer with air-conditioning & luggage boot'
                  },
                  {
                    id: 'Luxury Car',
                    title: 'Luxury Car',
                    subtitle: 'Executive Luxury Sedan / SUV (1-4 Pax)',
                    desc: 'Premium leather seating, bottled king coconuts & Wi-Fi'
                  },
                  {
                    id: 'Van',
                    title: 'Van',
                    subtitle: 'Toyota KDH High-Roof (4-8 Pax)',
                    desc: 'Ideal for families and groups with extra large luggage space'
                  }
                ].map((veh) => (
                  <div
                    key={veh.id}
                    onClick={() => setVehicleType(veh.id as any)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      vehicleType === veh.id
                        ? 'bg-[#DDEFE8]/70 border-[#176B52] shadow-xs'
                        : 'bg-[#F8F7F2] border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-bold text-sm text-[#17231F]">{veh.title}</span>
                      <input
                        type="radio"
                        name="vehSelect"
                        checked={vehicleType === veh.id}
                        onChange={() => setVehicleType(veh.id as any)}
                        className="text-[#176B52] focus:ring-[#176B52]"
                      />
                    </div>
                    <span className="text-[11px] font-semibold text-[#176B52] block mt-0.5">{veh.subtitle}</span>
                    <p className="text-[11px] text-[#68736E] mt-1">{veh.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Distance & Price Summary Box */}
            <div className="bg-[#0B3D2E] text-white rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-md">
              
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2 text-[#39A982] text-xs font-semibold uppercase tracking-wider">
                  <span>TRANSFER ROUTE SUMMARY</span>
                </div>
                <div className="font-serif text-xl sm:text-2xl font-bold flex items-center gap-2 flex-wrap">
                  <span>CMB Colombo Airport</span>
                  <ArrowRight className="w-5 h-5 text-[#39A982]" />
                  <span>{selectedDestination.name}</span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs text-stone-200 pt-1">
                  <span><strong>Distance:</strong> {selectedDestination.distanceKm} km</span>
                  <span>•</span>
                  <span><strong>Estimated Journey:</strong> {selectedDestination.estimatedHours}</span>
                  <span>•</span>
                  <span><strong>Vehicle:</strong> {vehicleType}</span>
                </div>
              </div>

              {/* Price & Action Buttons */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
                <div>
                  <span className="text-[11px] text-stone-300 block uppercase font-medium">Calculated Transfer Price</span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-serif text-3xl font-bold text-white">${calculatedTransferPrice}</span>
                    <span className="text-xs text-stone-300">USD</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
                  <button
                    onClick={handleBookTransferOnly}
                    className="px-5 py-3 rounded-xl bg-white text-[#0B3D2E] hover:bg-stone-100 font-semibold text-xs transition-colors shadow-xs"
                  >
                    Book Transfer Only
                  </button>

                  <button
                    onClick={handleContinueToTour}
                    className="px-6 py-3 rounded-xl bg-[#39A982] hover:bg-[#176B52] text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    <span>Continue to Tour</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* SECTION 2: TOURS DIRECT CATALOG */}
        <div id="tours-catalog" className="space-y-8 pt-4">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200 pb-5">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-[#176B52] uppercase tracking-wider">
                SIGNATURE ITINERARIES
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#17231F]">
                Hand-Crafted Sri Lanka Tours
              </h2>
              <p className="text-xs sm:text-sm text-[#68736E] max-w-xl">
                All multi-day journeys include private vehicle with dedicated English-fluent chauffeur-guide, luxury accommodation, and breakfast.
              </p>
            </div>

            {/* Quick Search */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={tourSearchQuery}
                onChange={(e) => setTourSearchQuery(e.target.value)}
                placeholder="Filter tours (e.g. Safari, Kandy)..."
                className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs font-medium text-[#17231F] focus:outline-none focus:ring-2 focus:ring-[#176B52]"
              />
            </div>
          </div>

          {/* Simple Customizer Bar (Days & Vehicle) */}
          <div className="bg-white/85 backdrop-blur-xl p-5 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#17231F]">
              <Sparkles className="w-4 h-4 text-[#176B52]" />
              <span>Simple Customization (Filter by Days):</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {[
                { label: 'All Days', val: 0 },
                { label: '5 Days', val: 5 },
                { label: '6 Days', val: 6 },
                { label: '7 Days', val: 7 },
                { label: '8 Days', val: 8 },
                { label: '10 Days', val: 10 },
                { label: '14 Days', val: 14 }
              ].map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => {
                    if (opt.val === 0) {
                      setTourSearchQuery('');
                    } else {
                      setTourSearchQuery(`${opt.val} Days`);
                    }
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                    (opt.val === 0 && !tourSearchQuery) || tourSearchQuery.includes(`${opt.val} Days`)
                      ? 'bg-[#0B3D2E] text-white font-semibold'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tours Grid with Visible Starting Prices */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>

        </div>

      </div>
    </div>
  );
};
