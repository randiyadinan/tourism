import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Compass, 
  Mail, 
  ArrowLeft, 
  CheckCircle2, 
  ArrowRight,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  RefreshCw,
  AlertCircle,
  Timer,
  ShieldCheck
} from 'lucide-react';
import { authService } from '../../services/authService';

type Step = 'REQUEST' | 'VERIFY_OTP' | 'NEW_PASSWORD' | 'SUCCESS';

export const ForgotPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>('REQUEST');
  const [email, setEmail] = useState(searchParams.get('email') || '');
  
  // 6-digit OTP state
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Password fields
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status & Timers
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(600); // 10 mins
  const [cooldown, setCooldown] = useState<number>(0); // 30s resend cooldown

  // Focus OTP box on step transition
  useEffect(() => {
    if (step === 'VERIFY_OTP' && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [step]);

  // Expiry countdown timer (10 mins)
  useEffect(() => {
    let timer: any;
    if (step === 'VERIFY_OTP' || step === 'NEW_PASSWORD') {
      timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step]);

  // Resend cooldown timer (30s)
  useEffect(() => {
    let cdTimer: any;
    if (cooldown > 0) {
      cdTimer = setInterval(() => {
        setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(cdTimer);
  }, [cooldown]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // STEP 1: Request Password Reset Code
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await authService.requestPasswordReset(email.trim());
      if (res.success) {
        setStep('VERIFY_OTP');
        setTimeLeft(600);
        setCooldown(30);
        setSuccessMsg(res.message || 'A 6-digit verification code has been sent to your email.');
      } else {
        setError(res.error || 'Failed to process request. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // OTP Input Handler
  const handleOtpChange = (index: number, value: string) => {
    const cleanVal = value.replace(/[^0-9]/g, '');
    
    if (cleanVal.length > 1) {
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

    if (cleanVal && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // STEP 2: Verify 6-digit OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = otp.join('');
    if (fullCode.length !== 6) {
      setError('Please enter all 6 digits of the verification code.');
      return;
    }

    if (timeLeft <= 0) {
      setError('The verification code has expired. Please request a new code.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await authService.verifyPasswordResetOtp(email.trim(), fullCode);
      if (res.success) {
        setStep('NEW_PASSWORD');
        setSuccessMsg('Code verified! Please enter your new password.');
      } else {
        setError(res.error || 'Invalid verification code. Please check and try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to verify reset code.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP Code
  const handleResendOtp = async () => {
    if (cooldown > 0 || loading) return;
    setLoading(true);
    setError(null);

    try {
      const res = await authService.requestPasswordReset(email.trim());
      if (res.success) {
        setOtp(['', '', '', '', '', '']);
        setTimeLeft(600);
        setCooldown(30);
        setSuccessMsg('A new 6-digit code has been sent to your email.');
        inputRefs.current[0]?.focus();
      } else {
        setError(res.error || 'Failed to resend code.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to resend reset code.');
    } finally {
      setLoading(false);
    }
  };

  // STEP 3: Submit New Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = otp.join('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please ensure both fields are identical.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await authService.resetPassword(email.trim(), fullCode, newPassword);
      if (res.success) {
        setStep('SUCCESS');
      } else {
        setError(res.error || 'Failed to reset password. The code may have expired or been used.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#F8F7F2] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-stone-200 shadow-xl relative overflow-hidden">
        
        {/* Top Branding */}
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
          
          <h2 className="font-serif text-2xl font-bold text-[#062C22]">
            {step === 'REQUEST' && 'Reset Your Password'}
            {step === 'VERIFY_OTP' && 'Enter Verification Code'}
            {step === 'NEW_PASSWORD' && 'Create New Password'}
            {step === 'SUCCESS' && 'Password Reset Complete'}
          </h2>
          
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            {step === 'REQUEST' && 'Enter your registered email address to receive a secure 6-digit verification code.'}
            {step === 'VERIFY_OTP' && `We sent a 6-digit code to ${email}. Please enter it below:`}
            {step === 'NEW_PASSWORD' && 'Enter a secure new password for your LankaVoyage traveler account.'}
            {step === 'SUCCESS' && 'Your password has been successfully updated. You can now sign in with your new credentials.'}
          </p>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs text-rose-800 animate-scale-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Global Success Banner */}
        {successMsg && step !== 'SUCCESS' && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-800 animate-scale-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{successMsg}</span>
          </div>
        )}

        {/* ─── STEP 1: REQUEST RESET ─────────────────────────── */}
        {step === 'REQUEST' && (
          <form onSubmit={handleRequestReset} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Registered Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sarah.traveler@example.com"
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F8F7F2] border border-stone-300 rounded-xl text-xs text-[#062C22] focus:outline-none focus:ring-2 focus:ring-[#176B52] disabled:opacity-50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#0B3D2E] text-white hover:bg-[#134E3F] font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#39A982]" />
                  <span>Sending Verification Code...</span>
                </>
              ) : (
                <>
                  <span>Send 6-Digit Code</span>
                  <ArrowRight className="w-4 h-4 text-[#39A982]" />
                </>
              )}
            </button>
          </form>
        )}

        {/* ─── STEP 2: VERIFY OTP ────────────────────────────── */}
        {step === 'VERIFY_OTP' && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            
            {/* 6-Digit OTP Boxes */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 block text-center">
                6-Digit Verification Code
              </label>
              <div className="flex justify-between gap-1.5 sm:gap-2">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => { inputRefs.current[idx] = el; }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    disabled={loading}
                    className="w-10 h-12 sm:w-12 sm:h-14 text-center font-mono text-lg sm:text-xl font-bold bg-[#F8F7F2] border-2 border-stone-300 rounded-xl text-[#062C22] focus:border-[#176B52] focus:bg-white focus:outline-none transition-all shadow-xs"
                  />
                ))}
              </div>
            </div>

            {/* Timer & Expiry Display */}
            <div className="flex items-center justify-between text-xs text-stone-500 bg-[#F8F7F2] p-3 rounded-xl border border-stone-200">
              <div className="flex items-center gap-1.5">
                <Timer className="w-3.5 h-3.5 text-stone-400" />
                <span>Code expires in:</span>
              </div>
              <span className={`font-mono font-bold ${timeLeft < 60 ? 'text-rose-600 animate-pulse' : 'text-[#062C22]'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>

            <button
              type="submit"
              disabled={loading || otp.join('').length !== 6 || timeLeft <= 0}
              className="w-full py-3.5 bg-[#0B3D2E] text-white hover:bg-[#134E3F] font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#39A982]" />
                  <span>Verifying Code...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-[#39A982]" />
                  <span>Verify Code & Continue</span>
                </>
              )}
            </button>

            {/* Resend Action */}
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={cooldown > 0 || loading}
                className="text-xs text-stone-600 hover:text-[#0B3D2E] font-bold inline-flex items-center gap-1.5 disabled:opacity-40 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>
                  {cooldown > 0 ? `Resend Code (${cooldown}s)` : 'Didn’t receive code? Resend'}
                </span>
              </button>
            </div>
          </form>
        )}

        {/* ─── STEP 3: NEW PASSWORD ──────────────────────────── */}
        {step === 'NEW_PASSWORD' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  disabled={loading}
                  className="w-full pl-10 pr-10 py-2.5 bg-[#F8F7F2] border border-stone-300 rounded-xl text-xs text-[#062C22] focus:outline-none focus:ring-2 focus:ring-[#176B52] disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Confirm New Password</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your new password"
                  disabled={loading}
                  className="w-full pl-10 pr-10 py-2.5 bg-[#F8F7F2] border border-stone-300 rounded-xl text-xs text-[#062C22] focus:outline-none focus:ring-2 focus:ring-[#176B52] disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !newPassword || !confirmPassword}
              className="w-full py-3.5 bg-[#0B3D2E] text-white hover:bg-[#134E3F] font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#39A982]" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <>
                  <span>Save New Password</span>
                  <ArrowRight className="w-4 h-4 text-[#39A982]" />
                </>
              )}
            </button>
          </form>
        )}

        {/* ─── STEP 4: SUCCESS ───────────────────────────────── */}
        {step === 'SUCCESS' && (
          <div className="bg-[#F8F7F2] p-6 rounded-2xl border border-emerald-300 text-center space-y-4 animate-scale-in">
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            
            <div className="space-y-1">
              <h4 className="font-serif text-lg font-bold text-[#062C22]">Password Changed Successfully!</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Your password has been securely updated. You can now log into your account with your new credentials.
              </p>
            </div>

            <button
              onClick={() => navigate('/login', { state: { email } })}
              className="w-full py-3 bg-[#0B3D2E] text-white hover:bg-[#134E3F] text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Sign In Now</span>
              <ArrowRight className="w-4 h-4 text-[#39A982]" />
            </button>
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="pt-2 text-center border-t border-stone-100">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-[#0B3D2E]">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </Link>
        </div>

      </div>
    </div>
  );
};
