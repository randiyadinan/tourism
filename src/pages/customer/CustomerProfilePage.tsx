import React, { useState } from 'react';
import { 
  Save, 
  CheckCircle2, 
  ShieldCheck, 
  Mail, 
  Phone, 
  User as UserIcon,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CountrySelect } from '../../components/common/CountrySelect';

export const CustomerProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [country, setCountry] = useState(user?.country || 'Sri Lanka');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await updateProfile({
      name,
      phone,
      country
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
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#062C22]">My Profile</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Verified Account
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">Manage your personal details and contact information.</p>
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

      {/* Basic Profile Form */}
      <form onSubmit={handleSave} className="space-y-6 text-xs max-w-xl">
        
        {/* Name */}
        <div className="space-y-1.5">
          <label className="font-bold text-stone-700 flex items-center gap-1.5">
            <UserIcon className="w-3.5 h-3.5 text-[#176B52]" />
            Full Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[#F8F7F2] border border-stone-300 rounded-xl font-medium text-[#062C22]"
          />
        </div>

        {/* Email (Read-only) */}
        <div className="space-y-1.5">
          <label className="font-bold text-stone-700 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-[#176B52]" />
            Email Address
          </label>
          <input
            type="email"
            disabled
            value={email}
            className="w-full px-3.5 py-2.5 bg-stone-100 border border-stone-200 rounded-xl font-medium text-stone-500 cursor-not-allowed"
          />
          <span className="text-[10px] text-stone-400">Account login email cannot be changed.</span>
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <label className="font-bold text-stone-700 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-[#176B52]" />
            Phone Number / WhatsApp
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. +94 77 123 4567"
            className="w-full px-3.5 py-2.5 bg-[#F8F7F2] border border-stone-300 rounded-xl font-medium text-[#062C22]"
          />
        </div>

        {/* Country */}
        <CountrySelect
          label="Country of Residence"
          value={country}
          onChange={(c) => setCountry(c)}
          placeholder="Select your country..."
        />

        <div className="pt-4 border-t border-stone-100 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0B3D2E] hover:bg-[#176B52] text-white font-bold text-xs rounded-xl shadow-sm transition-all"
          >
            <Save className="w-4 h-4 text-[#39A982]" />
            <span>Save Profile</span>
          </button>
        </div>

      </form>

    </div>
  );
};
