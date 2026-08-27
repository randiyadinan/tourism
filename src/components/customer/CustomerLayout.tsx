import React from 'react';
import { NavLink, useNavigate, Outlet, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  User, 
  CreditCard, 
  LogOut, 
  Compass, 
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { TopAnnouncement } from '../common/TopAnnouncement';

export const CustomerSidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // ONLY 4 simple, useful menu items
  const menuItems = [
    { name: 'Dashboard', href: '/customer', icon: LayoutDashboard },
    { name: 'My Bookings', href: '/customer/bookings', icon: Calendar },
    { name: 'My Profile', href: '/customer/profile', icon: User },
    { name: 'Payments', href: '/customer/payments', icon: CreditCard },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="w-full lg:w-64 liquid-glass-white rounded-3xl border border-white/80 p-6 shadow-[0_10px_30px_-10px_rgba(6,44,34,0.08)] flex flex-col justify-between shrink-0 space-y-6">
      <div className="space-y-6">
        {/* User Card */}
        <div className="flex items-center gap-3 p-3.5 bg-white/70 backdrop-blur-md rounded-2xl border border-stone-200/80 shadow-2xs">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
            alt={user?.name}
            className="w-12 h-12 rounded-xl object-cover border-2 border-[#176B52] shadow-xs"
          />
          <div className="overflow-hidden">
            <h4 className="font-serif font-bold text-sm text-[#062C22] truncate">{user?.name}</h4>
            <span className="text-[11px] text-[#176B52] font-semibold block uppercase tracking-wider">
              {user?.role === 'admin' ? 'Administrator' : 'Verified Traveler'}
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                end={item.href === '/customer'}
                className={({ isActive }) => `
                  flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive 
                      ? 'bg-[#0B3D2E] text-white shadow-xs' 
                      : 'text-stone-600 hover:bg-stone-100 hover:text-[#062C22]'
                  }
                `}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-[#39A982]" />
                  <span>{item.name}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-40" />
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Logout */}
      <div className="pt-4 border-t border-stone-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export const CustomerLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8F7F2] flex flex-col">
      <TopAnnouncement />

      {/* Traveler Header */}
      <header className="bg-[#062C22] text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#39A982] flex items-center justify-center text-white">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif text-lg font-bold text-white block leading-tight">LankaVoyage</span>
              <span className="text-[9px] uppercase tracking-wider text-[#39A982] font-bold block">Traveler Portal</span>
            </div>
          </Link>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <Link to="/" className="text-stone-300 hover:text-white transition-colors">
              Return to Website &rarr;
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
        <CustomerSidebar />
        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
