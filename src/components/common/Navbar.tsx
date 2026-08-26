import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
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
  Star,
  Palmtree
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
      setIsScrolled(window.scrollY > 20);
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
    { name: 'Experiences', href: '/activities' },
    { name: 'Customize', href: '/customize' },
    { name: 'Reviews', href: '/reviews' },
    { name: 'About', href: '/about' },
  ];

  const adminMgmtLinks = [
    { name: 'Tours Management', href: '/admin/tours', icon: CompassIcon },
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
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-stone-200/80 py-3 text-[#193238]' 
          : isHome
            ? 'bg-[#075E67]/90 backdrop-blur-xs border-b border-white/15 py-4 text-white'
            : 'bg-[#075E67] border-b border-white/15 py-4 text-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-11">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#087F8C] to-[#3E8E5B] flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
              <Palmtree className="w-4 h-4 text-[#F3D6A4]" />
            </div>
            <div className="flex flex-col">
              <span className={`font-serif text-xl font-bold tracking-tight leading-none ${isScrolled ? 'text-[#075E67]' : 'text-white'}`}>
                Lanka<span className="text-[#E7B85C]">Voyage</span>
              </span>
              <span className={`text-[9px] uppercase tracking-[0.2em] mt-0.5 font-medium ${isScrolled ? 'text-stone-500' : 'text-[#F3D6A4]'}`}>
                Tropical Sri Lanka
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.href}
                className={({ isActive }) => `
                  text-sm font-medium tracking-normal transition-colors duration-150
                  ${isActive 
                    ? isScrolled ? 'text-[#087F8C] font-semibold' : 'text-[#F3D6A4] font-semibold'
                    : isScrolled ? 'text-stone-700 hover:text-[#087F8C]' : 'text-stone-100 hover:text-white'
                  }
                `}
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right Controls & Primary CTA */}
          <div className="hidden lg:flex items-center gap-4">
            
            {/* Guest View */}
            {!isAuthenticated && (
              <div className="flex items-center gap-3.5">
                <Link
                  to="/login"
                  className={`text-xs font-medium transition-colors ${
                    isScrolled ? 'text-stone-600 hover:text-[#087F8C]' : 'text-stone-100 hover:text-white'
                  }`}
                >
                  Sign In
                </Link>
                <Link
                  to="/customize"
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#087F8C] hover:bg-[#075E67] text-white shadow-xs transition-all hover:shadow-md transform hover:-translate-y-0.5"
                >
                  Plan Your Trip
                </Link>
              </div>
            )}

            {/* Customer View */}
            {isAuthenticated && !isAdmin && user && (
              <div className="flex items-center gap-3">
                <Link
                  to="/customer"
                  className={`flex items-center gap-1.5 text-xs font-medium transition-colors py-1 ${
                    isScrolled ? 'text-stone-700 hover:text-[#087F8C]' : 'text-stone-100 hover:text-[#F3D6A4]'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </Link>

                <Link
                  to="/customer/bookings"
                  className={`flex items-center gap-1.5 text-xs font-medium transition-colors py-1 ${
                    isScrolled ? 'text-stone-700 hover:text-[#087F8C]' : 'text-stone-100 hover:text-[#F3D6A4]'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Bookings</span>
                </Link>

                <Link
                  to="/customer/profile"
                  className={`flex items-center gap-2 pl-2 pr-3 py-1 rounded-full text-xs transition-colors border ${
                    isScrolled
                      ? 'bg-stone-100 hover:bg-stone-200 border-stone-200 text-[#193238]'
                      : 'bg-white/15 hover:bg-white/20 border-white/20 text-white'
                  }`}
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
                  className={`p-1.5 rounded-lg transition-colors ${
                    isScrolled ? 'text-stone-500 hover:text-rose-600 hover:bg-stone-100' : 'text-stone-200 hover:text-rose-300 hover:bg-white/10'
                  }`}
                  title="Sign Out"
                  aria-label="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Admin View */}
            {isAuthenticated && isAdmin && user && (
              <div className="flex items-center gap-3">
                <Link
                  to="/admin"
                  className={`flex items-center gap-1.5 text-xs font-medium transition-colors py-1 ${
                    location.pathname === '/admin' 
                      ? 'text-[#E7B85C] font-semibold' 
                      : isScrolled ? 'text-stone-700 hover:text-[#087F8C]' : 'text-stone-100 hover:text-white'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Overview</span>
                </Link>

                <Link
                  to="/admin/bookings"
                  className={`flex items-center gap-1.5 text-xs font-medium transition-colors py-1 ${
                    location.pathname === '/admin/bookings' 
                      ? 'text-[#E7B85C] font-semibold' 
                      : isScrolled ? 'text-stone-700 hover:text-[#087F8C]' : 'text-stone-100 hover:text-white'
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
                      isScrolled ? 'text-stone-700 hover:text-[#087F8C]' : 'text-stone-100 hover:text-white'
                    }`}
                  >
                    <span>Management</span>
                    <ChevronDown className="w-3 h-3 text-[#E7B85C]" />
                  </button>

                  {adminMenuOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-52 bg-white border border-stone-200 rounded-2xl shadow-xl py-2 z-50 animate-fadeIn text-xs text-[#193238]"
                      onMouseLeave={() => setAdminMenuOpen(false)}
                    >
                      <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#087F8C] border-b border-stone-100">
                        Admin Controls
                      </div>
                      {adminMgmtLinks.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          onClick={() => setAdminMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3.5 py-2 hover:bg-[#FFF9EF] text-stone-700 hover:text-[#087F8C] transition-colors"
                        >
                          <item.icon className="w-3.5 h-3.5 text-[#087F8C]" />
                          <span>{item.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleLogout}
                  className={`p-1.5 rounded-lg transition-colors ${
                    isScrolled ? 'text-stone-500 hover:text-rose-600 hover:bg-stone-100' : 'text-stone-200 hover:text-rose-300 hover:bg-white/10'
                  }`}
                  title="Sign Out"
                  aria-label="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-xl focus:outline-none transition-colors ${
                isScrolled ? 'text-[#075E67] hover:bg-stone-100' : 'text-white hover:bg-white/10'
              }`}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#E7B85C]" /> : <Menu className="w-5 h-5 text-[#E7B85C]" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#075E67] border-t border-white/10 px-4 pt-3 pb-6 space-y-3 shadow-xl animate-fadeIn">
          
          {/* Public Nav Links */}
          {!isAdmin && (
            <div className="space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => `
                    block px-3 py-2 rounded-xl text-sm font-medium transition-colors
                    ${isActive ? 'bg-white/15 text-[#F3D6A4] font-semibold' : 'text-stone-100 hover:text-white'}
                  `}
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          )}

          {/* Guest Mobile Links */}
          {!isAuthenticated && (
            <div className="border-t border-white/10 pt-3 space-y-2">
              <Link
                to="/customize"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full py-2.5 text-center text-xs font-semibold rounded-xl bg-[#087F8C] text-white shadow-xs"
              >
                Plan Your Trip
              </Link>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full py-2.5 text-center text-xs font-medium rounded-xl bg-white/10 text-white"
              >
                Sign In
              </Link>
            </div>
          )}

          {/* Customer Mobile Links */}
          {isAuthenticated && !isAdmin && user && (
            <div className="border-t border-white/10 pt-3 space-y-1.5 text-xs text-stone-100">
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
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 text-stone-100"
              >
                <LayoutDashboard className="w-4 h-4 text-[#F3D6A4]" />
                <span>Dashboard Overview</span>
              </Link>
              <Link
                to="/customer/bookings"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 text-stone-100"
              >
                <Calendar className="w-4 h-4 text-[#F3D6A4]" />
                <span>My Bookings</span>
              </Link>
              <Link
                to="/customer/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 text-stone-100"
              >
                <UserIcon className="w-4 h-4 text-[#F3D6A4]" />
                <span>My Profile</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-rose-300 w-full text-left rounded-xl hover:bg-white/10"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}

          {/* Admin Mobile Links */}
          {isAuthenticated && isAdmin && (
            <div className="border-t border-white/10 pt-3 space-y-1 text-xs text-stone-100">
              <div className="px-3 py-1 font-bold uppercase tracking-wider text-[#F3D6A4] text-[10px]">
                Admin Console
              </div>
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 text-stone-100"
              >
                <LayoutDashboard className="w-4 h-4 text-[#F3D6A4]" />
                <span>Dashboard Overview</span>
              </Link>
              <Link
                to="/admin/bookings"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 text-stone-100"
              >
                <Calendar className="w-4 h-4 text-[#F3D6A4]" />
                <span>All Tour Bookings</span>
              </Link>
              {adminMgmtLinks.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 text-stone-100"
                >
                  <item.icon className="w-4 h-4 text-[#F3D6A4]" />
                  <span>{item.name}</span>
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-rose-300 w-full text-left rounded-xl hover:bg-white/10"
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
