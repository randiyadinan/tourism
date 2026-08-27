import React, { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  MapPin, 
  Car, 
  Plane,
  LogOut, 
  Compass, 
  Menu, 
  X,
  Eye
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { TopAnnouncement } from '../common/TopAnnouncement';

export const AdminLayout: React.FC = () => {
  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, end: true },
    { name: 'Customer Bookings', href: '/admin/bookings', icon: Compass },
    { name: 'Customer Profiles', href: '/admin/customers', icon: Eye },
    { name: 'Business Reports', href: '/admin/reports', icon: LayoutDashboard },
    { name: 'Tours & Itineraries', href: '/admin/tours', icon: BookOpen },
    { name: 'Vehicle Daily Rates', href: '/admin/vehicles', icon: Car },
    { name: 'Destinations & Tickets', href: '/admin/destinations', icon: MapPin },
    { name: 'Airport Transfer Rates', href: '/admin/airport-transfers', icon: Plane },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F8F7F2] flex flex-col">
      <TopAnnouncement />

      {/* Admin Topbar */}
      <header className="bg-[#062C22] text-white border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl text-stone-200 hover:bg-white/10"
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link to="/admin" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#39A982] flex items-center justify-center text-white">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <span className="font-serif text-lg font-bold text-white block leading-tight">LankaVoyage</span>
                <span className="text-[9px] uppercase tracking-wider text-[#39A982] font-bold block">Admin Console</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-stone-200 text-xs font-semibold transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-[#39A982]" />
              <span className="hidden sm:inline">View Live Site</span>
            </Link>

            <button
              onClick={handleLogout}
              className="p-2 text-stone-400 hover:text-rose-400 rounded-xl transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Sidebar Navigation */}
        <aside className="hidden lg:block lg:col-span-3 liquid-glass-white p-5 rounded-3xl border border-white/80 shadow-[0_10px_30px_-10px_rgba(6,44,34,0.08)] space-y-2">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider px-3 block mb-2">
            Website Controls
          </span>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-[#0B3D2E] text-white shadow-xs'
                        : 'text-stone-600 hover:bg-[#F8F7F2] hover:text-[#062C22]'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 text-[#39A982]" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="lg:hidden col-span-1 bg-white p-4 rounded-2xl border border-stone-200 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  end={item.end}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold ${
                      isActive
                        ? 'bg-[#0B3D2E] text-white'
                        : 'text-stone-600 hover:bg-stone-50'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 text-[#39A982]" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </div>
        )}

        {/* Content Outlet */}
        <main className="lg:col-span-9">
          <Outlet />
        </main>

      </div>
    </div>
  );
};
