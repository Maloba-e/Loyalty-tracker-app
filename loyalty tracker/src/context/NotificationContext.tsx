import React, { createContext, useContext, ReactNode } from 'react';
import { useNotifications, Notification } from '../hooks/useNotifications';

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => string;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  notifySuccess: (title: string, message: string, action?: Notification['action']) => string;
  notifyError: (title: string, message: string, action?: Notification['action']) => string;
  notifyWarning: (title: string, message: string, action?: Notification['action']) => string;
  notifyInfo: (title: string, message: string, action?: Notification['action']) => string;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const notificationHook = useNotifications();

  return (
    <NotificationContext.Provider value={notificationHook}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};