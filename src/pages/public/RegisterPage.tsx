import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Mail, Lock, User, Phone, Globe, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('United Kingdom');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter your password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    const res = await register(name, email, password, phone, country);
    setLoading(false);

    if (res.success) {
      navigate('/customer');
    } else {
      setError(res.error || 'Failed to create account');
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#FAF8F5] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-stone-200 shadow-xl">
        
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E5C378] to-[#C5A059] p-0.5 flex items-center justify-center">
              <div className="w-full h-full bg-[#082F24] rounded-[10px] flex items-center justify-center">
                <Compass className="w-5 h-5 text-[#E5C378]" />
              </div>
            </div>
            <span className="font-serif text-2xl font-bold tracking-wider text-[#082F24]">
              Lanka<span className="text-[#8C6D2B]">Voyage</span>
            </span>
          </Link>
          <h2 className="font-serif text-2xl font-bold text-[#082F24]">Create Traveler Account</h2>
          <p className="text-xs text-stone-500">Register as a traveler to save bespoke trips, access digital vouchers, and manage bookings.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700">Full Legal Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. David Miller"
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-stone-300 rounded-xl text-xs text-[#082F24] focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="david@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-stone-300 rounded-xl text-xs text-[#082F24] focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Country</label>
              <div className="relative">
                <Globe className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. Germany"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-stone-300 rounded-xl text-xs text-[#082F24] focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
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
                  placeholder="+49 170 123456"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-stone-300 rounded-xl text-xs text-[#082F24] focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700">Create Password (min 6 characters)</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-stone-300 rounded-xl text-xs text-[#082F24] focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700">Confirm Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-stone-300 rounded-xl text-xs text-[#082F24] focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
              />
            </div>
          </div>

          <div className="p-3 bg-[#FAF8F5] rounded-xl border border-stone-200 text-[11px] text-stone-500 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#0D3B2E] shrink-0" />
            <span>Account will be assigned standard Verified Traveler privileges.</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#0D3B2E] text-white hover:bg-[#134E3F] font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Creating Account...' : 'Register as Traveler'}</span>
            <ArrowRight className="w-4 h-4 text-[#E5C378]" />
          </button>
        </form>

        <p className="text-center text-xs text-stone-500">
          Already registered?{' '}
          <Link to="/login" className="text-[#0D3B2E] font-bold hover:underline">
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
};

