import { useState, useEffect, useCallback } from 'react';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      duration: notification.duration || 5000
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Auto-remove notification after duration
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, newNotification.duration);
    }

    return newNotification.id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Success notification shorthand
  const notifySuccess = useCallback((title: string, message: string, action?: Notification['action']) => {
    return addNotification({ type: 'success', title, message, action });
  }, [addNotification]);

  // Error notification shorthand
  const notifyError = useCallback((title: string, message: string, action?: Notification['action']) => {
    return addNotification({ type: 'error', title, message, duration: 0, action }); // Errors don't auto-dismiss
  }, [addNotification]);

  // Warning notification shorthand
  const notifyWarning = useCallback((title: string, message: string, action?: Notification['action']) => {
    return addNotification({ type: 'warning', title, message, action });
  }, [addNotification]);

  // Info notification shorthand
  const notifyInfo = useCallback((title: string, message: string, action?: Notification['action']) => {
    return addNotification({ type: 'info', title, message, action });
  }, [addNotification]);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyInfo
  };
};