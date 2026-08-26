import React from 'react';
import { NavLink, useNavigate, Outlet, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MapPin, 
  Calendar, 
  User, 
  Heart, 
  CreditCard, 
  Bell, 
  LogOut, 
  Compass, 
  
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { useNotifications } from '../../context/NotificationContext';
import { TopAnnouncement } from '../common/TopAnnouncement';

export const CustomerSidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const { count: wishlistCount } = useWishlist();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', href: '/customer', icon: LayoutDashboard },
    { name: 'My Trips Timeline', href: '/customer/trips', icon: MapPin },
    { name: 'My Bookings & Vouchers', href: '/customer/bookings', icon: Calendar },
    { name: 'My Profile', href: '/customer/profile', icon: User },
    { name: 'Saved Wishlist', href: '/customer/wishlist', icon: Heart, badge: wishlistCount },
    { name: 'Payments & Invoices', href: '/customer/payments', icon: CreditCard },
    { name: 'Notifications', href: '/customer/notifications', icon: Bell, badge: unreadCount, badgeColor: 'red' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="w-full lg:w-64 bg-white rounded-3xl border border-stone-200 p-6 shadow-sm flex flex-col justify-between shrink-0 space-y-6">
      <div className="space-y-6">
        {/* User Card */}
        <div className="flex items-center gap-3 p-3 bg-[#F8F7F2] rounded-2xl border border-stone-200/80">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
            alt={user?.name}
            className="w-12 h-12 rounded-xl object-cover border-2 border-[#176B52]"
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
                  flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all
                  ${isActive 
                    ? 'bg-[#0B3D2E] text-white shadow-md' 
                    : 'text-stone-600 hover:bg-[#F8F7F2] hover:text-[#062C22]'
                  }
                `}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-[#176B52]" />
                  <span>{item.name}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    item.badgeColor === 'red' ? 'bg-rose-500 text-white' : 'bg-[#176B52] text-[#062C22]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer / Logout */}
      <div className="pt-4 border-t border-stone-100 space-y-2">
        <Link
          to="/"
          className="flex items-center justify-between px-3.5 py-2 text-xs font-semibold text-stone-600 hover:text-[#0B3D2E] transition-colors"
        >
          <span className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#176B52]" />
            Explore Site
          </span>
          <ChevronRight className="w-4 h-4 text-stone-400" />
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export const CustomerLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8F7F2] flex flex-col">
      <TopAnnouncement />
      
      {/* Simple Top Banner for Portal */}
      <div className="bg-[#062C22] border-b border-[#176B52]/20 py-4 px-4 sm:px-8 text-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#39A982]" />
            <span className="font-serif text-xl font-bold tracking-wide">
              Lanka<span className="text-[#39A982]">Voyage</span>
            </span>
            <span className="text-xs text-stone-400 pl-2 ml-2 border-l border-white/20 hidden sm:inline">
              Guest Portal
            </span>
          </Link>

          <div className="flex items-center gap-3 text-xs">
            <Link to="/tours" className="text-stone-300 hover:text-white">Explore Tours</Link>
            <Link to="/customize" className="text-[#39A982] font-bold hover:underline">Plan Custom Trip</Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <CustomerSidebar />
          <main className="flex-1 w-full min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
