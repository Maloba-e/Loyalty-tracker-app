import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  color: 'emerald' | 'blue' | 'orange' | 'purple';
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  change,
  changeType = 'neutral',
  color
}) => {
  const colorClasses = {
    emerald: 'text-emerald-600 bg-emerald-100',
    blue: 'text-blue-600 bg-blue-100',
    orange: 'text-orange-600 bg-orange-100',
    purple: 'text-purple-600 bg-purple-100'
  };

  const changeColorClasses = {
    positive: 'text-emerald-600',
    negative: 'text-red-600',
    neutral: 'text-gray-500'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 lg:p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-lg lg:text-2xl font-bold ${colorClasses[color].split(' ')[0]}`}>
            {value}
          </p>
          <p className="text-xs lg:text-sm text-gray-600">{title}</p>
          {change && (
            <p className={`text-xs font-medium mt-1 ${changeColorClasses[changeType]}`}>
              {change}
            </p>
          )}
        </div>
        <div className={`flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-4 h-4 lg:w-5 lg:h-5" />
        </div>
      </div>
    </div>
  );
};