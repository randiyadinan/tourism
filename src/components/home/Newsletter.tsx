import React, { useState } from 'react';
import { Mail, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section className="py-16 sm:py-20 bg-[#0B3D2E] text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#DDEFE8] text-xs font-semibold uppercase tracking-wider border border-white/15">
          <Sparkles className="w-3.5 h-3.5 text-[#39A982]" />
          <span>Curated Ceylon Dispatch</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl font-bold">
          Receive Seasonal Sri Lanka Travel Inspiration
        </h2>

        <p className="text-sm sm:text-base text-stone-200 max-w-lg mx-auto leading-relaxed">
          Get occasional insider destination guides, wildlife migration updates, and bespoke holiday ideas.
        </p>

        {subscribed ? (
          <div className="bg-[#062C22] border border-white/20 p-4 rounded-2xl max-w-md mx-auto flex items-center justify-center gap-2 text-white text-sm font-medium">
            <CheckCircle2 className="w-4 h-4 text-[#39A982]" />
            <span>Thank you for subscribing to LankaVoyage dispatches.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2.5 pt-2">
            <div className="relative flex-1">
              <Mail className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white text-[#17231F] placeholder-stone-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#176B52] shadow-xs"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-[#176B52] hover:bg-[#062C22] text-white font-semibold text-xs sm:text-sm rounded-2xl transition-colors flex items-center justify-center gap-1.5 shrink-0 shadow-sm border border-white/10"
            >
              <span>Subscribe</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#DDEFE8]" />
            </button>
          </form>
        )}

        <p className="text-[11px] text-stone-300">
          We respect your privacy. Unsubscribe at any time with one click.
        </p>
      </div>
    </section>
  );
};
