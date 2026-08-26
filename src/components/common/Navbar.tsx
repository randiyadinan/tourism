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
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.href}
                className={({ isActive }) => `
                  text-sm font-medium tracking-normal transition-colors duration-200
                  ${isActive 
                    ? isScrolled ? 'text-[#176B52] font-bold' : 'text-[#DDEFE8] font-bold drop-shadow-xs'
                    : isScrolled ? 'text-[#17231F]/80 hover:text-[#176B52]' : 'text-stone-100 hover:text-white'
                  }
                `}
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Controls & Primary CTA */}
          <div className="hidden lg:flex items-center gap-4">
            
            {/* Guest View */}
            {!isAuthenticated && (
              <div className="flex items-center gap-3.5">
                <Link
                  to="/login"
                  className={`text-xs font-medium transition-colors ${
                    isScrolled ? 'text-[#17231F]/80 hover:text-[#176B52]' : 'text-stone-100 hover:text-white'
                  }`}
                >
                  Sign In
                </Link>
                <Link
                  to="/customize"
                  className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-[#0B3D2E] hover:bg-[#176B52] text-white shadow-xs hover:shadow-md transition-all transform hover:-translate-y-0.5 border border-white/10"
                >
                  Plan Your Trip
                </Link>
              </div>
            )}

            {/* Customer Logged In */}
            {isAuthenticated && !isAdmin && user && (
              <div className="flex items-center gap-3">
                <Link
                  to="/customer"
                  className={`flex items-center gap-1.5 text-xs font-medium transition-colors py-1 ${
                    isScrolled ? 'text-[#17231F] hover:text-[#176B52]' : 'text-stone-100 hover:text-[#DDEFE8]'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </Link>

                <Link
                  to="/customer/bookings"
                  className={`flex items-center gap-1.5 text-xs font-medium transition-colors py-1 ${
                    isScrolled ? 'text-[#17231F] hover:text-[#176B52]' : 'text-stone-100 hover:text-[#DDEFE8]'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Bookings</span>
                </Link>

                <Link
                  to="/customer/profile"
                  className={`flex items-center gap-2 pl-2 pr-3 py-1 rounded-full text-xs transition-colors border ${
                    isScrolled
                      ? 'bg-stone-100/80 hover:bg-stone-200/80 border-stone-200 text-[#17231F]'
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
                    isScrolled ? 'text-stone-500 hover:text-rose-600 hover:bg-stone-100' : 'text-stone-300 hover:text-rose-300 hover:bg-white/10'
                  }`}
                  title="Sign Out"
                  aria-label="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Admin Logged In */}
            {isAuthenticated && isAdmin && user && (
              <div className="flex items-center gap-3">
                <Link
                  to="/admin"
                  className={`flex items-center gap-1.5 text-xs font-medium transition-colors py-1 ${
                    location.pathname === '/admin' 
                      ? 'text-[#39A982] font-semibold' 
                      : isScrolled ? 'text-[#17231F] hover:text-[#176B52]' : 'text-stone-100 hover:text-white'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Overview</span>
                </Link>

                <Link
                  to="/admin/bookings"
                  className={`flex items-center gap-1.5 text-xs font-medium transition-colors py-1 ${
                    location.pathname === '/admin/bookings' 
                      ? 'text-[#39A982] font-semibold' 
                      : isScrolled ? 'text-[#17231F] hover:text-[#176B52]' : 'text-stone-100 hover:text-white'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Bookings</span>
                </Link>

                <div className="relative">
                  <button
                    onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                    className={`flex items-center gap-1 text-xs font-medium transition-colors py-1 ${
                      isScrolled ? 'text-[#17231F] hover:text-[#176B52]' : 'text-stone-100 hover:text-white'
                    }`}
                  >
                    <span>Management</span>
                    <ChevronDown className="w-3 h-3 text-[#39A982]" />
                  </button>

                  {adminMenuOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-52 bg-white/95 backdrop-blur-xl border border-stone-200 rounded-2xl shadow-xl py-2 z-50 animate-fadeIn text-xs text-[#17231F]"
                      onMouseLeave={() => setAdminMenuOpen(false)}
                    >
                      <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#176B52] border-b border-stone-100">
                        Admin Controls
                      </div>
                      {adminMgmtLinks.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          onClick={() => setAdminMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3.5 py-2 hover:bg-[#F8F7F2] text-stone-700 hover:text-[#176B52] transition-colors"
                        >
                          <item.icon className="w-3.5 h-3.5 text-[#176B52]" />
                          <span>{item.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleLogout}
                  className={`p-1.5 rounded-lg transition-colors ${
                    isScrolled ? 'text-stone-500 hover:text-rose-600 hover:bg-stone-100' : 'text-stone-300 hover:text-rose-300 hover:bg-white/10'
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
                isScrolled ? 'text-[#0B3D2E] hover:bg-stone-100' : 'text-white hover:bg-white/10'
              }`}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#39A982]" /> : <Menu className="w-5 h-5 text-[#39A982]" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Glass Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#062C22]/95 backdrop-blur-2xl border-t border-white/10 px-4 pt-3 pb-6 space-y-3 shadow-2xl animate-fadeIn text-white">
          {!isAdmin && (
            <div className="space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => `
                    block px-3 py-2 rounded-xl text-sm font-medium transition-colors
                    ${isActive ? 'bg-white/15 text-[#DDEFE8] font-bold' : 'text-stone-200 hover:text-white'}
                  `}
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          )}

          {!isAuthenticated && (
            <div className="border-t border-white/10 pt-3 space-y-2">
              <Link
                to="/customize"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full py-2.5 text-center text-xs font-semibold rounded-xl bg-[#176B52] text-white shadow-xs"
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
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 text-stone-200"
              >
                <LayoutDashboard className="w-4 h-4 text-[#39A982]" />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/customer/bookings"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 text-stone-200"
              >
                <Calendar className="w-4 h-4 text-[#39A982]" />
                <span>My Bookings</span>
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

          {isAuthenticated && isAdmin && (
            <div className="border-t border-white/10 pt-3 space-y-1 text-xs text-stone-200">
              <div className="px-3 py-1 font-bold uppercase tracking-wider text-[#39A982] text-[10px]">
                Admin Console
              </div>
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10"
              >
                <LayoutDashboard className="w-4 h-4 text-[#39A982]" />
                <span>Overview</span>
              </Link>
              <Link
                to="/admin/bookings"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10"
              >
                <Calendar className="w-4 h-4 text-[#39A982]" />
                <span>Bookings</span>
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
        </div>
      )}
    </header>
  );
};
