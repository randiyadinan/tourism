import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle,
  ChevronDown,
  MessageSquare
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
      a: 'We recommend booking 2 to 4 months in advance, especially for high season (December through April) to secure the finest boutique hotel suites and scenic blue train observation tickets.'
    },
    {
      q: 'Are your chauffeur-guides licensed by the government?',
      a: 'Yes, 100% of our chauffeur-guides are certified by the Sri Lanka Tourism Development Authority (SLTDA) with verified defensive driving and cultural lecturer licenses.'
    },
    {
      q: 'What is your cancellation and refund policy?',
      a: 'We offer full refunds up to 30 days prior to arrival and flexible date rescheduling with zero penalty fees.'
    },
    {
      q: 'Do you provide airport meet and greet?',
      a: 'Yes, our representative holds a personalized name tablet at the Colombo (CMB) / Mattala (HRI) Arrivals exit gate with fresh jasmine garlands and chilled refreshments.'
    }
  ];

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0D3B2E]/10 text-[#0D3B2E] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            24/7 Island Concierge
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#082F24]">
            Connect with Our Ceylon Travel Specialists
          </h1>
          <p className="text-sm sm:text-base text-stone-600">
            Have questions about weather, visa procedures, hotel suites, or custom routes? Our local curators are ready to help.
          </p>
        </div>

        {/* 2-Column Contact Info & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Direct Contact & Office Details (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Hotline Card */}
            <div className="bg-[#082F24] text-white p-8 rounded-3xl shadow-xl space-y-6 relative overflow-hidden">
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#E5C378] uppercase tracking-wider">Direct Assistance</span>
                <h3 className="font-serif text-2xl font-bold">24/7 Traveler Helpline</h3>
                <p className="text-xs text-stone-300">Call, WhatsApp, or request an instant bespoke proposal callback.</p>
              </div>

              <div className="space-y-4 text-sm text-stone-200">
                {SOCIAL_LINKS.whatsapp?.url ? (
                  <a 
                    href={SOCIAL_LINKS.whatsapp.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label={SOCIAL_LINKS.whatsapp.ariaLabel}
                    className="flex items-center gap-3 p-3 bg-white/10 hover:bg-[#25D366] hover:text-white rounded-2xl transition-colors font-semibold"
                  >
                    <MessageSquare className="w-5 h-5 text-[#E5C378]" />
                    <span>WhatsApp Direct: +94 77 123 4567</span>
                  </a>
                ) : null}

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <span>Head Office: +94 11 234 5678</span>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <span>concierge@lankavoyage.com</span>
                </div>
              </div>
            </div>

            {/* Physical Offices */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
              <h4 className="font-serif font-bold text-lg text-[#082F24]">Island Headquarters</h4>
              
              <div className="space-y-3 text-xs text-stone-600">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#082F24] block">Colombo Executive Office:</strong>
                    <span>Level 14, West Tower, World Trade Center, Echelon Square, Colombo 01</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#082F24] block">Kandy Hill Country Branch:</strong>
                    <span>42 Peradeniya Road, Kandy 20000</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 pt-2 border-t border-stone-100">
                  <Clock className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <span>Office Hours: Mon - Sat: 8:00 AM - 7:00 PM (IST)</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Inquiry Form (7 cols) */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-stone-200 shadow-sm space-y-6">
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#082F24]">Send a Message to Our Travel Curators</h3>
              <p className="text-xs text-stone-500">We respond to all travel inquiries within 2 business hours.</p>
            </div>

            {submitted ? (
              <div className="bg-[#FAF8F5] p-8 rounded-2xl border border-emerald-300 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-serif text-xl font-bold text-[#082F24]">Message Received!</h4>
                <p className="text-xs text-stone-600">
                  Ayubowan! Our senior travel designer has received your message and will reach out to you shortly with tailored recommendations.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2 bg-[#0D3B2E] text-white text-xs font-bold rounded-xl"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Eleanor Vance"
                    className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-4 py-2.5 text-xs text-[#082F24]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. eleanor@example.com"
                      className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-4 py-2.5 text-xs text-[#082F24]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Phone / WhatsApp (Optional)</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+44 7700 900077"
                      className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-4 py-2.5 text-xs text-[#082F24]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Inquiry Topic</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-[#082F24]"
                  >
                    <option value="Custom Tour Inquiry">Bespoke Custom Tour Inquiry</option>
                    <option value="Existing Booking Question">Existing Booking & Voucher Support</option>
                    <option value="VIP Airport Transfer">Airport Transfer Booking</option>
                    <option value="Corporate & Group Travel">Corporate / Group Travel (8+ Pax)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">How Can We Help You?</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us your target travel dates, preferred destinations, group size, and any special wishes..."
                    className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-4 py-2.5 text-xs text-[#082F24]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#0D3B2E] text-white hover:bg-[#134E3F] font-bold text-sm rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 text-[#E5C378]" />
                  <span>Send Inquiry to Travel Curator</span>
                </button>
              </form>
            )}

          </div>

        </div>

        {/* FAQ Accordion */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-stone-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#C5A059]" />
            <h3 className="font-serif text-2xl font-bold text-[#082F24]">Frequently Asked Questions</h3>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="border border-stone-200 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left font-bold text-sm text-[#082F24] flex items-center justify-between gap-4 hover:bg-[#FAF8F5] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-stone-400 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-[#0D3B2E]' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-stone-600 leading-relaxed border-t border-stone-100 pt-2 animate-fadeIn">
                      {faq.a}
                    </div>
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
