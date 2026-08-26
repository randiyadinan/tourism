import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck, 
  Globe2, 
  Camera
} from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#062C22] text-white border-t border-white/10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
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
                href="mailto:concierge@lankavoyage.com" 
                aria-label="Send email to LankaVoyage Concierge"
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-[#176B52] text-stone-200 flex items-center justify-center transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Travel Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-semibold text-white">Experience</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-300">
              <li>
                <Link to="/transfers" className="hover:text-[#39A982] transition-colors">
                  Airport Transfers & Tours
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="hover:text-[#39A982] transition-colors">
                  Guest Reviews & Gallery
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#39A982] transition-colors">
                  Contact Concierge
                </Link>
              </li>
            </ul>
          </div>

          {/* 24/7 Concierge */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-semibold text-white">24/7 Concierge</h4>
            <div className="space-y-2.5 text-xs sm:text-sm text-stone-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#39A982] shrink-0 mt-0.5" />
                <span>Level 14, World Trade Center, Colombo 01, Sri Lanka</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#39A982] shrink-0" />
                <a href="tel:+94771234567" className="hover:text-[#39A982]">+94 77 123 4567</a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#39A982] shrink-0" />
                <a href="mailto:concierge@lankavoyage.com" className="hover:text-[#39A982]">concierge@lankavoyage.com</a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#39A982] shrink-0" />
                <span>24/7 Dedicated Chauffeur Support</span>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-semibold text-white">Official Certification</h4>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#39A982]">
                <ShieldCheck className="w-4 h-4 text-[#39A982]" />
                <span>SLTDA Registered Agency</span>
              </div>
              <p className="text-[11px] text-stone-400 leading-relaxed">
                Licensed by Sri Lanka Tourism Development Authority. Fully insured passenger vehicles and authorized English-speaking national tourist chauffeurs.
              </p>
            </div>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>&copy; {currentYear} LankaVoyage (Pvt) Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms-and-conditions" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/cancellation-refund-policy" className="hover:text-white transition-colors">Cancellation Policy</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
