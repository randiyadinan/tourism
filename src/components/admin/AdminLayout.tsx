import React, { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  MapPin, 
  Activity as ActivityIcon, 
  Hotel, 
  Car, 
  Users, 
  Calendar, 
  CreditCard, 
  Star, 
  Percent, 
  BarChart3, 
  LogOut, 
  Compass, 
  Menu, 
  X,
  Plane,
  Bell,
  Settings,
  Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { TopAnnouncement } from '../common/TopAnnouncement';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const menuSections = [
    {
      title: 'Operations',
      items: [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Bookings', href: '/admin/bookings', icon: Calendar },
        { name: 'Airport Transfers', href: '/admin/transfers', icon: Plane },
        { name: 'Payments', href: '/admin/payments', icon: CreditCard },
        { name: 'Customers', href: '/admin/customers', icon: Users },
      ]
    },
    {
      title: 'Catalog & Inventory',
      items: [
        { name: 'Tours', href: '/admin/tours', icon: BookOpen },
        { name: 'Destinations', href: '/admin/destinations', icon: MapPin },
        { name: 'Activities', href: '/admin/activities', icon: ActivityIcon },
        { name: 'Hotels', href: '/admin/hotels', icon: Hotel },
        { name: 'Fleet & Vehicles', href: '/admin/vehicles', icon: Car },
      ]
    },
    {
      title: 'Marketing & System',
      items: [
        { name: 'Reviews', href: '/admin/reviews', icon: Star },
        { name: 'Coupons', href: '/admin/discounts', icon: Percent },
        { name: 'Notifications', href: '/admin/notifications', icon: Bell },
        { name: 'Reports & Analytics', href: '/admin/reports', icon: BarChart3 },
        { name: 'Settings', href: '/admin/settings', icon: Settings },
      ]
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F3EFEA] flex flex-col font-sans">
      <TopAnnouncement />

      {/* Admin Topbar */}
      <header className="bg-[#082F24] border-b border-[#C5A059]/20 text-white px-4 sm:px-8 py-3.5 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-1.5 rounded-lg bg-white/10 text-white"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Link to="/admin" className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-[#E5C378]" />
              <span className="font-serif text-xl font-bold tracking-wide">
                Lanka<span className="text-[#E5C378]">Voyage</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-[#C5A059] text-[#082F24] ml-2">
                Admin Suite
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-stone-300 hover:text-white bg-white/10 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Compass className="w-3.5 h-3.5 text-[#C5A059]" />
              View Public Website
            </Link>

            <div className="flex items-center gap-2">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'}
                alt="Admin"
                className="w-8 h-8 rounded-full border border-[#C5A059] object-cover"
              />
              <span className="text-xs font-semibold hidden md:inline">{user?.name || 'Administrator'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Admin Navigation Sidebar */}
        <aside className={`w-full lg:w-64 bg-white rounded-3xl border border-stone-200 p-6 shadow-sm shrink-0 space-y-6 ${mobileOpen ? 'block' : 'hidden lg:block'}`}>
          <div className="space-y-6">
            {menuSections.map((section, sIdx) => (
              <div key={sIdx} className="space-y-2">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block px-3">
                  {section.title}
                </span>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.name}
                        to={item.href}
                        end={item.href === '/admin'}
                        onClick={() => setMobileOpen(false)}
                        className={({ isActive }) => `
                          flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all
                          ${isActive 
                            ? 'bg-[#0D3B2E] text-white shadow-md' 
                            : 'text-stone-600 hover:bg-[#FAF8F5] hover:text-[#082F24]'
                          }
                        `}
                      >
                        <Icon className="w-4 h-4 text-[#C5A059]" />
                        <span>{item.name}</span>
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-stone-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out Admin</span>
            </button>
          </div>
        </aside>

        {/* Admin Page Content */}
        <main className="flex-1 w-full min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
