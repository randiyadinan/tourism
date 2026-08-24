import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Compass, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Award, 
  
  Globe,
  Clock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#082F24] text-stone-300 border-t border-[#C5A059]/20 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand & Mission (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E5C378] to-[#C5A059] p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-[#082F24] rounded-[10px] flex items-center justify-center">
                  <Compass className="w-5 h-5 text-[#E5C378]" />
                </div>
              </div>
              <span className="font-serif text-2xl font-bold tracking-wider text-white">
                Lanka<span className="text-[#E5C378]">Voyage</span>
              </span>
            </Link>

            <p className="text-sm text-stone-400 leading-relaxed max-w-sm">
              Sri Lanka’s premier bespoke travel designer. We curate private journeys, luxury wildlife safaris, tea estate retreats, and cultural odysseys tailored around you with 24/7 dedicated local concierge support.
            </p>

            {/* Accreditations */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-[#134E3F] rounded-full text-xs text-[#E5C378] border border-[#C5A059]/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>SLTDA Reg. No: TS/2026/884</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-[#134E3F] rounded-full text-xs text-stone-200 border border-[#C5A059]/30">
                <Award className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>TripAdvisor Travellers’ Choice 2026</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#C5A059] hover:text-[#082F24] text-stone-300 flex items-center justify-center transition-colors">
                <Globe className="w-4 h-4" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#C5A059] hover:text-[#082F24] text-stone-300 flex items-center justify-center transition-colors">
                <Globe className="w-4 h-4" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#C5A059] hover:text-[#082F24] text-stone-300 flex items-center justify-center transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-lg font-semibold text-white">Signature Tours</h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>
                <Link to="/tours/sri-lanka-classic-highlights" className="hover:text-[#E5C378] transition-colors">
                  Grand Highlights & Heritage (10D)
                </Link>
              </li>
              <li>
                <Link to="/tours/wildlife-safari-predators-giants" className="hover:text-[#E5C378] transition-colors">
                  Wild Sri Lanka: Leopards & Whales (7D)
                </Link>
              </li>
              <li>
                <Link to="/tours/romantic-luxury-sri-lanka-honeymoon" className="hover:text-[#E5C378] transition-colors">
                  Luxury Ceylon Honeymoon (8D)
                </Link>
              </li>
              <li>
                <Link to="/tours/ella-hill-country-nature-escape" className="hover:text-[#E5C378] transition-colors">
                  Highland Misty Tea Escapes (5D)
                </Link>
              </li>
              <li>
                <Link to="/tours/cultural-triangle-sacred-realms" className="hover:text-[#E5C378] transition-colors">
                  Cultural Triangle Kingdoms (6D)
                </Link>
              </li>
              <li>
                <Link to="/customize" className="text-[#E5C378] font-medium hover:underline flex items-center gap-1">
                  Custom Tour Builder &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Regions */}
          <div className="space-y-3">
            <h4 className="font-serif text-lg font-semibold text-white">Destinations</h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li><Link to="/destinations/sigiriya" className="hover:text-[#E5C378] transition-colors">Sigiriya Ancient Citadel</Link></li>
              <li><Link to="/destinations/ella" className="hover:text-[#E5C378] transition-colors">Ella & Nine Arches</Link></li>
              <li><Link to="/destinations/yala" className="hover:text-[#E5C378] transition-colors">Yala Leopard Safari</Link></li>
              <li><Link to="/destinations/galle" className="hover:text-[#E5C378] transition-colors">Galle Dutch Fort</Link></li>
              <li><Link to="/destinations/kandy" className="hover:text-[#E5C378] transition-colors">Kandy Temple of the Tooth</Link></li>
              <li><Link to="/destinations/mirissa" className="hover:text-[#E5C378] transition-colors">Mirissa Whale Sanctuary</Link></li>
            </ul>
          </div>

          {/* Contact & Concierge */}
          <div className="space-y-3">
            <h4 className="font-serif text-lg font-semibold text-white">24/7 Concierge</h4>
            <div className="space-y-2.5 text-sm text-stone-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <span>Level 14, World Trade Center, Echelon Square, Colombo 01, Sri Lanka</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C5A059] shrink-0" />
                <a href="tel:+94771234567" className="hover:text-[#E5C378]">+94 77 123 4567</a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C5A059] shrink-0" />
                <a href="mailto:concierge@lankavoyage.com" className="hover:text-[#E5C378]">concierge@lankavoyage.com</a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>24/7 Islandwide Chauffeur Support</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar with Copyright, Payment Badges & Disclaimer */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>© {new Date().getFullYear()} LankaVoyage Ltd. All Rights Reserved. Designed with passion for Ceylon hospitality.</p>

          <div className="flex flex-wrap items-center gap-4 text-stone-400">
            <Link to="/about" className="hover:text-[#E5C378]">About Us</Link>
            <span>•</span>
            <Link to="/reviews" className="hover:text-[#E5C378]">Guest Reviews</Link>
            <span>•</span>
            <Link to="/transfers" className="hover:text-[#E5C378]">Airport Transfers</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-[#E5C378]">Contact</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
