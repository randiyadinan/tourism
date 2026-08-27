import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  MapPin, 
  Car, 
  ArrowRight,
  Plane,
  Compass,
  Users
} from 'lucide-react';
import { tourService } from '../../services/tourService';
import { destinationTicketService } from '../../services/destinationTicketService';
import { vehiclePricingService } from '../../services/vehiclePricingService';
import { bookingService } from '../../services/bookingService';
import { authService } from '../../services/authService';
import { formatPrice } from '../../utils/formatters';

export const AdminDashboardPage: React.FC = () => {
  const [toursCount, setToursCount] = useState(0);
  const [destCount, setDestCount] = useState(0);
  const [carDailyRate, setCarDailyRate] = useState(15000);
  const [vanDailyRate, setVanDailyRate] = useState(20000);

  const [bookingsCount, setBookingsCount] = useState(0);
  const [pendingBookingsCount, setPendingBookingsCount] = useState(0);
  const [customersCount, setCustomersCount] = useState(0);

  useEffect(() => {
    const tours = tourService.getAllTours();
    const dests = destinationTicketService.getAllDestinations();
    const vehCar = vehiclePricingService.getVehicleById('car');
    const vehVan = vehiclePricingService.getVehicleById('van');
    const allB = bookingService.getAllBookings();
    const allCust = authService.getUsers().filter(u => u.role === 'customer');

    setToursCount(tours.length);
    setDestCount(dests.length);
    setBookingsCount(allB.length);
    setPendingBookingsCount(allB.filter(b => b.bookingStatus === 'Pending').length);
    setCustomersCount(allCust.length);
    if (vehCar) setCarDailyRate(vehCar.dailyPriceLKR);
    if (vehVan) setVanDailyRate(vehVan.dailyPriceLKR);

    bookingService.fetchBookingsFromServer().then((latest) => {
      setBookingsCount(latest.length);
      setPendingBookingsCount(latest.filter(b => b.bookingStatus === 'Pending').length);
    });
  }, []);

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#062C22]">Website Management Console</h1>
        <p className="text-xs text-stone-500 mt-1">
          Directly manage all customer bookings, customer profiles, tour itineraries, attraction tickets, and vehicle daily rates.
        </p>
      </div>

      {/* Core Management Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* 1. Customer Bookings */}
        <div className="liquid-glass-card glass-card-interactive p-6 rounded-3xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#0B3D2E] text-white flex items-center justify-center font-bold shadow-md">
              <Compass className="w-6 h-6 text-[#39A982]" />
            </div>
            <h3 className="font-serif font-bold text-xl text-[#062C22]">Customer Bookings</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              {bookingsCount} total bookings {pendingBookingsCount > 0 ? `(${pendingBookingsCount} awaiting confirmation)` : ''}.
            </p>
          </div>
          <Link
            to="/admin/bookings"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#176B52] hover:text-[#0B3D2E] pt-2"
          >
            <span>Manage Customer Bookings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 2. Customer Profiles */}
        <div className="liquid-glass-card glass-card-interactive p-6 rounded-3xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#176B52] text-white flex items-center justify-center font-bold shadow-md">
              <Users className="w-6 h-6 text-[#DDEFE8]" />
            </div>
            <h3 className="font-serif font-bold text-xl text-[#062C22]">Customer Profiles</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              {customersCount} registered traveler profiles, contact files, passport data, and spend history.
            </p>
          </div>
          <Link
            to="/admin/customers"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#176B52] hover:text-[#0B3D2E] pt-2"
          >
            <span>View Customer Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 3. Tours */}
        <div className="liquid-glass-card glass-card-interactive p-6 rounded-3xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#062C22] text-white flex items-center justify-center font-bold shadow-md">
              <BookOpen className="w-6 h-6 text-[#39A982]" />
            </div>
            <h3 className="font-serif font-bold text-xl text-[#062C22]">Tour Catalog</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              {toursCount} active tours with fixed day-by-day itineraries and destination photos.
            </p>
          </div>
          <Link
            to="/admin/tours"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#176B52] hover:text-[#0B3D2E] pt-2"
          >
            <span>Manage Tours</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4. Vehicle Daily Pricing */}
        <div className="liquid-glass-card glass-card-interactive p-6 rounded-3xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#176B52] text-white flex items-center justify-center font-bold shadow-md">
              <Car className="w-6 h-6 text-[#DDEFE8]" />
            </div>
            <h3 className="font-serif font-bold text-xl text-[#062C22]">Vehicle Daily Rates</h3>
            <div className="text-xs text-stone-600 space-y-0.5">
              <div>Car: <strong>{formatPrice(carDailyRate)} / day</strong></div>
              <div>Van: <strong>{formatPrice(vanDailyRate)} / day</strong></div>
            </div>
          </div>
          <Link
            to="/admin/vehicles"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#176B52] hover:text-[#0B3D2E] pt-2"
          >
            <span>Edit Daily Rates</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 5. Destinations & Tickets */}
        <div className="liquid-glass-card glass-card-interactive p-6 rounded-3xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#39A982] text-white flex items-center justify-center font-bold shadow-md">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-serif font-bold text-xl text-[#062C22]">Destination Tickets</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              {destCount} destinations with Adult and Child ticket rates for Home page calculator.
            </p>
          </div>
          <Link
            to="/admin/destinations"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#176B52] hover:text-[#0B3D2E] pt-2"
          >
            <span>Manage Destinations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 6. Airport Transfer Rates */}
        <div className="liquid-glass-card glass-card-interactive p-6 rounded-3xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#062C22] text-white flex items-center justify-center font-bold shadow-md">
              <Plane className="w-6 h-6 text-[#39A982]" />
            </div>
            <h3 className="font-serif font-bold text-xl text-[#062C22]">Airport Transfers</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              CMB airport distance rate per km and base meet fees for Car and Van.
            </p>
          </div>
          <Link
            to="/admin/airport-transfers"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#176B52] hover:text-[#0B3D2E] pt-2"
          >
            <span>Edit Transfer Rates</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

    </div>
  );
};
