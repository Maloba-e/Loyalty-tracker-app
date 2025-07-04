import React, { useState, useContext } from 'react';
import { MessageSquare, Send, Users, Calendar, Zap, Target, Clock, CheckCircle, AlertCircle, Settings, Phone } from 'lucide-react';
import { SMSContext } from '../context/SMSContext';
import { LoyaltyContext } from '../context/LoyaltyContext';

export const SMS: React.FC = () => {
  const { 
    campaigns, 
    isLoading, 
    currentProvider, 
    sendMessage, 
    getCampaignStats, 
    setProvider, 
    getProviders, 
    calculateCost 
  } = useContext(SMSContext);
  
  const { customers } = useContext(LoyaltyContext);
  
  const [activeTab, setActiveTab] = useState<'campaigns' | 'compose' | 'analytics' | 'settings'>('campaigns');
  const [newMessage, setNewMessage] = useState('');
  const [campaignName, setCampaignName] = useState('');
  const [selectedAudience, setSelectedAudience] = useState<'all' | 'regular' | 'vip' | 'inactive'>('all');
  const [messageType, setMessageType] = useState<'promotion' | 'reminder' | 'reward' | 'welcome'>('promotion');
  const [showProviderSettings, setShowProviderSettings] = useState(false);

  const audienceOptions = {
    all: { 
      label: 'All Customers', 
      count: customers.length, 
      description: 'Send to all registered customers',
      recipients: customers.map(c => c.phone)
    },
    regular: { 
      label: 'Regular Customers', 
      count: customers.filter(c => c.totalVisits >= 5).length, 
      description: 'Customers with 5+ visits',
      recipients: customers.filter(c => c.totalVisits >= 5).map(c => c.phone)
    },
    vip: { 
      label: 'VIP Customers', 
      count: customers.filter(c => c.totalVisits >= 20).length, 
      description: 'Customers with 20+ visits',
      recipients: customers.filter(c => c.totalVisits >= 20).map(c => c.phone)
    },
    inactive: { 
      label: 'Inactive Customers', 
      count: customers.filter(c => {
        const daysSinceLastVisit = c.lastVisit ? 
          Math.floor((new Date().getTime() - new Date(c.lastVisit).getTime()) / (1000 * 60 * 60 * 24)) : 
          Infinity;
        return daysSinceLastVisit > 30;
      }).length, 
      description: 'No visit in last 30 days',
      recipients: customers.filter(c => {
        const daysSinceLastVisit = c.lastVisit ? 
          Math.floor((new Date().getTime() - new Date(c.lastVisit).getTime()) / (1000 * 60 * 60 * 24)) : 
          Infinity;
        return daysSinceLastVisit > 30;
      }).map(c => c.phone)
    }
  };

  const messageTemplates = {
    promotion: [
      'Special offer at {shopName}! Get 20% off your next visit. Book now: {phone}',
      'Weekend special: Buy 2 services, get 1 FREE at {shopName}. Limited time only!',
      'Flash sale! 30% off all services today at {shopName}. Walk-ins welcome!'
    ],
    reminder: [
      'Hi {customerName}, we miss you at {shopName}! It\'s been a while. Book today!',
      'Your favorite stylist is available this week at {shopName}. Schedule your appointment!',
      'Time for a fresh new look? Visit {shopName} and treat yourself!'
    ],
    reward: [
      'Congratulations {customerName}! You\'ve earned a free service at {shopName}. Visit us to redeem!',
      'Loyalty reward unlocked! Your free service is waiting at {shopName}.',
      'Thank you for your loyalty! Enjoy a complimentary service at {shopName}.'
    ],
    welcome: [
      'Welcome to {shopName}, {customerName}! Thank you for joining our loyalty program.',
      'Great to have you at {shopName}! Your loyalty journey starts now.',
      'Welcome aboard! Enjoy exclusive benefits at {shopName}.'
    ]
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !campaignName.trim()) {
      alert('Please enter both campaign name and message');
      return;
    }

    const recipients = audienceOptions[selectedAudience].recipients;
    if (recipients.length === 0) {
      alert('No recipients found for selected audience');
      return;
    }

    const success = await sendMessage(recipients, newMessage, campaignName, messageType);
    
    if (success) {
      setNewMessage('');
      setCampaignName('');
      setActiveTab('campaigns');
    } else {
      alert('Failed to send some messages. Check the campaigns tab for details.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'text-emerald-600 bg-emerald-100';
      case 'sending': return 'text-blue-600 bg-blue-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'draft': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'promotion': return <Zap className="w-4 h-4" />;
      case 'reward': return <Target className="w-4 h-4" />;
      case 'reminder': return <Clock className="w-4 h-4" />;
      case 'welcome': return <Users className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const stats = getCampaignStats();
  const providers = getProviders();
  const estimatedCost = calculateCost(audienceOptions[selectedAudience].count, newMessage.length);

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="mb-6 lg:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              SMS Marketing
            </h1>
            <p className="text-sm sm:text-base text-gray-600">Send real-time SMS messages to engage your customers</p>
          </div>
          <button
            onClick={() => setShowProviderSettings(true)}
            className="mt-3 lg:mt-0 flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-3 lg:px-4 text-sm lg:text-base rounded-lg transition-colors duration-200 cursor-pointer"
          >
            <Settings className="w-4 h-4" />
            <span>Provider Settings</span>
          </button>
        </div>

        {/* Provider Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 lg:p-4 mb-4">
          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              Current Provider: {providers[currentProvider]?.name} 
              (KES {providers[currentProvider]?.costPerSMS}/SMS)
            </span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6 lg:mb-8 w-fit">
        {[
          { id: 'campaigns', label: 'Campaigns', icon: MessageSquare },
          { id: 'compose', label: 'Compose', icon: Send },
          { id: 'analytics', label: 'Analytics', icon: Target },
          { id: 'settings', label: 'Settings', icon: Settings }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-1 lg:space-x-2 px-3 lg:px-4 py-2 rounded-md font-medium text-xs lg:text-sm transition-colors duration-200 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-3 h-3 lg:w-4 lg:h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="mb-4 lg:mb-6 p-3 lg:p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-center space-x-2 lg:space-x-3">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <p className="text-sm lg:text-base text-blue-800 font-semibold">Sending messages...</p>
          </div>
        </div>
      )}

      {/* Tab Content */}
      {activeTab === 'campaigns' && (
        <div className="space-y-4 lg:space-y-6">
          {/* Campaign Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 lg:p-4">
              <div className="flex items-center space-x-2 lg:space-x-3">
                <div className="flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 bg-blue-100 rounded-lg">
                  <Send className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-lg lg:text-2xl font-bold text-blue-600">{campaigns.length}</p>
                  <p className="text-xs lg:text-sm text-gray-600">Total Campaigns</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 lg:p-4">
              <div className="flex items-center space-x-2 lg:space-x-3">
                <div className="flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 bg-emerald-100 rounded-lg">
                  <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-lg lg:text-2xl font-bold text-emerald-600">{Math.round(stats.deliveryRate)}%</p>
                  <p className="text-xs lg:text-sm text-gray-600">Delivery Rate</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 lg:p-4">
              <div className="flex items-center space-x-2 lg:space-x-3">
                <div className="flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 bg-purple-100 rounded-lg">
                  <Users className="w-4 h-4 lg:w-5 lg:h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-lg lg:text-2xl font-bold text-purple-600">{stats.totalSent}</p>
                  <p className="text-xs lg:text-sm text-gray-600">Messages Sent</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 lg:p-4">
              <div className="flex items-center space-x-2 lg:space-x-3">
                <div className="flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 bg-orange-100 rounded-lg">
                  <Target className="w-4 h-4 lg:w-5 lg:h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-lg lg:text-2xl font-bold text-orange-600">KES {stats.totalCost.toFixed(2)}</p>
                  <p className="text-xs lg:text-sm text-gray-600">Total Spent</p>
                </div>
              </div>
            </div>
          </div>

          {/* Campaign List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-4 lg:p-6 border-b border-gray-200">
              <h3 className="text-base lg:text-lg font-semibold text-gray-900">Recent Campaigns</h3>
            </div>
            
            <div className="divide-y divide-gray-200">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="p-4 lg:p-6 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center space-x-3 lg:space-x-4">
                      <div className={`flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 rounded-lg ${
                        campaign.type === 'promotion' ? 'bg-yellow-100 text-yellow-600' :
                        campaign.type === 'reward' ? 'bg-emerald-100 text-emerald-600' :
                        campaign.type === 'reminder' ? 'bg-blue-100 text-blue-600' :
                        'bg-purple-100 text-purple-600'
                      }`}>
                        {getTypeIcon(campaign.type)}
                      </div>
                      <div>
                        <h4 className="text-sm lg:text-base font-semibold text-gray-900">{campaign.name}</h4>
                        <p className="text-xs lg:text-sm text-gray-600 max-w-md">{campaign.message}</p>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-1 lg:mt-2">
                          <span className="text-xs lg:text-sm text-gray-500">{campaign.recipients.length} recipients</span>
                          {campaign.sentDate && (
                            <span className="text-xs lg:text-sm text-gray-500">
                              Sent {new Date(campaign.sentDate).toLocaleDateString()}
                            </span>
                          )}
                          {campaign.totalCost && (
                            <span className="text-xs lg:text-sm text-gray-500">
                              Cost: KES {campaign.totalCost.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-left lg:text-right mt-3 lg:mt-0">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                      </span>
                      {campaign.successCount !== undefined && (
                        <div className="mt-1">
                          <p className="text-xs lg:text-sm text-emerald-600 font-medium">
                            {campaign.successCount} delivered
                          </p>
                          {campaign.failureCount! > 0 && (
                            <p className="text-xs lg:text-sm text-red-600">
                              {campaign.failureCount} failed
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'compose' && (
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
            <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4 lg:mb-6">Compose New Message</h3>
            
            <div className="space-y-4 lg:space-y-6">
              {/* Campaign Name */}
              <div>
                <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-2">
                  Campaign Name
                </label>
                <input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="Enter campaign name"
                  className="w-full px-3 py-2 text-sm lg:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Message Type */}
              <div>
                <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-2">
                  Message Type
                </label>
                <select
                  value={messageType}
                  onChange={(e) => setMessageType(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm lg:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                >
                  <option value="promotion">Promotion</option>
                  <option value="reminder">Reminder</option>
                  <option value="reward">Reward</option>
                  <option value="welcome">Welcome</option>
                </select>
              </div>

              {/* Audience Selection */}
              <div>
                <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-2 lg:mb-3">
                  Select Audience
                </label>
                <div className="grid sm:grid-cols-2 gap-2 lg:gap-3">
                  {Object.entries(audienceOptions).map(([key, option]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedAudience(key as any)}
                      className={`p-2 lg:p-3 text-left border rounded-lg transition-colors duration-200 cursor-pointer ${
                        selectedAudience === key
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs lg:text-sm font-medium">{option.label}</span>
                        <span className="text-xs lg:text-sm font-semibold text-blue-600">{option.count}</span>
                      </div>
                      <p className="text-xs text-gray-500">{option.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Composer */}
              <div>
                <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message here..."
                  rows={4}
                  maxLength={160}
                  className="w-full px-3 py-2 text-sm lg:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs lg:text-sm text-gray-500">
                    {newMessage.length}/160 characters
                  </p>
                  <p className="text-xs lg:text-sm text-gray-600">
                    Est. cost: KES {estimatedCost.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Quick Templates */}
              <div>
                <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-2">
                  Quick Templates
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {messageTemplates[messageType].map((template, index) => (
                    <button
                      key={index}
                      onClick={() => setNewMessage(template)}
                      className="p-2 lg:p-3 text-left text-xs lg:text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 cursor-pointer"
                    >
                      {template}
                    </button>
                  ))}
                </div>
              </div>

              {/* Send Options */}
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || !campaignName.trim() || isLoading}
                  className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 lg:py-3 px-4 text-sm lg:text-base rounded-lg transition-colors duration-200 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isLoading ? 'Sending...' : 'Send Now'}</span>
                </button>
                <button 
                  disabled={isLoading}
                  className="flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 font-medium py-2 lg:py-3 px-4 text-sm lg:text-base rounded-lg transition-colors duration-200 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Schedule</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-4 lg:space-y-6">
          {/* Analytics Overview */}
          <div className="grid lg:grid-cols-3 gap-4 lg:gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
              <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4">Campaign Performance</h3>
              <div className="space-y-2 lg:space-y-3">
                <div className="flex justify-between">
                  <span className="text-xs lg:text-sm text-gray-600">Total Sent</span>
                  <span className="text-xs lg:text-sm font-semibold">{stats.totalSent}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs lg:text-sm text-gray-600">Delivered</span>
                  <span className="text-xs lg:text-sm font-semibold text-emerald-600">{stats.totalDelivered} ({Math.round(stats.deliveryRate)}%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs lg:text-sm text-gray-600">Failed</span>
                  <span className="text-xs lg:text-sm font-semibold text-red-600">{stats.totalSent - stats.totalDelivered}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs lg:text-sm text-gray-600">Total Cost</span>
                  <span className="text-xs lg:text-sm font-semibold text-purple-600">KES {stats.totalCost.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
              <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4">Provider Performance</h3>
              <div className="space-y-2 lg:space-y-3">
                <div className="flex justify-between">
                  <span className="text-xs lg:text-sm text-gray-600">Current Provider</span>
                  <span className="text-xs lg:text-sm font-semibold text-blue-600">{providers[currentProvider]?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs lg:text-sm text-gray-600">Cost per SMS</span>
                  <span className="text-xs lg:text-sm font-semibold text-emerald-600">KES {providers[currentProvider]?.costPerSMS}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs lg:text-sm text-gray-600">Success Rate</span>
                  <span className="text-xs lg:text-sm font-semibold text-emerald-600">{Math.round(stats.deliveryRate)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs lg:text-sm text-gray-600">Avg. Cost/Campaign</span>
                  <span className="text-xs lg:text-sm font-semibold text-gray-900">KES {campaigns.length > 0 ? (stats.totalCost / campaigns.length).toFixed(2) : '0.00'}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
              <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4">Best Performing</h3>
              <div className="space-y-2 lg:space-y-3">
                <div>
                  <p className="text-xs lg:text-sm font-medium text-gray-900">Message Type</p>
                  <p className="text-xs lg:text-sm text-emerald-600">Reward Notifications</p>
                  <p className="text-xs text-gray-500">Highest delivery rate</p>
                </div>
                <div>
                  <p className="text-xs lg:text-sm font-medium text-gray-900">Best Audience</p>
                  <p className="text-xs lg:text-sm text-blue-600">VIP Customers</p>
                  <p className="text-xs text-gray-500">Best engagement</p>
                </div>
                <div>
                  <p className="text-xs lg:text-sm font-medium text-gray-900">Optimal Time</p>
                  <p className="text-xs lg:text-sm text-purple-600">Tuesday 2-4 PM</p>
                  <p className="text-xs text-gray-500">Peak delivery time</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
            <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4 lg:mb-6">SMS Provider Settings</h3>
            
            <div className="space-y-4 lg:space-y-6">
              <div>
                <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-3">
                  Select SMS Provider
                </label>
                <div className="space-y-3">
                  {Object.entries(providers).map(([key, provider]) => (
                    <div
                      key={key}
                      onClick={() => setProvider(key)}
                      className={`p-3 lg:p-4 border rounded-lg cursor-pointer transition-colors duration-200 ${
                        currentProvider === key
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm lg:text-base font-semibold text-gray-900">{provider.name}</h4>
                          <p className="text-xs lg:text-sm text-gray-600">KES {provider.costPerSMS} per SMS</p>
                          <p className="text-xs text-gray-500">
                            Supports: {provider.supportedCountries.join(', ')}
                          </p>
                        </div>
                        {currentProvider === key && (
                          <CheckCircle className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 lg:p-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs lg:text-sm font-semibold text-yellow-800">Setup Required</h4>
                    <p className="text-xs lg:text-sm text-yellow-700 mt-1">
                      To send real SMS messages, you need to configure API credentials for your chosen provider. 
                      Contact your SMS provider to get API keys and sender ID approval.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Provider Settings Modal */}
      {showProviderSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-4 lg:p-6">
            <div className="flex items-center justify-between mb-3 lg:mb-4">
              <h3 className="text-base lg:text-lg font-semibold text-gray-900">Provider Settings</h3>
              <button
                onClick={() => setShowProviderSettings(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-3">
              {Object.entries(providers).map(([key, provider]) => (
                <button
                  key={key}
                  onClick={() => {
                    setProvider(key);
                    setShowProviderSettings(false);
                  }}
                  className={`w-full p-3 text-left border rounded-lg transition-colors duration-200 cursor-pointer ${
                    currentProvider === key
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{provider.name}</p>
                      <p className="text-xs text-gray-600">KES {provider.costPerSMS}/SMS</p>
                    </div>
                    {currentProvider === key && (
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};