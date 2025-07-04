import React from 'react';
import { TrendingUp, Users, DollarSign, Calendar, ArrowUp, ArrowDown, Star } from 'lucide-react';

export const Analytics: React.FC = () => {
  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="mb-6 lg:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Business Analytics
        </h1>
        <p className="text-sm sm:text-base text-gray-600">Track your salon's performance and customer insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6 lg:mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 lg:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg lg:text-2xl font-bold text-emerald-600">0</p>
              <p className="text-xs lg:text-sm text-gray-600">Total Visits</p>
            </div>
            <div className="flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 bg-emerald-100 rounded-lg">
              <Users className="w-4 h-4 lg:w-5 lg:h-5 text-emerald-600" />
            </div>
          </div>
          <div className="flex items-center mt-1 lg:mt-2">
            <span className="text-xs lg:text-sm text-gray-500">No data yet</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 lg:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg lg:text-2xl font-bold text-blue-600">0</p>
              <p className="text-xs lg:text-sm text-gray-600">Active Customers</p>
            </div>
            <div className="flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 bg-blue-100 rounded-lg">
              <TrendingUp className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center mt-1 lg:mt-2">
            <span className="text-xs lg:text-sm text-gray-500">No data yet</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 lg:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg lg:text-2xl font-bold text-purple-600">KES 0</p>
              <p className="text-xs lg:text-sm text-gray-600">Revenue</p>
            </div>
            <div className="flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 bg-purple-100 rounded-lg">
              <DollarSign className="w-4 h-4 lg:w-5 lg:h-5 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center mt-1 lg:mt-2">
            <span className="text-xs lg:text-sm text-gray-500">No data yet</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 lg:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg lg:text-2xl font-bold text-orange-600">0</p>
              <p className="text-xs lg:text-sm text-gray-600">Avg. Revenue/Visit</p>
            </div>
            <div className="flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 bg-orange-100 rounded-lg">
              <Calendar className="w-4 h-4 lg:w-5 lg:h-5 text-orange-600" />
            </div>
          </div>
          <div className="flex items-center mt-1 lg:mt-2">
            <span className="text-xs lg:text-sm text-gray-500">No data yet</span>
          </div>
        </div>
      </div>

      {/* Empty State */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 lg:p-12 text-center">
        <TrendingUp className="w-12 h-12 lg:w-16 lg:h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">No Analytics Data Yet</h3>
        <p className="text-sm lg:text-base text-gray-600 mb-6">
          Start adding customers and recording visits to see your business analytics here.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors duration-200">
            Add First Customer
          </button>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200">
            Record Visit
          </button>
        </div>
      </div>
    </div>
  );
};