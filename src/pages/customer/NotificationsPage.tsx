import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Bell, 
  CheckCheck, 
  Calendar, 
  Plane, 
   
   
  ArrowRight } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { EmptyState } from '../../components/common/EmptyState';

export const NotificationsPage: React.FC = () => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();

  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#082F24]">Notifications & Travel Alerts</h1>
          <p className="text-xs text-stone-500">Trip updates, flight status notices, and concierge messages.</p>
        </div>

        {notifications.some(n => !n.isRead) && (
          <button
            onClick={markAllAsRead}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-stone-200 text-xs font-bold text-[#0D3B2E] rounded-xl hover:bg-stone-50 shadow-xs"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => markAsRead(notif.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                notif.isRead
                  ? 'bg-white border-stone-200 text-stone-600'
                  : 'bg-white border-[#C5A059] shadow-sm ring-1 ring-[#C5A059]/20'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                notif.type === 'booking'
                  ? 'bg-emerald-100 text-emerald-800'
                  : notif.type === 'trip_update'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-[#0D3B2E]/10 text-[#0D3B2E]'
              }`}>
                {notif.type === 'booking' ? <Calendar className="w-5 h-5" /> : notif.type === 'trip_update' ? <Plane className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
              </div>

              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-[#082F24]">{notif.title}</h4>
                  <span className="text-[11px] text-stone-400">
                    {new Date(notif.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">{notif.message}</p>
                {notif.linkUrl && (
                  <Link
                    to={notif.linkUrl}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#0D3B2E] pt-1 hover:underline"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Bell}
          title="No Notifications"
          description="You are all caught up! New alerts regarding your trips and vouchers will appear here."
        />
      )}

    </div>
  );
};
