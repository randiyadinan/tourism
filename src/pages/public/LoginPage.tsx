import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Compass, 
  Mail, 
  Lock, 
  ArrowRight, 
  UserCheck, 
  ShieldCheck, 
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResendPrompt, setShowResendPrompt] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);
  const [resending, setResending] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/customer';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShowResendPrompt(false);
    setResendStatus(null);
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success && res.user) {
      if (res.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from === '/admin' ? '/customer' : from);
      }
    } else {
      if (res.requiresVerification) {
        setShowResendPrompt(true);
        setError('Please verify your email before signing in.');
      } else {
        setError(res.error || 'Invalid email or password.');
      }
    }
  };

  const handleResendVerification = async () => {
    if (!email) return;
    setResending(true);
    setResendStatus(null);
    const res = await authService.resendVerification(email);
    setResending(false);
    if (res.success) {
      setResendStatus('Verification link re-sent! Please check your email inbox.');
    } else {
      setResendStatus(res.error || 'Failed to resend verification email.');
    }
  };

  const autofillCustomer = () => {
    setEmail('sarah.traveler@example.com');
    setPassword('password123');
    setError('');
  };

  const autofillAdmin = () => {
    setEmail('admin@lankavoyage.com');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="min-h-[85vh] bg-[#F8F7F2] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-stone-200 shadow-xl">
        
        {/* Brand Logo */}
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
          <h2 className="font-serif text-2xl font-bold text-[#062C22]">Sign In</h2>
          <p className="text-xs text-stone-500">Enter your credentials to access your traveler portal or admin suite.</p>
        </div>

        {/* Demo Credentials Helper Box */}
        <div className="bg-[#F8F7F2] p-4 rounded-2xl border border-stone-200 space-y-2.5">
          <span className="text-[10px] font-bold text-[#176B52] uppercase tracking-wider block text-center">
            Demo Credentials (Click to Autofill)
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={autofillCustomer}
              className="p-2.5 bg-white hover:bg-stone-50 border border-stone-200 rounded-xl text-left transition-all"
            >
              <div className="flex items-center gap-1.5 font-bold text-xs text-[#062C22]">
                <UserCheck className="w-3.5 h-3.5 text-[#0B3D2E]" />
                <span>Customer</span>
              </div>
              <p className="text-[10px] text-stone-400 truncate mt-0.5">sarah.traveler@example.com</p>
            </button>

            <button
              type="button"
              onClick={autofillAdmin}
              className="p-2.5 bg-white hover:bg-stone-50 border border-[#176B52]/40 rounded-xl text-left transition-all"
            >
              <div className="flex items-center gap-1.5 font-bold text-xs text-[#062C22]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#176B52]" />
                <span>Administrator</span>
              </div>
              <p className="text-[10px] text-stone-400 truncate mt-0.5">admin@lankavoyage.com</p>
            </button>
          </div>
        </div>

        {/* Standard Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-2xl flex flex-col gap-2 animate-fadeIn">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="font-semibold">{error}</span>
              </div>
              {showResendPrompt && (
                <div className="pt-1 border-t border-rose-200/60 flex items-center justify-between">
                  <span className="text-[11px] text-rose-700">Need a new verification email?</span>
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={resending}
                    className="text-[11px] font-bold text-[#176B52] hover:underline disabled:opacity-50"
                  >
                    {resending ? 'Sending...' : 'Resend Email'}
                  </button>
                </div>
              )}
            </div>
          )}

          {resendStatus && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{resendStatus}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-[#F8F7F2] border border-stone-300 rounded-xl text-xs text-[#062C22] focus:outline-none focus:ring-2 focus:ring-[#176B52]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-700">Password</label>
              <Link to="/forgot-password" className="text-[11px] text-[#176B52] hover:underline font-semibold">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-[#F8F7F2] border border-stone-300 rounded-xl text-xs text-[#062C22] focus:outline-none focus:ring-2 focus:ring-[#176B52]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#0B3D2E] text-white hover:bg-[#134E3F] font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4 text-[#39A982]" />
          </button>
        </form>

        <p className="text-center text-xs text-stone-500">
          Don’t have an account yet?{' '}
          <Link to="/register" className="text-[#0B3D2E] font-bold hover:underline">
            Register as a Traveler
          </Link>
        </p>

      </div>
    </div>
  );
};

