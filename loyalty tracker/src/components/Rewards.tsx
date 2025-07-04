import React, { useContext, useState } from 'react';
import { Gift, Settings, Trophy, Star, Target, Calendar } from 'lucide-react';
import { LoyaltyContext } from '../context/LoyaltyContext';

export const Rewards: React.FC = () => {
  const { customers, rewards, rewardSettings, updateRewardSettings, redeemReward } = useContext(LoyaltyContext);
  const [showSettings, setShowSettings] = useState(false);
  const [newThreshold, setNewThreshold] = useState(rewardSettings.visitsRequired);
  const [newRewardType, setNewRewardType] = useState(rewardSettings.rewardType);

  const pendingRewards = rewards.filter(r => r.status === 'earned');
  const redeemedRewards = rewards.filter(r => r.status === 'redeemed');
  
  const topCustomers = customers
    .filter(c => c.totalVisits >= 5)
    .sort((a, b) => b.totalVisits - a.totalVisits)
    .slice(0, 5);

  const handleSaveSettings = () => {
    updateRewardSettings({
      ...rewardSettings,
      visitsRequired: newThreshold,
      rewardType: newRewardType
    });
    setShowSettings(false);
  };

  const handleRedeemReward = (rewardId: string) => {
    if (redeemReward) {
      redeemReward(rewardId);
    }
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="mb-6 lg:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 lg:mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Loyalty Rewards
            </h1>
            <p className="text-sm sm:text-base text-gray-600">Manage customer rewards and loyalty program settings</p>
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="mt-3 lg:mt-0 flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 lg:px-4 text-sm lg:text-base rounded-lg transition-colors duration-200 cursor-pointer"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>

        {/* Reward Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6 lg:mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 lg:p-4">
            <div className="flex items-center space-x-2 lg:space-x-3">
              <div className="flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 bg-orange-100 rounded-lg">
                <Gift className="w-4 h-4 lg:w-5 lg:h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-lg lg:text-2xl font-bold text-orange-600">{pendingRewards.length}</p>
                <p className="text-xs lg:text-sm text-gray-600">Pending Rewards</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 lg:p-4">
            <div className="flex items-center space-x-2 lg:space-x-3">
              <div className="flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 bg-emerald-100 rounded-lg">
                <Trophy className="w-4 h-4 lg:w-5 lg:h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-lg lg:text-2xl font-bold text-emerald-600">{redeemedRewards.length}</p>
                <p className="text-xs lg:text-sm text-gray-600">Redeemed This Month</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 lg:p-4">
            <div className="flex items-center space-x-2 lg:space-x-3">
              <div className="flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 bg-blue-100 rounded-lg">
                <Target className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-lg lg:text-2xl font-bold text-blue-600">{rewardSettings.visitsRequired}</p>
                <p className="text-xs lg:text-sm text-gray-600">Visits Required</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 lg:p-4">
            <div className="flex items-center space-x-2 lg:space-x-3">
              <div className="flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 bg-purple-100 rounded-lg">
                <Star className="w-4 h-4 lg:w-5 lg:h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-lg lg:text-2xl font-bold text-purple-600">
                  {Math.round((redeemedRewards.length / (pendingRewards.length + redeemedRewards.length) * 100) || 0)}%
                </p>
                <p className="text-xs lg:text-sm text-gray-600">Redemption Rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid xl:grid-cols-3 gap-4 lg:gap-6">
        {/* Pending Rewards */}
        <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 lg:p-6 border-b border-gray-200">
            <h3 className="text-base lg:text-lg font-semibold text-gray-900">Pending Rewards</h3>
            <p className="text-xs lg:text-sm text-gray-500 mt-1">Customers ready to redeem rewards</p>
          </div>
          
          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {pendingRewards.length > 0 ? pendingRewards.map((reward) => {
              const customer = customers.find(c => c.id === reward.customerId);
              if (!customer) return null;
              
              return (
                <div key={reward.id} className="p-4 lg:p-6 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center space-x-2 lg:space-x-3">
                      <div className="flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 bg-orange-100 rounded-full">
                        <Gift className="w-5 h-5 lg:w-6 lg:h-6 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="text-sm lg:text-base font-semibold text-gray-900">{customer.name}</h4>
                        <p className="text-xs lg:text-sm text-gray-500">{customer.phone}</p>
                        <p className="text-xs text-orange-600 font-medium">
                          Earned {new Date(reward.earnedDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-left lg:text-right mt-3 lg:mt-0">
                      <button 
                        onClick={() => handleRedeemReward(reward.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-3 lg:px-4 text-xs lg:text-sm rounded-lg transition-colors duration-200 cursor-pointer"
                      >
                        Redeem Now
                      </button>
                      <p className="text-xs text-gray-500 mt-1">{customer.totalVisits} total visits</p>
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div className="p-8 lg:p-12 text-center">
                <Gift className="w-8 h-8 lg:w-12 lg:h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-sm lg:text-base text-gray-500">No pending rewards</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 lg:space-y-6">
          {/* Top Customers */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
            <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4">Top Loyal Customers</h3>
            <div className="space-y-2 lg:space-y-3">
              {topCustomers.map((customer, index) => (
                <div key={customer.id} className="flex items-center space-x-2 lg:space-x-3">
                  <div className="flex items-center justify-center w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full text-white font-bold text-xs lg:text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs lg:text-sm font-medium text-gray-900">{customer.name}</p>
                    <p className="text-xs text-gray-500">{customer.totalVisits} visits</p>
                  </div>
                  <Star className="w-3 h-3 lg:w-4 lg:h-4 text-yellow-500" />
                </div>
              ))}
            </div>
          </div>

          {/* Program Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
            <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4">Program Overview</h3>
            <div className="space-y-3 lg:space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs lg:text-sm text-gray-600">Current Threshold</span>
                <span className="text-xs lg:text-sm font-semibold text-blue-600">{rewardSettings.visitsRequired} visits</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs lg:text-sm text-gray-600">Reward Type</span>
                <span className="text-xs lg:text-sm font-semibold text-gray-900">{rewardSettings.rewardType}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs lg:text-sm text-gray-600">Active Since</span>
                <span className="text-xs lg:text-sm font-semibold text-gray-900">Jan 2025</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
            <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4">Recent Activity</h3>
            <div className="space-y-2 lg:space-y-3">
              {redeemedRewards.slice(0, 3).map((reward) => {
                const customer = customers.find(c => c.id === reward.customerId);
                if (!customer) return null;
                
                return (
                  <div key={reward.id} className="flex items-center space-x-2 lg:space-x-3">
                    <div className="flex items-center justify-center w-6 h-6 lg:w-8 lg:h-8 bg-emerald-100 rounded-full">
                      <Trophy className="w-3 h-3 lg:w-4 lg:h-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs lg:text-sm font-medium text-gray-900">{customer.name}</p>
                      <p className="text-xs text-gray-500">
                        Redeemed {reward.redeemedDate ? new Date(reward.redeemedDate).toLocaleDateString() : 'recently'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-4 lg:p-6">
            <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4">Reward Settings</h3>
            
            <div className="space-y-3 lg:space-y-4">
              <div>
                <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-2">
                  Visits Required for Reward
                </label>
                <input
                  type="number"
                  value={newThreshold}
                  onChange={(e) => setNewThreshold(parseInt(e.target.value))}
                  min="1"
                  max="20"
                  className="w-full px-3 py-2 text-sm lg:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-2">
                  Reward Type
                </label>
                <select 
                  value={newRewardType}
                  onChange={(e) => setNewRewardType(e.target.value)}
                  className="w-full px-3 py-2 text-sm lg:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                >
                  <option value="Free Service">Free Service</option>
                  <option value="Discount">Discount</option>
                  <option value="Free Product">Free Product</option>
                </select>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-4 lg:mt-6">
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 px-4 py-2 text-xs lg:text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSettings}
                className="flex-1 px-4 py-2 text-xs lg:text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};