import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Eye
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { bookingService } from '../../services/bookingService';
import { authService } from '../../services/authService';
import type { Booking } from '../../types';

export const AdminDashboardPage: React.FC = () => {
  const [allBookings, setAllBookings] = useState<Booking[]>(() => bookingService.getAllBookings());
  const [statusMessage, setStatusMessage] = useState('');
  const monthlyRevenue = adminService.getRevenueByMonth();
  const popularTours = adminService.getPopularToursPerformance();
  const allUsers = authService.getUsers();
  const totalCustomers = allUsers.filter(u => u.role === 'customer').length;
  const publishedTours = 12;

  const pendingBookings = allBookings.filter(b => b.bookingStatus === 'Pending');
  const confirmedBookings = allBookings.filter(b => b.bookingStatus === 'Confirmed');
  const rejectedBookings = allBookings.filter(b => b.bookingStatus === 'Rejected');
  const recentBookings = allBookings.slice(0, 5);

  const maxMonthRev = Math.max(...monthlyRevenue.map(m => m.revenue));

  const handleQuickStatus = (id: string, newStatus: 'Confirmed' | 'Rejected') => {
    try {
      bookingService.adminUpdateStatus(id, newStatus);
      const updated = bookingService.getAllBookings();
      setAllBookings(updated);
      setStatusMessage(`Booking ${id} status updated to ${newStatus}`);
      setTimeout(() => setStatusMessage(''), 3500);
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#082F24]">Executive Admin Dashboard</h1>
          <p className="text-xs text-stone-500">Live booking operations, approval queue, platform statistics, and revenue logs.</p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/bookings"
            className="px-4 py-2 bg-[#0D3B2E] text-white hover:bg-[#134E3F] text-xs font-bold rounded-xl shadow-sm transition-all"
          >
            Manage All Bookings &rarr;
          </Link>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* 6 Real KPI Cards: Total Bookings, Pending, Confirmed, Rejected, Customers, Tours */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        
        {/* 1. Total Bookings */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
          <span className="text-[10px] sm:text-xs font-bold text-stone-400 uppercase block">Total Bookings</span>
          <span className="font-serif text-2xl sm:text-3xl font-bold text-[#082F24] block">
            {allBookings.length}
          </span>
          <p className="text-[10px] text-stone-500">All registered trips</p>
        </div>

        {/* 2. Pending Requests (Visually Obvious / Prominent) */}
        <div className="bg-amber-50/70 p-4 sm:p-5 rounded-2xl border-2 border-amber-300 shadow-sm space-y-1 relative overflow-hidden">
          <span className="text-[10px] sm:text-xs font-bold text-amber-800 uppercase block flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Pending
          </span>
          <span className="font-serif text-2xl sm:text-3xl font-bold text-amber-700 block">
            {pendingBookings.length}
          </span>
          <p className="text-[10px] text-amber-800 font-medium">Needs Ops Action</p>
          {pendingBookings.length > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          )}
        </div>

        {/* 3. Confirmed */}
        <div className="bg-emerald-50/60 p-4 sm:p-5 rounded-2xl border border-emerald-200 shadow-sm space-y-1">
          <span className="text-[10px] sm:text-xs font-bold text-emerald-800 uppercase block flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Confirmed
          </span>
          <span className="font-serif text-2xl sm:text-3xl font-bold text-emerald-700 block">
            {confirmedBookings.length}
          </span>
          <p className="text-[10px] text-emerald-800">Ready for travel</p>
        </div>

        {/* 4. Rejected */}
        <div className="bg-rose-50/60 p-4 sm:p-5 rounded-2xl border border-rose-200 shadow-sm space-y-1">
          <span className="text-[10px] sm:text-xs font-bold text-rose-800 uppercase block flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            Rejected
          </span>
          <span className="font-serif text-2xl sm:text-3xl font-bold text-rose-700 block">
            {rejectedBookings.length}
          </span>
          <p className="text-[10px] text-rose-700">Declined requests</p>
        </div>

        {/* 5. Total Customers */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
          <span className="text-[10px] sm:text-xs font-bold text-stone-400 uppercase block flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-[#0D3B2E]" />
            Customers
          </span>
          <span className="font-serif text-2xl sm:text-3xl font-bold text-[#082F24] block">
            {totalCustomers}
          </span>
          <p className="text-[10px] text-stone-500">Registered CRM files</p>
        </div>

        {/* 6. Total Tours */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
          <span className="text-[10px] sm:text-xs font-bold text-stone-400 uppercase block flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-[#C5A059]" />
            Total Tours
          </span>
          <span className="font-serif text-2xl sm:text-3xl font-bold text-[#082F24] block">
            {publishedTours}
          </span>
          <p className="text-[10px] text-stone-500">Active catalog</p>
        </div>

      </div>

      {/* Prominent Pending Bookings Queue (If Any) */}
      {pendingBookings.length > 0 && (
        <div className="bg-amber-50/80 border-2 border-amber-300 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
              <h3 className="font-serif text-lg font-bold text-amber-950">
                Action Required: {pendingBookings.length} Pending Booking{pendingBookings.length > 1 ? 's' : ''} Awaiting Confirmation
              </h3>
            </div>
            <Link to="/admin/bookings" className="text-xs font-bold text-amber-900 hover:underline">
              View All in Booking Desk &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingBookings.map((b) => (
              <div key={b.id} className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs flex flex-col justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#8C6D2B]">{b.bookingCode}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                      Pending Review
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-sm text-[#082F24] mt-1">{b.tourTitle}</h4>
                  <p className="text-stone-600 mt-0.5">
                    <strong>Customer:</strong> {b.customerName} ({b.customerEmail})
                  </p>
                  <p className="text-stone-500 text-[11px]">
                    <strong>Dates:</strong> {b.startDate} to {b.endDate} • {b.totalTravelers} Pax • ${b.totalAmount.toLocaleString()} USD
                  </p>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-100">
                  <Link
                    to={`/customer/bookings/${b.id}`}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0D3B2E] hover:underline"
                  >
                    <Eye className="w-3 h-3 text-[#C5A059]" />
                    <span>Inspect</span>
                  </Link>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuickStatus(b.id, 'Confirmed')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
                    >
                      ✓ Confirm
                    </button>
                    <button
                      onClick={() => handleQuickStatus(b.id, 'Rejected')}
                      className="px-3 py-1.5 bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 font-bold text-xs rounded-xl transition-all"
                    >
                      ✕ Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2-Column Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Monthly Revenue Bar Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#082F24]">2026 Monthly Revenue ($ USD)</h3>
              <p className="text-xs text-stone-500">Gross revenue generated across bespoke tours and transfers</p>
            </div>
            <span className="text-xs font-bold text-[#0D3B2E] bg-emerald-50 px-2.5 py-1 rounded-lg">
              High Peak Seasons
            </span>
          </div>

          <div className="h-60 flex items-end justify-between gap-3 pt-6">
            {monthlyRevenue.map((m) => {
              const heightPct = Math.round((m.revenue / maxMonthRev) * 100);
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-bold text-stone-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    ${(m.revenue / 1000).toFixed(1)}k
                  </span>
                  <div
                    style={{ height: `${heightPct}%` }}
                    className="w-full bg-[#0D3B2E] hover:bg-[#C5A059] rounded-t-xl transition-all duration-500 cursor-pointer shadow-xs"
                    title={`${m.month}: $${m.revenue.toLocaleString()} (${m.bookings} bookings)`}
                  />
                  <span className="text-xs font-bold text-stone-600">{m.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Popular Tours Breakdown (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-5">
          <h3 className="font-serif text-lg font-bold text-[#082F24]">Top Performing Tours</h3>
          
          <div className="space-y-4">
            {popularTours.map((t, idx) => (
              <div key={idx} className="space-y-1.5 text-xs">
                <div className="flex justify-between font-bold text-[#082F24]">
                  <span className="truncate max-w-[200px]">{t.name}</span>
                  <span>${t.revenue.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#C5A059] rounded-full" style={{ width: `${t.percentage}%` }} />
                </div>
                <div className="flex justify-between text-[11px] text-stone-400">
                  <span>{t.bookings} bookings</span>
                  <span>{t.percentage}% market share</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recent Bookings Feed */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden space-y-4 p-6 sm:p-8">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <h3 className="font-serif text-lg font-bold text-[#082F24]">Recent Customer Bookings</h3>
          <Link to="/admin/bookings" className="text-xs font-bold text-[#0D3B2E] hover:underline">
            View All Operations &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] text-stone-700 font-bold border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Booking Ref</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Tour / Package</th>
                <th className="py-3 px-4">Dates</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-600">
              {recentBookings.map((b) => (
                <tr key={b.id} className="hover:bg-stone-50/50">
                  <td className="py-3.5 px-4 font-bold text-[#8C6D2B]">{b.bookingCode}</td>
                  <td className="py-3.5 px-4 font-semibold text-[#082F24]">{b.customerName}</td>
                  <td className="py-3.5 px-4 truncate max-w-[200px]">{b.tourTitle}</td>
                  <td className="py-3.5 px-4">{b.startDate}</td>
                  <td className="py-3.5 px-4 font-bold text-[#082F24]">${b.totalAmount.toLocaleString()}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      b.bookingStatus === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {b.bookingStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      to={`/customer/bookings/${b.id}`}
                      className="text-xs font-bold text-[#0D3B2E] hover:underline"
                    >
                      Inspect Voucher
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
