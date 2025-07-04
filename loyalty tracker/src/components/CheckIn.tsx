import React, { useState, useContext } from 'react';
import { Phone, QrCode, Search, UserPlus, CheckCircle, Clock, Camera, X } from 'lucide-react';
import { LoyaltyContext } from '../context/LoyaltyContext';
import { Customer, Visit } from '../types';

export const CheckIn: React.FC = () => {
  const { customers, addCustomer, addVisit, checkRewardEligibility } = useContext(LoyaltyContext);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [searchResults, setSearchResults] = useState<Customer[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [recentCheckIn, setRecentCheckIn] = useState<{ customer: Customer; isReward: boolean } | null>(null);

  const handlePhoneSearch = (phone: string) => {
    setPhoneNumber(phone);
    if (phone.length >= 3) {
      const results = customers.filter(customer =>
        customer.phone.includes(phone) || 
        customer.name.toLowerCase().includes(phone.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleCheckIn = (customer: Customer) => {
    const visit: Visit = {
      id: Date.now().toString(),
      customerId: customer.id,
      timestamp: new Date().toISOString(),
      serviceType: 'General Service'
    };

    addVisit(visit);
    
    const isRewardEligible = checkRewardEligibility(customer.id);
    setRecentCheckIn({ customer, isReward: isRewardEligible });
    
    // Clear form
    setPhoneNumber('');
    setSearchResults([]);
    
    // Clear success message after 5 seconds
    setTimeout(() => setRecentCheckIn(null), 5000);
  };

  const handleNewCustomer = () => {
    if (phoneNumber.length >= 10) {
      const newCustomer: Customer = {
        id: Date.now().toString(),
        name: 'New Customer',
        phone: phoneNumber,
        email: '',
        totalVisits: 0,
        joinDate: new Date().toISOString(),
        lastVisit: null
      };
      
      addCustomer(newCustomer);
      handleCheckIn(newCustomer);
    }
  };

  const handleQRScan = () => {
    setShowQRScanner(true);
  };

  const simulateQRScan = () => {
    setIsScanning(true);
    // Simulate QR scan delay
    setTimeout(() => {
      setIsScanning(false);
      setShowQRScanner(false);
      
      // Mock successful scan - find a random customer or create new one
      if (customers.length > 0 && Math.random() > 0.3) {
        const randomCustomer = customers[Math.floor(Math.random() * customers.length)];
        handleCheckIn(randomCustomer);
      } else {
        // Simulate new customer from QR scan
        const newCustomer: Customer = {
          id: Date.now().toString(),
          name: `Customer ${Math.floor(Math.random() * 1000)}`,
          phone: `+254${Math.floor(Math.random() * 900000000) + 100000000}`,
          email: '',
          totalVisits: 0,
          joinDate: new Date().toISOString(),
          lastVisit: null
        };
        
        addCustomer(newCustomer);
        handleCheckIn(newCustomer);
      }
    }, 2000);
  };

  const stopQRScan = () => {
    setIsScanning(false);
    setShowQRScanner(false);
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 lg:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Customer Check-In
          </h1>
          <p className="text-sm sm:text-base text-gray-600">Check in customers using phone number or QR code</p>
        </div>

        {/* Success Message */}
        {recentCheckIn && (
          <div className="mb-4 lg:mb-6 p-3 lg:p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <div className="flex items-center space-x-2 lg:space-x-3">
              <CheckCircle className="w-5 h-5 lg:w-6 lg:h-6 text-emerald-600 flex-shrink-0" />
              <div>
                <p className="text-sm lg:text-base text-emerald-800 font-semibold">Check-in successful!</p>
                <p className="text-xs lg:text-sm text-emerald-600">
                  {recentCheckIn.customer.name} has been checked in.
                  {recentCheckIn.isReward && ' 🎉 Reward earned!'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Check-in Methods */}
        <div className="grid lg:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
          {/* Phone Number Check-in */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
            <div className="flex items-center space-x-2 lg:space-x-3 mb-3 lg:mb-4">
              <div className="flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 bg-blue-100 rounded-lg">
                <Phone className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
              </div>
              <h3 className="text-base lg:text-lg font-semibold text-gray-900">Phone Number</h3>
            </div>
            
            <div className="space-y-3 lg:space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => handlePhoneSearch(e.target.value)}
                  placeholder="Enter phone number..."
                  className="w-full pl-10 pr-4 py-2 lg:py-3 text-sm lg:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="space-y-2 max-h-40 lg:max-h-48 overflow-y-auto">
                  {searchResults.map((customer) => (
                    <button
                      key={customer.id}
                      onClick={() => handleCheckIn(customer)}
                      className="w-full flex items-center justify-between p-2 lg:p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 cursor-pointer"
                    >
                      <div className="text-left">
                        <p className="text-sm lg:text-base font-medium text-gray-900">{customer.name}</p>
                        <p className="text-xs lg:text-sm text-gray-500">{customer.phone}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs lg:text-sm font-medium text-blue-600">{customer.totalVisits} visits</p>
                        {customer.lastVisit && (
                          <p className="text-xs text-gray-400">
                            Last: {new Date(customer.lastVisit).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* New Customer Option */}
              {phoneNumber.length >= 10 && searchResults.length === 0 && (
                <button
                  onClick={handleNewCustomer}
                  className="w-full flex items-center justify-center space-x-2 p-2 lg:p-3 border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-lg transition-colors duration-200 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
                  <span className="text-sm lg:text-base text-gray-600">Add as new customer</span>
                </button>
              )}
            </div>
          </div>

          {/* QR Code Check-in */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
            <div className="flex items-center space-x-2 lg:space-x-3 mb-3 lg:mb-4">
              <div className="flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 bg-emerald-100 rounded-lg">
                <QrCode className="w-4 h-4 lg:w-5 lg:h-5 text-emerald-600" />
              </div>
              <h3 className="text-base lg:text-lg font-semibold text-gray-900">QR Code Scanner</h3>
            </div>
            
            <div className="text-center space-y-3 lg:space-y-4">
              <div className="mx-auto w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                {isScanning ? (
                  <div className="animate-pulse">
                    <Clock className="w-6 h-6 lg:w-8 lg:h-8 text-gray-400" />
                  </div>
                ) : (
                  <Camera className="w-8 h-8 lg:w-12 lg:h-12 text-gray-400" />
                )}
              </div>
              
              <button
                onClick={handleQRScan}
                disabled={isScanning}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold py-2 lg:py-3 px-4 text-sm lg:text-base rounded-lg transition-colors duration-200 cursor-pointer"
              >
                {isScanning ? 'Scanning...' : 'Start QR Scanner'}
              </button>
              
              <p className="text-xs lg:text-sm text-gray-500">
                Scan customer QR codes for instant check-in
              </p>
            </div>
          </div>
        </div>

        {/* Recent Check-ins */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
          <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4">Recent Check-ins Today</h3>
          <div className="space-y-2 lg:space-y-3 max-h-60 lg:max-h-80 overflow-y-auto">
            {customers.slice(0, 5).map((customer) => (
              <div key={customer.id} className="flex items-center justify-between p-2 lg:p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm lg:text-base font-medium text-gray-900">{customer.name}</p>
                  <p className="text-xs lg:text-sm text-gray-500">{customer.phone}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs lg:text-sm text-gray-600">2 hours ago</p>
                  <p className="text-xs text-blue-600">{customer.totalVisits} total visits</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-4 lg:p-6">
            <div className="flex items-center justify-between mb-3 lg:mb-4">
              <h3 className="text-base lg:text-lg font-semibold text-gray-900">QR Code Scanner</h3>
              <button
                onClick={stopQRScan}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3 lg:space-y-4">
              <div className="text-center">
                <div className="w-full h-64 bg-gray-900 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
                  {isScanning ? (
                    <div className="text-white text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                      <p className="text-sm">Scanning...</p>
                    </div>
                  ) : (
                    <div className="text-white text-center">
                      <Camera className="w-12 h-12 mx-auto mb-2" />
                      <p className="text-sm">Position QR code in frame</p>
                    </div>
                  )}
                  
                  {/* Scanner frame overlay */}
                  <div className="absolute inset-0 border-2 border-emerald-500 rounded-lg pointer-events-none">
                    <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-emerald-500"></div>
                    <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-emerald-500"></div>
                    <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-emerald-500"></div>
                    <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-emerald-500"></div>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={stopQRScan}
                    className="flex-1 px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={simulateQRScan}
                    disabled={isScanning}
                    className="flex-1 px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-lg transition-colors duration-200 cursor-pointer"
                  >
                    {isScanning ? 'Scanning...' : 'Simulate Scan'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};