import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
   
   
   
   
  Sparkles, 
  ArrowRight, 
  
  
  Car } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { bookingService } from '../../services/bookingService';

export const CustomerDashboardPage: React.FC = () => {
  const { user } = useAuth();

  const userBookings = user ? bookingService.getUserBookings(user.id) : [];
  const pendingBookings = userBookings.filter(b => b.bookingStatus === 'Pending');
  const confirmedBookings = userBookings.filter(b => b.bookingStatus === 'Confirmed');
  const activeTrip = userBookings.find(b => b.bookingStatus === 'Confirmed' || b.bookingStatus === 'Pending') || userBookings[0];

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#082F24] via-[#0D3B2E] to-[#134E3F] text-white p-8 sm:p-10 rounded-3xl shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A059]/20 text-[#E5C378] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Welcome, {user?.name || 'Traveler'}
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold">
            Traveler Dashboard
          </h1>
          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
            Track your custom itineraries, review real-time booking confirmation status, and access digital travel vouchers.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 z-10">
          <Link
            to="/customize"
            className="w-full sm:w-auto text-center px-6 py-3 bg-[#C5A059] hover:bg-[#E5C378] text-[#082F24] text-xs font-bold rounded-xl shadow-lg transition-all"
          >
            Plan New Custom Trip
          </Link>
          <Link
            to="/customer/bookings"
            className="w-full sm:w-auto text-center px-6 py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/20 transition-all"
          >
            My Bookings ({userBookings.length})
          </Link>
        </div>

        {/* Ambient Pattern */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      {/* KPI Highlights: Bookings status */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
          <span className="text-xs text-stone-400 font-semibold block uppercase">Total Bookings</span>
          <span className="font-serif text-2xl font-bold text-[#082F24]">{userBookings.length}</span>
          <p className="text-[11px] text-stone-500">All registered trips</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm space-y-1 bg-emerald-50/40">
          <span className="text-xs text-emerald-800 font-semibold block uppercase">Confirmed</span>
          <span className="font-serif text-2xl font-bold text-emerald-700">
            {confirmedBookings.length}
          </span>
          <p className="text-[11px] text-stone-500">Ready & Confirmed</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm space-y-1 bg-amber-50/40 col-span-2 sm:col-span-1">
          <span className="text-xs text-amber-800 font-semibold block uppercase">Pending Review</span>
          <span className="font-serif text-2xl font-bold text-amber-700">
            {pendingBookings.length}
          </span>
          <p className="text-[11px] text-stone-500">Awaiting confirmation</p>
        </div>
      </div>

      {/* Empty State when Customer has No Bookings */}
      {userBookings.length === 0 && (
        <div className="bg-white p-10 sm:p-12 rounded-3xl border border-stone-200 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-[#FAF8F5] border border-stone-200 text-[#C5A059] flex items-center justify-center mx-auto">
            <Calendar className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-xl font-bold text-[#082F24]">No bookings yet</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Explore our curated tours or customize your own private Sri Lankan journey.
            </p>
          </div>
          <Link
            to="/tours"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0D3B2E] text-white hover:bg-[#134E3F] text-xs font-bold rounded-xl shadow-md transition-all"
          >
            <span>Explore Tours</span>
            <ArrowRight className="w-4 h-4 text-[#E5C378]" />
          </Link>
        </div>
      )}

      {/* Active Upcoming Trip Card */}
      {activeTrip && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#8C6D2B]">
                Upcoming Booking
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#082F24] mt-0.5">
                {activeTrip.tourTitle}
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">Booking Ref: <strong>{activeTrip.bookingCode}</strong></p>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3.5 py-1 text-xs font-bold rounded-full ${
                activeTrip.bookingStatus === 'Confirmed'
                  ? 'bg-emerald-100 text-emerald-800'
                  : activeTrip.bookingStatus === 'Pending'
                  ? 'bg-amber-100 text-amber-800'
                  : activeTrip.bookingStatus === 'Rejected'
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-stone-100 text-stone-700'
              }`}>
                {activeTrip.bookingStatus}
              </span>
              <span className="px-3 py-1 bg-[#FAF8F5] border border-stone-200 text-stone-700 text-xs font-semibold rounded-full">
                {activeTrip.paymentStatus}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-stone-600 bg-[#FAF8F5] p-5 rounded-2xl border border-stone-200/80">
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-[#C5A059] shrink-0" />
              <div>
                <span className="font-bold text-[#082F24] block">Dates:</span>
                <span>{activeTrip.startDate} to {activeTrip.endDate}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Car className="w-4 h-4 text-[#C5A059] shrink-0" />
              <div>
                <span className="font-bold text-[#082F24] block">Chauffeur Guide:</span>
                <span>{activeTrip.bookingStatus === 'Confirmed' ? (activeTrip.assignedGuide?.name || 'Roshan Silva') : 'Allocated upon confirmation'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-[#C5A059] shrink-0" />
              <div>
                <span className="font-bold text-[#082F24] block">Destinations:</span>
                <span className="truncate">{activeTrip.destinationsCovered?.slice(0, 3).join(', ') || 'Sri Lanka'}...</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <Link
              to="/customer/bookings"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#0D3B2E] hover:underline"
            >
              <span>View All My Bookings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              to={`/customer/bookings/${activeTrip.id}`}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#0D3B2E] text-white hover:bg-[#134E3F] text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              <span>View Digital Voucher & Itinerary</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Recent Bookings List */}
      {userBookings.length > 0 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <h3 className="font-serif text-xl font-bold text-[#082F24]">Recent Bookings</h3>
            <Link to="/customer/bookings" className="text-xs font-bold text-[#0D3B2E] hover:underline">
              View All ({userBookings.length}) &rarr;
            </Link>
          </div>

          <div className="divide-y divide-stone-100">
            {userBookings.slice(0, 3).map((b) => (
              <div key={b.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#8C6D2B]">{b.bookingCode}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      b.bookingStatus === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' : b.bookingStatus === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {b.bookingStatus}
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-[#082F24] text-sm mt-0.5">{b.tourTitle}</h4>
                  <p className="text-stone-500 text-[11px]">{b.startDate} to {b.endDate} • {b.totalTravelers} Travelers • ${b.totalAmount.toLocaleString()} USD</p>
                </div>

                <Link
                  to={`/customer/bookings/${b.id}`}
                  className="px-4 py-2 bg-[#FAF8F5] border border-stone-200 text-[#082F24] hover:bg-[#0D3B2E] hover:text-white text-xs font-bold rounded-xl transition-all self-start sm:self-center"
                >
                  View Voucher
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
