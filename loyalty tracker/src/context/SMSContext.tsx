import React, { createContext, useState, ReactNode, useContext } from 'react';
import { smsService, SMSResponse, SMS_PROVIDERS } from '../services/smsService';
import { LoyaltyContext } from './LoyaltyContext';

export interface Campaign {
  id: string;
  name: string;
  type: 'promotion' | 'reminder' | 'reward' | 'welcome' | 'appointment' | 'followup';
  message: string;
  recipients: string[];
  status: 'draft' | 'sending' | 'sent' | 'failed';
  scheduledDate?: string;
  sentDate?: string;
  results?: SMSResponse[];
  totalCost?: number;
  successCount?: number;
  failureCount?: number;
}

interface SMSContextType {
  campaigns: Campaign[];
  isLoading: boolean;
  currentProvider: string;
  sendMessage: (recipients: string[], message: string, campaignName: string, type: Campaign['type']) => Promise<boolean>;
  scheduleCampaign: (campaign: Omit<Campaign, 'id' | 'status'>) => void;
  getCampaignStats: () => {
    totalSent: number;
    totalDelivered: number;
    totalCost: number;
    deliveryRate: number;
  };
  setProvider: (provider: string) => void;
  getProviders: () => typeof SMS_PROVIDERS;
  calculateCost: (recipients: number, messageLength: number) => number;
}

export const SMSContext = createContext<SMSContextType>({
  campaigns: [],
  isLoading: false,
  currentProvider: 'africastalking',
  sendMessage: async () => false,
  scheduleCampaign: () => {},
  getCampaignStats: () => ({ totalSent: 0, totalDelivered: 0, totalCost: 0, deliveryRate: 0 }),
  setProvider: () => {},
  getProviders: () => SMS_PROVIDERS,
  calculateCost: () => 0
});

interface SMSProviderProps {
  children: ReactNode;
}

export const SMSProvider: React.FC<SMSProviderProps> = ({ children }) => {
  const { customers } = useContext(LoyaltyContext);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentProvider, setCurrentProvider] = useState('africastalking');

  const sendMessage = async (
    recipients: string[], 
    message: string, 
    campaignName: string, 
    type: Campaign['type']
  ): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Create new campaign
      const newCampaign: Campaign = {
        id: Date.now().toString(),
        name: campaignName,
        type,
        message,
        recipients,
        status: 'sending',
        sentDate: new Date().toISOString()
      };
      
      setCampaigns(prev => [...prev, newCampaign]);
      
      // Process message template
      const processedMessage = smsService.processTemplate(message, {
        shopName: 'My Salon',
        phone: '+254712345678',
        customerName: 'Valued Customer'
      });
      
      // Send bulk SMS
      const results = await smsService.sendBulkSMS(recipients, processedMessage);
      
      // Calculate results
      const successCount = results.filter(r => r.success).length;
      const failureCount = results.filter(r => !r.success).length;
      const totalCost = results.reduce((sum, r) => sum + (r.cost || 0), 0);
      
      // Update campaign with results
      setCampaigns(prev => prev.map(campaign => 
        campaign.id === newCampaign.id
          ? {
              ...campaign,
              status: 'sent' as const,
              results,
              successCount,
              failureCount,
              totalCost
            }
          : campaign
      ));
      
      // Emit SMS campaign sent event
      window.dispatchEvent(new CustomEvent('sms-campaign-sent', {
        detail: { 
          campaignName, 
          successCount, 
          totalCount: recipients.length,
          failureCount,
          totalCost
        }
      }));
      
      setIsLoading(false);
      return successCount > 0;
      
    } catch (error) {
      console.error('Failed to send SMS campaign:', error);
      setIsLoading(false);
      return false;
    }
  };

  const scheduleCampaign = (campaignData: Omit<Campaign, 'id' | 'status'>) => {
    const newCampaign: Campaign = {
      ...campaignData,
      id: Date.now().toString(),
      status: 'draft'
    };
    
    setCampaigns(prev => [...prev, newCampaign]);
  };

  const getCampaignStats = () => {
    const totalSent = campaigns.reduce((sum, c) => sum + (c.successCount || 0) + (c.failureCount || 0), 0);
    const totalDelivered = campaigns.reduce((sum, c) => sum + (c.successCount || 0), 0);
    const totalCost = campaigns.reduce((sum, c) => sum + (c.totalCost || 0), 0);
    const deliveryRate = totalSent > 0 ? (totalDelivered / totalSent) * 100 : 0;
    
    return {
      totalSent,
      totalDelivered,
      totalCost,
      deliveryRate
    };
  };

  const setProvider = (provider: string) => {
    if (SMS_PROVIDERS[provider]) {
      setCurrentProvider(provider);
      smsService.setProvider(provider);
    }
  };

  const getProviders = () => SMS_PROVIDERS;

  const calculateCost = (recipients: number, messageLength: number) => {
    return smsService.calculateCost(recipients, messageLength);
  };

  return (
    <SMSContext.Provider
      value={{
        campaigns,
        isLoading,
        currentProvider,
        sendMessage,
        scheduleCampaign,
        getCampaignStats,
        setProvider,
        getProviders,
        calculateCost
      }}
    >
      {children}
    </SMSContext.Provider>
  );
};