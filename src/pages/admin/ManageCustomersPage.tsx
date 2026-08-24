import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Mail, Phone, Users, ShieldCheck, Eye, X, Calendar, DollarSign } from 'lucide-react';
import { authService } from '../../services/authService';
import { bookingService } from '../../services/bookingService';
import type { User, Booking } from '../../types';

export const ManageCustomersPage: React.FC = () => {
  const [users] = useState<User[]>(() => authService.getUsers().filter(u => u.role === 'customer'));
  const [allBookings] = useState<Booking[]>(() => bookingService.getAllBookings());
  const [search, setSearch] = useState('');
  const [inspectingCustomer, setInspectingCustomer] = useState<User | null>(null);

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.country && u.country.toLowerCase().includes(search.toLowerCase()))
  );

  const totalRegistered = users.length;
  const totalRevenue = allBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  const customerBookings = inspectingCustomer
    ? allBookings.filter(b => b.userId === inspectingCustomer.id || b.customerEmail.toLowerCase() === inspectingCustomer.email.toLowerCase())
    : [];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#082F24]">Traveler Directory & CRM</h1>
          <p className="text-xs text-stone-500">Verified customer accounts, contact details, passport profiles, and booking history.</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
          <span className="text-[10px] text-stone-400 font-bold uppercase block">Registered Customers</span>
          <span className="font-serif text-2xl font-bold text-[#082F24] flex items-center gap-2">
            <Users className="w-5 h-5 text-[#C5A059]" />
            {totalRegistered}
          </span>
          <p className="text-[11px] text-stone-500">Active traveler accounts</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
          <span className="text-[10px] text-stone-400 font-bold uppercase block">Total Bookings Recorded</span>
          <span className="font-serif text-2xl font-bold text-[#0D3B2E] flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#0D3B2E]" />
            {allBookings.length}
          </span>
          <p className="text-[11px] text-stone-500">Bespoke itineraries & transfers</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
          <span className="text-[10px] text-stone-400 font-bold uppercase block">Gross Platform Revenue</span>
          <span className="font-serif text-2xl font-bold text-emerald-700 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            ${totalRevenue.toLocaleString()} USD
          </span>
          <p className="text-[11px] text-stone-500">Customer transactions</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-stone-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customers by name, email, or country..."
          className="w-full bg-transparent border-none text-xs text-[#082F24] focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] text-stone-700 font-bold border-b border-stone-200">
              <tr>
                <th className="py-3.5 px-6">Customer Name</th>
                <th className="py-3.5 px-4">Contact Details</th>
                <th className="py-3.5 px-4">Country</th>
                <th className="py-3.5 px-4">Bookings</th>
                <th className="py-3.5 px-4">Lifetime Spend</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-600">
              {filtered.map((cust) => {
                const custBookings = allBookings.filter(b => b.userId === cust.id || b.customerEmail.toLowerCase() === cust.email.toLowerCase());
                const totalSpend = custBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

                return (
                  <tr key={cust.id} className="hover:bg-stone-50/50">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <img
                        src={cust.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                        alt={cust.name}
                        className="w-10 h-10 rounded-full object-cover border border-[#C5A059]"
                      />
                      <div>
                        <h4 className="font-serif font-bold text-xs text-[#082F24] flex items-center gap-1">
                          {cust.name}
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        </h4>
                        <span className="text-[10px] font-mono text-stone-400">{cust.id}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-stone-600">
                        <Mail className="w-3 h-3 text-[#C5A059]" />
                        <span>{cust.email}</span>
                      </div>
                      {cust.phone && (
                        <div className="flex items-center gap-1.5 text-stone-400">
                          <Phone className="w-3 h-3 text-[#C5A059]" />
                          <span>{cust.phone}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 font-semibold text-[#082F24]">{cust.country || 'International'}</td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF8F5] border border-stone-200 text-[#0D3B2E]">
                        {custBookings.length} Trips
                      </span>
                    </td>
                    <td className="py-4 px-4 font-bold text-[#082F24]">
                      ${totalSpend.toLocaleString()} USD
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setInspectingCustomer(cust)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#0D3B2E] text-white hover:bg-[#134E3F] text-xs font-bold rounded-xl shadow-xs transition-all"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#E5C378]" />
                        <span>View Profile & Trips</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Inspector Modal */}
      {inspectingCustomer && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto space-y-6">
            
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={inspectingCustomer.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                  alt={inspectingCustomer.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#C5A059]"
                />
                <div>
                  <span className="text-[10px] font-bold text-[#8C6D2B] uppercase tracking-wider">
                    Customer CRM File
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#082F24] flex items-center gap-1.5">
                    {inspectingCustomer.name}
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-bold">
                      Verified
                    </span>
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setInspectingCustomer(null)}
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:bg-stone-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-stone-200/80 space-y-1.5">
                <span className="font-bold text-[#082F24] block">Contact Details</span>
                <p><strong>Email:</strong> {inspectingCustomer.email}</p>
                <p><strong>Phone:</strong> {inspectingCustomer.phone || 'Not provided'}</p>
                <p><strong>Country:</strong> {inspectingCustomer.country || 'International'}</p>
                <p><strong>Joined:</strong> {inspectingCustomer.createdAt || '2026-05-10'}</p>
              </div>

              <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-stone-200/80 space-y-1.5">
                <span className="font-bold text-[#082F24] block">Preferences & Safety</span>
                <p><strong>Passport No:</strong> {inspectingCustomer.passportNumber || 'Not provided'}</p>
                <p><strong>Dietary:</strong> {inspectingCustomer.dietaryPreferences || 'Standard'}</p>
                {inspectingCustomer.emergencyContact && (
                  <p><strong>Emergency:</strong> {inspectingCustomer.emergencyContact.name} ({inspectingCustomer.emergencyContact.phone})</p>
                )}
              </div>
            </div>

            {/* Customer Bookings History */}
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-base text-[#082F24]">
                Customer Bookings & Itineraries ({customerBookings.length})
              </h4>

              {customerBookings.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {customerBookings.map((b) => (
                    <div key={b.id} className="p-3 bg-[#FAF8F5] rounded-xl border border-stone-200 flex items-center justify-between text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#8C6D2B]">{b.bookingCode}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            b.bookingStatus === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' : b.bookingStatus === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-stone-100 text-stone-700'
                          }`}>
                            {b.bookingStatus}
                          </span>
                        </div>
                        <p className="font-bold text-[#082F24] mt-0.5">{b.tourTitle}</p>
                        <p className="text-[11px] text-stone-500">{b.startDate} to {b.endDate} • ${b.totalAmount.toLocaleString()} USD</p>
                      </div>

                      <Link
                        to={`/customer/bookings/${b.id}`}
                        className="px-3 py-1.5 bg-[#0D3B2E] text-white text-[11px] font-bold rounded-lg hover:bg-[#134E3F] shrink-0"
                      >
                        Voucher
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-stone-400 py-4 text-center">No bookings placed yet by this customer.</p>
              )}
            </div>

            <div className="pt-4 border-t border-stone-100 flex justify-end">
              <button
                onClick={() => setInspectingCustomer(null)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl"
              >
                Close Customer File
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
