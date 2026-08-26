import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Compass, 
  Menu, 
  X, 
  LogOut, 
  ChevronDown, 
  LayoutDashboard, 
  Calendar, 
  User as UserIcon, 
  Compass as CompassIcon, 
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
      setIsScrolled(window.scrollY > 15);
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

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Tours', href: '/tours' },
    { name: 'Destinations', href: '/destinations' },
    { name: 'Activities', href: '/activities' },
    { name: 'Customize', href: '/customize' },
    { name: 'Reviews', href: '/reviews' },
    { name: 'About', href: '/about' },
  ];

  const adminMgmtLinks = [
    { name: 'Tours Management', href: '/admin/tours', icon: CompassIcon },
    { name: 'Destinations', href: '/admin/destinations', icon: MapPin },
    { name: 'Activities', href: '/admin/activities', icon: Sparkles },
    { name: 'Airport Transfers', href: '/transfers', icon: Car },
    { name: 'Customer Accounts', href: '/admin/customers', icon: Users },
    { name: 'Reviews & Feedback', href: '/admin/reviews', icon: Star },
  ];

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#12372A]/95 backdrop-blur-md shadow-md border-b border-[#C8A45D]/20 py-3' 
          : 'bg-[#12372A] border-b border-white/10 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-11">
          
          {/* ========================================================= */}
          {/* LEFT: LankaVoyage Brand Logo */}
          {/* ========================================================= */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-8 h-8 rounded-lg bg-[#C8A45D] flex items-center justify-center shadow-xs group-hover:bg-[#dfb96f] transition-colors">
              <Compass className="w-4 h-4 text-[#12372A]" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl font-bold tracking-tight text-white leading-none">
                Lanka<span className="text-[#C8A45D]">Voyage</span>
              </span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-stone-300 mt-0.5 font-medium">
                Sri Lanka Travel
              </span>
            </div>
          </Link>

          {/* ========================================================= */}
          {/* CENTER: Clean Navigation Links */}
          {/* ========================================================= */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.href}
                className={({ isActive }) => `
                  relative py-1 text-sm font-medium tracking-normal transition-colors duration-150
                  ${isActive 
                    ? 'text-[#C8A45D] font-semibold' 
                    : 'text-stone-200 hover:text-white'
                  }
                `}
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* ========================================================= */}
          {/* RIGHT: Role-Based Controls & Primary CTA */}
          {/* ========================================================= */}
          <div className="hidden lg:flex items-center gap-5">
            
            {/* 1. GUEST VIEW */}
            {!isAuthenticated && (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-xs font-medium text-stone-200 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/customize"
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#C8A45D] hover:bg-[#dfb96f] text-[#12372A] shadow-xs hover:shadow-sm transition-all"
                >
                  Plan Your Trip
                </Link>
              </div>
            )}

            {/* 2. CUSTOMER VIEW */}
            {isAuthenticated && !isAdmin && user && (
              <div className="flex items-center gap-3">
                <Link
                  to="/customer"
                  className="flex items-center gap-1.5 text-xs font-medium text-stone-200 hover:text-[#C8A45D] transition-colors py-1"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </Link>

                <Link
                  to="/customer/bookings"
                  className="flex items-center gap-1.5 text-xs font-medium text-stone-200 hover:text-[#C8A45D] transition-colors py-1"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Bookings</span>
                </Link>

                <Link
                  to="/customer/profile"
                  className="flex items-center gap-2 pl-2 pr-3 py-1 bg-white/10 hover:bg-white/15 rounded-full text-xs text-stone-100 transition-colors border border-white/10"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                    alt={user.name}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  <span className="max-w-[85px] truncate font-medium text-xs">
                    {user.name.split(' ')[0]}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-1.5 text-stone-300 hover:text-rose-300 hover:bg-white/10 rounded-lg transition-colors"
                  title="Sign Out"
                  aria-label="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* 3. ADMIN VIEW */}
            {isAuthenticated && isAdmin && user && (
              <div className="flex items-center gap-3">
                <Link
                  to="/admin"
                  className={`flex items-center gap-1.5 text-xs font-medium transition-colors py-1 ${
                    location.pathname === '/admin' ? 'text-[#C8A45D] font-semibold' : 'text-stone-200 hover:text-white'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Overview</span>
                </Link>

                <Link
                  to="/admin/bookings"
                  className={`flex items-center gap-1.5 text-xs font-medium transition-colors py-1 ${
                    location.pathname === '/admin/bookings' ? 'text-[#C8A45D] font-semibold' : 'text-stone-200 hover:text-white'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Bookings</span>
                </Link>

                {/* Management Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                    className={`flex items-center gap-1 text-xs font-medium transition-colors py-1 ${
                      location.pathname.startsWith('/admin') && location.pathname !== '/admin' && location.pathname !== '/admin/bookings'
                        ? 'text-[#C8A45D] font-semibold'
                        : 'text-stone-200 hover:text-white'
                    }`}
                  >
                    <span>Management</span>
                    <ChevronDown className="w-3 h-3 text-[#C8A45D]" />
                  </button>

                  {adminMenuOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-52 bg-[#12372A] border border-[#C8A45D]/30 rounded-xl shadow-xl py-2 z-50 animate-fadeIn text-xs text-stone-200"
                      onMouseLeave={() => setAdminMenuOpen(false)}
                    >
                      <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#C8A45D] border-b border-white/10">
                        Admin Controls
                      </div>
                      {adminMgmtLinks.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          onClick={() => setAdminMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3.5 py-2 hover:bg-white/10 text-stone-200 hover:text-[#C8A45D] transition-colors"
                        >
                          <item.icon className="w-3.5 h-3.5 text-[#C8A45D]" />
                          <span>{item.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleLogout}
                  className="p-1.5 text-stone-300 hover:text-rose-300 hover:bg-white/10 rounded-lg transition-colors"
                  title="Sign Out"
                  aria-label="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>

          {/* ========================================================= */}
          {/* MOBILE HAMBURGER BUTTON */}
          {/* ========================================================= */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-stone-200 hover:text-white hover:bg-white/10 focus:outline-none transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#C8A45D]" /> : <Menu className="w-5 h-5 text-[#C8A45D]" />}
            </button>
          </div>

        </div>
      </div>

      {/* ========================================================= */}
      {/* MOBILE DRAWER / MENU */}
      {/* ========================================================= */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#12372A] border-t border-white/10 px-4 pt-3 pb-6 space-y-3 shadow-xl">
          
          {/* Public Nav Links */}
          {!isAdmin && (
            <div className="space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => `
                    block px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isActive ? 'bg-white/10 text-[#C8A45D] font-semibold' : 'text-stone-200 hover:text-white'}
                  `}
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          )}

          {/* 1. GUEST MOBILE LINKS */}
          {!isAuthenticated && (
            <div className="border-t border-white/10 pt-3 space-y-2">
              <Link
                to="/customize"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full py-2.5 text-center text-xs font-semibold rounded-lg bg-[#C8A45D] text-[#12372A]"
              >
                Plan Your Trip
              </Link>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full py-2.5 text-center text-xs font-medium rounded-lg bg-white/10 text-white"
              >
                Sign In
              </Link>
            </div>
          )}

          {/* 2. CUSTOMER MOBILE LINKS */}
          {isAuthenticated && !isAdmin && user && (
            <div className="border-t border-white/10 pt-3 space-y-1.5 text-xs text-stone-200">
              <div className="px-3 py-1 flex items-center gap-2 border-b border-white/10 mb-2">
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                  alt={user.name}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="font-semibold text-white">{user.name}</span>
              </div>
              <Link
                to="/customer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 text-stone-200"
              >
                <LayoutDashboard className="w-4 h-4 text-[#C8A45D]" />
                <span>Dashboard Overview</span>
              </Link>
              <Link
                to="/customer/bookings"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 text-stone-200"
              >
                <Calendar className="w-4 h-4 text-[#C8A45D]" />
                <span>My Bookings</span>
              </Link>
              <Link
                to="/customer/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 text-stone-200"
              >
                <UserIcon className="w-4 h-4 text-[#C8A45D]" />
                <span>My Profile</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-rose-300 w-full text-left rounded-lg hover:bg-white/10"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}

          {/* 3. ADMIN MOBILE LINKS */}
          {isAuthenticated && isAdmin && (
            <div className="border-t border-white/10 pt-3 space-y-1 text-xs text-stone-200">
              <div className="px-3 py-1 font-bold uppercase tracking-wider text-[#C8A45D] text-[10px]">
                Admin Console
              </div>
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 text-stone-200"
              >
                <LayoutDashboard className="w-4 h-4 text-[#C8A45D]" />
                <span>Dashboard Overview</span>
              </Link>
              <Link
                to="/admin/bookings"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 text-stone-200"
              >
                <Calendar className="w-4 h-4 text-[#C8A45D]" />
                <span>All Tour Bookings</span>
              </Link>
              {adminMgmtLinks.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 text-stone-200"
                >
                  <item.icon className="w-4 h-4 text-[#C8A45D]" />
                  <span>{item.name}</span>
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-rose-300 w-full text-left rounded-lg hover:bg-white/10"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}

        </div>
      )}
    </header>
  );
};
