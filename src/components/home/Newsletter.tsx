import React, { useState } from 'react';
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react';

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
    <section className="py-14 sm:py-16 bg-[#1F6F54] text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        
        <span className="text-xs font-semibold uppercase tracking-wider text-stone-200">
          Stay Inspired
        </span>

        <h2 className="font-serif text-2xl sm:text-3xl font-bold">
          Get Seasonal Sri Lanka Travel Inspiration
        </h2>

        <p className="text-xs sm:text-sm text-stone-100 max-w-lg mx-auto leading-relaxed">
          Receive occasional destination guides, wildlife sighting updates, and bespoke holiday ideas.
        </p>

        {subscribed ? (
          <div className="bg-[#12372A] border border-white/20 p-3.5 rounded-xl max-w-md mx-auto flex items-center justify-center gap-2 text-white text-xs sm:text-sm font-medium">
            <CheckCircle2 className="w-4 h-4 text-[#C8A45D]" />
            <span>Thank you for subscribing to LankaVoyage updates!</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2 pt-2">
            <div className="relative flex-1">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-white text-[#1F2933] placeholder-stone-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#12372A]"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#12372A] hover:bg-[#174837] text-white font-semibold text-xs sm:text-sm rounded-lg transition-colors flex items-center justify-center gap-1.5 shrink-0 shadow-xs"
            >
              <span>Subscribe</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C8A45D]" />
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
