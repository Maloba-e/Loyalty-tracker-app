import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Customer, Visit, Reward, RewardSettings } from '../types';
import { dataService, AppData } from '../services/dataService';

interface LoyaltyContextType {
  customers: Customer[];
  visits: Visit[];
  rewards: Reward[];
  rewardSettings: RewardSettings;
  isLoading: boolean;
  lastSaved: string | null;
  addCustomer: (customer: Customer) => void;
  addVisit: (visit: Visit) => void;
  addReward: (reward: Reward) => void;
  updateRewardSettings: (settings: RewardSettings) => void;
  checkRewardEligibility: (customerId: string) => boolean;
  redeemReward?: (rewardId: string) => void;
  deleteCustomer: (customerId: string) => void;
  updateCustomer: (customerId: string, updates: Partial<Customer>) => void;
  exportData: () => string;
  importData: (jsonData: string) => boolean;
  clearAllData: () => void;
}

const defaultRewardSettings: RewardSettings = {
  visitsRequired: 5,
  rewardType: 'Free Service',
  isActive: true
};

export const LoyaltyContext = createContext<LoyaltyContextType>({
  customers: [],
  visits: [],
  rewards: [],
  rewardSettings: defaultRewardSettings,
  isLoading: false,
  lastSaved: null,
  addCustomer: () => {},
  addVisit: () => {},
  addReward: () => {},
  updateRewardSettings: () => {},
  checkRewardEligibility: () => false,
  redeemReward: () => {},
  deleteCustomer: () => {},
  updateCustomer: () => {},
  exportData: () => '',
  importData: () => false,
  clearAllData: () => {}
});

interface LoyaltyProviderProps {
  children: ReactNode;
}

