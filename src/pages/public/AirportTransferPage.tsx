import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plane, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  AlertCircle, 
  Plus, 
  Minus, 
  Loader2, 
  MapPin, 
  Compass, 
  Search,
  Car,
  Users,
  Briefcase,
  Sparkles,
  X,
  Star,
  CheckCircle2
} from 'lucide-react';
import { 
  SUPPORTED_AIRPORTS, 
  TRANSFER_VEHICLE_OPTIONS, 
  DESTINATION_DISTANCES,
  calculateRealRoadTransferPrice, 
  type TransferVehicleOption 
} from '../../data/destinationDistances';
import { 
  AIRPORT_COORDINATES, 
  type PlaceResult, 
  type RouteResult, 
  calculateGoogleRoute 
} from '../../services/googleMapsService';
import { GoogleMapDestinationSelector } from '../../components/transfers/GoogleMapDestinationSelector';
import { tourService } from '../../services/tourService';
import { destinationService } from '../../services/destinationService';
import { TOUR_VEHICLE_OPTIONS, type TourVehicleOption } from '../../data/tourVehiclePricing';
import type { Tour, ItineraryDay } from '../../types';

export const AirportTransferPage: React.FC = () => {
  const navigate = useNavigate();
  const tourDetailSectionRef = useRef<HTMLDivElement>(null);

  // 1. AIRPORT (Bandaranaike International CMB default)
  const [selectedAirportId, setSelectedAirportId] = useState<string>('airport-cmb');

  // 2. FLIGHT DETAILS
  const [flightNumber, setFlightNumber] = useState<string>('UL 225');
  const [arrivalDate, setArrivalDate] = useState<string>('2026-10-15');
  const [arrivalTime, setArrivalTime] = useState<string>('14:30');

  // 3. PASSENGERS
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);
  const [infants, setInfants] = useState<number>(0);

  // 4. GOOGLE MAP SELECTED DESTINATION (null on initial page load - NO default destination)
  const [selectedDestination, setSelectedDestination] = useState<PlaceResult | null>(null);

  // ROUTE DATA (null on initial page load - NO default route)
  const [routeData, setRouteData] = useState<RouteResult | null>(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState<boolean>(false);
  const [routeError, setRouteError] = useState<string | null>(null);

  // 5. VEHICLE SELECTION (Airport Transfer)
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('veh-sedan-luxury');
  const [tripType, setTripType] = useState<'One Way: Airport to Hotel' | 'Round Trip'>('One Way: Airport to Hotel');

  // 6. TOURS EXPLORATION SEARCH/FILTER
  const [tourSearchQuery, setTourSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // 7. SELECTED TOUR & CUSTOMIZATION STATE
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [customTourDays, setCustomTourDays] = useState<number>(0);
  const [selectedTourVehicleId, setSelectedTourVehicleId] = useState<'car' | 'van' | null>(null);
  const [tourStartDate, setTourStartDate] = useState<string>('2026-10-15');
  const [tourAdults, setTourAdults] = useState<number>(2);
  const [tourChildren, setTourChildren] = useState<number>(0);

  // Destination image lookup map
  const destinationImageMap = useMemo(() => {
    const map: Record<string, string> = {};
    
    // Seed from destination distances
    DESTINATION_DISTANCES.forEach(d => {
      if (d.shortName && d.heroImage) map[d.shortName.toLowerCase()] = d.heroImage;
      if (d.name && d.heroImage) map[d.name.toLowerCase()] = d.heroImage;
    });

    // Seed from destination service
    try {
      const allDests = destinationService.getAllDestinations();
      allDests.forEach(d => {
        if (d.name && d.heroImage) map[d.name.toLowerCase()] = d.heroImage;
      });
    } catch {
      // ignore
    }

    // Default landmark fallbacks
    map['sigiriya'] = map['sigiriya'] || 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=800&q=80';
    map['kandy'] = map['kandy'] || 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80';
    map['nuwara eliya'] = map['nuwara eliya'] || 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80';
    map['ella'] = map['ella'] || 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=800&q=80';
    map['yala'] = map['yala'] || 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80';
    map['galle'] = map['galle'] || 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80';
    map['colombo'] = map['colombo'] || 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80';
    map['bentota'] = map['bentota'] || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80';
    map['mirissa'] = map['mirissa'] || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80';
    map['dambulla'] = map['dambulla'] || 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80';
    map['habarana'] = map['habarana'] || 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=800&q=80';
    map['anuradhapura'] = map['anuradhapura'] || 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80';
    map['polonnaruwa'] = map['polonnaruwa'] || 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=800&q=80';

    return map;
  }, []);

  // Helper to resolve an image for any destination name
  const getDestinationImage = (destName: string): string => {
    const clean = destName.toLowerCase().split('/')[0].split('(')[0].trim();
    for (const [key, url] of Object.entries(destinationImageMap)) {
      if (clean.includes(key) || key.includes(clean)) return url;
    }
    return 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=800&q=80';
  };

  // Selected airport memo
  const selectedAirport = useMemo(() => {
    return SUPPORTED_AIRPORTS.find(a => a.id === selectedAirportId) || SUPPORTED_AIRPORTS[0];
  }, [selectedAirportId]);

  const totalPassengers = adults + children + infants;

  // Selected vehicle memo (Transfer)
  const selectedVehicle: TransferVehicleOption = useMemo(() => {
    return TRANSFER_VEHICLE_OPTIONS.find(v => v.id === selectedVehicleId) || TRANSFER_VEHICLE_OPTIONS[0];
  }, [selectedVehicleId]);

  // Check vehicle capacity compatibility
  const isVehicleCapacityValid = totalPassengers <= selectedVehicle.capacityPassengers;
  const isRoundTrip = tripType === 'Round Trip';

  // Calculate real driving road distance route via Google Service ONLY when destination is selected
  useEffect(() => {
    if (!selectedDestination) {
      setRouteData(null);
      setIsLoadingRoute(false);
      setRouteError(null);
      return;
    }

    let isCancelled = false;
    setIsLoadingRoute(true);
    setRouteError(null);

    calculateGoogleRoute(
      { lat: AIRPORT_COORDINATES.lat, lng: AIRPORT_COORDINATES.lng, name: selectedAirport.name },
      selectedDestination
    )
      .then((res) => {
        if (!isCancelled) {
          setRouteData(res);
          setIsLoadingRoute(false);
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          console.error('Failed to compute Google Route:', err);
          setRouteError('Unable to calculate a driving route for this destination. Please try another location.');
          setIsLoadingRoute(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [selectedDestination, selectedAirport]);

  // Real road distance price calculation (0 if no destination selected yet)
  const currentDistanceKm = routeData ? routeData.distanceKm : 0;
  const calculatedPrice = useMemo(() => {
    if (!selectedDestination || !routeData) return 0;
    return calculateRealRoadTransferPrice(currentDistanceKm, selectedVehicle, isRoundTrip);
  }, [selectedDestination, routeData, currentDistanceKm, selectedVehicle, isRoundTrip]);

  // All Tours from tourService
  const allTours = useMemo(() => {
    return tourService.getAllTours();
  }, []);

  const tourCategories = useMemo(() => {
    const cats = Array.from(new Set(allTours.map(t => t.category)));
    return ['All', ...cats];
  }, [allTours]);

  const filteredTours = useMemo(() => {
    return allTours.filter(tour => {
      const matchesCategory = selectedCategory === 'All' || tour.category === selectedCategory;
      const matchesSearch = !tourSearchQuery || 
        tour.title.toLowerCase().includes(tourSearchQuery.toLowerCase()) ||
        tour.destinations.some(d => d.toLowerCase().includes(tourSearchQuery.toLowerCase())) ||
        tour.category.toLowerCase().includes(tourSearchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [allTours, selectedCategory, tourSearchQuery]);

  // Dynamic Tour Vehicle Memo
  const selectedTourVehicle: TourVehicleOption | null = useMemo(() => {
    if (!selectedTourVehicleId) return null;
    return TOUR_VEHICLE_OPTIONS.find(v => v.id === selectedTourVehicleId) || null;
  }, [selectedTourVehicleId]);

  // Dynamic Tour Price Calculation (Daily Rate * Duration in Days)
  const totalTourPriceLKR = useMemo(() => {
    if (!selectedTourVehicle || customTourDays <= 0) return 0;
    return selectedTourVehicle.dailyPriceLKR * customTourDays;
  }, [selectedTourVehicle, customTourDays]);

  const totalTourPriceUSD = useMemo(() => {
    if (!selectedTourVehicle || customTourDays <= 0) return 0;
    return selectedTourVehicle.dailyPriceUSD * customTourDays;
  }, [selectedTourVehicle, customTourDays]);

  // Dynamic Itinerary Generation based on customTourDays
  const activeItineraryDays: ItineraryDay[] = useMemo(() => {
    if (!selectedTour) return [];
    const baseItinerary = selectedTour.itinerary || [];
    const count = customTourDays > 0 ? customTourDays : selectedTour.durationDays;

    if (count <= baseItinerary.length) {
      return baseItinerary.slice(0, count);
    }

    // If extended beyond base itinerary, generate additional immersive days from tour destinations
    const result = [...baseItinerary];
    const availableDests = selectedTour.destinations.length > 0 ? selectedTour.destinations : ['Kandy', 'Ella', 'Galle', 'Sigiriya'];

    for (let d = baseItinerary.length + 1; d <= count; d++) {
      const destIndex = (d - baseItinerary.length - 1) % availableDests.length;
      const targetDest = availableDests[destIndex];
      result.push({
        day: d,
        title: `Extended Exploration & Bespoke Leisure in ${targetDest}`,
        destination: targetDest,
        description: `Enjoy an extra relaxed chauffeured day in ${targetDest}. Explore local artisan craft markets, scenic viewpoints, hidden waterfalls, and boutique culinary gems at your own personalized pace with your private chauffeur.`,
        highlights: [`Scenic chauffeured excursion around ${targetDest}`, 'Bespoke leisure & photography', 'Authentic local dining experience'],
        mealsIncluded: ['Breakfast'],
        accommodation: 'Boutique Heritage Villa / Luxury Eco Resort'
      });
    }

    return result;
  }, [selectedTour, customTourDays]);

  // When customer clicks "View / Customize Tour" from tour cards
  const handleSelectTour = (tour: Tour) => {
    setSelectedTour(tour);
    setCustomTourDays(tour.durationDays);
    setSelectedTourVehicleId(null); // Do not automatically select vehicle
    setTimeout(() => {
      tourDetailSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Re-adjust transfer vehicle if passengers exceed standard car capacity
  const handlePassengerChange = (type: 'adults' | 'children' | 'infants', delta: number) => {
    let newAdults = adults;
    let newChildren = children;
    let newInfants = infants;

    if (type === 'adults') newAdults = Math.max(1, Math.min(8, adults + delta));
    if (type === 'children') newChildren = Math.max(0, Math.min(6, children + delta));
    if (type === 'infants') newInfants = Math.max(0, Math.min(3, infants + delta));

    setAdults(newAdults);
    setChildren(newChildren);
    setInfants(newInfants);

    const newTotal = newAdults + newChildren + newInfants;
    if (newTotal > 3 && (selectedVehicle.vehicleCode === 'standard-car' || selectedVehicle.vehicleCode === 'luxury-car')) {
      setSelectedVehicleId('veh-van-kdh');
    }
  };

  // Direct checkout execution for Airport Transfer
  const handleBookTransfer = () => {
    if (!selectedDestination) {
      alert('Please search and select your destination location on the map.');
      return;
    }

    if (!isVehicleCapacityValid) {
      alert(`Please select a vehicle suitable for ${totalPassengers} passengers.`);
      return;
    }

    navigate('/checkout', {
      state: {
        tourId: `transfer-${selectedAirport.code.toLowerCase()}-${encodeURIComponent(selectedDestination.name.toLowerCase().replace(/\s+/g, '-'))}`,
        tourTitle: `Private Airport Transfer: ${selectedAirport.code} Airport to ${selectedDestination.name}`,
        tourImage: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=800&q=80',
        durationDays: isRoundTrip ? 2 : 1,
        startDate: arrivalDate,
        flightNumber: flightNumber,
        arrivalTime: arrivalTime,
        adults: adults,
        children: children,
        airportPickup: true,
        totalAmount: calculatedPrice,
        destinations: [selectedDestination.name, selectedDestination.formattedAddress],
        vehicleType: selectedVehicle.name
      }
    });
  };

  // Direct checkout execution for Tour Booking (Dynamic Daily Rate * Days)
  const handleBookTour = () => {
    if (!selectedTour) {
      alert('Please select a tour.');
      return;
    }

    if (!selectedTourVehicle) {
      alert('Please select a vehicle (Car or Van) for your tour.');
      return;
    }

    const totalTourPax = tourAdults + tourChildren;
    if (totalTourPax > selectedTourVehicle.capacityPassengers) {
      alert(`The selected ${selectedTourVehicle.categoryTitle} supports up to ${selectedTourVehicle.capacityPassengers} passengers. Please choose a Van or adjust passenger count.`);
      return;
    }

    navigate('/checkout', {
      state: {
        tourId: selectedTour.id,
        tourTitle: `${selectedTour.title} (${customTourDays} Days with Private ${selectedTourVehicle.categoryTitle})`,
        tourImage: selectedTour.heroImage,
        durationDays: customTourDays,
        startDate: tourStartDate,
        adults: tourAdults,
        children: tourChildren,
        airportPickup: true,
        totalAmount: totalTourPriceUSD,
        destinations: selectedTour.destinations,
        vehicleType: `${selectedTourVehicle.categoryTitle} (Rs. ${selectedTourVehicle.dailyPriceLKR.toLocaleString()}/day)`
      }
    });
  };

  return (
    <div className="bg-[#F8F7F2] min-h-screen py-10 sm:py-16 space-y-16 sm:space-y-24">
      
      {/* ============================================================ */}
      {/* 1. AIRPORT TRANSFER & GOOGLE ROUTING SECTION */}
      {/* ============================================================ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Page Top Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white text-[#176B52] border border-stone-200 text-xs font-semibold uppercase tracking-wider shadow-2xs">
            <Plane className="w-3.5 h-3.5 text-[#39A982]" />
            <span>VIP SRI LANKA AIRPORT CHAUFFEUR & TOURS</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#17231F]">
            Your Journey Starts at the Airport
          </h1>
          <p className="text-sm sm:text-base text-[#68736E] leading-relaxed">
            Book a comfortable private transfer from the airport to your destination with transparent distance-based pricing, or explore our handcrafted multi-day chauffeured tours below.
          </p>
        </div>

        {/* 2-Column Responsive Layout: Left Booking Details (5 Cols) & Right Google Map + Vehicle + Price Summary (7 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* LEFT COLUMN: BOOKING DETAILS (Airport, Flight Details, Passengers) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* 1. ARRIVAL AIRPORT */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-[0_4px_20px_-4px_rgba(6,44,34,0.05)] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#176B52] uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#DDEFE8] text-[#176B52] flex items-center justify-center text-[11px] font-bold">1</span>
                  Arrival Airport
                </span>
                <span className="text-[11px] text-[#68736E]">Main International Hub</span>
              </div>

              <div className="space-y-2.5">
                {SUPPORTED_AIRPORTS.map((apt) => (
                  <div
                    key={apt.id}
                    onClick={() => setSelectedAirportId(apt.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      selectedAirportId === apt.id
                        ? 'bg-[#DDEFE8]/60 border-[#176B52] shadow-xs'
                        : 'bg-[#F8F7F2] border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#0B3D2E] text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {apt.code}
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-xs sm:text-sm text-[#17231F]">{apt.name}</h4>
                        <p className="text-[11px] text-[#68736E]">{apt.location}</p>
                      </div>
                    </div>

                    <input
                      type="radio"
                      name="airportSel"
                      checked={selectedAirportId === apt.id}
                      onChange={() => setSelectedAirportId(apt.id)}
                      className="text-[#176B52] focus:ring-[#176B52]"
                      aria-label={`Select ${apt.name}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 2. FLIGHT DETAILS */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-[0_4px_20px_-4px_rgba(6,44,34,0.05)] space-y-4">
              <span className="text-xs font-bold text-[#176B52] uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#DDEFE8] text-[#176B52] flex items-center justify-center text-[11px] font-bold">2</span>
                Flight Details
              </span>

              <div className="space-y-3.5 text-xs sm:text-sm">
                
                <div className="space-y-1">
                  <label htmlFor="flight-number-input" className="font-semibold text-[#17231F] flex items-center gap-1.5">
                    <Plane className="w-3.5 h-3.5 text-[#176B52]" aria-hidden="true" />
                    Flight Number
                  </label>
                  <input
                    id="flight-number-input"
                    type="text"
                    value={flightNumber}
                    onChange={(e) => setFlightNumber(e.target.value)}
                    placeholder="e.g. UL 225"
                    className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl p-3 font-medium text-[#17231F] focus:outline-none focus:ring-2 focus:ring-[#176B52] uppercase"
                    aria-label="Flight number input"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label htmlFor="arrival-date-input" className="font-semibold text-[#17231F] flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#176B52]" aria-hidden="true" />
                      Arrival Date
                    </label>
                    <input
                      id="arrival-date-input"
                      type="date"
                      required
                      value={arrivalDate}
                      onChange={(e) => setArrivalDate(e.target.value)}
                      className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl p-2.5 font-medium text-[#17231F] focus:outline-none focus:ring-2 focus:ring-[#176B52]"
                      aria-label="Arrival date picker"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="arrival-time-input" className="font-semibold text-[#17231F] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#176B52]" aria-hidden="true" />
                      Arrival Time (Local)
                    </label>
                    <input
                      id="arrival-time-input"
                      type="time"
                      required
                      value={arrivalTime}
                      onChange={(e) => setArrivalTime(e.target.value)}
                      className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl p-2.5 font-medium text-[#17231F] focus:outline-none focus:ring-2 focus:ring-[#176B52]"
                      aria-label="Arrival time picker"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-xs font-semibold text-[#17231F] block mb-1.5">Trip Direction:</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setTripType('One Way: Airport to Hotel')}
                      className={`p-2.5 text-xs rounded-xl font-medium transition-colors text-center ${
                        tripType === 'One Way: Airport to Hotel' ? 'bg-[#0B3D2E] text-white font-semibold' : 'bg-[#F8F7F2] text-stone-600 border border-stone-200'
                      }`}
                    >
                      One Way (Airport &rarr; Hotel)
                    </button>
                    <button
                      type="button"
                      onClick={() => setTripType('Round Trip')}
                      className={`p-2.5 text-xs rounded-xl font-medium transition-colors text-center ${
                        tripType === 'Round Trip' ? 'bg-[#0B3D2E] text-white font-semibold' : 'bg-[#F8F7F2] text-stone-600 border border-stone-200'
                      }`}
                    >
                      Round Trip (15% Off)
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* 3. PASSENGERS QUANTITY PICKER */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-[0_4px_20px_-4px_rgba(6,44,34,0.05)] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#176B52] uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#DDEFE8] text-[#176B52] flex items-center justify-center text-[11px] font-bold">3</span>
                  Passenger Count
                </span>
                <span className="text-xs font-bold text-[#0B3D2E] bg-[#DDEFE8] px-3 py-1 rounded-full">
                  Total: {totalPassengers} Pax
                </span>
              </div>

              <div className="space-y-3">
                
                {/* Adults */}
                <div className="p-3 bg-[#F8F7F2] rounded-2xl border border-stone-200 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-xs text-[#17231F] block">Adults</span>
                    <span className="text-[10px] text-[#68736E]">Age 12+</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => handlePassengerChange('adults', -1)}
                      className="w-7 h-7 rounded-full bg-white border border-stone-300 flex items-center justify-center text-stone-600 hover:bg-stone-100"
                      aria-label="Decrease adult count"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-bold text-sm w-4 text-center">{adults}</span>
                    <button
                      type="button"
                      onClick={() => handlePassengerChange('adults', 1)}
                      className="w-7 h-7 rounded-full bg-white border border-stone-300 flex items-center justify-center text-stone-600 hover:bg-stone-100"
                      aria-label="Increase adult count"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Children */}
                <div className="p-3 bg-[#F8F7F2] rounded-2xl border border-stone-200 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-xs text-[#17231F] block">Children</span>
                    <span className="text-[10px] text-[#68736E]">Age 2–11</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => handlePassengerChange('children', -1)}
                      className="w-7 h-7 rounded-full bg-white border border-stone-300 flex items-center justify-center text-stone-600 hover:bg-stone-100"
                      aria-label="Decrease child count"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-bold text-sm w-4 text-center">{children}</span>
                    <button
                      type="button"
                      onClick={() => handlePassengerChange('children', 1)}
                      className="w-7 h-7 rounded-full bg-white border border-stone-300 flex items-center justify-center text-stone-600 hover:bg-stone-100"
                      aria-label="Increase child count"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Infants */}
                <div className="p-3 bg-[#F8F7F2] rounded-2xl border border-stone-200 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-xs text-[#17231F] block">Infants</span>
                    <span className="text-[10px] text-[#68736E]">Under 2 yrs</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => handlePassengerChange('infants', -1)}
                      className="w-7 h-7 rounded-full bg-white border border-stone-300 flex items-center justify-center text-stone-600 hover:bg-stone-100"
                      aria-label="Decrease infant count"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-bold text-sm w-4 text-center">{infants}</span>
                    <button
                      type="button"
                      onClick={() => handlePassengerChange('infants', 1)}
                      className="w-7 h-7 rounded-full bg-white border border-stone-300 flex items-center justify-center text-stone-600 hover:bg-stone-100"
                      aria-label="Increase infant count"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: GOOGLE MAP + VEHICLE SELECTION + PRICE SUMMARY (7 Cols) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* 4. GOOGLE MAP INTERACTIVE DESTINATION SEARCH */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#176B52] uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#DDEFE8] text-[#176B52] flex items-center justify-center text-[11px] font-bold">4</span>
                  Interactive Google Map Destination Search
                </span>
                <span className="text-[11px] text-[#68736E]">Real Road Distance Routing</span>
              </div>

              {/* Google Map Selector Component */}
              <GoogleMapDestinationSelector
                selectedDestination={selectedDestination}
                routeData={routeData}
                isLoadingRoute={isLoadingRoute}
                onSelectPlace={(place) => setSelectedDestination(place)}
              />

              {routeError && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2 text-xs text-rose-700">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{routeError}</span>
                </div>
              )}
            </div>

            {/* 5. VEHICLE SELECTION (Airport Transfer) */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-[0_4px_20px_-4px_rgba(6,44,34,0.05)] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#176B52] uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#DDEFE8] text-[#176B52] flex items-center justify-center text-[11px] font-bold">5</span>
                  Select Vehicle Type
                </span>
                <span className="text-[11px] text-[#68736E]">Private Air-Conditioned Fleet</span>
              </div>

              <div className="space-y-3">
                {TRANSFER_VEHICLE_OPTIONS.map((veh) => {
                  const isCapacityOk = totalPassengers <= veh.capacityPassengers;
                  const isSelected = selectedVehicleId === veh.id;
                  const itemPrice = calculateRealRoadTransferPrice(currentDistanceKm, veh, isRoundTrip);

                  return (
                    <div
                      key={veh.id}
                      onClick={() => {
                        if (isCapacityOk) setSelectedVehicleId(veh.id);
                      }}
                      className={`p-4 rounded-2xl border transition-all ${
                        !isCapacityOk
                          ? 'opacity-60 bg-stone-100/60 border-stone-200 cursor-not-allowed'
                          : isSelected
                            ? 'bg-[#DDEFE8]/70 border-[#176B52] shadow-sm cursor-pointer'
                            : 'bg-[#F8F7F2] border-stone-200 hover:border-stone-300 cursor-pointer'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        
                        <div className="flex items-start gap-3.5">
                          <img
                            src={veh.image}
                            alt={veh.name}
                            className="w-18 h-14 rounded-xl object-cover shrink-0 border border-stone-200"
                          />
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-serif font-bold text-sm text-[#17231F]">{veh.categoryTitle}</h4>
                              <span className="text-[10px] font-bold bg-white text-[#176B52] px-2 py-0.5 rounded-full border border-stone-200">
                                {veh.badge}
                              </span>
                            </div>
                            <p className="text-xs text-[#68736E]">{veh.name}</p>
                            <p className="text-[11px] text-stone-500">{veh.description}</p>
                          </div>
                        </div>

                        {/* Price & Selection Button */}
                        <div className="text-right sm:self-center shrink-0">
                          {selectedDestination && routeData ? (
                            <>
                              <div className="flex items-baseline justify-end gap-1">
                                <span className="font-serif text-xl font-bold text-[#0B3D2E]">${itemPrice}</span>
                                <span className="text-xs text-[#68736E]">USD</span>
                              </div>
                              <span className="text-[10px] text-[#68736E] block">
                                (${veh.ratePerKmUSD}/km &bull; {currentDistanceKm} km Google Route)
                              </span>
                            </>
                          ) : (
                            <span className="text-[11px] text-[#176B52] font-semibold block">
                              From ${veh.baseBookingFeeUSD} + ${veh.ratePerKmUSD}/km
                            </span>
                          )}

                          {!isCapacityOk ? (
                            <span className="text-[10px] font-bold text-rose-600 block mt-1">
                              Max {veh.capacityPassengers} Pax
                            </span>
                          ) : (
                            <button
                              type="button"
                              className={`mt-1.5 px-3.5 py-1 rounded-xl text-xs font-semibold transition-colors ${
                                isSelected 
                                  ? 'bg-[#0B3D2E] text-white' 
                                  : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-50'
                              }`}
                            >
                              {isSelected ? 'Selected' : 'Select'}
                            </button>
                          )}
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>

              {!isVehicleCapacityValid && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2 text-xs text-rose-700">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Please select a vehicle suitable for {totalPassengers} passengers (e.g. Van).</span>
                </div>
              )}
            </div>

            {/* 6. FINAL TRANSFER SUMMARY & BOOK TRANSFER BUTTON */}
            <div className="bg-[#0B3D2E] text-white rounded-3xl p-6 sm:p-7 shadow-xl space-y-5 border border-white/10">
              
              <div className="flex items-center justify-between border-b border-white/15 pb-4">
                <div>
                  <span className="text-[10px] text-[#39A982] uppercase font-bold tracking-wider block">TRANSFER SUMMARY</span>
                  {isLoadingRoute ? (
                    <div className="flex items-center gap-2 mt-1">
                      <Loader2 className="w-5 h-5 text-[#39A982] animate-spin" />
                      <span className="text-xs text-stone-300">Calculating transfer price...</span>
                    </div>
                  ) : selectedDestination && routeData ? (
                    <span className="font-serif text-3xl font-bold">${calculatedPrice} <span className="text-xs font-sans font-normal text-stone-300">USD</span></span>
                  ) : (
                    <span className="text-sm font-semibold text-stone-200 mt-1 block">Select a destination above</span>
                  )}
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-[#DDEFE8] border border-white/20">
                  {tripType === 'Round Trip' ? 'Round Trip' : 'One Way'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs text-stone-200">
                <div className="flex justify-between">
                  <span>Airport:</span>
                  <span className="font-semibold text-white">{selectedAirport.name} ({selectedAirport.code})</span>
                </div>
                <div className="flex justify-between">
                  <span>Flight:</span>
                  <span className="font-semibold text-white">{flightNumber || 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Arrival:</span>
                  <span className="font-semibold text-white">{arrivalDate} at {arrivalTime}</span>
                </div>
                <div className="flex justify-between">
                  <span>Destination:</span>
                  <span className="font-semibold text-white truncate max-w-[160px]">
                    {selectedDestination ? selectedDestination.name : 'Not selected yet'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Distance:</span>
                  <span className="font-semibold text-[#39A982]">
                    {isLoadingRoute 
                      ? 'Calculating...' 
                      : selectedDestination && routeData 
                        ? `${currentDistanceKm} km (Real Google Road)` 
                        : '—'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Drive:</span>
                  <span className="font-semibold text-white">
                    {isLoadingRoute 
                      ? 'Calculating...' 
                      : selectedDestination && routeData 
                        ? (routeData.durationText || '—') 
                        : '—'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Passengers:</span>
                  <span className="font-semibold text-white">{totalPassengers} Total ({adults} Ad, {children} Ch, {infants} Inf)</span>
                </div>
                <div className="flex justify-between">
                  <span>Vehicle:</span>
                  <span className="font-semibold text-white">{selectedVehicle.categoryTitle}</span>
                </div>
              </div>

              {/* Main Action: Book Transfer */}
              <button
                type="button"
                onClick={handleBookTransfer}
                disabled={!selectedDestination || !isVehicleCapacityValid || isLoadingRoute}
                className={`w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md ${
                  !selectedDestination || !isVehicleCapacityValid || isLoadingRoute
                    ? 'bg-stone-600 text-stone-300 cursor-not-allowed opacity-80'
                    : 'bg-[#39A982] hover:bg-[#176B52] text-white hover:shadow-lg transform hover:-translate-y-0.5'
                }`}
              >
                {!selectedDestination ? (
                  <>
                    <MapPin className="w-4 h-4" />
                    <span>Please Select a Destination</span>
                  </>
                ) : (
                  <>
                    <span>Book Transfer &bull; ${calculatedPrice} USD</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-4 text-[11px] text-stone-300 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#39A982]" />
                  Includes Meet & Greet
                </span>
                <span>&bull;</span>
                <span>Free Flight Delay Waiting</span>
                <span>&bull;</span>
                <span>All Tolls Included</span>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ============================================================ */}
      {/* 2. EXPLORE OUR TOURS SECTION */}
      {/* ============================================================ */}
      <section className="bg-white border-t border-stone-200/80 py-20 sm:py-28" ref={tourDetailSectionRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-100 pb-8">
            <div className="space-y-2.5 max-w-2xl">
              <span className="text-xs font-bold text-[#176B52] uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-[#39A982]" />
                MULTI-DAY BESPOKE EXPERIENCES
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#17231F]">
                Explore Our Tours
              </h2>
              <p className="text-sm sm:text-base text-[#68736E] leading-relaxed">
                Handcrafted multi-day itineraries across Sri Lanka featuring dedicated national chauffeur guides, boutique colonial stays, and private wildlife safaris. Click “View / Customize Tour” to explore day-by-day itineraries and vehicle pricing.
              </p>
            </div>

            {/* Tour Search & Category Filter */}
            <div className="space-y-3 w-full md:w-auto">
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={tourSearchQuery}
                  onChange={(e) => setTourSearchQuery(e.target.value)}
                  placeholder="Search tours, regions, attractions..."
                  className="w-full md:w-72 pl-10 pr-4 py-2.5 bg-[#F8F7F2] border border-stone-300 rounded-xl text-xs font-medium text-[#17231F] focus:outline-none focus:ring-2 focus:ring-[#176B52]"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {tourCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      selectedCategory === cat
                        ? 'bg-[#0B3D2E] text-white shadow-xs'
                        : 'bg-stone-100 text-[#68736E] hover:bg-stone-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* 3. FULL TOUR DETAILS & DAY-BY-DAY ITINERARY WITH PHOTOS */}
          {/* ONLY SHOWN AFTER CUSTOMER CLICKS "VIEW / CUSTOMIZE TOUR" */}
          {/* ============================================================ */}
          {selectedTour && (
            <div className="bg-[#F8F7F2] border-2 border-[#176B52] rounded-3xl p-6 sm:p-10 shadow-2xl space-y-10 animate-fadeIn relative">
              
              {/* Close Button */}
              <button
                onClick={() => {
                  setSelectedTour(null);
                  setSelectedTourVehicleId(null);
                }}
                className="absolute top-6 right-6 p-2.5 rounded-full bg-white text-stone-600 hover:text-[#17231F] shadow-sm border border-stone-200 transition-colors"
                aria-label="Close tour details"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Tour Header Banner */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-stone-200 pb-8 pr-12">
                <div className="flex items-start gap-5">
                  <img
                    src={selectedTour.heroImage}
                    alt={selectedTour.title}
                    className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover shrink-0 border border-stone-300 shadow-md"
                  />
                  <div className="space-y-1.5">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#176B52] text-white text-[11px] font-bold uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5 text-[#DDEFE8]" />
                      Customizable Private Itinerary
                    </div>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#17231F]">
                      {selectedTour.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#68736E] max-w-2xl">{selectedTour.subtitle}</p>
                    
                    <div className="flex items-center gap-4 pt-2 text-xs text-[#0B3D2E] font-medium flex-wrap">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-[#176B52]" />
                        {selectedTour.durationDays} Days Default Itinerary
                      </span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-[#39A982] fill-[#39A982]" />
                        {selectedTour.rating} ({selectedTour.reviewCount} Reviews)
                      </span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-[#176B52]" />
                        {selectedTour.destinations.join(' &bull; ')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tour Duration Customizer */}
                <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm space-y-2 shrink-0">
                  <span className="text-[10px] uppercase font-bold text-[#68736E] block tracking-wider">
                    Customize Number of Days
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setCustomTourDays(Math.max(1, customTourDays - 1))}
                      className="w-10 h-10 rounded-xl bg-[#F8F7F2] border border-stone-300 flex items-center justify-center text-stone-700 hover:bg-stone-200 font-bold transition-colors"
                      aria-label="Decrease tour days"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <div className="text-center w-16">
                      <span className="font-serif text-2xl font-bold text-[#0B3D2E] block leading-none">
                        {customTourDays}
                      </span>
                      <span className="text-[10px] font-semibold text-[#68736E] uppercase">Days</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCustomTourDays(Math.min(30, customTourDays + 1))}
                      className="w-10 h-10 rounded-xl bg-[#F8F7F2] border border-stone-300 flex items-center justify-center text-stone-700 hover:bg-stone-200 font-bold transition-colors"
                      aria-label="Increase tour days"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Day-by-Day Itinerary with Destination Photos */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#17231F] flex items-center gap-2">
                      <Compass className="w-5 h-5 text-[#176B52]" />
                      Day-by-Day Itinerary ({customTourDays} Days Displayed)
                    </h4>
                    <p className="text-xs text-[#68736E] mt-0.5">
                      Each day is fully chauffeured with your private dedicated English-speaking national chauffeur-guide.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeItineraryDays.map((dayItem) => {
                    const destImg = getDestinationImage(dayItem.destination || selectedTour.destinations[0] || 'Sri Lanka');

                    return (
                      <div 
                        key={dayItem.day}
                        className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                      >
                        {/* Day Photo & Header Badge */}
                        <div className="relative h-44 overflow-hidden">
                          <img
                            src={destImg}
                            alt={dayItem.destination}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          <div className="absolute top-3 left-3 bg-[#0B3D2E] text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                            DAY {dayItem.day}
                          </div>
                          <div className="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl text-white flex items-center gap-1.5 text-xs font-semibold">
                            <MapPin className="w-3.5 h-3.5 text-[#39A982] shrink-0" />
                            <span className="truncate">{dayItem.destination}</span>
                          </div>
                        </div>

                        {/* Day Details */}
                        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                          <div className="space-y-1.5">
                            <h5 className="font-serif text-base font-bold text-[#17231F] leading-snug">
                              {dayItem.title}
                            </h5>
                            <p className="text-xs text-[#68736E] leading-relaxed line-clamp-3">
                              {dayItem.description}
                            </p>
                          </div>

                          {/* Day Highlights / Inclusions */}
                          {dayItem.highlights && dayItem.highlights.length > 0 && (
                            <div className="pt-2 border-t border-stone-100 space-y-1">
                              <span className="text-[10px] uppercase font-bold text-[#176B52] block tracking-wider">
                                Included Highlights
                              </span>
                              <div className="space-y-1">
                                {dayItem.highlights.slice(0, 2).map((hl, hIdx) => (
                                  <div key={hIdx} className="flex items-start gap-1.5 text-[11px] text-stone-600">
                                    <CheckCircle2 className="w-3 h-3 text-[#39A982] shrink-0 mt-0.5" />
                                    <span className="line-clamp-1">{hl}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ============================================================ */}
              {/* 4. VEHICLE SELECTION (ONLY SHOWN INSIDE OPENED TOUR) */}
              {/* 🚗 CAR OR 🚐 VAN ONLY */}
              {/* ============================================================ */}
              <div className="space-y-4 pt-4 border-t border-stone-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif text-xl font-bold text-[#17231F] flex items-center gap-2">
                      <Car className="w-5 h-5 text-[#176B52]" />
                      Select Tour Vehicle (Car or Van)
                    </h4>
                    <p className="text-xs text-[#68736E]">
                      Select exactly one vehicle type to see daily rate and instant total tour price.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#176B52] bg-white px-3 py-1 rounded-full border border-stone-200">
                    2 Fleet Options
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {TOUR_VEHICLE_OPTIONS.map((veh) => {
                    const isSelected = selectedTourVehicleId === veh.id;
                    const calculatedDailyTotalLKR = veh.dailyPriceLKR * customTourDays;
                    const calculatedDailyTotalUSD = veh.dailyPriceUSD * customTourDays;

                    return (
                      <div
                        key={veh.id}
                        onClick={() => setSelectedTourVehicleId(veh.id)}
                        className={`p-5 sm:p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-white border-[#0B3D2E] shadow-xl ring-2 ring-[#0B3D2E]/20'
                            : 'bg-white/80 border-stone-200 hover:border-stone-400 hover:bg-white'
                        }`}
                      >
                        <div className="space-y-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3.5">
                              <img
                                src={veh.image}
                                alt={veh.name}
                                className="w-20 h-14 rounded-xl object-cover border border-stone-200 shrink-0"
                              />
                              <div>
                                <div className="flex items-center gap-2">
                                  <h5 className="font-serif text-lg font-bold text-[#17231F]">
                                    {veh.id === 'car' ? '🚗' : '🚐'} {veh.categoryTitle}
                                  </h5>
                                  <span className="text-[10px] font-bold bg-[#DDEFE8] text-[#176B52] px-2.5 py-0.5 rounded-full">
                                    {veh.badge}
                                  </span>
                                </div>
                                <p className="text-xs text-[#68736E]">{veh.name}</p>
                              </div>
                            </div>

                            <input
                              type="radio"
                              name="tourVehicleChoice"
                              checked={isSelected}
                              onChange={() => setSelectedTourVehicleId(veh.id)}
                              className="text-[#0B3D2E] focus:ring-[#0B3D2E] w-5 h-5 mt-1"
                            />
                          </div>

                          <p className="text-xs text-stone-600 leading-relaxed">{veh.description}</p>

                          <div className="p-3.5 bg-[#F8F7F2] rounded-xl border border-stone-200 flex items-center justify-between">
                            <div>
                              <span className="text-[10px] uppercase font-bold text-[#68736E] block">Daily Rate</span>
                              <span className="text-base font-bold text-[#0B3D2E]">
                                Rs. {veh.dailyPriceLKR.toLocaleString()} / day
                              </span>
                              <span className="text-[11px] text-[#68736E] block">
                                (${veh.dailyPriceUSD} USD / day)
                              </span>
                            </div>

                            <div className="text-right">
                              <span className="text-[10px] uppercase font-bold text-[#176B52] block">
                                Total ({customTourDays} Days)
                              </span>
                              <span className="font-serif text-xl font-bold text-[#0B3D2E]">
                                Rs. {calculatedDailyTotalLKR.toLocaleString()}
                              </span>
                              <span className="text-xs font-semibold text-[#68736E] block">
                                (${calculatedDailyTotalUSD} USD)
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-4 text-xs text-[#68736E]">
                          <span className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-[#176B52]" />
                            Max {veh.capacityPassengers} Passengers
                          </span>
                          <span>&bull;</span>
                          <span className="flex items-center gap-1.5">
                            <Briefcase className="w-3.5 h-3.5 text-[#176B52]" />
                            {veh.capacityLuggage} Large Suitcases
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tour Date & Passenger Configuration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="text-[10px] font-bold text-[#176B52] uppercase tracking-wider block mb-1">
                    Tour Start Date
                  </label>
                  <input
                    type="date"
                    value={tourStartDate}
                    onChange={(e) => setTourStartDate(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl p-3 text-xs font-medium text-[#17231F] focus:ring-2 focus:ring-[#176B52]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#176B52] uppercase tracking-wider block mb-1">
                    Adults (Age 12+)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={tourAdults}
                    onChange={(e) => setTourAdults(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-white border border-stone-300 rounded-xl p-3 text-xs font-medium text-[#17231F] focus:ring-2 focus:ring-[#176B52]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#176B52] uppercase tracking-wider block mb-1">
                    Children (Age 2-11)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="6"
                    value={tourChildren}
                    onChange={(e) => setTourChildren(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full bg-white border border-stone-300 rounded-xl p-3 text-xs font-medium text-[#17231F] focus:ring-2 focus:ring-[#176B52]"
                  />
                </div>
              </div>

              {/* ============================================================ */}
              {/* 5. TOUR BOOKING SUMMARY & CHECKOUT BUTTON */}
              {/* ============================================================ */}
              <div className="bg-[#0B3D2E] text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-5 border border-white/10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/15 pb-5">
                  <div>
                    <span className="text-[10px] text-[#39A982] uppercase font-bold tracking-wider block">
                      TOUR BOOKING SUMMARY
                    </span>
                    <h4 className="font-serif text-2xl font-bold">{selectedTour.title}</h4>
                  </div>
                  <div className="text-right">
                    {selectedTourVehicle ? (
                      <>
                        <span className="text-[10px] text-[#39A982] uppercase font-bold tracking-wider block">
                          TOTAL TOUR PRICE ({customTourDays} DAYS)
                        </span>
                        <div className="flex items-baseline justify-end gap-2">
                          <span className="font-serif text-3xl sm:text-4xl font-bold">
                            Rs. {totalTourPriceLKR.toLocaleString()}
                          </span>
                          <span className="text-xs text-[#DDEFE8]">
                            (${totalTourPriceUSD} USD)
                          </span>
                        </div>
                      </>
                    ) : (
                      <span className="text-sm font-semibold text-stone-300">
                        Please select 🚗 Car or 🚐 Van above to calculate price
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-stone-200">
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-semibold">Selected Tour</span>
                    <span className="font-bold text-white truncate block">{selectedTour.title}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-semibold">Duration</span>
                    <span className="font-bold text-white">{customTourDays} Days</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-semibold">Selected Vehicle</span>
                    <span className="font-bold text-white">
                      {selectedTourVehicle ? selectedTourVehicle.categoryTitle : 'Not selected yet'}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-semibold">Vehicle Price / Day</span>
                    <span className="font-bold text-[#39A982]">
                      {selectedTourVehicle ? `Rs. ${selectedTourVehicle.dailyPriceLKR.toLocaleString()} / day` : '—'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleBookTour}
                  disabled={!selectedTourVehicle}
                  className={`w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md ${
                    !selectedTourVehicle
                      ? 'bg-stone-600 text-stone-300 cursor-not-allowed opacity-80'
                      : 'bg-[#39A982] hover:bg-[#176B52] text-white hover:shadow-lg transform hover:-translate-y-0.5'
                  }`}
                >
                  {!selectedTourVehicle ? (
                    <span>Please Select a Vehicle (Car or Van) to Continue</span>
                  ) : (
                    <>
                      <span>Book {selectedTour.title} &bull; Rs. {totalTourPriceLKR.toLocaleString()} ({customTourDays} Days with {selectedTourVehicle.categoryTitle})</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </div>
          )}

          {/* ============================================================ */}
          {/* TOUR CARDS GRID: ONLY BASIC INFO SHOWN (NO VEHICLE PRICES) */}
          {/* ============================================================ */}
          {filteredTours.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTours.map((tour) => {
                const isCurrentSelected = selectedTour?.id === tour.id;

                return (
                  <div 
                    key={tour.id} 
                    className={`group bg-white rounded-3xl border overflow-hidden transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-1 ${
                      isCurrentSelected 
                        ? 'border-[#0B3D2E] shadow-2xl ring-2 ring-[#0B3D2E]' 
                        : 'border-stone-200/70 shadow-[0_4px_20px_-4px_rgba(6,44,34,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(6,44,34,0.12)]'
                    }`}
                  >
                    {/* Image */}
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={tour.heroImage}
                        alt={tour.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute top-3.5 left-3.5 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                        <Clock className="w-3.5 h-3.5 text-[#39A982]" />
                        <span>{tour.durationDays} Days / {tour.durationNights} Nights</span>
                      </div>
                      <div className="absolute top-3.5 right-3.5 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[#0B3D2E] text-xs font-bold shadow-xs">
                        {tour.category}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 sm:p-7 flex flex-col justify-between flex-1 space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-[#176B52] uppercase tracking-wider text-[10px]">
                            {tour.destinations.length} Destinations Included
                          </span>
                          <div className="flex items-center gap-1 font-semibold text-[#17231F]">
                            <Star className="w-3.5 h-3.5 fill-[#39A982] text-[#39A982]" />
                            <span>{tour.rating.toFixed(1)}</span>
                            <span className="text-[#68736E] font-normal">({tour.reviewCount})</span>
                          </div>
                        </div>

                        <h3 className="font-serif text-xl font-bold text-[#17231F] group-hover:text-[#176B52] transition-colors leading-snug">
                          {tour.title}
                        </h3>
                        <p className="text-xs text-[#176B52] font-semibold">{tour.subtitle}</p>
                        <p className="text-xs text-[#68736E] line-clamp-2 leading-relaxed">{tour.overview}</p>
                      </div>

                      {/* Main Destinations List */}
                      <div className="space-y-1.5 pt-2 border-t border-stone-100">
                        <span className="text-[10px] font-bold text-[#68736E] uppercase tracking-wider block">
                          Destinations Covered
                        </span>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {tour.destinations.slice(0, 4).map((dest, i) => (
                            <span key={i} className="text-[11px] bg-[#F8F7F2] text-[#0B3D2E] px-2.5 py-0.5 rounded-md font-medium border border-stone-200">
                              {dest}
                            </span>
                          ))}
                          {tour.destinations.length > 4 && (
                            <span className="text-[10px] text-stone-500 font-semibold">
                              +{tour.destinations.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Card Action Button: View / Customize Tour (NO vehicle prices shown on card) */}
                      <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
                        <div>
                          <span className="text-[10px] text-[#68736E] block font-medium uppercase tracking-wider">
                            Private Chauffeur Tour
                          </span>
                          <span className="text-xs font-bold text-[#0B3D2E]">
                            {tour.durationDays} Days Itinerary
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleSelectTour(tour)}
                          className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-xl transition-all shadow-xs ${
                            isCurrentSelected
                              ? 'bg-[#176B52] text-white'
                              : 'bg-[#0B3D2E] hover:bg-[#176B52] text-white hover:shadow-md'
                          }`}
                        >
                          {isCurrentSelected ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#DDEFE8]" />
                              <span>Customizing</span>
                            </>
                          ) : (
                            <>
                              <span>View / Customize Tour</span>
                              <ArrowRight className="w-3.5 h-3.5 text-[#DDEFE8]" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center bg-[#F8F7F2] rounded-3xl border border-stone-200 space-y-3">
              <Compass className="w-8 h-8 text-stone-400 mx-auto" />
              <h3 className="font-serif text-lg font-bold text-[#17231F]">No tours found</h3>
              <p className="text-xs text-[#68736E]">Try changing your search term or category filter.</p>
              <button
                onClick={() => {
                  setTourSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="px-4 py-2 rounded-xl bg-[#0B3D2E] text-white text-xs font-semibold hover:bg-[#176B52]"
              >
                Reset Filters
              </button>
            </div>
          )}

        </div>
      </section>

    </div>
  );
};
