import React, { useState } from 'react';
import { Mail, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

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
    <section className="py-16 bg-[#0D3B2E] text-white relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#E5C378] text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          The LankaVoyage Journal
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl font-bold">
          Unlock Exclusive Sri Lanka Travel Curations & Seasonal Offers
        </h2>

        <p className="text-sm sm:text-base text-stone-200 max-w-xl mx-auto leading-relaxed">
          Join our private circle of luxury travelers. Receive quarterly travel journals, newly opened villa previews, and priority access to seasonal promotional codes.
        </p>

        {subscribed ? (
          <div className="bg-[#134E3F] border border-[#C5A059]/40 p-4 rounded-2xl max-w-md mx-auto flex items-center justify-center gap-2 text-white font-medium text-sm">
            <CheckCircle2 className="w-5 h-5 text-[#E5C378]" />
            <span>Ayubowan! You are now subscribed to LankaVoyage Journal.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Mail className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-[#C5A059] hover:bg-[#E5C378] text-[#082F24] font-bold text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-1.5 shrink-0"
            >
              <span>Subscribe</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <p className="text-[11px] text-stone-400">
          No spam, ever. Unsubscribe anytime with a single click.
        </p>
      </div>
    </section>
  );
};
