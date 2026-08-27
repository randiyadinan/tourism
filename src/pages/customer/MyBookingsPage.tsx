import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Eye, 
  ArrowRight
} from 'lucide-react';
import { bookingService } from '../../services/bookingService';
import { useAuth } from '../../context/AuthContext';
import type { Booking } from '../../types';

export const MyBookingsPage: React.FC = () => {
  const { user } = useAuth();
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [allBookings, setAllBookings] = useState<Booking[]>(() => (user ? bookingService.getUserBookings(user.id) : []));

  useEffect(() => {
    if (user) {
      setAllBookings(bookingService.getUserBookings(user.id));
      bookingService.fetchBookingsFromServer().then(() => {
        setAllBookings(bookingService.getUserBookings(user.id));
      });
    }
  }, [user]);

  const filtered = filterStatus === 'All'
    ? allBookings
    : allBookings.filter(b => b.bookingStatus === filterStatus);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#062C22]">My Bookings</h1>
          <p className="text-xs text-stone-500">View your tour reservations, airport transfers, and payment statuses.</p>
        </div>

        <Link
          to="/transfers"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#0B3D2E] text-white hover:bg-[#134E3F] text-xs font-bold rounded-xl shadow-sm transition-all"
        >
          <span>Book Transfer & Tours</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Filter Tabs: All, Confirmed, Pending, Rejected, Completed */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['All', 'Confirmed', 'Pending', 'Rejected', 'Completed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filterStatus === status
                ? 'bg-[#0B3D2E] text-white shadow-sm'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filtered.length > 0 ? (
        <div className="liquid-glass-white rounded-3xl border border-white/80 shadow-[0_10px_30px_-10px_rgba(6,44,34,0.08)] overflow-hidden p-6 sm:p-7">
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
                {filtered.map((b) => (
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
        </div>
      ) : (
        <div className="bg-white p-12 rounded-3xl border border-stone-200 text-center space-y-3 shadow-sm">
          <Calendar className="w-8 h-8 text-stone-300 mx-auto" />
          <h3 className="font-serif font-bold text-base text-[#062C22]">No {filterStatus !== 'All' ? filterStatus : ''} Bookings Found</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            You currently have no bookings under this status.
          </p>
        </div>
      )}

    </div>
  );
};
