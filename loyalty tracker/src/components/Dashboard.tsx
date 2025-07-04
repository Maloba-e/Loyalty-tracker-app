import React, { useContext, useEffect } from 'react';
import { Users, UserCheck, Gift, TrendingUp, Calendar, Clock, Database } from 'lucide-react';
import { LoyaltyContext } from '../context/LoyaltyContext';
import { StatsCard } from './ui/StatsCard';
import { RecentActivity } from './ui/RecentActivity';
import { LiveStats } from './ui/LiveStats';
import { DataManager } from './DataManager';
import { useRealTimeUpdates } from '../hooks/useRealTimeUpdates';
import { View } from '../App';

interface DashboardProps {
  onViewChange?: (view: View) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onViewChange }) => {
  const { customers, visits, rewards, isLoading } = useContext(LoyaltyContext);
  
  // Enable real-time updates
  useRealTimeUpdates();

  // Listen for navigation events
  useEffect(() => {
    const handleNavigation = (event: CustomEvent) => {
      const view = event.detail as View;
      if (onViewChange) {
        onViewChange(view);
      }
    };

    window.addEventListener('navigate-to', handleNavigation as EventListener);
    return () => {
      window.removeEventListener('navigate-to', handleNavigation as EventListener);
    };
  }, [onViewChange]);

  if (isLoading) {
    return (
      <div className="p-3 sm:p-4 md:p-6 lg:p-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your data...</p>
          </div>
        </div>
      </div>
    );
  }

  const totalCustomers = customers.length;
  const totalVisits = visits.length;
  const rewardsEarned = rewards.filter(r => r.status === 'earned').length;
  const rewardsRedeemed = rewards.filter(r => r.status === 'redeemed').length;

  const todayVisits = visits.filter(visit => {
    const today = new Date();
    const visitDate = new Date(visit.timestamp);
    return visitDate.toDateString() === today.toDateString();
  }).length;

  const weeklyGrowth = 12.5; // Mock data
  const avgVisitsPerCustomer = totalCustomers ? (totalVisits / totalCustomers).toFixed(1) : '0';

  const handleQuickAction = (view: View) => {
    if (onViewChange) {
      onViewChange(view);
    }
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="mb-6 lg:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Welcome back! 👋
        </h1>
        <p className="text-sm sm:text-base text-gray-600">Here's what's happening at your salon today.</p>
      </div>

      {/* Live Stats with Real-time Updates */}
      <LiveStats
        customers={totalCustomers}
        visits={totalVisits}
        rewards={rewardsEarned + rewardsRedeemed}
        todayVisits={todayVisits}
      />

      {/* Main Content Grid */}
      <div className="grid xl:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <div className="xl:col-span-2">
          <RecentActivity />
        </div>
        
        <div className="space-y-4 lg:space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
            <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4">Quick Actions</h3>
            <div className="space-y-2 lg:space-y-3">
              <button 
                onClick={() => handleQuickAction('checkin')}
                className="w-full flex items-center justify-between p-3 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors duration-200 cursor-pointer"
              >
                <div className="flex items-center space-x-2 lg:space-x-3">
                  <UserCheck className="w-4 h-4 lg:w-5 lg:h-5 text-emerald-600" />
                  <span className="text-sm lg:text-base text-emerald-700 font-medium">New Check-in</span>
                </div>
              </button>
              <button 
                onClick={() => handleQuickAction('customers')}
                className="w-full flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200 cursor-pointer"
              >
                <div className="flex items-center space-x-2 lg:space-x-3">
                  <Users className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
                  <span className="text-sm lg:text-base text-blue-700 font-medium">Add Customer</span>
                </div>
              </button>
              <button 
                onClick={() => handleQuickAction('rewards')}
                className="w-full flex items-center justify-between p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors duration-200 cursor-pointer"
              >
                <div className="flex items-center space-x-2 lg:space-x-3">
                  <Gift className="w-4 h-4 lg:w-5 lg:h-5 text-orange-600" />
                  <span className="text-sm lg:text-base text-orange-700 font-medium">Redeem Reward</span>
                </div>
              </button>
            </div>
          </div>

          {/* Today's Highlights */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
            <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4">Today's Highlights</h3>
            <div className="space-y-3 lg:space-y-4">
              <div className="flex items-center space-x-2 lg:space-x-3">
                <div className="flex items-center justify-center w-6 h-6 lg:w-8 lg:h-8 bg-emerald-100 rounded-full">
                  <Calendar className="w-3 h-3 lg:w-4 lg:h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs lg:text-sm font-medium text-gray-900">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                  <p className="text-xs text-gray-500">Peak hours: 2-6 PM</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 lg:space-x-3">
                <div className="flex items-center justify-center w-6 h-6 lg:w-8 lg:h-8 bg-blue-100 rounded-full">
                  <Clock className="w-3 h-3 lg:w-4 lg:h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs lg:text-sm font-medium text-gray-900">Average wait time</p>
                  <p className="text-xs text-gray-500">15 minutes</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 lg:space-x-3">
                <div className="flex items-center justify-center w-6 h-6 lg:w-8 lg:h-8 bg-purple-100 rounded-full">
                  <Database className="w-3 h-3 lg:w-4 lg:h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs lg:text-sm font-medium text-gray-900">Data automatically saved</p>
                  <p className="text-xs text-gray-500">Real-time backup active</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Management Section */}
      <DataManager />
    </div>
  );
};