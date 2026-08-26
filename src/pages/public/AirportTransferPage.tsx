import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plane, 
  MapPin, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  Navigation,
  AlertCircle,
  Plus,
  Minus,
  Check
} from 'lucide-react';
import { 
  SUPPORTED_AIRPORTS, 
  DESTINATION_DISTANCES, 
  TRANSFER_VEHICLE_OPTIONS,
  calculateRealRoadTransferPrice,
  type TransferVehicleOption,
  type DestinationDistance
} from '../../data/destinationDistances';

export const AirportTransferPage: React.FC = () => {
  const navigate = useNavigate();

  // STEP 1: AIRPORT
  const [selectedAirportId, setSelectedAirportId] = useState<string>('airport-cmb');

  // STEP 2: FLIGHT DETAILS
  const [flightNumber, setFlightNumber] = useState<string>('UL 504');
  const [arrivalDate, setArrivalDate] = useState<string>('2026-10-15');
  const [arrivalTime, setArrivalTime] = useState<string>('14:30');

  // STEP 3: PASSENGERS
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);
  const [infants, setInfants] = useState<number>(0);

  // STEP 4: DESTINATION
  const [selectedDestId, setSelectedDestId] = useState<string>('dest-sigiriya');

  // STEP 5: VEHICLE SELECTION
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('veh-sedan-luxury');
  const [tripType, setTripType] = useState<'One Way: Airport to Hotel' | 'Round Trip'>('One Way: Airport to Hotel');

  // Selected entities memo
  const selectedAirport = useMemo(() => {
    return SUPPORTED_AIRPORTS.find(a => a.id === selectedAirportId) || SUPPORTED_AIRPORTS[0];
  }, [selectedAirportId]);

  const selectedDestination: DestinationDistance = useMemo(() => {
    return DESTINATION_DISTANCES.find(d => d.id === selectedDestId) || DESTINATION_DISTANCES[0];
  }, [selectedDestId]);

  const totalPassengers = adults + children + infants;

  // Selected vehicle memo
  const selectedVehicle: TransferVehicleOption = useMemo(() => {
    return TRANSFER_VEHICLE_OPTIONS.find(v => v.id === selectedVehicleId) || TRANSFER_VEHICLE_OPTIONS[0];
  }, [selectedVehicleId]);

  // Check vehicle capacity compatibility
  const isVehicleCapacityValid = totalPassengers <= selectedVehicle.capacityPassengers;
  const isRoundTrip = tripType === 'Round Trip';

  // Real road distance price calculation (Road Distance × Vehicle Rate + Base Fee)
  const calculatedPrice = useMemo(() => {
    return calculateRealRoadTransferPrice(selectedDestination.distanceKm, selectedVehicle, isRoundTrip);
  }, [selectedDestination, selectedVehicle, isRoundTrip]);

  // Re-adjust vehicle if passengers exceed standard car capacity
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
      // Auto-recommend Van
      setSelectedVehicleId('veh-van-kdh');
    }
  };

  const handleProceedToCheckout = () => {
    if (!isVehicleCapacityValid) {
      alert(`The selected vehicle cannot accommodate ${totalPassengers} passengers. Please select a Van.`);
      return;
    }

    // Direct integration with standard checkout & booking service
    navigate('/checkout', {
      state: {
        tourId: `transfer-${selectedAirport.code.toLowerCase()}-${selectedDestination.shortName.toLowerCase()}`,
        tourTitle: `Private Airport Transfer: ${selectedAirport.code} Airport to ${selectedDestination.shortName}`,
        tourImage: selectedDestination.heroImage,
        durationDays: isRoundTrip ? 2 : 1,
        startDate: arrivalDate,
        adults: adults,
        children: children,
        airportPickup: true,
        totalAmount: calculatedPrice,
        destinations: [selectedDestination.name],
        vehicleType: selectedVehicle.name
      }
    });
  };

  return (
    <div className="bg-[#F8F7F2] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Page Top Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white text-[#176B52] border border-stone-200 text-xs font-semibold uppercase tracking-wider shadow-2xs">
            <Plane className="w-3.5 h-3.5 text-[#39A982]" />
            <span>VIP SRI LANKA AIRPORT CHAUFFEUR</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#17231F]">
            Your Journey Starts at the Airport
          </h1>
          <p className="text-sm sm:text-base text-[#68736E] leading-relaxed">
            Book a comfortable private transfer from the airport to your Sri Lankan destination with transparent distance-based pricing.
          </p>
        </div>

        {/* 2-Column Responsive Layout: Left Form (7 Cols) & Right Route + Price Summary (5 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* LEFT COLUMN: 5 STEP BOOKING FORM */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* STEP 1: ARRIVAL AIRPORT */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-[0_4px_20px_-4px_rgba(6,44,34,0.05)] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#176B52] uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#DDEFE8] text-[#176B52] flex items-center justify-center text-[11px] font-bold">1</span>
                  Arrival Airport
                </span>
                <span className="text-[11px] text-[#68736E]">Main International Hub</span>
              </div>

              <div className="space-y-3">
                {SUPPORTED_AIRPORTS.map((apt) => (
                  <div
                    key={apt.id}
                    onClick={() => setSelectedAirportId(apt.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      selectedAirportId === apt.id
                        ? 'bg-[#DDEFE8]/60 border-[#176B52] shadow-xs'
                        : 'bg-[#F8F7F2] border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-[#0B3D2E] text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {apt.code}
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-sm text-[#17231F]">{apt.name}</h4>
                        <p className="text-xs text-[#68736E]">{apt.location}</p>
                      </div>
                    </div>

                    <input
                      type="radio"
                      name="airportSel"
                      checked={selectedAirportId === apt.id}
                      onChange={() => setSelectedAirportId(apt.id)}
                      className="text-[#176B52] focus:ring-[#176B52]"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* STEP 2: FLIGHT DETAILS */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-[0_4px_20px_-4px_rgba(6,44,34,0.05)] space-y-4">
              <span className="text-xs font-bold text-[#176B52] uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#DDEFE8] text-[#176B52] flex items-center justify-center text-[11px] font-bold">2</span>
                Flight Details
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
                
                <div className="space-y-1.5">
                  <label className="font-semibold text-[#17231F] flex items-center gap-1.5">
                    <Plane className="w-3.5 h-3.5 text-[#176B52]" />
                    Flight Number
                  </label>
                  <input
                    type="text"
                    required
                    value={flightNumber}
                    onChange={(e) => setFlightNumber(e.target.value)}
                    placeholder="e.g. UL 504"
                    className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl p-3 font-medium text-[#17231F] focus:outline-none focus:ring-2 focus:ring-[#176B52] uppercase"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[#17231F] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#176B52]" />
                    Arrival Date
                  </label>
                  <input
                    type="date"
                    required
                    value={arrivalDate}
                    onChange={(e) => setArrivalDate(e.target.value)}
                    className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl p-2.5 font-medium text-[#17231F] focus:outline-none focus:ring-2 focus:ring-[#176B52]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[#17231F] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#176B52]" />
                    Arrival Time (Local)
                  </label>
                  <input
                    type="time"
                    required
                    value={arrivalTime}
                    onChange={(e) => setArrivalTime(e.target.value)}
                    className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl p-2.5 font-medium text-[#17231F] focus:outline-none focus:ring-2 focus:ring-[#176B52]"
                  />
                </div>

              </div>

              <div className="pt-2 flex items-center gap-2">
                <span className="text-xs font-semibold text-[#17231F]">Trip Direction:</span>
                <div className="inline-flex rounded-xl bg-[#F8F7F2] p-1 border border-stone-200">
                  <button
                    type="button"
                    onClick={() => setTripType('One Way: Airport to Hotel')}
                    className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                      tripType === 'One Way: Airport to Hotel' ? 'bg-[#0B3D2E] text-white font-semibold' : 'text-stone-600'
                    }`}
                  >
                    One Way (Airport &rarr; Hotel)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTripType('Round Trip')}
                    className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                      tripType === 'Round Trip' ? 'bg-[#0B3D2E] text-white font-semibold' : 'text-stone-600'
                    }`}
                  >
                    Round Trip (15% Off)
                  </button>
                </div>
              </div>
            </div>

            {/* STEP 3: PASSENGERS QUANTITY PICKER */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-[0_4px_20px_-4px_rgba(6,44,34,0.05)] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#176B52] uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#DDEFE8] text-[#176B52] flex items-center justify-center text-[11px] font-bold">3</span>
                  Passenger Count
                </span>
                <span className="text-xs font-bold text-[#0B3D2E] bg-[#DDEFE8] px-3 py-1 rounded-full">
                  Total: {totalPassengers} Passenger{totalPassengers > 1 ? 's' : ''}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Adults */}
                <div className="p-4 bg-[#F8F7F2] rounded-2xl border border-stone-200 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-xs text-[#17231F] block">Adults</span>
                    <span className="text-[11px] text-[#68736E]">Age 12+</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => handlePassengerChange('adults', -1)}
                      className="w-7 h-7 rounded-full bg-white border border-stone-300 flex items-center justify-center text-stone-600 hover:bg-stone-100"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-bold text-sm w-4 text-center">{adults}</span>
                    <button
                      type="button"
                      onClick={() => handlePassengerChange('adults', 1)}
                      className="w-7 h-7 rounded-full bg-white border border-stone-300 flex items-center justify-center text-stone-600 hover:bg-stone-100"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Children */}
                <div className="p-4 bg-[#F8F7F2] rounded-2xl border border-stone-200 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-xs text-[#17231F] block">Children</span>
                    <span className="text-[11px] text-[#68736E]">Age 2–11</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => handlePassengerChange('children', -1)}
                      className="w-7 h-7 rounded-full bg-white border border-stone-300 flex items-center justify-center text-stone-600 hover:bg-stone-100"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-bold text-sm w-4 text-center">{children}</span>
                    <button
                      type="button"
                      onClick={() => handlePassengerChange('children', 1)}
                      className="w-7 h-7 rounded-full bg-white border border-stone-300 flex items-center justify-center text-stone-600 hover:bg-stone-100"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Infants */}
                <div className="p-4 bg-[#F8F7F2] rounded-2xl border border-stone-200 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-xs text-[#17231F] block">Infants</span>
                    <span className="text-[11px] text-[#68736E]">Under 2 yrs</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => handlePassengerChange('infants', -1)}
                      className="w-7 h-7 rounded-full bg-white border border-stone-300 flex items-center justify-center text-stone-600 hover:bg-stone-100"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-bold text-sm w-4 text-center">{infants}</span>
                    <button
                      type="button"
                      onClick={() => handlePassengerChange('infants', 1)}
                      className="w-7 h-7 rounded-full bg-white border border-stone-300 flex items-center justify-center text-stone-600 hover:bg-stone-100"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* STEP 4: DESTINATION SELECTOR */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-[0_4px_20px_-4px_rgba(6,44,34,0.05)] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#176B52] uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#DDEFE8] text-[#176B52] flex items-center justify-center text-[11px] font-bold">4</span>
                  Where are you going?
                </span>
                <span className="text-[11px] text-[#68736E]">{DESTINATION_DISTANCES.length} Destinations</span>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#17231F]">Select Sri Lankan Destination</label>
                <select
                  value={selectedDestId}
                  onChange={(e) => setSelectedDestId(e.target.value)}
                  className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl p-3.5 text-xs sm:text-sm font-semibold text-[#17231F] focus:outline-none focus:ring-2 focus:ring-[#176B52]"
                >
                  {DESTINATION_DISTANCES.map((dest) => (
                    <option key={dest.id} value={dest.id}>
                      {dest.name} — ({dest.distanceKm} km &bull; Approx. {dest.estimatedHours})
                    </option>
                  ))}
                </select>
              </div>

              {/* Destination preview badge */}
              <div className="p-4 bg-[#F8F7F2] rounded-2xl border border-stone-200 flex items-center gap-3">
                <img
                  src={selectedDestination.heroImage}
                  alt={selectedDestination.shortName}
                  className="w-14 h-14 rounded-xl object-cover"
                />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-[#17231F] block">{selectedDestination.name}</span>
                  <p className="text-[11px] text-[#68736E]">{selectedDestination.popularFor}</p>
                </div>
              </div>
            </div>

            {/* STEP 5: VEHICLE SELECTION */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-[0_4px_20px_-4px_rgba(6,44,34,0.05)] space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#176B52] uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#DDEFE8] text-[#176B52] flex items-center justify-center text-[11px] font-bold">5</span>
                  Select Vehicle Type
                </span>
                <span className="text-[11px] text-[#68736E]">Private Air-Conditioned Fleet</span>
              </div>

              <div className="space-y-3.5">
                {TRANSFER_VEHICLE_OPTIONS.map((veh) => {
                  const isCapacityOk = totalPassengers <= veh.capacityPassengers;
                  const isSelected = selectedVehicleId === veh.id;
                  const itemPrice = calculateRealRoadTransferPrice(selectedDestination.distanceKm, veh, isRoundTrip);

                  return (
                    <div
                      key={veh.id}
                      onClick={() => {
                        if (isCapacityOk) setSelectedVehicleId(veh.id);
                      }}
                      className={`p-5 rounded-2xl border transition-all ${
                        !isCapacityOk
                          ? 'opacity-60 bg-stone-100/60 border-stone-200 cursor-not-allowed'
                          : isSelected
                            ? 'bg-[#DDEFE8]/70 border-[#176B52] shadow-sm cursor-pointer'
                            : 'bg-[#F8F7F2] border-stone-200 hover:border-stone-300 cursor-pointer'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        
                        <div className="flex items-start gap-4">
                          <img
                            src={veh.image}
                            alt={veh.name}
                            className="w-20 h-16 rounded-xl object-cover shrink-0 border border-stone-200"
                          />
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-serif font-bold text-base text-[#17231F]">{veh.categoryTitle}</h4>
                              <span className="text-[10px] font-bold bg-white text-[#176B52] px-2.5 py-0.5 rounded-full border border-stone-200">
                                {veh.badge}
                              </span>
                            </div>
                            <p className="text-xs text-[#68736E]">{veh.name}</p>
                            <p className="text-[11px] text-stone-500">{veh.description}</p>
                          </div>
                        </div>

                        {/* Price & Selection Button */}
                        <div className="text-right sm:self-center shrink-0">
                          <div className="flex items-baseline justify-end gap-1">
                            <span className="font-serif text-2xl font-bold text-[#0B3D2E]">${itemPrice}</span>
                            <span className="text-xs text-[#68736E]">USD</span>
                          </div>
                          <span className="text-[10px] text-[#68736E] block">
                            (${veh.ratePerKmUSD}/km &bull; {selectedDestination.distanceKm} km)
                          </span>

                          {!isCapacityOk ? (
                            <span className="text-[10px] font-bold text-rose-600 block mt-1">
                              Exceeds {veh.capacityPassengers} Pax limit
                            </span>
                          ) : (
                            <button
                              type="button"
                              className={`mt-2 px-4 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
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
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs text-rose-700">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>This vehicle is not suitable for {totalPassengers} passengers. Please select a Van above.</span>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN: ROUTE VISUALIZATION CARD & PRICE SUMMARY (5 COLS) */}
          <div className="lg:col-span-5 space-y-6 sticky top-24">
            
            {/* 1. ROUTE VISUALIZATION CARD */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-white/80 shadow-[0_10px_35px_-10px_rgba(6,44,34,0.08)] space-y-5">
              
              <div className="flex items-center justify-between border-b border-stone-100 pb-3.5">
                <span className="text-xs font-bold text-[#176B52] uppercase tracking-wider flex items-center gap-1.5">
                  <Navigation className="w-4 h-4 text-[#39A982]" />
                  Real Road Route
                </span>
                <span className="text-xs font-semibold text-[#0B3D2E] bg-[#DDEFE8] px-2.5 py-0.5 rounded-full">
                  Verified Expressway Route
                </span>
              </div>

              {/* Graphical Route Segment */}
              <div className="bg-[#F8F7F2] p-5 rounded-2xl border border-stone-200 space-y-4">
                
                {/* Airport Node */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#0B3D2E] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Plane className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#68736E] uppercase font-bold tracking-wider block">Pickup</span>
                    <h4 className="font-serif font-bold text-sm text-[#17231F]">{selectedAirport.name} ({selectedAirport.code})</h4>
                    <p className="text-[11px] text-[#68736E]">{selectedAirport.location}</p>
                  </div>
                </div>

                {/* Road Line with Distance indicator */}
                <div className="flex items-center gap-3 pl-4">
                  <div className="w-0.5 h-10 bg-[#176B52]/40" />
                  <div className="bg-white px-3 py-1 rounded-full border border-stone-200 text-[11px] font-semibold text-[#176B52] shadow-2xs">
                    {selectedDestination.distanceKm} km Road Distance &bull; {selectedDestination.estimatedHours}
                  </div>
                </div>

                {/* Destination Node */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#176B52] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#68736E] uppercase font-bold tracking-wider block">Drop-Off Destination</span>
                    <h4 className="font-serif font-bold text-sm text-[#17231F]">{selectedDestination.name}</h4>
                    <p className="text-[11px] text-[#68736E]">{selectedDestination.region}</p>
                  </div>
                </div>

              </div>

              {/* Inclusions summary */}
              <div className="space-y-2 text-xs text-[#68736E]">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#176B52]" />
                  <span>Licensed SLTDA English-speaking chauffeur</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#176B52]" />
                  <span>All expressway tolls & airport parking covered</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#176B52]" />
                  <span>Complimentary bottled water & flight delay monitoring</span>
                </div>
              </div>

            </div>

            {/* 2. PRICE SUMMARY CARD */}
            <div className="bg-[#0B3D2E] text-white rounded-3xl p-6 sm:p-7 shadow-xl space-y-5 border border-white/10">
              
              <div className="flex items-center justify-between border-b border-white/15 pb-4">
                <div>
                  <span className="text-[10px] text-[#39A982] uppercase font-bold tracking-wider block">Total Transfer Rate</span>
                  <span className="font-serif text-3xl font-bold">${calculatedPrice} <span className="text-xs font-sans font-normal text-stone-300">USD</span></span>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-[#DDEFE8] border border-white/20">
                  {tripType === 'Round Trip' ? 'Round Trip' : 'One Way'}
                </span>
              </div>

              <div className="space-y-2 text-xs text-stone-200">
                <div className="flex justify-between">
                  <span>Airport:</span>
                  <span className="font-semibold text-white">{selectedAirport.code} Colombo</span>
                </div>
                <div className="flex justify-between">
                  <span>Destination:</span>
                  <span className="font-semibold text-white">{selectedDestination.shortName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Passengers:</span>
                  <span className="font-semibold text-white">{totalPassengers} ({adults} Ad, {children} Ch, {infants} Inf)</span>
                </div>
                <div className="flex justify-between">
                  <span>Vehicle:</span>
                  <span className="font-semibold text-white">{selectedVehicle.categoryTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span>Road Distance:</span>
                  <span className="font-semibold text-[#39A982]">{selectedDestination.distanceKm} km</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Drive:</span>
                  <span className="font-semibold text-white">{selectedDestination.estimatedHours}</span>
                </div>
              </div>

              {/* Continue Button */}
              <button
                onClick={handleProceedToCheckout}
                disabled={!isVehicleCapacityValid}
                className={`w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md ${
                  !isVehicleCapacityValid
                    ? 'bg-stone-500 text-stone-300 cursor-not-allowed'
                    : 'bg-[#39A982] hover:bg-[#176B52] text-white hover:shadow-lg transform hover:-translate-y-0.5'
                }`}
              >
                <span>Continue to Secure Checkout</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-stone-300 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#39A982]" />
                <span>100% Free cancellation up to 24h before flight</span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
