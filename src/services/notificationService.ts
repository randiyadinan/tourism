import type { NotificationItem } from '../types';

const NOTIFICATIONS_KEY = 'lv_notifications';

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'user-customer-1',
    title: 'Booking Confirmed: Grand Highlights Tour',
    message: 'Your 10-Day Sri Lanka Grand Highlights & Heritage tour starting Oct 15, 2026 is confirmed. Chauffeur guide Roshan Silva is assigned.',
    type: 'booking',
    isRead: false,
    linkUrl: '/customer/bookings/bk-1001',
    createdAt: '2026-08-20T10:00:00Z'
  },
  {
    id: 'notif-2',
    userId: 'user-customer-1',
    title: 'Flight Tracking Alert (UL 504)',
    message: 'We have registered your flight UL 504 arriving at 14:30. Our airport representative will hold a personalized LankaVoyage tablet sign at Arrivals Exit.',
    type: 'trip_update',
    isRead: false,
    linkUrl: '/customer/trips',
    createdAt: '2026-08-22T08:30:00Z'
  },
  {
    id: 'notif-3',
    userId: 'user-customer-1',
    title: 'Seasonal Promo: 15% Early Bird Savings',
    message: 'Plan your 2027 holiday early using promo code EARLYBIRD for 15% off.',
    type: 'promo',
    isRead: true,
    linkUrl: '/tours',
    createdAt: '2026-08-15T14:10:00Z'
  }
];

export const notificationService = {
  getNotifications(userId: string): NotificationItem[] {
    const data = localStorage.getItem(NOTIFICATIONS_KEY);
    if (!data) {
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS.filter(n => n.userId === userId || n.userId === 'all');
    }
    try {
      const all: NotificationItem[] = JSON.parse(data);
      return all.filter(n => n.userId === userId || n.userId === 'all');
    } catch {
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS.filter(n => n.userId === userId || n.userId === 'all');
    }
  },

  markAsRead(id: string): void {
    const data = localStorage.getItem(NOTIFICATIONS_KEY);
    if (!data) return;
    try {
      const all: NotificationItem[] = JSON.parse(data);
      const item = all.find(n => n.id === id);
      if (item) {
        item.isRead = true;
        localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(all));
      }
    } catch {
      // ignore
    }
  },

  markAllAsRead(userId: string): void {
    const data = localStorage.getItem(NOTIFICATIONS_KEY);
    if (!data) return;
    try {
      const all: NotificationItem[] = JSON.parse(data);
      all.forEach(n => {
        if (n.userId === userId || n.userId === 'all') n.isRead = true;
      });
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(all));
    } catch {
      // ignore
    }
  },

  addNotification(notif: Omit<NotificationItem, 'id' | 'createdAt' | 'isRead'>): NotificationItem {
    let all: NotificationItem[] = INITIAL_NOTIFICATIONS;
    const data = localStorage.getItem(NOTIFICATIONS_KEY);
    if (data) {
      try {
        all = JSON.parse(data);
      } catch {
        all = INITIAL_NOTIFICATIONS;
      }
    }
    const newItem: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}`,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    all.unshift(newItem);
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(all));
    return newItem;
  }
};
