import React, { useState } from 'react';
import { 
  Bell, 
  Send, 
  Users, 
  CheckCheck, 
  Plus, 
  Calendar, 
  Plane, 
  Sparkles,
  X 
} from 'lucide-react';
import { notificationService } from '../../services/notificationService';
import { authService } from '../../services/authService';
import type { NotificationItem } from '../../types';

export const AdminNotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => notificationService.getNotifications('all'));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetUser, setTargetUser] = useState<string>('all');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'booking' | 'trip_update' | 'promo' | 'system'>('system');
  const [linkUrl, setLinkUrl] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const users = authService.getUsers().filter(u => u.role === 'customer');

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    const newNotif = notificationService.addNotification({
      userId: targetUser,
      title,
      message,
      type,
      linkUrl: linkUrl || undefined
    });

    setNotifications([newNotif, ...notifications]);
    setIsModalOpen(false);
    setTitle('');
    setMessage('');
    setLinkUrl('');
    setSuccessMsg('Notification broadcast successfully.');
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#082F24]">Notification & Broadcast Center</h1>
          <p className="text-xs text-stone-500">Send concierge alerts, itinerary updates, and promotional travel announcements.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#0D3B2E] text-white hover:bg-[#134E3F] text-xs font-bold rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 text-[#E5C378]" />
          <span>New Notification</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 flex items-center gap-2">
          <CheckCheck className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Grid of Broadcasts */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
        <h3 className="font-serif font-bold text-base text-[#082F24]">Dispatched Announcements</h3>

        {notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className="p-4 rounded-2xl border border-stone-200 hover:border-stone-300 transition-all flex items-start gap-4"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  notif.type === 'booking'
                    ? 'bg-emerald-100 text-emerald-800'
                    : notif.type === 'trip_update'
                    ? 'bg-blue-100 text-blue-800'
                    : notif.type === 'promo'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-[#0D3B2E]/10 text-[#0D3B2E]'
                }`}>
                  {notif.type === 'booking' ? <Calendar className="w-5 h-5" /> : notif.type === 'trip_update' ? <Plane className="w-5 h-5" /> : notif.type === 'promo' ? <Sparkles className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-[#082F24]">{notif.title}</h4>
                    <span className="text-[10px] text-stone-400">
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">{notif.message}</p>
                  <div className="flex items-center gap-3 pt-1 text-[10px] text-stone-400">
                    <span className="flex items-center gap-1 font-semibold text-[#8C6D2B]">
                      <Users className="w-3 h-3" />
                      Recipient: {notif.userId === 'all' ? 'All Customers' : notif.userId}
                    </span>
                    <span>•</span>
                    <span className="capitalize">{notif.type.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-xs text-stone-400">No active notifications sent.</div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <h3 className="font-serif text-xl font-bold text-[#082F24]">Create Announcement / Alert</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendNotification} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#082F24]">Target Recipient</label>
                <select
                  value={targetUser}
                  onChange={(e) => setTargetUser(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2 text-xs text-[#082F24]"
                >
                  <option value="all">Broadcast to All Customers</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-[#082F24]">Notification Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2 text-xs text-[#082F24]"
                  >
                    <option value="system">System Notice</option>
                    <option value="booking">Booking Update</option>
                    <option value="trip_update">Flight / Transfer</option>
                    <option value="promo">Special Promotion</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#082F24]">Target Link (Optional)</label>
                  <input
                    type="text"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="/customer/bookings"
                    className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2 text-xs text-[#082F24]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#082F24]">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Flight UL 504 Chauffeur Assigned"
                  className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2 text-xs text-[#082F24]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#082F24]">Message Content</label>
                <textarea
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Provide essential details or itinerary updates..."
                  className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2 text-xs text-[#082F24]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 text-stone-600 font-bold rounded-xl hover:bg-stone-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0D3B2E] text-white font-bold rounded-xl hover:bg-[#134E3F] inline-flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Notification</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
