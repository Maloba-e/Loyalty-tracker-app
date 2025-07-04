import React, { useState, useContext } from 'react';
import { Download, Upload, Trash2, Database, Clock, HardDrive, AlertTriangle, CheckCircle } from 'lucide-react';
import { LoyaltyContext } from '../context/LoyaltyContext';
import { dataService } from '../services/dataService';

export const DataManager: React.FC = () => {
  const { exportData, importData, clearAllData, lastSaved, customers, visits, rewards } = useContext(LoyaltyContext);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [importMessage, setImportMessage] = useState('');

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `loyalty-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = e.target?.result as string;
        const success = importData(jsonData);
        
        if (success) {
          setImportStatus('success');
          setImportMessage('Data imported successfully!');
        } else {
          setImportStatus('error');
          setImportMessage('Failed to import data. Please check the file format.');
        }
      } catch (error) {
        setImportStatus('error');
        setImportMessage('Invalid file format. Please select a valid backup file.');
      }
      
      // Clear status after 3 seconds
      setTimeout(() => {
        setImportStatus('idle');
        setImportMessage('');
      }, 3000);
    };
    
    reader.readAsText(file);
    event.target.value = ''; // Reset input
  };

  const handleClearData = () => {
    clearAllData();
    setShowClearConfirm(false);
  };

  const storageInfo = dataService.getStorageInfo();
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
      <div className="flex items-center space-x-2 lg:space-x-3 mb-4 lg:mb-6">
        <div className="flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 bg-blue-100 rounded-lg">
          <Database className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-base lg:text-lg font-semibold text-gray-900">Data Management</h3>
          <p className="text-xs lg:text-sm text-gray-500">Backup, restore, and manage your data</p>
        </div>
      </div>

      {/* Status Messages */}
      {importStatus === 'success' && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span className="text-sm text-emerald-800">{importMessage}</span>
          </div>
        </div>
      )}

      {importStatus === 'error' && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span className="text-sm text-red-800">{importMessage}</span>
          </div>
        </div>
      )}

      {/* Data Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-4 lg:mb-6">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-lg lg:text-xl font-bold text-blue-600">{customers.length}</p>
          <p className="text-xs lg:text-sm text-gray-600">Customers</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-lg lg:text-xl font-bold text-emerald-600">{visits.length}</p>
          <p className="text-xs lg:text-sm text-gray-600">Visits</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-lg lg:text-xl font-bold text-orange-600">{rewards.length}</p>
          <p className="text-xs lg:text-sm text-gray-600">Rewards</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-lg lg:text-xl font-bold text-purple-600">{formatBytes(storageInfo.totalSize)}</p>
          <p className="text-xs lg:text-sm text-gray-600">Storage Used</p>
        </div>
      </div>

      {/* Last Saved Info */}
      {lastSaved && (
        <div className="mb-4 lg:mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-800">
              Last saved: {new Date(lastSaved).toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3 lg:space-y-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <button
            onClick={handleExport}
            className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 lg:py-3 px-4 text-sm lg:text-base rounded-lg transition-colors duration-200 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Data</span>
          </button>
          
          <label className="flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 lg:py-3 px-4 text-sm lg:text-base rounded-lg transition-colors duration-200 cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Import Data</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>

        <button
          onClick={() => setShowClearConfirm(true)}
          className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 lg:py-3 px-4 text-sm lg:text-base rounded-lg transition-colors duration-200 cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear All Data</span>
        </button>
      </div>

      {/* Storage Info */}
      <div className="mt-4 lg:mt-6 pt-4 lg:pt-6 border-t border-gray-200">
        <div className="flex items-center space-x-2 mb-2">
          <HardDrive className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-900">Storage Information</span>
        </div>
        <div className="space-y-1 text-xs lg:text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Data Size:</span>
            <span>{formatBytes(storageInfo.dataSize)}</span>
          </div>
          <div className="flex justify-between">
            <span>Backup Size:</span>
            <span>{formatBytes(storageInfo.backupSize)}</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Total Used:</span>
            <span>{formatBytes(storageInfo.totalSize)}</span>
          </div>
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-4 lg:p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Clear All Data</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-gray-700">
                Are you sure you want to delete all customers, visits, and rewards? 
                This will permanently remove all data from your device.
              </p>
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800">
                  <strong>Tip:</strong> Export your data first to create a backup before clearing.
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleClearData}
                className="flex-1 px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 cursor-pointer"
              >
                Clear All Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};