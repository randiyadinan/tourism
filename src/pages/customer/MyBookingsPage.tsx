import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
   
   
  Eye, 
  Sparkles } from 'lucide-react';
import { bookingService } from '../../services/bookingService';
import { useAuth } from '../../context/AuthContext';
import { EmptyState } from '../../components/common/EmptyState';

export const MyBookingsPage: React.FC = () => {
  const { user } = useAuth();
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const allBookings = user ? bookingService.getUserBookings(user.id) : [];

  const filtered = filterStatus === 'All'
    ? allBookings
    : allBookings.filter(b => b.bookingStatus === filterStatus);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#062C22]">My Bookings & Vouchers</h1>
          <p className="text-xs text-stone-500">Access your digital vouchers, invoices, and payment receipts.</p>
        </div>

        <Link
          to="/customize"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#0B3D2E] text-white hover:bg-[#134E3F] text-xs font-bold rounded-xl shadow-sm transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#39A982]" />
          <span>Book Another Trip</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['All', 'Pending', 'Confirmed', 'Rejected', 'Completed', 'Cancelled'].map((status) => (
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
        <div className="space-y-4">
          {filtered.map((booking) => (
            <div
              key={booking.id}
              className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="flex items-start gap-4">
                <img
                  src={booking.tourImage || 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=200&q=80'}
                  alt={booking.tourTitle}
                  className="w-20 h-20 rounded-2xl object-cover border border-stone-200 shrink-0"
                />
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#176B52]">
                      {booking.bookingCode}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      booking.bookingStatus === 'Confirmed' 
                        ? 'bg-emerald-100 text-emerald-800'
                        : booking.bookingStatus === 'Pending'
                        ? 'bg-amber-100 text-amber-800'
                        : booking.bookingStatus === 'Rejected'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-stone-100 text-stone-700'
                    }`}>
                      {booking.bookingStatus}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#F8F7F2] border border-stone-200 text-stone-700">
                      {booking.paymentStatus}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-base text-[#062C22]">{booking.tourTitle}</h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#176B52]" />
                      {booking.startDate} to {booking.endDate}
                    </span>
                    <span>•</span>
                    <span>{booking.adultsCount} Adults{booking.childrenCount > 0 ? `, ${booking.childrenCount} Kids` : ''}</span>
                    <span>•</span>
                    <span className="font-bold text-[#062C22]">${booking.totalAmount.toLocaleString()} USD</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-4 md:pt-0 border-stone-100">
                <Link
                  to={`/customer/bookings/${booking.id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#0B3D2E] text-white hover:bg-[#134E3F] text-xs font-bold rounded-xl shadow-sm transition-all"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Voucher & Details</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Calendar}
          title="No Bookings Found"
          description="You don't have any bookings matching this status filter."
          actionText="Explore Tours"
          actionHref="/tours"
        />
      )}

    </div>
  );
};
