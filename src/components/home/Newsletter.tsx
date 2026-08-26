import React, { useState } from 'react';
import { Mail, CheckCircle2, ArrowRight, Sun } from 'lucide-react';

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
    <section className="py-16 sm:py-20 bg-[#087F8C] text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-[#F3D6A4] text-xs font-semibold uppercase tracking-wider">
          <Sun className="w-3.5 h-3.5" />
          <span>Stay Inspired</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl font-bold">
          Get Sri Lanka Vacation Inspiration & Secret Spots
        </h2>

        <p className="text-sm sm:text-base text-stone-100 max-w-lg mx-auto leading-relaxed">
          Receive seasonal beach guides, wildlife migration updates, and tailor-made holiday ideas.
        </p>

        {subscribed ? (
          <div className="bg-[#075E67] border border-white/20 p-4 rounded-2xl max-w-md mx-auto flex items-center justify-center gap-2 text-white text-sm font-medium">
            <CheckCircle2 className="w-4 h-4 text-[#F3D6A4]" />
            <span>Ayubowan! You're subscribed to LankaVoyage updates.</span>
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
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white text-[#193238] placeholder-stone-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#075E67] shadow-xs"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-[#075E67] hover:bg-[#05484F] text-white font-semibold text-xs sm:text-sm rounded-2xl transition-colors flex items-center justify-center gap-1.5 shrink-0 shadow-sm"
            >
              <span>Subscribe</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#F3D6A4]" />
            </button>
          </form>
        )}

        <p className="text-[11px] text-stone-200">
          We respect your privacy. Unsubscribe at any time with one click.
        </p>
      </div>
    </section>
  );
};
