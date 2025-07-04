import { Customer, Visit, Reward, RewardSettings } from '../types';

export interface AppData {
  customers: Customer[];
  visits: Visit[];
  rewards: Reward[];
  rewardSettings: RewardSettings;
  lastUpdated: string;
}

class DataService {
  private readonly STORAGE_KEY = 'loyalty-tracker-data';
  private readonly BACKUP_KEY = 'loyalty-tracker-backup';

  // Get all data from localStorage
  getData(): AppData | null {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading data from localStorage:', error);
      return this.getBackupData();
    }
  }

  // Save all data to localStorage with backup
  saveData(data: AppData): boolean {
    try {
      // Create backup of current data before saving new data
      const currentData = this.getData();
      if (currentData) {
        localStorage.setItem(this.BACKUP_KEY, JSON.stringify(currentData));
      }

      // Save new data with timestamp
      const dataWithTimestamp = {
        ...data,
        lastUpdated: new Date().toISOString()
      };

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dataWithTimestamp));
      
      // Dispatch event for real-time updates
      window.dispatchEvent(new CustomEvent('data-updated', {
        detail: dataWithTimestamp
      }));

      return true;
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
      return false;
    }
  }

  // Get backup data
  private getBackupData(): AppData | null {
    try {
      const backup = localStorage.getItem(this.BACKUP_KEY);
      return backup ? JSON.parse(backup) : null;
    } catch (error) {
      console.error('Error reading backup data:', error);
      return null;
    }
  }

  // Export data for backup
  exportData(): string {
    const data = this.getData();
    return data ? JSON.stringify(data, null, 2) : '';
  }

  // Import data from backup
  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData) as AppData;
      return this.saveData(data);
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  // Clear all data
  clearData(): boolean {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      localStorage.removeItem(this.BACKUP_KEY);
      
      window.dispatchEvent(new CustomEvent('data-cleared'));
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  }

  // Get storage usage info
  getStorageInfo() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      const backup = localStorage.getItem(this.BACKUP_KEY);
      
      return {
        dataSize: data ? new Blob([data]).size : 0,
        backupSize: backup ? new Blob([backup]).size : 0,
        totalSize: (data ? new Blob([data]).size : 0) + (backup ? new Blob([backup]).size : 0),
        lastUpdated: this.getData()?.lastUpdated || null
      };
    } catch (error) {
      console.error('Error getting storage info:', error);
      return {
        dataSize: 0,
        backupSize: 0,
        totalSize: 0,
        lastUpdated: null
      };
    }
  }
}

export const dataService = new DataService();