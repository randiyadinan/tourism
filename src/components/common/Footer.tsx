import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Globe,
  Clock
} from 'lucide-react';
import { SOCIAL_LINKS } from '../../config/socialLinks';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#075E63] text-stone-200 border-t border-white/10 pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand & Description */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold tracking-tight text-white leading-none">
                  Lanka<span className="text-[#E98B6B]">Voyage</span>
                </span>
                <span className="text-[9px] uppercase tracking-[0.22em] text-[#DDF5F0] mt-0.5 font-medium">
                  Bespoke Sri Lanka
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-stone-200 leading-relaxed max-w-sm">
              Sri Lanka's trusted bespoke travel company. Crafting private chauffeur journeys, wildlife expeditions, and boutique stays across the island.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs text-stone-100 border border-white/15">
                <ShieldCheck className="w-3.5 h-3.5 text-[#55C7C1]" />
                <span>SLTDA Registered Agency</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5 pt-2">
              {SOCIAL_LINKS.instagram?.url ? (
                <a 
                  href={SOCIAL_LINKS.instagram.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label={SOCIAL_LINKS.instagram.ariaLabel}
                  className="w-8 h-8 rounded-xl bg-white/10 hover:bg-[#0B7A75] text-stone-100 flex items-center justify-center transition-colors"
                >
                  <Globe className="w-4 h-4" />
                </a>
              ) : null}

              {SOCIAL_LINKS.facebook?.url ? (
                <a 
                  href={SOCIAL_LINKS.facebook.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label={SOCIAL_LINKS.facebook.ariaLabel}
                  className="w-8 h-8 rounded-xl bg-white/10 hover:bg-[#0B7A75] text-stone-100 flex items-center justify-center transition-colors"
                >
                  <Globe className="w-4 h-4" />
                </a>
              ) : null}

              {SOCIAL_LINKS.youtube?.url ? (
                <a 
                  href={SOCIAL_LINKS.youtube.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label={SOCIAL_LINKS.youtube.ariaLabel}
                  className="w-8 h-8 rounded-xl bg-white/10 hover:bg-[#0B7A75] text-stone-100 flex items-center justify-center transition-colors"
                >
                  <Globe className="w-4 h-4" />
                </a>
              ) : null}

              {SOCIAL_LINKS.whatsapp?.url ? (
                <a 
                  href={SOCIAL_LINKS.whatsapp.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label={SOCIAL_LINKS.whatsapp.ariaLabel}
                  className="w-8 h-8 rounded-xl bg-white/10 hover:bg-[#25D366] hover:text-white text-stone-100 flex items-center justify-center transition-colors"
                >
                  <Phone className="w-4 h-4" />
                </a>
              ) : null}

              <a 
                href="mailto:concierge@lankavoyage.com" 
                aria-label="Send email to LankaVoyage Concierge"
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-[#0B7A75] text-stone-100 flex items-center justify-center transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Explore Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-semibold text-white">Explore</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-200">
              <li>
                <Link to="/tours" className="hover:text-[#55C7C1] transition-colors">
                  Signature Tours
                </Link>
              </li>
              <li>
                <Link to="/destinations" className="hover:text-[#55C7C1] transition-colors">
                  Destinations
                </Link>
              </li>
              <li>
                <Link to="/activities" className="hover:text-[#55C7C1] transition-colors">
                  Unique Experiences
                </Link>
              </li>
              <li>
                <Link to="/customize" className="hover:text-[#55C7C1] transition-colors">
                  Customize Itinerary
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="hover:text-[#55C7C1] transition-colors">
                  Guest Reviews
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-semibold text-white">Company</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-200">
              <li><Link to="/about" className="hover:text-[#55C7C1] transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-[#55C7C1] transition-colors">Contact Concierge</Link></li>
              <li><Link to="/transfers" className="hover:text-[#55C7C1] transition-colors">Airport Transfers</Link></li>
              <li><Link to="/terms-and-conditions" className="hover:text-[#55C7C1] transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-[#55C7C1] transition-colors">Privacy Policy</Link></li>
              <li><Link to="/cancellation-refund-policy" className="hover:text-[#55C7C1] transition-colors">Cancellation Policy</Link></li>
            </ul>
          </div>

          {/* 24/7 Concierge */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-semibold text-white">24/7 Concierge</h4>
            <div className="space-y-2.5 text-xs sm:text-sm text-stone-200">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#55C7C1] shrink-0 mt-0.5" />
                <span>Level 14, World Trade Center, Colombo 01, Sri Lanka</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#55C7C1] shrink-0" />
                <a href="tel:+94771234567" className="hover:text-[#55C7C1]">+94 77 123 4567</a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#55C7C1] shrink-0" />
                <a href="mailto:concierge@lankavoyage.com" className="hover:text-[#55C7C1]">concierge@lankavoyage.com</a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#55C7C1] shrink-0" />
                <span>24/7 Islandwide Support</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-300">
          <p>© {new Date().getFullYear()} LankaVoyage Ltd. All Rights Reserved.</p>

          <div className="flex flex-wrap items-center gap-3.5 text-stone-200">
            <Link to="/about" className="hover:text-[#55C7C1]">About</Link>
            <span>•</span>
            <Link to="/reviews" className="hover:text-[#55C7C1]">Reviews</Link>
            <span>•</span>
            <Link to="/transfers" className="hover:text-[#55C7C1]">Transfers</Link>
            <span>•</span>
            <Link to="/terms-and-conditions" className="hover:text-[#55C7C1]">Terms</Link>
            <span>•</span>
            <Link to="/privacy-policy" className="hover:text-[#55C7C1]">Privacy</Link>
            <span>•</span>
            <Link to="/cancellation-refund-policy" className="hover:text-[#55C7C1]">Cancellations</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-[#55C7C1]">Contact</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
