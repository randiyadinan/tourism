import React, { createContext, useContext, useState, useEffect } from 'react';
import type { NotificationItem } from '../types';
import { notificationService } from '../services/notificationService';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  refreshNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const refreshNotifications = () => {
    if (user) {
      const items = notificationService.getNotifications(user.id);
      setNotifications(items);
    } else {
      setNotifications([]);
    }
  };

  useEffect(() => {
    refreshNotifications();
  }, [user]);

  const markAsRead = (id: string) => {
    notificationService.markAsRead(id);
    refreshNotifications();
  };

  const markAllAsRead = () => {
    if (user) {
      notificationService.markAllAsRead(user.id);
      refreshNotifications();
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        refreshNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within a NotificationProvider');
  return context;
};
