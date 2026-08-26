import React from 'react';
import { Phone, Award, ShieldCheck, UserCheck, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export const TopAnnouncement: React.FC = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();

  return (
    <div className="bg-[#062C22] text-white text-xs border-b border-[#176B52]/20 py-1.5 px-4">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left Badges */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-[#39A982]">
            <Award className="w-3.5 h-3.5" />
            <span className="font-medium tracking-wide">Sri Lanka’s #1 Luxury Bespoke Travel Specialist</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5 text-stone-300">
            <ShieldCheck className="w-3.5 h-3.5 text-[#176B52]" />
            <span>SLTDA Certified Agency • 100% Financial Protection</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 ml-auto">
          <a
            href="tel:+94771234567"
            className="hidden sm:flex items-center gap-1.5 text-stone-200 hover:text-[#39A982] transition-colors"
          >
            <Phone className="w-3 h-3 text-[#176B52]" />
            <span>24/7 Concierge: +94 77 123 4567</span>
          </a>

          {/* User Session Status Badge */}
          {isAuthenticated && user && (
            <div className="flex items-center gap-1.5 bg-[#134E3F] px-2.5 py-0.5 rounded-full border border-[#176B52]/30 text-[11px]">
              {isAdmin ? (
                <Link to="/admin" className="flex items-center gap-1 text-[#39A982] font-bold hover:underline">
                  <Shield className="w-3 h-3 text-[#39A982]" />
                  <span>Admin Suite</span>
                </Link>
              ) : (
                <Link to="/customer" className="flex items-center gap-1 text-stone-200 hover:text-white font-medium">
                  <UserCheck className="w-3 h-3 text-emerald-400" />
                  <span>Traveler Portal ({user.name.split(' ')[0]})</span>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
