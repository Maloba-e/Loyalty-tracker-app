import React from 'react';
import { 
  Home, 
  UserCheck, 
  Users, 
  Gift, 
  QrCode, 
  MessageSquare, 
  BarChart3,
  Scissors
} from 'lucide-react';
import { View } from '../App';

interface NavigationProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

const navItems = [
  { id: 'dashboard' as View, label: 'Dashboard', icon: Home },
  { id: 'checkin' as View, label: 'Check In', icon: UserCheck },
  { id: 'customers' as View, label: 'Customers', icon: Users },
  { id: 'rewards' as View, label: 'Rewards', icon: Gift },
  { id: 'qr' as View, label: 'QR Codes', icon: QrCode },
  { id: 'sms' as View, label: 'SMS', icon: MessageSquare },
  { id: 'analytics' as View, label: 'Analytics', icon: BarChart3 },
];

export const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange }) => {
  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden lg:flex lg:fixed lg:top-0 lg:left-0 lg:h-full lg:w-64 lg:flex-col bg-white border-r border-gray-200 shadow-sm z-30">
        <div className="p-4 lg:p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2 lg:space-x-3">
            <div className="flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 bg-emerald-500 rounded-lg">
              <Scissors className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg lg:text-xl font-bold text-gray-900">Loyalty Tracker</h1>
              <p className="text-xs lg:text-sm text-gray-500">Barber & Salon</p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 px-2 lg:px-4 py-4 lg:py-6 space-y-1 lg:space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center space-x-2 lg:space-x-3 px-3 lg:px-4 py-2 lg:py-3 text-left rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className={`w-4 h-4 lg:w-5 lg:h-5 ${isActive ? 'text-emerald-600' : 'text-gray-400'}`} />
                <span className="font-medium text-sm lg:text-base">{item.label}</span>
              </button>
            );
          })}
        </div>
        
        <div className="p-3 lg:p-4 border-t border-gray-200">
          <div className="bg-emerald-50 rounded-lg p-3 lg:p-4">
            <h3 className="text-xs lg:text-sm font-semibold text-emerald-800 mb-1">Pro Tip</h3>
            <p className="text-xs text-emerald-600">Use QR codes for faster customer check-ins!</p>
          </div>
        </div>
      </nav>

      {/* Tablet Navigation */}
      <nav className="hidden md:flex lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 z-30">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-emerald-500 rounded-lg">
              <Scissors className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Loyalty Tracker</h1>
              <p className="text-sm text-gray-500">Barber & Salon</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {navItems.slice(0, 4).map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-1 z-30">
        <div className="flex items-center justify-around">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-200 min-w-0 ${
                  isActive ? 'text-emerald-600' : 'text-gray-400'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-xs font-medium truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};