import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  Compass, 
  Mail, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ArrowRight, 
  Sparkles,
  ShieldCheck,
  Timer
} from 'lucide-react';
import { authService } from '../../services/authService';

export const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const emailParam = searchParams.get('email') || '';
  const [email, setEmail] = useState<string>(emailParam);
  
  // 6-digit OTP code inputs state
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Resend state & 10-minute expiry countdown
  const [resending, setResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(600); // 10 minutes (600s)
  const [cooldown, setCooldown] = useState<number>(0);

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Sync email from search params if updated
  useEffect(() => {
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [emailParam]);

  // Expiry countdown timer (10 mins)
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Resend cooldown timer (30s)
  useEffect(() => {
    if (cooldown > 0) {
      const cdTimer = setInterval(() => {
        setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(cdTimer);
    }
  }, [cooldown]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (index: number, value: string) => {
    // Only accept numeric characters
    const cleanVal = value.replace(/[^0-9]/g, '');
    
    if (cleanVal.length > 1) {
      // Handle pasting whole 6-digit code
      const pasted = cleanVal.slice(0, 6).split('');
      const newOtp = [...otp];
      pasted.forEach((char, i) => {
        newOtp[i] = char;
      });
      setOtp(newOtp);
      const nextFocus = Math.min(pasted.length, 5);
      inputRefs.current[nextFocus]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = cleanVal;
    setOtp(newOtp);
    setError(null);

    // Auto-advance to next input
    if (cleanVal && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (pastedData) {
      const newOtp = [...otp];
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pastedData[i] || '';
      }
      setOtp(newOtp);
      const nextIndex = Math.min(pastedData.length, 5);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const code = otp.join('');
    if (!email.trim()) {
      setError('Please provide your account email address.');
      return;
    }

    if (code.length !== 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    setLoading(true);
    const res = await authService.verifyEmail(email.trim(), code);
    setLoading(false);

    if (res.success) {
      setSuccess('Email successfully verified! Redirecting to login...');
      setTimeout(() => {
        navigate('/login', { state: { verified: true, email: email.trim() } });
      }, 1500);
    } else {
      setError(res.error || res.message || 'Invalid verification code. Please try again.');
    }
  };

  const handleResend = async () => {
    if (!email.trim() || cooldown > 0 || resending) return;

    setResending(true);
    setResendStatus(null);
    setError(null);

    const res = await authService.resendVerification(email.trim());
    setResending(false);

    if (res.success) {
      setResendStatus(res.message || 'A new 6-digit code has been sent to your email.');
      setCooldown(30);
      setTimeLeft(600); // Reset 10-minute expiry countdown
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } else {
      setError(res.error || 'Failed to resend verification code. Please try again.');
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#F8F7F2] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient background glow effects */}
      <div className="ambient-glow-orb w-96 h-96 bg-[#39A982] top-10 -left-20 opacity-20" />
      <div className="ambient-glow-orb w-96 h-96 bg-[#C5A059] bottom-10 -right-20 opacity-15" />

      <div className="max-w-md w-full relative z-10">
        <div className="liquid-glass-white rounded-3xl border border-white/80 p-8 sm:p-10 shadow-[0_15px_40px_-15px_rgba(6,44,34,0.12)] space-y-6 text-center">
          
          {/* Brand Header */}
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

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DDEFE8] text-[#0B3D2E] text-[11px] font-bold uppercase tracking-wider border border-[#39A982]/30">
              <ShieldCheck className="w-3.5 h-3.5 text-[#176B52]" />
              Account Security
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#062C22]">
              Verify Your Email
            </h1>
            <p className="text-xs text-stone-600 leading-relaxed max-w-sm mx-auto">
              We have sent a 6-digit verification code to
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-[#062C22] shadow-sm">
              <Mail className="w-3.5 h-3.5 text-[#39A982]" />
              <span>{email || 'your email address'}</span>
            </div>
          </div>

          {/* Success Banner */}
          {success && (
            <div className="p-4 bg-emerald-50 text-emerald-800 text-xs rounded-2xl border border-emerald-200 flex items-center gap-2 text-left animate-scale-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="font-medium">{success}</span>
            </div>
          )}

          {/* Resend Status Banner */}
          {resendStatus && (
            <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-2xl border border-emerald-200 flex items-center gap-2 text-left animate-scale-in">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{resendStatus}</span>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="p-3.5 bg-rose-50 text-rose-700 text-xs rounded-2xl border border-rose-200 flex items-center gap-2 text-left animate-scale-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Verification Code Form */}
          <form onSubmit={handleVerify} className="space-y-6">
            
            {/* If email is missing, show email input field */}
            {!emailParam && (
              <div className="text-left space-y-1.5">
                <label className="text-[11px] font-bold text-stone-700">Account Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs text-[#062C22] focus:outline-none focus:border-[#39A982]"
                  />
                </div>
              </div>
            )}

            {/* 6-Digit Code Inputs */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-stone-700 text-center uppercase tracking-wider">
                Enter 6-Digit Code
              </label>
              <div className="flex justify-center items-center gap-2 sm:gap-2.5" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold font-mono rounded-xl border bg-white shadow-inner transition-all duration-200 focus:outline-none ${
                      digit 
                        ? 'border-[#39A982] text-[#062C22] bg-[#F4F8F6] ring-2 ring-[#39A982]/20' 
                        : 'border-stone-300 text-[#062C22] focus:border-[#39A982] focus:ring-2 focus:ring-[#39A982]/20'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Expiry Countdown Timer */}
            <div className="flex items-center justify-center gap-1.5 text-xs text-stone-500">
              <Timer className="w-3.5 h-3.5 text-stone-400" />
              <span>
                Code expires in:{' '}
                <strong className={timeLeft < 60 ? 'text-rose-600 font-bold' : 'text-stone-700 font-bold'}>
                  {formatTime(timeLeft)}
                </strong>
              </span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                type="submit"
                disabled={loading || otp.join('').length !== 6}
                className="glass-btn-primary w-full py-3.5 px-6 rounded-2xl text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <span>Verify Email Address</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-xs pt-1 px-1">
                <span className="text-stone-500">Didn't receive code?</span>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending || cooldown > 0}
                  className="font-bold text-[#176B52] hover:text-[#0B3D2E] disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1 transition-colors"
                >
                  {resending ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : null}
                  <span>
                    {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend Code'}
                  </span>
                </button>
              </div>
            </div>
          </form>

          {/* Footer Back Link */}
          <div className="pt-4 border-t border-stone-200/60">
            <Link
              to="/login"
              className="text-xs text-stone-600 hover:text-[#062C22] font-semibold inline-flex items-center gap-1 transition-colors"
            >
              <span>Already verified or want to change email? Sign in</span>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};
