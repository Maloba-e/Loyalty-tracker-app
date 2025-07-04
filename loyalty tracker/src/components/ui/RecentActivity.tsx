import React, { useContext } from 'react';
import { UserCheck, Gift, Star, Clock } from 'lucide-react';
import { LoyaltyContext } from '../../context/LoyaltyContext';

export const RecentActivity: React.FC = () => {
  const { customers, visits, rewards } = useContext(LoyaltyContext);

  // Combine and sort recent activities
  const recentActivities = [
    ...visits.slice(-5).map(visit => ({
      id: visit.id,
      type: 'checkin' as const,
      customer: customers.find(c => c.id === visit.customerId),
      timestamp: visit.timestamp,
      message: 'checked in'
    })),
    ...rewards.slice(-3).map(reward => ({
      id: reward.id,
      type: 'reward' as const,
      customer: customers.find(c => c.id === reward.customerId),
      timestamp: reward.earnedDate,
      message: reward.status === 'earned' ? 'earned a reward' : 'redeemed a reward'
    }))
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 8);

  const getActivityIcon = (type: 'checkin' | 'reward') => {
    switch (type) {
      case 'checkin':
        return <UserCheck className="w-3 h-3 lg:w-4 lg:h-4 text-blue-600" />;
      case 'reward':
        return <Gift className="w-3 h-3 lg:w-4 lg:h-4 text-orange-600" />;
      default:
        return <Star className="w-3 h-3 lg:w-4 lg:h-4 text-gray-600" />;
    }
  };

  const getActivityColor = (type: 'checkin' | 'reward') => {
    switch (type) {
      case 'checkin':
        return 'bg-blue-100';
      case 'reward':
        return 'bg-orange-100';
      default:
        return 'bg-gray-100';
    }
  };

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return time.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
      <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4">Recent Activity</h3>
      
      <div className="space-y-2 lg:space-y-3 max-h-80 overflow-y-auto">
        {recentActivities.length > 0 ? recentActivities.map((activity) => (
          <div key={`${activity.type}-${activity.id}`} className="flex items-center space-x-2 lg:space-x-3 p-2 lg:p-3 bg-gray-50 rounded-lg">
            <div className={`flex items-center justify-center w-6 h-6 lg:w-8 lg:h-8 rounded-full ${getActivityColor(activity.type)}`}>
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1">
              <p className="text-xs lg:text-sm font-medium text-gray-900">
                <span className="font-semibold">{activity.customer?.name || 'Unknown Customer'}</span> {activity.message}
              </p>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <Clock className="w-2 h-2 lg:w-3 lg:h-3" />
                <span>{formatTime(activity.timestamp)}</span>
                {activity.customer?.phone && (
                  <>
                    <span>•</span>
                    <span className="hidden sm:inline">{activity.customer.phone}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        )) : (
          <div className="text-center py-6 lg:py-8">
            <Clock className="w-6 h-6 lg:w-8 lg:h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-xs lg:text-sm text-gray-500">No recent activity</p>
          </div>
        )}
      </div>
    </div>
  );
};