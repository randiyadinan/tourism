import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Mail, ArrowLeft, CheckCircle2, ArrowRight } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSent(true);
    }
  };

  return (
    <div className="min-h-[80vh] bg-[#FAF8F5] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-stone-200 shadow-xl">
        
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
          <h2 className="font-serif text-2xl font-bold text-[#082F24]">Reset Your Password</h2>
          <p className="text-xs text-stone-500">Enter your registered email address and we will send you a secure reset link.</p>
        </div>

        {sent ? (
          <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-emerald-300 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="font-serif text-lg font-bold text-[#082F24]">Password Reset Sent</h4>
            <p className="text-xs text-stone-600">
              We’ve sent instructions to <strong>{email}</strong>. Please check your inbox.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#0D3B2E] text-white text-xs font-bold rounded-xl"
            >
              Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sarah@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-stone-300 rounded-xl text-xs text-[#082F24] focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#0D3B2E] text-white hover:bg-[#134E3F] font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>Send Recovery Link</span>
              <ArrowRight className="w-4 h-4 text-[#E5C378]" />
            </button>
          </form>
        )}

        <div className="pt-2 text-center">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-[#0D3B2E]">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Sign In
          </Link>
        </div>

      </div>
    </div>
  );
};