export const LoyaltyProvider: React.FC<LoyaltyProviderProps> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [rewardSettings, setRewardSettings] = useState<RewardSettings>(defaultRewardSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Milestone tracking
  const checkMilestones = (newCustomers: Customer[], newVisits: Visit[], newRewards: Reward[]) => {
    const milestones = [10, 25, 50, 100, 250, 500, 1000];
    
    // Check customer milestones
    if (milestones.includes(newCustomers.length) && newCustomers.length > customers.length) {
      window.dispatchEvent(new CustomEvent('milestone-reached', {
        detail: { type: 'customers', count: newCustomers.length }
      }));
    }
    
    // Check visit milestones
    if (milestones.includes(newVisits.length) && newVisits.length > visits.length) {
      window.dispatchEvent(new CustomEvent('milestone-reached', {
        detail: { type: 'visits', count: newVisits.length }
      }));
    }
    
    // Check reward milestones
    if (milestones.includes(newRewards.length) && newRewards.length > rewards.length) {
      window.dispatchEvent(new CustomEvent('milestone-reached', {
        detail: { type: 'rewards', count: newRewards.length }
      }));
    }
  };

  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      try {
        const savedData = dataService.getData();
        if (savedData) {
          setCustomers(savedData.customers || []);
          setVisits(savedData.visits || []);
          setRewards(savedData.rewards || []);
          setRewardSettings(savedData.rewardSettings || defaultRewardSettings);
          setLastSaved(savedData.lastUpdated || null);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    // Listen for data updates from other tabs
    const handleDataUpdate = (event: CustomEvent) => {
      const data = event.detail as AppData;
      setCustomers(data.customers || []);
      setVisits(data.visits || []);
      setRewards(data.rewards || []);
      setRewardSettings(data.rewardSettings || defaultRewardSettings);
      setLastSaved(data.lastUpdated || null);
    };

    const handleDataClear = () => {
      setCustomers([]);
      setVisits([]);
      setRewards([]);
      setRewardSettings(defaultRewardSettings);
      setLastSaved(null);
    };

    window.addEventListener('data-updated', handleDataUpdate as EventListener);
    window.addEventListener('data-cleared', handleDataClear);

    return () => {
      window.removeEventListener('data-updated', handleDataUpdate as EventListener);
      window.removeEventListener('data-cleared', handleDataClear);
    };
  }, []);

  // Save data whenever state changes
  const saveData = (
    newCustomers: Customer[],
    newVisits: Visit[],
    newRewards: Reward[],
    newSettings: RewardSettings
  ) => {
    const data: AppData = {
      customers: newCustomers,
      visits: newVisits,
      rewards: newRewards,
      rewardSettings: newSettings,
      lastUpdated: new Date().toISOString()
    };

    const success = dataService.saveData(data);
    if (success) {
      setLastSaved(data.lastUpdated);
      
      // Emit data sync event
      window.dispatchEvent(new CustomEvent('data-synced', {
        detail: { timestamp: data.lastUpdated }
      }));
    }

    // Check for milestones
    checkMilestones(newCustomers, newVisits, newRewards);
  };

  const addCustomer = (customer: Customer) => {
    const newCustomers = [...customers, customer];
    setCustomers(newCustomers);
    saveData(newCustomers, visits, rewards, rewardSettings);
    
    // Emit customer added event
    window.dispatchEvent(new CustomEvent('customer-added', {
      detail: customer
    }));
  };

  const deleteCustomer = (customerId: string) => {
    const newCustomers = customers.filter(customer => customer.id !== customerId);
    const newVisits = visits.filter(visit => visit.customerId !== customerId);
    const newRewards = rewards.filter(reward => reward.customerId !== customerId);
    
    setCustomers(newCustomers);
    setVisits(newVisits);
    setRewards(newRewards);
    saveData(newCustomers, newVisits, newRewards, rewardSettings);
  };

  const updateCustomer = (customerId: string, updates: Partial<Customer>) => {
    const newCustomers = customers.map(customer => 
      customer.id === customerId
        ? { ...customer, ...updates }
        : customer
    );
    setCustomers(newCustomers);
    saveData(newCustomers, visits, rewards, rewardSettings);
  };

  const addVisit = (visit: Visit) => {
    const newVisits = [...visits, visit];
    
    // Update customer's total visits and last visit
    const newCustomers = customers.map(customer => 
      customer.id === visit.customerId
        ? {
            ...customer,
            totalVisits: customer.totalVisits + 1,
            lastVisit: visit.timestamp
          }
        : customer
    );
    
    setVisits(newVisits);
    setCustomers(newCustomers);
    saveData(newCustomers, newVisits, rewards, rewardSettings);
    
    // Emit visit added event
    const customer = newCustomers.find(c => c.id === visit.customerId);
    window.dispatchEvent(new CustomEvent('visit-added', {
      detail: { customer, visit }
    }));
  };

  const addReward = (reward: Reward) => {
    const newRewards = [...rewards, reward];
    setRewards(newRewards);
    saveData(customers, visits, newRewards, rewardSettings);
  };

  const updateRewardSettings = (settings: RewardSettings) => {
    setRewardSettings(settings);
    saveData(customers, visits, rewards, settings);
  };

  const redeemReward = (rewardId: string) => {
    const newRewards = rewards.map(reward => 
      reward.id === rewardId
        ? {
            ...reward,
            status: 'redeemed' as const,
            redeemedDate: new Date().toISOString()
          }
        : reward
    );
    setRewards(newRewards);
    saveData(customers, visits, newRewards, rewardSettings);
    
    // Emit reward redeemed event
    const reward = rewards.find(r => r.id === rewardId);
    const customer = customers.find(c => c.id === reward?.customerId);
    window.dispatchEvent(new CustomEvent('reward-redeemed', {
      detail: { customer, reward }
    }));
  };

  const checkRewardEligibility = (customerId: string): boolean => {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return false;

    // Check if customer has reached the required visits threshold
    const isEligible = (customer.totalVisits % rewardSettings.visitsRequired) === 0 && customer.totalVisits > 0;
    
    if (isEligible) {
      // Create a new reward
      const newReward: Reward = {
        id: Date.now().toString(),
        customerId,
        status: 'earned',
        earnedDate: new Date().toISOString()
      };
      addReward(newReward);
      
      // Emit reward earned event
      window.dispatchEvent(new CustomEvent('reward-earned', {
        detail: { customer, reward: { ...newReward, type: rewardSettings.rewardType } }
      }));
      
      return true;
    }
    
    return false;
  };

  const exportData = (): string => {
    return dataService.exportData();
  };

  const importData = (jsonData: string): boolean => {
    try {
      const success = dataService.importData(jsonData);
      if (success) {
        // Reload data after import
        const savedData = dataService.getData();
        if (savedData) {
          setCustomers(savedData.customers || []);
          setVisits(savedData.visits || []);
          setRewards(savedData.rewards || []);
          setRewardSettings(savedData.rewardSettings || defaultRewardSettings);
          setLastSaved(savedData.lastUpdated || null);
        }
      }
      return success;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  };

  const clearAllData = () => {
    const success = dataService.clearData();
    if (success) {
      setCustomers([]);
      setVisits([]);
      setRewards([]);
      setRewardSettings(defaultRewardSettings);
      setLastSaved(null);
    }
  };

  return (
    <LoyaltyContext.Provider
      value={{
        customers,
        visits,
        rewards,
        rewardSettings,
        isLoading,
        lastSaved,
        addCustomer,
        addVisit,
        addReward,
        updateRewardSettings,
        checkRewardEligibility,
        redeemReward,
        deleteCustomer,
        updateCustomer,
        exportData,
        importData,
        clearAllData
      }}
    >
      {children}
    </LoyaltyContext.Provider>
  );
};