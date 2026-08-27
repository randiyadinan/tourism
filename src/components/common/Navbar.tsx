import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  LogOut, 
  ChevronDown, 
  LayoutDashboard, 
  Compass, 
  MapPin, 
  Car, 
  BookOpen
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

  // ONLY 3 MAIN PUBLIC NAVIGATION LINKS: Home, Airport Transfer & Tours, Reviews
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Airport Transfer & Tours', href: '/transfers' },
    { name: 'Reviews', href: '/reviews' },
  ];

  const adminMgmtLinks = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Tours & Itineraries', href: '/admin/tours', icon: BookOpen },
    { name: 'Vehicle Daily Rates', href: '/admin/vehicles', icon: Car },
    { name: 'Destinations & Tickets', href: '/admin/destinations', icon: MapPin },
    { name: 'Airport Transfer Rates', href: '/admin/airport-transfers', icon: Car },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-400 ${
        isScrolled
          ? 'bg-[#062C22]/85 backdrop-blur-xl shadow-[0_12px_32px_-8px_rgba(0,0,0,0.35)] py-3 border-b border-white/12'
          : 'bg-[#062C22]/90 backdrop-blur-md py-4 border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-2xl bg-[#39A982] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-300">
              <Compass className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-tight text-white leading-none">
                Lanka<span className="text-[#39A982]">Voyage</span>
              </span>
              <span className="text-[9px] uppercase tracking-[0.24em] text-[#DDEFE8] font-medium mt-0.5">
                Bespoke Sri Lanka
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links (Only 3 Links) */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.href}
                className={({ isActive }) =>
                  `text-xs uppercase font-semibold tracking-wider transition-colors duration-200 ${
                    isActive
                      ? 'text-[#39A982]'
                      : 'text-stone-200 hover:text-white'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* If Admin, show Admin Dropdown Menu */}
            {isAdmin && (
              <div className="relative">
                <button
                  onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white border border-white/20 transition-all"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-[#39A982]" />
                  <span>Admin Console</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${adminMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {adminMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-stone-200 py-2 z-50 text-xs animate-fadeIn">
                    <div className="px-4 py-2 border-b border-stone-100 font-bold text-[#062C22]">
                      Admin Controls
                    </div>
                    {adminMgmtLinks.map((link) => {
                      const Icon = link.icon;
                      return (
                        <Link
                          key={link.name}
                          to={link.href}
                          onClick={() => setAdminMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-stone-700 hover:bg-[#F8F7F2] hover:text-[#0B3D2E] font-medium"
                        >
                          <Icon className="w-4 h-4 text-[#176B52]" />
                          <span>{link.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/customer"
                  className="text-xs font-bold text-white hover:text-[#39A982] transition-colors"
                >
                  Hi, {user?.name.split(' ')[0]}
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-stone-300 hover:text-rose-400 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-xs font-bold text-stone-200 hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-[#39A982] hover:bg-[#176B52] text-white shadow-sm transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-200 hover:text-white"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#062C22] border-t border-white/10 px-4 pt-4 pb-6 space-y-3">
          <nav className="space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.href}
                className={({ isActive }) =>
                  `block px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider ${
                    isActive ? 'bg-[#39A982] text-white' : 'text-stone-200 hover:bg-white/10'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {isAdmin && (
            <div className="pt-2 border-t border-white/10 space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#39A982] px-3">Admin Suite</span>
              <Link
                to="/admin"
                className="block px-3 py-2 text-xs font-bold text-stone-200 hover:bg-white/10 rounded-xl"
              >
                Dashboard
              </Link>
              <Link
                to="/admin/tours"
                className="block px-3 py-2 text-xs font-bold text-stone-200 hover:bg-white/10 rounded-xl"
              >
                Tours & Itineraries
              </Link>
              <Link
                to="/admin/vehicles"
                className="block px-3 py-2 text-xs font-bold text-stone-200 hover:bg-white/10 rounded-xl"
              >
                Vehicle Daily Rates
              </Link>
              <Link
                to="/admin/destinations"
                className="block px-3 py-2 text-xs font-bold text-stone-200 hover:bg-white/10 rounded-xl"
              >
                Destinations & Tickets
              </Link>
              <Link
                to="/admin/airport-transfers"
                className="block px-3 py-2 text-xs font-bold text-stone-200 hover:bg-white/10 rounded-xl"
              >
                Airport Transfer Rates
              </Link>
            </div>
          )}

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
            {isAuthenticated ? (
              <>
                <Link to="/customer" className="font-bold text-white">
                  My Account ({user?.name.split(' ')[0]})
                </Link>
                <button onClick={handleLogout} className="text-rose-400 font-bold">
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="font-bold text-white">
                  Log In
                </Link>
                <Link to="/register" className="font-bold text-[#39A982]">
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
