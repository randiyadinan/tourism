import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  ArrowRight,
  Eye,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { bookingService } from '../../services/bookingService';
import type { Booking } from '../../types';

export const CustomerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [userBookings, setUserBookings] = useState<Booking[]>(() => (user ? bookingService.getUserBookings(user.id) : []));

  useEffect(() => {
    if (user) {
      setUserBookings(bookingService.getUserBookings(user.id));
      bookingService.fetchBookingsFromServer().then(() => {
        setUserBookings(bookingService.getUserBookings(user.id));
      });
    }
  }, [user]);

  const pendingBookings = userBookings.filter(b => b.bookingStatus === 'Pending');
  const confirmedBookings = userBookings.filter(b => b.bookingStatus === 'Confirmed');

  // Next upcoming confirmed (or pending) booking
  const upcomingTrip = userBookings.find(b => b.bookingStatus === 'Confirmed') || userBookings[0];

  // Recent bookings (top 5)
  const recentBookings = userBookings.slice(0, 5);

  return (
    <div className="space-y-8">
      
      {/* 1. WELCOME BANNER */}
      <div className="liquid-glass-white p-6 sm:p-8 rounded-3xl border border-white/80 shadow-[0_10px_30px_-10px_rgba(6,44,34,0.08)] space-y-1">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#062C22]">
          Traveler Dashboard
        </h1>
        <p className="font-bold text-sm text-[#176B52]">
          Welcome, {user?.name || 'Traveler'}
        </p>
        <p className="text-xs text-stone-500 max-w-2xl pt-0.5">
          View your bookings, booking status, payment status, and travel details in one place.
        </p>
      </div>

      {/* 2. SUMMARY CARDS: Total Bookings, Confirmed, Pending */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Total Bookings */}
        <div className="liquid-glass-card glass-card-interactive p-5 rounded-2xl space-y-1">
          <span className="text-xs text-stone-400 font-bold uppercase tracking-wider block">
            Total Bookings
          </span>
          <span className="font-serif text-2xl sm:text-3xl font-bold text-[#062C22] block">
            {userBookings.length}
          </span>
          <p className="text-[11px] text-stone-500">All registered trips</p>
        </div>

        {/* Confirmed */}
        <div className="liquid-glass-card glass-card-interactive p-5 rounded-2xl space-y-1">
          <span className="text-xs text-emerald-800 font-bold uppercase tracking-wider block flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Confirmed
          </span>
          <span className="font-serif text-2xl sm:text-3xl font-bold text-emerald-700 block">
            {confirmedBookings.length}
          </span>
          <p className="text-[11px] text-emerald-800">Ready for travel</p>
        </div>

        {/* Pending */}
        <div className="liquid-glass-card glass-card-interactive p-5 rounded-2xl space-y-1">
          <span className="text-xs text-amber-800 font-bold uppercase tracking-wider block flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Pending
          </span>
          <span className="font-serif text-2xl sm:text-3xl font-bold text-amber-700 block">
            {pendingBookings.length}
          </span>
          <p className="text-[11px] text-amber-800">Awaiting review</p>
        </div>

      </div>

      {/* 3. UPCOMING TRIP (If any booking exists) */}
      {upcomingTrip ? (
        <div className="liquid-glass-white rounded-3xl border border-white/80 shadow-[0_10px_30px_-10px_rgba(6,44,34,0.08)] p-6 sm:p-7 space-y-5">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#176B52] block">
                Upcoming Trip
              </span>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#062C22]">
                {upcomingTrip.tourTitle}
              </h2>
            </div>
            
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                upcomingTrip.bookingStatus === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {upcomingTrip.bookingStatus}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                upcomingTrip.paymentStatus === 'Fully Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-700'
              }`}>
                Payment: {upcomingTrip.paymentStatus}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="space-y-0.5">
              <span className="text-stone-400 font-medium">Booking Reference</span>
              <p className="font-bold text-[#176B52]">{upcomingTrip.bookingCode}</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-stone-400 font-medium">Travel Dates</span>
              <p className="font-bold text-[#062C22]">{upcomingTrip.startDate} to {upcomingTrip.endDate}</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-stone-400 font-medium">Travelers & Vehicle</span>
              <p className="font-bold text-[#062C22]">{upcomingTrip.totalTravelers} Pax &bull; {upcomingTrip.vehicleType || 'Private Vehicle'}</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-stone-400 font-medium">Destinations</span>
              <p className="font-bold text-[#062C22] truncate">{upcomingTrip.destinationsCovered?.join(', ') || 'Sri Lanka'}</p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
            <Link
              to={`/customer/bookings/${upcomingTrip.id}`}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#0B3D2E] hover:bg-[#176B52] text-white text-xs font-bold rounded-xl shadow-xs transition-all"
            >
              <Eye className="w-3.5 h-3.5 text-[#39A982]" />
              <span>View Booking</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-3xl border border-stone-200 text-center space-y-3 shadow-sm">
          <Calendar className="w-8 h-8 text-stone-300 mx-auto" />
          <h3 className="font-serif font-bold text-base text-[#062C22]">No bookings found</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Book an airport transfer or explore chauffeured Sri Lanka tours.
          </p>
          <Link
            to="/transfers"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0B3D2E] text-white font-bold text-xs rounded-xl"
          >
            <span>Book Airport Transfer & Tours</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* 4. MY BOOKINGS LIST */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden p-6 sm:p-7 space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <h3 className="font-serif text-lg font-bold text-[#062C22]">My Bookings</h3>
          {userBookings.length > 5 && (
            <Link to="/customer/bookings" className="text-xs font-bold text-[#0B3D2E] hover:underline">
              View All Bookings &rarr;
            </Link>
          )}
        </div>

        {recentBookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F7F2] text-stone-700 font-bold border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Booking Ref</th>
                  <th className="py-3 px-4">Service / Tour</th>
                  <th className="py-3 px-4">Travel Date</th>
                  <th className="py-3 px-4">Travelers</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-600">
                {recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-stone-50/50">
                    <td className="py-3.5 px-4 font-bold text-[#176B52]">{b.bookingCode}</td>
                    <td className="py-3.5 px-4 font-semibold text-[#062C22] max-w-[200px] truncate">{b.tourTitle}</td>
                    <td className="py-3.5 px-4">{b.startDate}</td>
                    <td className="py-3.5 px-4">{b.totalTravelers} Pax</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        b.bookingStatus === 'Confirmed' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : b.bookingStatus === 'Pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                      }`}>
                        {b.bookingStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        b.paymentStatus === 'PAID' || b.paymentStatus === 'Fully Paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : b.paymentStatus === 'NOT PAID' || b.paymentStatus === 'Unpaid'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {b.paymentStatus === 'PAID' || b.paymentStatus === 'Fully Paid' ? 'PAID' : b.paymentStatus === 'NOT PAID' || b.paymentStatus === 'Unpaid' ? 'NOT PAID' : b.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/customer/bookings/${b.id}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#0B3D2E] hover:underline"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Booking</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-stone-500 py-4 text-center">No recent bookings recorded.</p>
        )}
      </div>

    </div>
  );
};
