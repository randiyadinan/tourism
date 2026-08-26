import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  LogOut, 
  ChevronDown, 
  LayoutDashboard, 
  Calendar, 
  Compass, 
  MapPin, 
  Sparkles, 
  Car, 
  Users, 
  Star
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);

  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setAdminMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  // Main Public Navigation Links: Home, Airport Transfer & Tours, Reviews & Gallery
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Airport Transfer & Tours', href: '/transfers' },
    { name: 'Reviews & Gallery', href: '/reviews' },
  ];

  const adminMgmtLinks = [
    { name: 'Tours Management', href: '/admin/tours', icon: Compass },
    { name: 'Destinations', href: '/admin/destinations', icon: MapPin },
    { name: 'Experiences', href: '/admin/activities', icon: Sparkles },
    { name: 'Airport Transfers', href: '/transfers', icon: Car },
    { name: 'Customer Accounts', href: '/admin/customers', icon: Users },
    { name: 'Reviews & Feedback', href: '/admin/reviews', icon: Star },
  ];

  const isHome = location.pathname === '/';

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/85 backdrop-blur-xl border-b border-white/70 shadow-[0_8px_24px_-8px_rgba(6,44,34,0.08)] py-3 text-[#17231F]' 
          : isHome
            ? 'bg-[#062C22]/35 backdrop-blur-md border-b border-white/10 py-4 text-white'
            : 'bg-[#0B3D2E]/95 backdrop-blur-xl border-b border-white/10 py-4 text-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-11">
          
          {/* Clean Luxury Typography Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <div className="flex flex-col">
              <span className={`font-serif text-2xl font-bold tracking-tight leading-none ${isScrolled ? 'text-[#0B3D2E]' : 'text-white'}`}>
                Lanka<span className="text-[#39A982]">Voyage</span>
              </span>
              <span className={`text-[8.5px] uppercase tracking-[0.24em] mt-0.5 font-medium ${isScrolled ? 'text-[#68736E]' : 'text-[#DDEFE8]'}`}>
                Bespoke Sri Lanka
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.href}
                className={({ isActive }) => `
                  text-sm font-medium tracking-normal transition-colors duration-200
                  ${isActive 
                    ? 'text-[#39A982] font-semibold' 
                    : isScrolled
                      ? 'text-[#17231F] hover:text-[#176B52]'
                      : 'text-white hover:text-[#39A982]'
                  }
                `}
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Icons & User Account */}
          <div className="hidden lg:flex items-center gap-4">
            
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {/* Admin Management Dropdown Button */}
                {isAdmin && (
                  <div className="relative">
                    <button
                      onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        isScrolled 
                          ? 'bg-[#0B3D2E] text-white border-[#0B3D2E]' 
                          : 'bg-white/15 text-white border-white/20 hover:bg-white/25'
                      }`}
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      <span>Admin Suite</span>
                      <ChevronDown className={`w-3 h-3 transition-transform ${adminMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {adminMenuOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50 text-[#17231F] animate-fadeIn">
                        <div className="px-3 py-1.5 text-[10px] font-bold text-[#68736E] uppercase tracking-wider border-b border-stone-100">
                          Operations Management
                        </div>
                        {adminMgmtLinks.map((adminLink) => (
                          <Link
                            key={adminLink.name}
                            to={adminLink.href}
                            onClick={() => setAdminMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3.5 py-2 text-xs hover:bg-[#DDEFE8] hover:text-[#176B52] transition-colors"
                          >
                            <adminLink.icon className="w-3.5 h-3.5 text-[#176B52]" />
                            <span>{adminLink.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Customer Dashboard Link */}
                <Link
                  to="/customer"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    isScrolled
                      ? 'bg-[#F8F7F2] text-[#0B3D2E] border-stone-300 hover:bg-[#DDEFE8]'
                      : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5 text-[#39A982]" />
                  <span>My Bookings</span>
                </Link>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className={`p-2 rounded-xl border transition-colors ${
                    isScrolled
                      ? 'border-stone-200 text-[#68736E] hover:text-rose-600 hover:bg-rose-50'
                      : 'border-white/20 text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                  title="Log out"
                  aria-label="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className={`text-xs font-semibold transition-colors ${
                    isScrolled ? 'text-[#17231F] hover:text-[#176B52]' : 'text-white hover:text-[#39A982]'
                  }`}
                >
                  Sign In
                </Link>

                <Link
                  to="/transfers"
                  className="px-4 py-2 rounded-full text-xs font-semibold bg-[#39A982] hover:bg-[#176B52] text-white shadow-xs hover:shadow-md transition-all"
                >
                  Book Transfer & Tours
                </Link>
              </div>
            )}

          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-xl border transition-colors ${
                isScrolled
                  ? 'border-stone-200 text-[#17231F]'
                  : 'border-white/20 text-white'
              }`}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-white" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-2xl border-b border-stone-200 px-6 py-6 space-y-5 text-[#17231F] animate-fadeIn shadow-2xl">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.href}
                className={({ isActive }) => `
                  text-sm font-semibold py-2 transition-colors
                  ${isActive ? 'text-[#39A982]' : 'text-[#17231F] hover:text-[#176B52]'}
                `}
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          <div className="pt-4 border-t border-stone-200 space-y-3">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="text-xs text-[#68736E]">
                  Signed in as <span className="font-semibold text-[#17231F]">{user?.name || user?.email}</span>
                </div>
                {isAdmin && (
                  <Link
                    to="/admin/tours"
                    className="block w-full py-2.5 text-center text-xs font-semibold bg-[#0B3D2E] text-white rounded-xl"
                  >
                    Admin Suite
                  </Link>
                )}
                <Link
                  to="/customer"
                  className="block w-full py-2.5 text-center text-xs font-semibold bg-[#DDEFE8] text-[#0B3D2E] rounded-xl"
                >
                  My Trips & Bookings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full py-2 text-center text-xs font-semibold text-rose-600 hover:underline"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  className="py-2.5 text-center text-xs font-semibold bg-[#F8F7F2] text-[#17231F] rounded-xl border border-stone-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/transfers"
                  className="py-2.5 text-center text-xs font-semibold bg-[#39A982] text-white rounded-xl"
                >
                  Book Transfer
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
