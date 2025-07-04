import React from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info, Clock } from 'lucide-react';
import { useNotificationContext } from '../../context/NotificationContext';
import { Notification } from '../../hooks/useNotifications';

export const NotificationCenter: React.FC = () => {
  const { notifications, removeNotification } = useNotificationContext();

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />;
      default:
        return <Info className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStyles = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-emerald-50 border-emerald-200 text-emerald-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return time.toLocaleDateString();
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {notifications.slice(0, 5).map((notification) => (
        <div
          key={notification.id}
          className={`p-4 rounded-lg border shadow-lg transition-all duration-300 transform animate-in slide-in-from-right ${getStyles(notification.type)}`}
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-0.5">
              {getIcon(notification.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-semibold truncate">{notification.title}</h4>
                <button
                  onClick={() => removeNotification(notification.id)}
                  className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <p className="text-sm opacity-90 mb-2">{notification.message}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 text-xs opacity-75">
                  <Clock className="w-3 h-3" />
                  <span>{formatTime(notification.timestamp)}</span>
                </div>
                
                {notification.action && (
                  <button
                    onClick={notification.action.onClick}
                    className="text-xs font-medium underline hover:no-underline transition-all duration-200"
                  >
                    {notification.action.label}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {notifications.length > 5 && (
        <div className="text-center">
          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full shadow-sm">
            +{notifications.length - 5} more notifications
          </span>
        </div>
      )}
    </div>
  );
};