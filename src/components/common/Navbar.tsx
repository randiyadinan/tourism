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

  const centerLinks = [
    { name: 'Home', href: '/' },
    { name: 'Tours', href: '/tours' },
    { name: 'Destinations', href: '/destinations' },
    { name: 'Activities', href: '/activities' },
    { name: 'Airport Transfers', href: '/transfers' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
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
          ? 'bg-[#082F24]/98 backdrop-blur-md shadow-md border-b border-[#C5A059]/25 py-2.5' 
          : 'bg-[#082F24] border-b border-stone-800/80 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          
          {/* ========================================================= */}
          {/* LEFT: LankaVoyage Brand Logo */}
          {/* ========================================================= */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E5C378] via-[#C5A059] to-[#8C6D2B] p-0.5 shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#082F24] rounded-[9px] flex items-center justify-center">
                <Compass className="w-4 h-4 text-[#E5C378]" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl font-bold tracking-wider text-white">
                Lanka<span className="text-[#E5C378]">Voyage</span>
              </span>
              <span className="text-[8px] uppercase tracking-[0.22em] text-[#C5A059] -mt-1 font-semibold">
                Ceylon Bespoke
              </span>
            </div>
          </Link>

          {/* ========================================================= */}
          {/* CENTER: Clean Navigation Links (Home, Tours, Destinations, Activities, About, Contact) */}
          {/* ========================================================= */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {centerLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.href}
                className={({ isActive }) => `
                  relative py-1 text-xs font-medium tracking-wide transition-colors duration-200
                  ${isActive 
                    ? 'text-[#E5C378] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#E5C378] after:rounded-full' 
                    : 'text-stone-300 hover:text-white'
                  }
                `}
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* ========================================================= */}
          {/* RIGHT: Role-Based Controls (Guest / Customer / Admin) */}
          {/* ========================================================= */}
          <div className="hidden lg:flex items-center gap-4">
            
            {/* 1. GUEST VIEW */}
            {!isAuthenticated && (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-xs font-medium text-stone-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/tours"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-[#C5A059] hover:bg-[#E5C378] text-[#082F24] shadow-md hover:shadow-lg transition-all"
                >
                  Explore Tours
                </Link>
              </div>
            )}

            {/* 2. CUSTOMER VIEW */}
            {isAuthenticated && !isAdmin && user && (
              <div className="flex items-center gap-4">
                <NavLink
                  to="/customer/bookings"
                  className={({ isActive }) => `
                    text-xs font-medium tracking-wide transition-colors
                    ${isActive ? 'text-[#E5C378] font-semibold' : 'text-stone-300 hover:text-white'}
                  `}
                >
                  My Bookings
                </NavLink>

                <NavLink
                  to="/customer/profile"
                  className={({ isActive }) => `
                    text-xs font-medium tracking-wide transition-colors
                    ${isActive ? 'text-[#E5C378] font-semibold' : 'text-stone-300 hover:text-white'}
                  `}
                >
                  Profile
                </NavLink>

                {/* Customer Identity Badge */}
                <Link
                  to="/customer"
                  className="flex items-center gap-2 pl-1.5 pr-3 py-1 bg-[#134E3F] hover:bg-[#1A5C4B] rounded-full border border-[#C5A059]/30 transition-colors"
                  title="Open Customer Dashboard"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                    alt={user.name}
                    className="w-6 h-6 rounded-full object-cover border border-[#C5A059]"
                  />
                  <span className="text-xs font-semibold text-white max-w-[100px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-1.5 text-stone-400 hover:text-rose-400 hover:bg-white/5 rounded-lg transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* 3. ADMIN VIEW */}
            {isAuthenticated && isAdmin && user && (
              <div className="flex items-center gap-4">
                <NavLink
                  to="/admin"
                  end
                  className={({ isActive }) => `
                    text-xs font-medium tracking-wide transition-colors
                    ${isActive ? 'text-[#E5C378] font-semibold' : 'text-stone-300 hover:text-white'}
                  `}
                >
                  Dashboard
                </NavLink>

                <NavLink
                  to="/admin/bookings"
                  className={({ isActive }) => `
                    text-xs font-medium tracking-wide transition-colors
                    ${isActive ? 'text-[#E5C378] font-semibold' : 'text-stone-300 hover:text-white'}
                  `}
                >
                  Bookings
                </NavLink>

                {/* Admin Management Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                    className={`flex items-center gap-1 text-xs font-medium tracking-wide transition-colors py-1 ${
                      location.pathname.startsWith('/admin') && location.pathname !== '/admin' && location.pathname !== '/admin/bookings'
                        ? 'text-[#E5C378] font-semibold'
                        : 'text-stone-300 hover:text-white'
                    }`}
                  >
                    <span>Management</span>
                    <ChevronDown className="w-3 h-3 text-[#C5A059]" />
                  </button>

                  {adminMenuOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-52 bg-[#0D3B2E] border border-[#C5A059]/30 rounded-2xl shadow-2xl py-2 z-50 animate-fadeIn text-xs text-stone-200"
                      onMouseLeave={() => setAdminMenuOpen(false)}
                    >
                      <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#C5A059] border-b border-white/10">
                        Admin Controls
                      </div>
                      {adminMgmtLinks.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          onClick={() => setAdminMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3.5 py-2 hover:bg-white/10 text-stone-200 hover:text-[#E5C378] transition-colors"
                        >
                          <item.icon className="w-3.5 h-3.5 text-[#C5A059]" />
                          <span>{item.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Admin Identity Badge */}
                <div 
                  className="flex items-center gap-2 pl-1.5 pr-3 py-1 bg-[#134E3F] rounded-full border border-[#C5A059]/40"
                  title="Admin Operations"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80'}
                    alt={user.name}
                    className="w-6 h-6 rounded-full object-cover border border-[#C5A059]"
                  />
                  <span className="text-xs font-semibold text-[#E5C378] max-w-[100px] truncate">
                    Admin
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-1.5 text-stone-400 hover:text-rose-400 hover:bg-white/5 rounded-lg transition-colors"
                  title="Sign Out"
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
              className="p-2 rounded-xl text-stone-200 hover:text-white hover:bg-white/10 focus:outline-none transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#E5C378]" /> : <Menu className="w-6 h-6 text-[#E5C378]" />}
            </button>
          </div>

        </div>
      </div>

      {/* ========================================================= */}
      {/* MOBILE DRAWER / MENU */}
      {/* ========================================================= */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#082F24] border-t border-stone-800 px-4 pt-3 pb-6 space-y-3 animate-fadeIn shadow-2xl">
          
          {/* Center Links (Common for public & customer) */}
          {!isAdmin && (
            <div className="space-y-1">
              {centerLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => `
                    block px-3 py-2 rounded-xl text-xs font-medium transition-colors
                    ${isActive ? 'bg-white/10 text-[#E5C378] font-bold' : 'text-stone-200 hover:text-white'}
                  `}
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          )}

          {/* 1. GUEST MOBILE LINKS */}
          {!isAuthenticated && (
            <div className="border-t border-stone-800 pt-3 space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full py-2.5 text-center text-xs font-semibold rounded-xl bg-white/10 text-white"
              >
                Sign In
              </Link>
              <Link
                to="/tours"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full py-2.5 text-center text-xs font-bold rounded-xl bg-[#C5A059] text-[#082F24]"
              >
                Explore Tours
              </Link>
            </div>
          )}

          {/* 2. CUSTOMER MOBILE LINKS */}
          {isAuthenticated && !isAdmin && user && (
            <div className="border-t border-stone-800 pt-3 space-y-1.5">
              <div className="flex items-center gap-3 px-3 py-2 bg-[#134E3F] rounded-xl mb-2">
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border border-[#C5A059]"
                />
                <div>
                  <p className="font-semibold text-xs text-white">{user.name}</p>
                  <p className="text-[10px] text-[#E5C378]">{user.email}</p>
                </div>
              </div>

              <NavLink
                to="/customer/bookings"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium
                  ${isActive ? 'bg-white/10 text-[#E5C378] font-bold' : 'text-stone-200'}
                `}
              >
                <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>My Bookings</span>
              </NavLink>

              <NavLink
                to="/customer/profile"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium
                  ${isActive ? 'bg-white/10 text-[#E5C378] font-bold' : 'text-stone-200'}
                `}
              >
                <UserIcon className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Profile</span>
              </NavLink>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 mt-2 text-rose-300 font-bold text-xs rounded-xl bg-rose-950/30 hover:bg-rose-950/50"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          )}

          {/* 3. ADMIN MOBILE LINKS */}
          {isAuthenticated && isAdmin && user && (
            <div className="space-y-1">
              <div className="flex items-center gap-3 px-3 py-2 bg-[#134E3F] rounded-xl mb-2">
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80'}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border border-[#C5A059]"
                />
                <div>
                  <p className="font-semibold text-xs text-[#E5C378]">{user.name}</p>
                  <p className="text-[10px] text-stone-300">Administrator</p>
                </div>
              </div>

              <NavLink
                to="/admin"
                end
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium
                  ${isActive ? 'bg-white/10 text-[#E5C378] font-bold' : 'text-stone-200'}
                `}
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Dashboard</span>
              </NavLink>

              <NavLink
                to="/admin/bookings"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium
                  ${isActive ? 'bg-white/10 text-[#E5C378] font-bold' : 'text-stone-200'}
                `}
              >
                <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Bookings</span>
              </NavLink>

              <NavLink
                to="/admin/tours"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium
                  ${isActive ? 'bg-white/10 text-[#E5C378] font-bold' : 'text-stone-200'}
                `}
              >
                <CompassIcon className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Tours</span>
              </NavLink>

              <NavLink
                to="/admin/destinations"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium
                  ${isActive ? 'bg-white/10 text-[#E5C378] font-bold' : 'text-stone-200'}
                `}
              >
                <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Destinations</span>
              </NavLink>

              <NavLink
                to="/admin/activities"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium
                  ${isActive ? 'bg-white/10 text-[#E5C378] font-bold' : 'text-stone-200'}
                `}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Activities</span>
              </NavLink>

              <NavLink
                to="/transfers"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium
                  ${isActive ? 'bg-white/10 text-[#E5C378] font-bold' : 'text-stone-200'}
                `}
              >
                <Car className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Transfers</span>
              </NavLink>

              <NavLink
                to="/admin/customers"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium
                  ${isActive ? 'bg-white/10 text-[#E5C378] font-bold' : 'text-stone-200'}
                `}
              >
                <Users className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Customers</span>
              </NavLink>

              <NavLink
                to="/admin/reviews"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium
                  ${isActive ? 'bg-white/10 text-[#E5C378] font-bold' : 'text-stone-200'}
                `}
              >
                <Star className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Reviews</span>
              </NavLink>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 mt-2 text-rose-300 font-bold text-xs rounded-xl bg-rose-950/30 hover:bg-rose-950/50"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          )}

        </div>
      )}
    </header>
  );
};
