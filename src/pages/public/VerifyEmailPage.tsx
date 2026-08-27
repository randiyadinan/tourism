import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Compass, 
  Mail, 
  ArrowRight, 
  RefreshCw,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { authService } from '../../services/authService';

export const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const emailParam = searchParams.get('email');

  const [status, setStatus] = useState<'verifying' | 'success' | 'expired' | 'invalid'>('verifying');
  const [message, setMessage] = useState<string>('Verifying your email address...');
  const [resendEmail, setResendEmail] = useState<string>(emailParam || '');
  const [resending, setResending] = useState<boolean>(false);
  const [resendSuccess, setResendSuccess] = useState<string | null>(null);
  const [resendError, setResendError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setStatus('invalid');
      setMessage('No verification token was provided in the link.');
      return;
    }

    let isMounted = true;
    authService.verifyEmail(token, emailParam || undefined)
      .then((res) => {
        if (!isMounted) return;
        if (res.success) {
          setStatus('success');
          setMessage(res.message || 'Your email address has been verified successfully!');
        } else {
          if (res.error?.toLowerCase().includes('expired')) {
            setStatus('expired');
            setMessage('Your email verification token has expired. Please request a fresh link below.');
          } else {
            setStatus('invalid');
            setMessage(res.message || res.error || 'This verification link is invalid or has already been used.');
          }
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setStatus('invalid');
        setMessage('An unexpected error occurred during verification. Please try again.');
      });

    return () => {
      isMounted = false;
    };
  }, [token, emailParam]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail.trim()) {
      setResendError('Please enter your email address.');
      return;
    }

    setResending(true);
    setResendSuccess(null);
    setResendError(null);

    const res = await authService.resendVerification(resendEmail.trim());
    setResending(false);

    if (res.success) {
      setResendSuccess(res.message || 'A fresh verification link has been sent to your email!');
    } else {
      setResendError(res.error || 'Failed to send verification email. Please check your address.');
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#F8F7F2] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Ambient background blur lights */}
      <div className="ambient-glow-orb w-96 h-96 bg-[#39A982] top-10 -left-20 opacity-20" />
      <div className="ambient-glow-orb w-96 h-96 bg-[#C5A059] bottom-10 -right-20 opacity-15" />

      <div className="max-w-md w-full relative z-10">
        <div className="liquid-glass-white rounded-3xl border border-white/80 p-8 sm:p-10 shadow-[0_15px_40px_-15px_rgba(6,44,34,0.12)] space-y-6 text-center">
          
          {/* Brand Logo */}
          <div className="flex flex-col items-center gap-2">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-2xl bg-[#39A982] flex items-center justify-center text-white shadow-md">
                <Compass className="w-6 h-6" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-[#062C22]">
                Lanka<span className="text-[#39A982]">Voyage</span>
              </span>
            </Link>
          </div>

          {/* 1. VERIFYING STATE */}
          {status === 'verifying' && (
            <div className="space-y-4 py-6">
              <div className="w-16 h-16 rounded-3xl bg-[#DDEFE8] text-[#176B52] flex items-center justify-center mx-auto border border-[#39A982]/30 shadow-sm animate-pulse">
                <RefreshCw className="w-8 h-8 animate-spin text-[#176B52]" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#062C22]">Verifying Email</h2>
              <p className="text-xs text-stone-600 leading-relaxed">
                Please wait while we confirm your single-use security token with the server...
              </p>
            </div>
          )}

          {/* 2. SUCCESS STATE */}
          {status === 'success' && (
            <div className="space-y-5 py-4 animate-scale-in">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-300 shadow-sm">
                <CheckCircle2 className="w-9 h-9 text-emerald-600" />
              </div>
              
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold uppercase tracking-wider border border-emerald-200">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  Email Verified
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#062C22]">
                  Verification Complete!
                </h2>
                <p className="text-xs text-stone-600 leading-relaxed max-w-sm mx-auto">
                  {message}
                </p>
              </div>

              <div className="pt-2">
                <Link
                  to="/login"
                  className="glass-btn-primary w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl text-white font-bold text-xs shadow-md"
                >
                  <span>Sign In to Your Account</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}

          {/* 3. EXPIRED TOKEN STATE */}
          {status === 'expired' && (
            <div className="space-y-5 py-4 animate-scale-in">
              <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto border border-amber-300 shadow-sm">
                <Clock className="w-9 h-9 text-amber-700" />
              </div>

              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-[11px] font-bold uppercase tracking-wider border border-amber-200">
                  Token Expired
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#062C22]">
                  Verification Link Expired
                </h2>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Security tokens expire after 24 hours. Enter your email below to receive a new link.
                </p>
              </div>

              {/* Resend Form */}
              <form onSubmit={handleResend} className="space-y-3 pt-2 text-left">
                {resendSuccess && (
                  <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{resendSuccess}</span>
                  </div>
                )}

                {resendError && (
                  <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{resendError}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-700">Account Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={resendEmail}
                      onChange={(e) => setResendEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs text-[#062C22] focus:outline-none focus:border-[#39A982]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={resending}
                  className="glass-btn-primary w-full py-3 rounded-xl text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {resending ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Mail className="w-3.5 h-3.5" />}
                  <span>{resending ? 'Sending Email...' : 'Send New Verification Link'}</span>
                </button>
              </form>
            </div>
          )}

          {/* 4. INVALID TOKEN STATE */}
          {status === 'invalid' && (
            <div className="space-y-5 py-4 animate-scale-in">
              <div className="w-16 h-16 rounded-3xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto border border-rose-300 shadow-sm">
                <XCircle className="w-9 h-9 text-rose-600" />
              </div>

              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 text-[11px] font-bold uppercase tracking-wider border border-rose-200">
                  Invalid Link
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#062C22]">
                  Verification Unsuccessful
                </h2>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {message}
                </p>
              </div>

              {/* Resend Link Section */}
              <form onSubmit={handleResend} className="space-y-3 pt-2 text-left">
                {resendSuccess && (
                  <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{resendSuccess}</span>
                  </div>
                )}

                {resendError && (
                  <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{resendError}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-700">Account Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={resendEmail}
                      onChange={(e) => setResendEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs text-[#062C22] focus:outline-none focus:border-[#39A982]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={resending}
                  className="glass-btn-primary w-full py-3 rounded-xl text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {resending ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Mail className="w-3.5 h-3.5" />}
                  <span>{resending ? 'Sending Email...' : 'Request Fresh Link'}</span>
                </button>
              </form>

              <div className="pt-2 border-t border-stone-200/60">
                <Link
                  to="/login"
                  className="text-xs text-[#176B52] hover:text-[#0B3D2E] font-bold inline-flex items-center gap-1"
                >
                  <span>Return to Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
