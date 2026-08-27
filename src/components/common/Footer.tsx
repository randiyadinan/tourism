import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Compass, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Clock, 
  Heart, 
  Globe2, 
  Camera 
} from 'lucide-react';
import { getWhatsAppChatUrl, WHATSAPP_MESSAGES } from '../../config/whatsapp';
import { WhatsAppIcon } from './WhatsAppButton';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#062C22] text-white border-t border-white/10 relative overflow-hidden">
      
      {/* Decorative top accent line */}
      <div className="h-1 w-full bg-gradient-to-r from-[#0B3D2E] via-[#39A982] to-[#0B3D2E]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        
        {/* Main 4-Column Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <Link to="/" className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                Lanka<span className="text-[#39A982]">Voyage</span>
              </span>
              <span className="text-[9px] uppercase tracking-[0.24em] text-[#DDEFE8] font-medium mt-0.5">
                Bespoke Sri Lanka
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Official SLTDA certified premier luxury destination management company crafting chauffeured bespoke journeys and private airport transfers across Sri Lanka.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Visit LankaVoyage Facebook Page"
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-[#176B52] text-stone-200 flex items-center justify-center transition-colors"
              >
                <Globe2 className="w-4 h-4" />
              </a>

              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Visit LankaVoyage Instagram"
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-[#176B52] text-stone-200 flex items-center justify-center transition-colors"
              >
                <Camera className="w-4 h-4" />
              </a>

              <a 
                href={getWhatsAppChatUrl(WHATSAPP_MESSAGES.general)}
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Chat with LankaVoyage Concierge on WhatsApp"
                className="w-8 h-8 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366] text-[#25D366] hover:text-white flex items-center justify-center transition-all"
              >
                <WhatsAppIcon className="w-4 h-4" />
              </a>

              <a 
                href="mailto:concierge@lankavoyage.com" 
                aria-label="Send email to LankaVoyage Concierge"
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-[#176B52] text-stone-200 flex items-center justify-center transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Travel Links (Only 3 Main Customer Pages + Contact) */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-semibold text-white">Explore Ceylon</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-300">
              <li>
                <Link to="/" className="hover:text-[#39A982] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/transfers" className="hover:text-[#39A982] transition-colors">
                  Transfers & Tours
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#39A982] transition-colors">
                  Contact Concierge
                </Link>
              </li>
              <li>
                <a 
                  href={getWhatsAppChatUrl(WHATSAPP_MESSAGES.general)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#39A982] hover:underline flex items-center gap-1.5"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5" />
                  <span>WhatsApp Chat</span>
                </a>
              </li>
            </ul>
          </div>

          {/* 24/7 Concierge */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-semibold text-white">24/7 Concierge</h4>
            <div className="space-y-2.5 text-xs sm:text-sm text-stone-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#39A982] shrink-0 mt-0.5" />
                <span>[Registered Corporate Office Address, Colombo, Sri Lanka]</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#39A982] shrink-0" />
                <span>[Official Contact Phone / +94 XX XXX XXXX]</span>
              </div>
              <div className="flex items-center gap-2.5">
                <WhatsAppIcon className="w-4 h-4 text-[#39A982] shrink-0" />
                <a 
                  href={getWhatsAppChatUrl(WHATSAPP_MESSAGES.general)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-300 hover:text-[#39A982] transition-colors"
                >
                  WhatsApp: +94 XX XXX XXXX
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#39A982] shrink-0" />
                <span>[Official Contact Email / concierge@lankavoyage.com]</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#39A982] shrink-0" />
                <span>24/7 Dedicated Chauffeur Support</span>
              </div>
            </div>
          </div>

          {/* Accreditations & Guarantee */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-semibold text-white">Accreditations</h4>
            <div className="space-y-2.5 text-xs text-stone-300">
              <div className="flex items-center gap-2 bg-white/5 p-2.5 rounded-xl border border-white/10">
                <ShieldCheck className="w-4 h-4 text-[#39A982] shrink-0" />
                <span>SLTDA Registered Agency ([Registration Placeholder])</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 p-2.5 rounded-xl border border-white/10">
                <Compass className="w-4 h-4 text-[#39A982] shrink-0" />
                <span>Certified National Chauffeur Fleet</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright & legal terms */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p className="flex items-center gap-1">
            &copy; {new Date().getFullYear()} LankaVoyage Ltd. Handcrafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> in Sri Lanka.
          </p>

          <div className="flex items-center gap-6">
            <Link to="/terms-and-conditions" className="hover:text-white transition-colors">Terms & Conditions</Link>
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/cancellation-refund-policy" className="hover:text-white transition-colors">Cancellation Policy</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
