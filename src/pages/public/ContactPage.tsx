import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import { SOCIAL_LINKS } from '../../config/socialLinks';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Custom Tour Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
  };

  const faqs = [
    {
      q: 'How far in advance should I book my Sri Lanka trip?',
      a: 'We recommend booking 2 to 4 months in advance, especially for high season (December through April) to secure the finest boutique coastal villas and scenic blue train observation tickets.'
    },
    {
      q: 'Are your chauffeur-guides licensed by the government?',
      a: 'Yes, 100% of our chauffeur-guides are certified by the Sri Lanka Tourism Development Authority (SLTDA) with verified tourist transport and cultural lecturer licenses.'
    },
    {
      q: 'What is your cancellation and refund policy?',
      a: 'We offer full refunds up to 30 days prior to arrival and flexible date rescheduling with zero penalty fees.'
    },
    {
      q: 'Do you provide airport meet and greet?',
      a: 'Yes, our representative meets you at the Colombo (CMB) / Mattala (HRI) Arrivals exit gate with private transport.'
    }
  ];

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="bg-[#F6F1E7] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#0B7A75] border border-stone-200 text-xs font-semibold uppercase tracking-wider shadow-2xs">
            <span>ISLAND CONCIERGE</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#173238]">
            Get in Touch with Our Team
          </h1>
          <p className="text-sm sm:text-base text-[#68736E] leading-relaxed">
            Have questions about tailor-made routes, private chauffeur rates, or boutique hotel bookings? Our Colombo travel team is here to assist 24/7.
          </p>
        </div>

        {/* 2-Column Grid: Contact Information & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-start">
          
          {/* Left: Contact Info Cards (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="bg-[#FCFEFD]/85 backdrop-blur-xl p-7 rounded-3xl border border-white/80 shadow-[0_4px_20px_-4px_rgba(7,94,99,0.06)] space-y-4">
              <h2 className="font-serif text-xl font-bold text-[#173238]">Direct Channels</h2>

              <div className="space-y-3 text-xs sm:text-sm text-[#68736E]">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#075E63] text-[#DDF5F0] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-[#173238] block">Headquarters</span>
                    <p>Level 14, World Trade Center, Echelon Square, Colombo 01, Sri Lanka</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#075E63] text-[#DDF5F0] flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-[#173238] block">Direct Phone</span>
                    <a href="tel:+94771234567" className="hover:text-[#0B7A75] transition-colors">+94 77 123 4567</a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#075E63] text-[#DDF5F0] flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-[#173238] block">Concierge Email</span>
                    <a href="mailto:concierge@lankavoyage.com" className="hover:text-[#0B7A75] transition-colors">concierge@lankavoyage.com</a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#075E63] text-[#DDF5F0] flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-[#173238] block">Support Hours</span>
                    <p>24 Hours / 7 Days Islandwide</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick WhatsApp Card in Deep Ocean Teal */}
            <div className="bg-[#075E63] text-white p-7 rounded-3xl shadow-md space-y-3 border border-white/10">
              <h3 className="font-serif text-lg font-bold">Prefer Instant Messaging?</h3>
              <p className="text-xs text-stone-200 leading-relaxed">
                Connect directly with our senior travel planner on WhatsApp for fast questions and route suggestions.
              </p>
              {SOCIAL_LINKS.whatsapp?.url ? (
                <a
                  href={SOCIAL_LINKS.whatsapp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#25D366] text-white font-semibold text-xs rounded-xl hover:bg-[#20bd5a] transition-colors shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Chat on WhatsApp</span>
                </a>
              ) : null}
            </div>

          </div>

          {/* Right: Message Form (7 Cols) */}
          <div className="lg:col-span-7 bg-[#FCFEFD]/85 backdrop-blur-xl p-7 sm:p-9 rounded-3xl border border-white/80 shadow-[0_4px_20px_-4px_rgba(7,94,99,0.06)] space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#173238]">Send an Inquiry</h2>
              <p className="text-xs text-[#68736E] mt-1">We typically reply within 2 to 4 hours.</p>
            </div>

            {submitted ? (
              <div className="p-8 text-center bg-[#DDF5F0]/60 rounded-2xl border border-[#0B7A75]/30 space-y-3">
                <CheckCircle2 className="w-10 h-10 text-[#0B7A75] mx-auto" />
                <h3 className="font-serif text-xl font-bold text-[#173238]">Inquiry Received</h3>
                <p className="text-xs text-[#68736E] max-w-md mx-auto">
                  Thank you for contacting LankaVoyage. A dedicated travel designer has received your message and will get back to you promptly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-2 text-xs font-semibold text-[#0B7A75] hover:underline"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-[#173238]">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Eleanor Vance"
                      className="w-full bg-[#F6F1E7] border border-stone-300 rounded-xl p-3 font-medium text-[#173238] focus:outline-none focus:ring-2 focus:ring-[#0B7A75]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-[#173238]">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. eleanor@example.com"
                      className="w-full bg-[#F6F1E7] border border-stone-300 rounded-xl p-3 font-medium text-[#173238] focus:outline-none focus:ring-2 focus:ring-[#0B7A75]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-[#173238]">Phone / WhatsApp</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +44 7911 123456"
                      className="w-full bg-[#F6F1E7] border border-stone-300 rounded-xl p-3 font-medium text-[#173238] focus:outline-none focus:ring-2 focus:ring-[#0B7A75]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-[#173238]">Inquiry Topic</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-[#F6F1E7] border border-stone-300 rounded-xl p-3 font-medium text-[#173238] focus:outline-none focus:ring-2 focus:ring-[#0B7A75]"
                    >
                      <option value="Custom Tour Inquiry">Bespoke Tour Planning</option>
                      <option value="Airport Transfer Booking">Airport Transfer Booking</option>
                      <option value="Chauffeur Only Service">Chauffeur & Vehicle Hire</option>
                      <option value="Existing Booking Inquiry">Existing Booking Question</option>
                      <option value="Other">Other Question</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#173238]">Your Message / Travel Vision *</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your estimated dates, group size, preferred destinations, or interests..."
                    className="w-full bg-[#F6F1E7] border border-stone-300 rounded-xl p-3 font-medium text-[#173238] focus:outline-none focus:ring-2 focus:ring-[#0B7A75]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#0B7A75] hover:bg-[#075E63] text-white font-semibold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm border border-white/20"
                >
                  <Send className="w-4 h-4 text-[#DDF5F0]" />
                  <span>Send Message to Concierge</span>
                </button>

              </form>
            )}

          </div>

        </div>

        {/* FAQs */}
        <div className="bg-[#FCFEFD]/85 backdrop-blur-xl rounded-3xl p-7 sm:p-9 border border-white/80 shadow-[0_4px_20px_-4px_rgba(7,94,99,0.06)] space-y-4 max-w-4xl mx-auto">
          <h2 className="font-serif text-2xl font-bold text-[#173238] text-center">Frequently Asked Questions</h2>

          <div className="divide-y divide-stone-100">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="py-3.5">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="flex items-center justify-between w-full text-left font-semibold text-xs sm:text-sm text-[#173238] hover:text-[#0B7A75] transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-[#0B7A75] shrink-0" />
                      {faq.q}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <p className="pt-2 text-xs sm:text-sm text-[#68736E] leading-relaxed pl-6">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
