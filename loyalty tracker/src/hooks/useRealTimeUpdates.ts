import { useEffect, useCallback } from 'react';
import { useNotificationContext } from '../context/NotificationContext';

export const useRealTimeUpdates = () => {
  const { notifySuccess, notifyInfo, notifyWarning } = useNotificationContext();

  // Listen for customer events
  const handleCustomerAdded = useCallback((event: CustomEvent) => {
    const customer = event.detail;
    notifySuccess(
      'New Customer Added',
      `${customer.name} has been added to your customer base`,
      {
        label: 'View Customer',
        onClick: () => {
          // Navigate to customers view
          window.dispatchEvent(new CustomEvent('navigate-to', { detail: 'customers' }));
        }
      }
    );
  }, [notifySuccess]);

  // Listen for visit events
  const handleVisitAdded = useCallback((event: CustomEvent) => {
    const { customer, visit } = event.detail;
    notifySuccess(
      'Customer Check-in',
      `${customer.name} has checked in successfully`,
      {
        label: 'View Dashboard',
        onClick: () => {
          window.dispatchEvent(new CustomEvent('navigate-to', { detail: 'dashboard' }));
        }
      }
    );
  }, [notifySuccess]);

  // Listen for reward events
  const handleRewardEarned = useCallback((event: CustomEvent) => {
    const { customer, reward } = event.detail;
    notifySuccess(
      'Reward Earned! 🎉',
      `${customer.name} has earned a ${reward.type || 'free service'}!`,
      {
        label: 'View Rewards',
        onClick: () => {
          window.dispatchEvent(new CustomEvent('navigate-to', { detail: 'rewards' }));
        }
      }
    );
  }, [notifySuccess]);

  // Listen for reward redemption
  const handleRewardRedeemed = useCallback((event: CustomEvent) => {
    const { customer } = event.detail;
    notifyInfo(
      'Reward Redeemed',
      `${customer.name} has redeemed their loyalty reward`,
      {
        label: 'View Rewards',
        onClick: () => {
          window.dispatchEvent(new CustomEvent('navigate-to', { detail: 'rewards' }));
        }
      }
    );
  }, [notifyInfo]);

  // Listen for SMS campaign events
  const handleSMSCampaignSent = useCallback((event: CustomEvent) => {
    const { campaignName, successCount, totalCount } = event.detail;
    const successRate = Math.round((successCount / totalCount) * 100);
    
    if (successRate >= 90) {
      notifySuccess(
        'SMS Campaign Sent',
        `"${campaignName}" sent to ${successCount}/${totalCount} recipients (${successRate}% success)`,
        {
          label: 'View SMS',
          onClick: () => {
            window.dispatchEvent(new CustomEvent('navigate-to', { detail: 'sms' }));
          }
        }
      );
    } else {
      notifyWarning(
        'SMS Campaign Completed',
        `"${campaignName}" sent to ${successCount}/${totalCount} recipients (${successRate}% success)`,
        {
          label: 'View Details',
          onClick: () => {
            window.dispatchEvent(new CustomEvent('navigate-to', { detail: 'sms' }));
          }
        }
      );
    }
  }, [notifySuccess, notifyWarning]);

  // Listen for data sync events
  const handleDataSynced = useCallback((event: CustomEvent) => {
    const { timestamp } = event.detail;
    notifyInfo(
      'Data Synced',
      'Your data has been automatically saved',
      {
        label: 'View Data',
        onClick: () => {
          window.dispatchEvent(new CustomEvent('navigate-to', { detail: 'dashboard' }));
        }
      }
    );
  }, [notifyInfo]);

  // Listen for milestone events
  const handleMilestoneReached = useCallback((event: CustomEvent) => {
    const { type, count } = event.detail;
    let title = '';
    let message = '';
    
    switch (type) {
      case 'customers':
        title = 'Customer Milestone! 🎯';
        message = `You now have ${count} loyal customers!`;
        break;
      case 'visits':
        title = 'Visit Milestone! 📈';
        message = `You've recorded ${count} customer visits!`;
        break;
      case 'rewards':
        title = 'Reward Milestone! 🏆';
        message = `${count} rewards have been earned by your customers!`;
        break;
    }
    
    if (title && message) {
      notifySuccess(title, message);
    }
  }, [notifySuccess]);

  useEffect(() => {
    // Add event listeners
    window.addEventListener('customer-added', handleCustomerAdded as EventListener);
    window.addEventListener('visit-added', handleVisitAdded as EventListener);
    window.addEventListener('reward-earned', handleRewardEarned as EventListener);
    window.addEventListener('reward-redeemed', handleRewardRedeemed as EventListener);
    window.addEventListener('sms-campaign-sent', handleSMSCampaignSent as EventListener);
    window.addEventListener('data-synced', handleDataSynced as EventListener);
    window.addEventListener('milestone-reached', handleMilestoneReached as EventListener);

    return () => {
      // Remove event listeners
      window.removeEventListener('customer-added', handleCustomerAdded as EventListener);
      window.removeEventListener('visit-added', handleVisitAdded as EventListener);
      window.removeEventListener('reward-earned', handleRewardEarned as EventListener);
      window.removeEventListener('reward-redeemed', handleRewardRedeemed as EventListener);
      window.removeEventListener('sms-campaign-sent', handleSMSCampaignSent as EventListener);
      window.removeEventListener('data-synced', handleDataSynced as EventListener);
      window.removeEventListener('milestone-reached', handleMilestoneReached as EventListener);
    };
  }, [
    handleCustomerAdded,
    handleVisitAdded,
    handleRewardEarned,
    handleRewardRedeemed,
    handleSMSCampaignSent,
    handleDataSynced,
    handleMilestoneReached
  ]);
};