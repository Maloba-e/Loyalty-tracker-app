import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Database, AlertCircle } from 'lucide-react';

export const ConnectionStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowStatus(true);
      setTimeout(() => setShowStatus(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowStatus(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Show status initially if offline
    if (!navigator.onLine) {
      setShowStatus(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showStatus && isOnline) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 p-3 rounded-lg shadow-lg transition-all duration-300 ${
      isOnline 
        ? 'bg-emerald-50 border border-emerald-200' 
        : 'bg-orange-50 border border-orange-200'
    }`}>
      <div className="flex items-center space-x-2">
        {isOnline ? (
          <>
            <Wifi className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-800">Back online</span>
            <Database className="w-4 h-4 text-emerald-600" />
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-800">Working offline</span>
            <AlertCircle className="w-4 h-4 text-orange-600" />
          </>
        )}
      </div>
      {!isOnline && (
        <p className="text-xs text-orange-600 mt-1">
          Data will sync when connection returns
        </p>
      )}
    </div>
  );
};