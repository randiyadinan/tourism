import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Mail, 
  Phone, 
  Users, 
  ShieldCheck, 
  Eye, 
  X, 
  Calendar,
  Trash2,
  Edit3,
  AlertCircle,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { formatPrice } from '../../utils/formatters';
import type { User, Booking } from '../../types';

export const ManageCustomersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState('');
  const [inspectingCustomer, setInspectingCustomer] = useState<any | null>(null);
  
  // Edit State
  const [editingCustomer, setEditingCustomer] = useState<User | null>(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editCountry, setEditCountry] = useState('');
  const [editPassport, setEditPassport] = useState('');
  const [editDietary, setEditDietary] = useState('');

  // Status & Feedback
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [fetchedUsers, fetchedBookings] = await Promise.all([
        adminService.fetchUsers(),
        adminService.fetchBookings()
      ]);
      setUsers(fetchedUsers.filter(u => u.role === 'customer'));
      setAllBookings(fetchedBookings);
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to load customers' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.country && u.country.toLowerCase().includes(search.toLowerCase()))
  );

  const totalRegistered = users.length;
  const totalRevenue = allBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  const handleOpenEdit = (user: User) => {
    setEditingCustomer(user);
    setEditName(user.name);
    setEditPhone(user.phone || '');
    setEditCountry(user.country || '');
    setEditPassport(user.passportNumber || '');
    setEditDietary(user.dietaryPreferences || '');
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer) return;

    setActionLoading(true);
    try {
      const updated = await adminService.updateUser(editingCustomer.id, {
        name: editName.trim(),
        phone: editPhone.trim(),
        country: editCountry.trim(),
        passportNumber: editPassport.trim(),
        dietaryPreferences: editDietary.trim()
      });

      setUsers(users.map(u => u.id === updated.id ? { ...u, ...updated } : u));
      if (inspectingCustomer && inspectingCustomer.id === updated.id) {
        setInspectingCustomer({ ...inspectingCustomer, ...updated });
      }
      setEditingCustomer(null);
      setStatusMsg({ type: 'success', text: `Profile for ${updated.name} updated successfully.` });
      setTimeout(() => setStatusMsg(null), 4000);
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to update profile.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (user: User) => {
    const userBookings = allBookings.filter(b => b.userId === user.id || b.customerEmail.toLowerCase() === user.email.toLowerCase());
    const hasActiveBookings = userBookings.some(b => b.bookingStatus === 'Confirmed' || b.bookingStatus === 'Pending');

    if (hasActiveBookings) {
      alert(`Cannot delete customer account "${user.name}" because they have active / pending bookings. Please cancel or complete bookings first.`);
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to permanently delete the customer account for "${user.name}" (${user.email})?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    setActionLoading(true);
    try {
      const res = await adminService.deleteUser(user.id);
      if (res.success) {
        setUsers(users.filter(u => u.id !== user.id));
        if (inspectingCustomer && inspectingCustomer.id === user.id) {
          setInspectingCustomer(null);
        }
        setStatusMsg({ type: 'success', text: `Customer ${user.name} was safely deleted.` });
      } else {
        setStatusMsg({ type: 'error', text: res.error || 'Failed to delete customer' });
      }
      setTimeout(() => setStatusMsg(null), 4000);
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Deletion failed.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleInspect = async (user: User) => {
    try {
      const detailed = await adminService.getUserDetails(user.id);
      setInspectingCustomer(detailed || user);
    } catch {
      setInspectingCustomer(user);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#062C22]">Customer CRM & Profiles</h1>
          <p className="text-xs text-stone-500">Verified traveler accounts, contact records, booking history, and safe profile management.</p>
        </div>
        <button
          onClick={loadData}
          disabled={loading}
          className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh CRM</span>
        </button>
      </div>

      {/* Global Status Banner */}
      {statusMsg && (
        <div className={`p-3.5 rounded-2xl flex items-center gap-2 text-xs font-bold animate-scale-in ${
          statusMsg.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
            : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          {statusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="liquid-glass-white p-5 rounded-2xl border border-white/80 shadow-[0_4px_20px_-4px_rgba(6,44,34,0.06)] space-y-1">
          <span className="text-[10px] text-stone-400 font-bold uppercase block">Registered Customers</span>
          <span className="font-serif text-2xl font-bold text-[#062C22] flex items-center gap-2">
            <Users className="w-5 h-5 text-[#176B52]" />
            {totalRegistered}
          </span>
          <p className="text-[11px] text-stone-500">Active traveler profiles</p>
        </div>

        <div className="liquid-glass-white p-5 rounded-2xl border border-white/80 shadow-[0_4px_20px_-4px_rgba(6,44,34,0.06)] space-y-1">
          <span className="text-[10px] text-stone-400 font-bold uppercase block">Total Bookings Recorded</span>
          <span className="font-serif text-2xl font-bold text-[#0B3D2E] flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#0B3D2E]" />
            {allBookings.length}
          </span>
          <p className="text-[11px] text-stone-500">Bespoke itineraries & transfers</p>
        </div>

        <div className="liquid-glass-white p-5 rounded-2xl border border-white/80 shadow-[0_4px_20px_-4px_rgba(6,44,34,0.06)] space-y-1">
          <span className="text-[10px] text-stone-400 font-bold uppercase block">Gross Platform Revenue</span>
          <span className="font-serif text-2xl font-bold text-emerald-700 flex items-center gap-2">
            {formatPrice(totalRevenue)}
          </span>
          <p className="text-[11px] text-stone-500">Customer transactions</p>
        </div>
      </div>

      {/* Search */}
      <div className="liquid-glass-white p-4 rounded-2xl border border-white/80 shadow-[0_4px_20px_-4px_rgba(6,44,34,0.06)] flex items-center gap-3">
        <Search className="w-4 h-4 text-stone-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customers by name, email, or country..."
          className="w-full bg-transparent border-none text-xs text-[#062C22] focus:outline-none font-medium"
        />
      </div>

      {/* Table */}
      <div className="liquid-glass-white rounded-3xl border border-white/80 shadow-[0_10px_30px_-10px_rgba(6,44,34,0.08)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F7F2] text-stone-700 font-bold border-b border-stone-200">
              <tr>
                <th className="py-3.5 px-6">Customer</th>
                <th className="py-3.5 px-4">Contact Info</th>
                <th className="py-3.5 px-4">Country</th>
                <th className="py-3.5 px-4">Trips</th>
                <th className="py-3.5 px-4">Total Spend</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-600">
              {filtered.map((cust) => {
                const custBookings = allBookings.filter(b => b.userId === cust.id || b.customerEmail?.toLowerCase() === cust.email?.toLowerCase());
                const totalSpend = custBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

                return (
                  <tr key={cust.id} className="hover:bg-stone-50/50">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <img
                        src={cust.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                        alt={cust.name}
                        className="w-10 h-10 rounded-full object-cover border border-[#176B52]"
                      />
                      <div>
                        <h4 className="font-serif font-bold text-xs text-[#062C22] flex items-center gap-1">
                          {cust.name}
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        </h4>
                        <span className="text-[10px] font-mono text-stone-400">{cust.id}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-stone-600">
                        <Mail className="w-3 h-3 text-[#176B52]" />
                        <span>{cust.email}</span>
                      </div>
                      {cust.phone && (
                        <div className="flex items-center gap-1.5 text-stone-400">
                          <Phone className="w-3 h-3 text-[#176B52]" />
                          <span>{cust.phone}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 font-semibold text-[#062C22]">{cust.country || 'International'}</td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F8F7F2] border border-stone-200 text-[#0B3D2E]">
                        {custBookings.length} Trips
                      </span>
                    </td>
                    <td className="py-4 px-4 font-bold text-[#062C22]">
                      {formatPrice(totalSpend)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleInspect(cust)}
                          className="px-2.5 py-1.5 bg-[#0B3D2E] text-white hover:bg-[#134E3F] text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1"
                          title="View Profile"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#39A982]" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => handleOpenEdit(cust)}
                          className="p-1.5 text-stone-500 hover:text-[#0B3D2E] hover:bg-stone-100 rounded-lg"
                          title="Edit Profile"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cust)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                          title="Delete Customer Account"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── CUSTOMER PROFILE MODAL ───────────────────────── */}
      {inspectingCustomer && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto space-y-6">
            
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={inspectingCustomer.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                  alt={inspectingCustomer.name}
                  className="w-12 h-12 rounded-full object-cover border border-[#176B52]"
                />
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#062C22]">{inspectingCustomer.name}</h3>
                  <p className="text-xs text-stone-400 font-mono">{inspectingCustomer.id} &bull; {inspectingCustomer.email}</p>
                </div>
              </div>
              <button
                onClick={() => setInspectingCustomer(null)}
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:bg-stone-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-[#F8F7F2] p-4 rounded-2xl border border-stone-200/80 space-y-1.5">
                <span className="font-bold text-[#062C22] block">Contact & Registration</span>
                <p><strong>Email:</strong> {inspectingCustomer.email}</p>
                <p><strong>Phone:</strong> {inspectingCustomer.phone || 'Not provided'}</p>
                <p><strong>Country:</strong> {inspectingCustomer.country || 'International'}</p>
                <p><strong>Status:</strong> {inspectingCustomer.emailVerified ? 'Verified Account' : 'Pending Verification'}</p>
              </div>

              <div className="bg-[#F8F7F2] p-4 rounded-2xl border border-stone-200/80 space-y-1.5">
                <span className="font-bold text-[#062C22] block">Passport & Preferences</span>
                <p><strong>Passport Number:</strong> {inspectingCustomer.passportNumber || 'Not provided'}</p>
                <p><strong>Dietary Preferences:</strong> {inspectingCustomer.dietaryPreferences || 'Standard'}</p>
              </div>
            </div>

            {/* Customer Bookings History */}
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-base text-[#062C22]">
                Booking Records & Itineraries
              </h4>

              {inspectingCustomer.bookings && inspectingCustomer.bookings.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {inspectingCustomer.bookings.map((b: any) => (
                    <div key={b.id} className="p-3.5 bg-[#F8F7F2] rounded-xl border border-stone-200 flex items-center justify-between text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#176B52]">{b.bookingCode}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            b.bookingStatus === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' : b.bookingStatus === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-stone-100 text-stone-700'
                          }`}>
                            {b.bookingStatus}
                          </span>
                        </div>
                        <p className="font-bold text-[#062C22] mt-0.5">{b.tourTitle}</p>
                        <p className="text-[11px] text-stone-500">{b.startDate} to {b.endDate} • {formatPrice(b.totalAmount)}</p>
                      </div>

                      <Link
                        to={`/customer/bookings/${b.id}`}
                        className="px-3 py-1.5 bg-[#0B3D2E] text-white text-[11px] font-bold rounded-lg hover:bg-[#134E3F] shrink-0"
                      >
                        View Voucher
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-stone-400 py-3 text-center bg-[#F8F7F2] rounded-xl">No bookings recorded for this customer.</p>
              )}
            </div>

            <div className="pt-4 border-t border-stone-100 flex justify-between items-center">
              <button
                onClick={() => handleOpenEdit(inspectingCustomer)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-[#062C22] font-bold text-xs rounded-xl flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>

              <button
                onClick={() => setInspectingCustomer(null)}
                className="px-4 py-2 bg-[#0B3D2E] text-white font-bold text-xs rounded-xl hover:bg-[#134E3F]"
              >
                Close Customer File
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ─── EDIT CUSTOMER MODAL ─────────────────────────── */}
      {editingCustomer && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-serif text-lg font-bold text-[#062C22]">Edit Customer Profile</h3>
              <button onClick={() => setEditingCustomer(null)} className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:bg-stone-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-stone-700">Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F8F7F2] border border-stone-300 rounded-xl text-xs text-[#062C22] focus:outline-none focus:ring-2 focus:ring-[#176B52]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700">Phone Number</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="+94 77 123 4567"
                  className="w-full px-3 py-2 bg-[#F8F7F2] border border-stone-300 rounded-xl text-xs text-[#062C22] focus:outline-none focus:ring-2 focus:ring-[#176B52]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700">Country of Residence</label>
                <input
                  type="text"
                  value={editCountry}
                  onChange={(e) => setEditCountry(e.target.value)}
                  placeholder="United Kingdom"
                  className="w-full px-3 py-2 bg-[#F8F7F2] border border-stone-300 rounded-xl text-xs text-[#062C22] focus:outline-none focus:ring-2 focus:ring-[#176B52]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700">Passport Number</label>
                <input
                  type="text"
                  value={editPassport}
                  onChange={(e) => setEditPassport(e.target.value)}
                  placeholder="GB12345678"
                  className="w-full px-3 py-2 bg-[#F8F7F2] border border-stone-300 rounded-xl text-xs text-[#062C22] focus:outline-none focus:ring-2 focus:ring-[#176B52]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700">Dietary Preferences</label>
                <input
                  type="text"
                  value={editDietary}
                  onChange={(e) => setEditDietary(e.target.value)}
                  placeholder="Vegetarian / Halal"
                  className="w-full px-3 py-2 bg-[#F8F7F2] border border-stone-300 rounded-xl text-xs text-[#062C22] focus:outline-none focus:ring-2 focus:ring-[#176B52]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingCustomer(null)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 font-bold text-xs rounded-xl hover:bg-stone-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 bg-[#0B3D2E] text-white font-bold text-xs rounded-xl hover:bg-[#134E3F] disabled:opacity-50"
                >
                  {actionLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
