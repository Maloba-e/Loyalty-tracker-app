export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalVisits: number;
  joinDate: string;
  lastVisit: string | null;
}

export interface Visit {
  id: string;
  customerId: string;
  timestamp: string;
  serviceType: string;
}

export interface Reward {
  id: string;
  customerId: string;
  status: 'earned' | 'redeemed';
  earnedDate: string;
  redeemedDate?: string;
}

export interface RewardSettings {
  visitsRequired: number;
  rewardType: string;
  isActive: boolean;
}