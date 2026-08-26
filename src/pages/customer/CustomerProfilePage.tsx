import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Save, 
  CheckCircle2, 
  ShieldCheck, 
  Mail, 
  Phone, 
  Globe, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const CustomerProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [country, setCountry] = useState(user?.country || 'International');
  const [passportNumber, setPassportNumber] = useState(user?.passportNumber || '');
  const [dietaryPreferences, setDietaryPreferences] = useState(user?.dietaryPreferences || '');
  const [emergencyName, setEmergencyName] = useState(user?.emergencyContact?.name || '');
  const [emergencyPhone, setEmergencyPhone] = useState(user?.emergencyContact?.phone || '');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await updateProfile({
      name,
      phone,
      country,
      passportNumber,
      dietaryPreferences,
      emergencyContact: {
        name: emergencyName,
        relationship: 'Emergency Contact',
        phone: emergencyPhone
      }
    });

    if (res.success) {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } else {
      setError(res.error || 'Failed to update profile');
    }
  };

  return (
    <div className="bg-white p-8 sm:p-10 rounded-3xl border border-stone-200 shadow-sm space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#062C22]">Traveler Profile & Preferences</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Verified Traveler
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">Manage your contact information, passport details, and travel requirements.</p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile Updated Successfully!</span>
          </div>
        )}
      </div>

      {error && (
        <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl flex items-center gap-2 border border-rose-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Account Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-[#F8F7F2] rounded-2xl border border-stone-200 space-y-1">
          <span className="text-[10px] text-stone-400 font-bold uppercase block">Account ID</span>
          <p className="font-mono text-xs font-bold text-[#062C22] truncate">{user?.id || 'user-customer'}</p>
        </div>
        <div className="p-4 bg-[#F8F7F2] rounded-2xl border border-stone-200 space-y-1">
          <span className="text-[10px] text-stone-400 font-bold uppercase block">Account Type</span>
          <p className="text-xs font-bold text-[#0B3D2E] capitalize">
            {user?.role === 'customer' ? 'Customer / Traveler' : 'Administrator'}
          </p>
        </div>
        <div className="p-4 bg-[#F8F7F2] rounded-2xl border border-stone-200 space-y-1">
          <span className="text-[10px] text-stone-400 font-bold uppercase block">Member Since</span>
          <p className="text-xs font-bold text-[#062C22] flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[#176B52]" />
            {user?.createdAt || '2026-05-10'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-sm">
        
        {/* Personal Details */}
        <div className="space-y-4">
          <h3 className="font-serif font-bold text-base text-[#062C22] flex items-center gap-1.5">
            <UserIcon className="w-4 h-4 text-[#176B52]" />
            Personal Information
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-[#062C22] focus:outline-none focus:ring-2 focus:ring-[#176B52]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Email Address (Immutable Login ID)</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  disabled
                  value={user?.email}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-stone-100 border border-stone-200 rounded-xl text-xs text-stone-500 cursor-not-allowed font-medium"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Phone / WhatsApp</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+44 7700 900077"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#F8F7F2] border border-stone-300 rounded-xl text-xs text-[#062C22] focus:outline-none focus:ring-2 focus:ring-[#176B52]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Country of Residence</label>
              <div className="relative">
                <Globe className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="United Kingdom"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#F8F7F2] border border-stone-300 rounded-xl text-xs text-[#062C22] focus:outline-none focus:ring-2 focus:ring-[#176B52]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Travel & Passport Details */}
        <div className="space-y-4 pt-4 border-t border-stone-100">
          <h3 className="font-serif font-bold text-base text-[#062C22]">Travel & Stay Preferences</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Passport Number (For National Parks & Train Tickets)</label>
              <input
                type="text"
                value={passportNumber}
                onChange={(e) => setPassportNumber(e.target.value)}
                placeholder="e.g. GB98821458"
                className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-[#062C22] uppercase focus:outline-none focus:ring-2 focus:ring-[#176B52]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Dietary Preferences & Allergies</label>
              <input
                type="text"
                value={dietaryPreferences}
                onChange={(e) => setDietaryPreferences(e.target.value)}
                placeholder="e.g. Vegetarian, Nut Allergy, Halal"
                className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-[#062C22] focus:outline-none focus:ring-2 focus:ring-[#176B52]"
              />
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="space-y-4 pt-4 border-t border-stone-100">
          <h3 className="font-serif font-bold text-base text-[#062C22]">Emergency Contact</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Emergency Contact Person Name</label>
              <input
                type="text"
                value={emergencyName}
                onChange={(e) => setEmergencyName(e.target.value)}
                placeholder="e.g. Mark Jenkins (Spouse)"
                className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-[#062C22] focus:outline-none focus:ring-2 focus:ring-[#176B52]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Emergency Contact Phone</label>
              <input
                type="tel"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                placeholder="+44 7700 900088"
                className="w-full bg-[#F8F7F2] border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-[#062C22] focus:outline-none focus:ring-2 focus:ring-[#176B52]"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-stone-100 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0B3D2E] text-white hover:bg-[#134E3F] font-bold text-xs rounded-xl shadow-md transition-all"
          >
            <Save className="w-4 h-4 text-[#39A982]" />
            <span>Save Profile Settings</span>
          </button>
        </div>

      </form>
    </div>
  );
};
