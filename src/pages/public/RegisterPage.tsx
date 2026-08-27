import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Compass, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  ArrowRight, 
  AlertCircle, 
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CountrySelect } from '../../components/common/CountrySelect';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('United Kingdom');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();

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
      // Redirect directly to /verify-email with the email populated
      navigate(`/verify-email?email=${encodeURIComponent(email.trim().toLowerCase())}`);
    } else {
      setError(res.error || 'Failed to create account');
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#F8F7F2] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="ambient-glow-orb w-96 h-96 bg-[#39A982] top-10 -left-20 opacity-20" />
      <div className="ambient-glow-orb w-96 h-96 bg-[#C5A059] bottom-10 -right-20 opacity-15" />
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-stone-200 shadow-xl">
        
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#39A982] to-[#176B52] p-0.5 flex items-center justify-center">
              <div className="w-full h-full bg-[#062C22] rounded-[10px] flex items-center justify-center">
                <Compass className="w-5 h-5 text-[#39A982]" />
              </div>
            </div>
            <span className="font-serif text-2xl font-bold tracking-wider text-[#062C22]">
              Lanka<span className="text-[#176B52]">Voyage</span>
            </span>
          </Link>
          <h2 className="font-serif text-2xl font-bold text-[#062C22]">Create Traveler Account</h2>
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
                className="w-full pl-10 pr-4 py-2.5 bg-[#F8F7F2] border border-stone-300 rounded-xl text-xs text-[#062C22] focus:outline-none focus:ring-2 focus:ring-[#176B52]"
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
                className="w-full pl-10 pr-4 py-2.5 bg-[#F8F7F2] border border-stone-300 rounded-xl text-xs text-[#062C22] focus:outline-none focus:ring-2 focus:ring-[#176B52]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <CountrySelect
              label="Country"
              value={country}
              onChange={(c) => setCountry(c)}
              placeholder="Select your country..."
            />

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Phone / WhatsApp</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+49 170 123456"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F8F7F2] border border-stone-300 rounded-xl text-xs text-[#062C22] focus:outline-none focus:ring-2 focus:ring-[#176B52]"
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
                className="w-full pl-10 pr-4 py-2.5 bg-[#F8F7F2] border border-stone-300 rounded-xl text-xs text-[#062C22] focus:outline-none focus:ring-2 focus:ring-[#176B52]"
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
                className="w-full pl-10 pr-4 py-2.5 bg-[#F8F7F2] border border-stone-300 rounded-xl text-xs text-[#062C22] focus:outline-none focus:ring-2 focus:ring-[#176B52]"
              />
            </div>
          </div>

          <div className="p-3 bg-[#F8F7F2] rounded-xl border border-stone-200 text-[11px] text-stone-500 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#0B3D2E] shrink-0" />
            <span>Account will be assigned standard Verified Traveler privileges.</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#0B3D2E] text-white hover:bg-[#134E3F] font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Creating Account...' : 'Register as Traveler'}</span>
            <ArrowRight className="w-4 h-4 text-[#39A982]" />
          </button>
        </form>

        <p className="text-center text-xs text-stone-500">
          Already registered?{' '}
          <Link to="/login" className="text-[#0B3D2E] font-bold hover:underline">
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
};

