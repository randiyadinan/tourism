import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  Plane, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Briefcase, 
  ShieldCheck, 
  CreditCard, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';
import { airportTransferService, TRANSFER_RATES } from '../../services/airportTransferService';
import { INITIAL_VEHICLES } from '../../data/vehicles';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../../components/common/Modal';

export const AirportTransferPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [airport, setAirport] = useState<'Bandaranaike International Airport (CMB - Colombo)' | 'Mattala Rajapaksa International (HRI - Hambantota)' | 'Jaffna International Airport (JAF)'>('Bandaranaike International Airport (CMB - Colombo)');
  const [tripType, setTripType] = useState<'One Way: Airport to Hotel' | 'One Way: Hotel to Airport' | 'Round Trip'>('One Way: Airport to Hotel');
  const [destinationArea, setDestinationArea] = useState('Colombo City (Hotels / Galle Face / Port City)');
  const [hotelAddress, setHotelAddress] = useState('The Galle Face Hotel, Colombo');
  const [flightDate, setFlightDate] = useState('2026-10-15');
  const [flightTime, setFlightTime] = useState('14:30');
  const [flightNumber, setFlightNumber] = useState('UL 504');
  const [passengers, setPassengers] = useState(2);
  const [luggageCount, setLuggageCount] = useState(2);
  const [selectedVehicleId, setSelectedVehicleId] = useState('veh-sedan-luxury');

  const [contactName, setContactName] = useState(user?.name || 'Sarah Jenkins');
  const [contactEmail, setContactEmail] = useState(user?.email || 'sarah.traveler@example.com');
  const [contactPhone, setContactPhone] = useState(user?.phone || '+44 7700 900077');
  const [specialRequests, setSpecialRequests] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedVehicle = INITIAL_VEHICLES.find(v => v.id === selectedVehicleId) || INITIAL_VEHICLES[0];
  const isRoundTrip = tripType === 'Round Trip';
  const estimatedQuote = airportTransferService.calculateQuote(destinationArea, selectedVehicle.dailyRateUSD, isRoundTrip);

  const handleConfirmTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      airportTransferService.bookTransfer({
        airport,
        tripType,
        destinationArea,
        hotelAddress,
        flightDate,
        flightTime,
        flightNumber,
        passengers,
        luggageCount,
        vehicleId: selectedVehicle.id,
        vehicleName: selectedVehicle.name,
        basePriceUSD: estimatedQuote,
        totalPriceUSD: estimatedQuote,
        contactName,
        contactEmail,
        contactPhone,
        specialRequests,
        paymentStatus: 'Fully Paid'
      });

      setIsSubmitting(false);
      setIsModalOpen(false);

      try {
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      } catch (err) {}

      navigate('/customer/bookings');
    }, 1000);
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0D3B2E]/10 text-[#0D3B2E] text-xs font-bold uppercase tracking-wider">
            <Plane className="w-3.5 h-3.5 text-[#C5A059]" />
            VIP Airport Chauffeur Service
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#082F24]">
            Sri Lanka Airport Transfers & Private Chauffeur
          </h1>
          <p className="text-sm sm:text-base text-stone-600">
            Guaranteed flight monitoring, name sign meet & greet at Colombo (CMB) / Mattala (HRI), air-conditioned luxury fleet, and fixed transparent rates.
          </p>
        </div>

        {/* 2-Column Booking Engine Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form Controls (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
            
            {/* Trip Type Selector */}
            <div className="grid grid-cols-3 gap-2">
              {(['One Way: Airport to Hotel', 'One Way: Hotel to Airport', 'Round Trip'] as const).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTripType(t)}
                  className={`p-3 rounded-xl border text-xs font-bold text-center transition-all ${
                    tripType === t
                      ? 'bg-[#0D3B2E] text-white border-[#0D3B2E] shadow-sm'
                      : 'bg-[#FAF8F5] text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Airport & Drop-off Area */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#082F24] flex items-center gap-1">
                  <Plane className="w-3.5 h-3.5 text-[#C5A059]" />
                  Airport
                </label>
                <select
                  value={airport}
                  onChange={(e) => setAirport(e.target.value as any)}
                  className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2.5 text-xs font-semibold text-[#082F24]"
                >
                  <option value="Bandaranaike International Airport (CMB - Colombo)">CMB - Colombo International</option>
                  <option value="Mattala Rajapaksa International (HRI - Hambantota)">HRI - Mattala Hambantota</option>
                  <option value="Jaffna International Airport (JAF)">JAF - Jaffna International</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#082F24] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                  Destination Region
                </label>
                <select
                  value={destinationArea}
                  onChange={(e) => setDestinationArea(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2.5 text-xs font-semibold text-[#082F24]"
                >
                  {Object.keys(TRANSFER_RATES).map(dest => (
                    <option key={dest} value={dest}>{dest}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Hotel Address */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#082F24]">Hotel / Villa Name & Full Address</label>
              <input
                type="text"
                value={hotelAddress}
                onChange={(e) => setHotelAddress(e.target.value)}
                placeholder="e.g. Cinnamon Grand Colombo / Aliya Resort Sigiriya"
                className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-[#082F24]"
              />
            </div>

            {/* Flight Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#082F24] flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                  Flight Date
                </label>
                <input
                  type="date"
                  value={flightDate}
                  onChange={(e) => setFlightDate(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2.5 text-xs text-[#082F24]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#082F24] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
                  Flight Arrival Time
                </label>
                <input
                  type="time"
                  value={flightTime}
                  onChange={(e) => setFlightTime(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2.5 text-xs text-[#082F24]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#082F24]">Flight Number</label>
                <input
                  type="text"
                  value={flightNumber}
                  onChange={(e) => setFlightNumber(e.target.value)}
                  placeholder="e.g. UL 504 / QR 668"
                  className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2.5 text-xs text-[#082F24]"
                />
              </div>
            </div>

            {/* Passengers & Luggage */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#082F24] flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-[#C5A059]" />
                  Passengers
                </label>
                <select
                  value={passengers}
                  onChange={(e) => setPassengers(Number(e.target.value))}
                  className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2.5 text-xs text-[#082F24]"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 12, 16].map(n => (
                    <option key={n} value={n}>{n} Passenger{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#082F24] flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-[#C5A059]" />
                  Luggage Bags
                </label>
                <select
                  value={luggageCount}
                  onChange={(e) => setLuggageCount(Number(e.target.value))}
                  className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2.5 text-xs text-[#082F24]"
                >
                  {[1, 2, 3, 4, 5, 6, 8, 10].map(n => (
                    <option key={n} value={n}>{n} Large Suitcase{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Vehicle Selection */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold text-[#082F24] uppercase tracking-wider block">
                Select Vehicle Class
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {INITIAL_VEHICLES.map((veh) => {
                  const isSelected = selectedVehicleId === veh.id;
                  return (
                    <div
                      key={veh.id}
                      onClick={() => setSelectedVehicleId(veh.id)}
                      className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                        isSelected
                          ? 'border-[#0D3B2E] bg-[#0D3B2E]/5 ring-2 ring-[#C5A059]'
                          : 'border-stone-200 bg-white hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <img src={veh.image} alt={veh.name} className="w-12 h-12 rounded-xl object-cover" />
                        <div>
                          <h5 className="font-bold text-xs text-[#082F24] line-clamp-1">{veh.name}</h5>
                          <p className="text-[11px] text-stone-500">Max {veh.capacityPassengers} pax • {veh.capacityLuggage} bags</p>
                        </div>
                      </div>
                      <span className={`text-[11px] font-bold ${isSelected ? 'text-[#0D3B2E]' : 'text-stone-400'}`}>
                        {isSelected ? '✓ Selected' : 'Select'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Quote Summary Card (5 cols) */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xl space-y-6">
              
              <div className="border-b border-stone-100 pb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C5A059]" />
                  <span className="text-xs font-bold text-[#8C6D2B] uppercase">Instant Guaranteed Quote</span>
                </div>
                <h4 className="font-serif text-2xl font-bold text-[#082F24] mt-1">
                  ${estimatedQuote} USD
                </h4>
                <p className="text-xs text-stone-500">
                  {tripType} • {selectedVehicle.name}
                </p>
              </div>

              <div className="space-y-2 text-xs text-stone-600">
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span>Pickup Location:</span>
                  <strong className="text-[#082F24]">CMB Airport Terminal</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span>Drop-off Destination:</span>
                  <strong className="text-[#082F24] text-right truncate max-w-[200px]">{destinationArea}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span>Flight Date & Time:</span>
                  <strong className="text-[#082F24]">{flightDate} at {flightTime}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span>Passengers & Luggage:</span>
                  <strong className="text-[#082F24]">{passengers} Pax, {luggageCount} Bags</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span>Highway Expressway Tolls:</span>
                  <strong className="text-emerald-700">100% Included</strong>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="w-full py-4 bg-gradient-to-r from-[#C5A059] to-[#A37F37] text-[#082F24] font-bold text-sm rounded-2xl shadow-xl hover:from-[#E5C378] hover:to-[#C5A059] transition-all flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>Reserve VIP Transfer • ${estimatedQuote}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="space-y-2 pt-2 border-t border-stone-100 text-[11px] text-stone-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#0D3B2E] shrink-0" />
                  <span>Free cancellation up to 24 hours prior to flight arrival.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0D3B2E] shrink-0" />
                  <span>Chauffeur waits 90 minutes past actual flight touch-down.</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Transfer Checkout Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Confirm Airport Chauffeur Transfer"
        maxWidth="md"
      >
        <form onSubmit={handleConfirmTransfer} className="space-y-4">
          <div className="bg-[#FAF8F5] p-4 rounded-xl border border-stone-200 space-y-1 text-xs">
            <h4 className="font-bold text-[#082F24]">{selectedVehicle.name}</h4>
            <p className="text-stone-600">{destinationArea} • ${estimatedQuote} USD Total</p>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs text-stone-600">Lead Passenger Name (Signboard name)</label>
              <input
                type="text"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2 text-sm text-[#082F24]"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-stone-600">Email Address</label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2 text-sm text-[#082F24]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-stone-600">WhatsApp / Phone</label>
                <input
                  type="tel"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2 text-sm text-[#082F24]"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-stone-600">Special Notes (e.g. child seat, sim card request)</label>
              <textarea
                rows={2}
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2 text-xs text-[#082F24]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-[#0D3B2E] text-white font-bold text-sm rounded-xl shadow-lg hover:bg-[#134E3F] transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>Confirming Transfer Reservation...</span>
            ) : (
              <>
                <CreditCard className="w-4 h-4 text-[#E5C378]" />
                <span>Confirm & Issue Transfer Voucher • ${estimatedQuote}</span>
              </>
            )}
          </button>
        </form>
      </Modal>
    </div>
  );
};
