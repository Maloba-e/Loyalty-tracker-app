import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Gift, Calendar, ArrowUp, ArrowDown } from 'lucide-react';

interface LiveStatsProps {
  customers: number;
  visits: number;
  rewards: number;
  todayVisits: number;
}

export const LiveStats: React.FC<LiveStatsProps> = ({ customers, visits, rewards, todayVisits }) => {
  const [previousStats, setPreviousStats] = useState({ customers, visits, rewards, todayVisits });
  const [changes, setChanges] = useState({ customers: 0, visits: 0, rewards: 0, todayVisits: 0 });
  const [showChanges, setShowChanges] = useState(false);

  useEffect(() => {
    const newChanges = {
      customers: customers - previousStats.customers,
      visits: visits - previousStats.visits,
      rewards: rewards - previousStats.rewards,
      todayVisits: todayVisits - previousStats.todayVisits
    };

    const hasChanges = Object.values(newChanges).some(change => change !== 0);

    if (hasChanges) {
      setChanges(newChanges);
      setShowChanges(true);
      
      // Hide changes after 3 seconds
      setTimeout(() => {
        setShowChanges(false);
        setPreviousStats({ customers, visits, rewards, todayVisits });
      }, 3000);
    }
  }, [customers, visits, rewards, todayVisits, previousStats]);

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color, 
    change 
  }: { 
    title: string; 
    value: number; 
    icon: any; 
    color: string; 
    change: number;
  }) => (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-3 lg:p-4 transition-all duration-300 ${
      showChanges && change !== 0 ? 'ring-2 ring-emerald-200 bg-emerald-50' : ''
    }`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-lg lg:text-2xl font-bold text-${color}-600 transition-all duration-300`}>
            {value}
          </p>
          <p className="text-xs lg:text-sm text-gray-600">{title}</p>
          {showChanges && change !== 0 && (
            <div className="flex items-center mt-1">
              {change > 0 ? (
                <ArrowUp className="w-3 h-3 text-emerald-600 mr-1" />
              ) : (
                <ArrowDown className="w-3 h-3 text-red-600 mr-1" />
              )}
              <span className={`text-xs font-medium ${
                change > 0 ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {change > 0 ? '+' : ''}{change}
              </span>
            </div>
          )}
        </div>
        <div className={`flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 bg-${color}-100 rounded-lg`}>
          <Icon className={`w-4 h-4 lg:w-5 lg:h-5 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 lg:mb-8">
      <StatCard
        title="Total Customers"
        value={customers}
        icon={Users}
        color="emerald"
        change={changes.customers}
      />
      <StatCard
        title="Today's Visits"
        value={todayVisits}
        icon={Calendar}
        color="blue"
        change={changes.todayVisits}
      />
      <StatCard
        title="Total Visits"
        value={visits}
        icon={TrendingUp}
        color="purple"
        change={changes.visits}
      />
      <StatCard
        title="Rewards Earned"
        value={rewards}
        icon={Gift}
        color="orange"
        change={changes.rewards}
      />
    </div>
  );
};