import React, { useContext, useState } from 'react';
import { Search, UserPlus, Phone, Mail, Calendar, Star, Edit2, Trash2, X } from 'lucide-react';
import { LoyaltyContext } from '../context/LoyaltyContext';
import { Customer } from '../types';

export const Customers: React.FC = () => {
  const { customers, visits, addCustomer, deleteCustomer, updateCustomer } = useContext(LoyaltyContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'visits' | 'lastVisit'>('name');
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showEditCustomer, setShowEditCustomer] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);
  const [newCustomerData, setNewCustomerData] = useState({
    name: '',
    phone: '',
    email: ''
  });

  const filteredCustomers = customers
    .filter(customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'visits':
          return b.totalVisits - a.totalVisits;
        case 'lastVisit':
          if (!a.lastVisit && !b.lastVisit) return 0;
          if (!a.lastVisit) return 1;
          if (!b.lastVisit) return -1;
          return new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime();
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const handleAddCustomer = () => {
    if (newCustomerData.name && newCustomerData.phone) {
      const newCustomer: Customer = {
        id: Date.now().toString(),
        name: newCustomerData.name,
        phone: newCustomerData.phone,
        email: newCustomerData.email,
        totalVisits: 0,
        joinDate: new Date().toISOString(),
        lastVisit: null
      };
      
      addCustomer(newCustomer);
      setNewCustomerData({ name: '', phone: '', email: '' });
      setShowAddCustomer(false);
    }
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setNewCustomerData({
      name: customer.name,
      phone: customer.phone,
      email: customer.email
    });
    setShowEditCustomer(true);
  };

  const handleUpdateCustomer = () => {
    if (editingCustomer && newCustomerData.name && newCustomerData.phone) {
      updateCustomer(editingCustomer.id, {
        name: newCustomerData.name,
        phone: newCustomerData.phone,
        email: newCustomerData.email
      });
      setNewCustomerData({ name: '', phone: '', email: '' });
      setShowEditCustomer(false);
      setEditingCustomer(null);
    }
  };

  const handleDeleteCustomer = (customerId: string) => {
    setCustomerToDelete(customerId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (customerToDelete) {
      deleteCustomer(customerToDelete);
      setCustomerToDelete(null);
      setShowDeleteConfirm(false);
    }
  };

  const cancelDelete = () => {
    setCustomerToDelete(null);
    setShowDeleteConfirm(false);
  };

  const getCustomerVisits = (customerId: string) => {
    return visits.filter(visit => visit.customerId === customerId);
  };

  const getVisitFrequency = (customer: Customer) => {
    if (!customer.lastVisit || customer.totalVisits === 0) return 'New';
    
    const daysSinceJoin = Math.floor(
      (new Date().getTime() - new Date(customer.joinDate).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSinceJoin === 0) return 'New';
    
    const frequency = Math.round(customer.totalVisits / (daysSinceJoin / 30));
    if (frequency >= 4) return 'Very Frequent';
    if (frequency >= 2) return 'Regular';
    if (frequency >= 1) return 'Occasional';
    return 'Rare';
  };

  const getLoyaltyLevel = (totalVisits: number) => {
    if (totalVisits >= 20) return { level: 'VIP', color: 'text-purple-600 bg-purple-100' };
    if (totalVisits >= 10) return { level: 'Gold', color: 'text-yellow-600 bg-yellow-100' };
    if (totalVisits >= 5) return { level: 'Silver', color: 'text-gray-600 bg-gray-100' };
    return { level: 'Bronze', color: 'text-orange-600 bg-orange-100' };
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="mb-6 lg:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 lg:mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Customer Management
            </h1>
            <p className="text-sm sm:text-base text-gray-600">Manage your loyal customers and track their visits</p>
          </div>
          <button
            onClick={() => setShowAddCustomer(true)}
            className="mt-3 lg:mt-0 flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-3 lg:px-4 text-sm lg:text-base rounded-lg transition-colors duration-200 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Customer</span>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 mb-4 lg:mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search customers..."
              className="w-full pl-10 pr-4 py-2 text-sm lg:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'visits' | 'lastVisit')}
            className="px-3 lg:px-4 py-2 text-sm lg:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent cursor-pointer"
          >
            <option value="name">Sort by Name</option>
            <option value="visits">Sort by Visits</option>
            <option value="lastVisit">Sort by Last Visit</option>
          </select>
        </div>

        {/* Customer Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6 lg:mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 lg:p-4">
            <p className="text-lg lg:text-2xl font-bold text-emerald-600">{customers.length}</p>
            <p className="text-xs lg:text-sm text-gray-600">Total Customers</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 lg:p-4">
            <p className="text-lg lg:text-2xl font-bold text-blue-600">
              {customers.filter(c => c.totalVisits >= 5).length}
            </p>
            <p className="text-xs lg:text-sm text-gray-600">Regular Customers</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 lg:p-4">
            <p className="text-lg lg:text-2xl font-bold text-purple-600">
              {customers.filter(c => c.totalVisits >= 20).length}
            </p>
            <p className="text-xs lg:text-sm text-gray-600">VIP Customers</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 lg:p-4">
            <p className="text-lg lg:text-2xl font-bold text-orange-600">
              {customers.filter(c => {
                const daysSinceLastVisit = c.lastVisit ? 
                  Math.floor((new Date().getTime() - new Date(c.lastVisit).getTime()) / (1000 * 60 * 60 * 24)) : 
                  Infinity;
                return daysSinceLastVisit > 30;
              }).length}
            </p>
            <p className="text-xs lg:text-sm text-gray-600">Need Follow-up</p>
          </div>
        </div>
      </div>

      {/* Customer List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 lg:p-6 border-b border-gray-200">
          <h3 className="text-base lg:text-lg font-semibold text-gray-900">
            All Customers ({filteredCustomers.length})
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredCustomers.map((customer) => {
            const loyaltyLevel = getLoyaltyLevel(customer.totalVisits);
            const frequency = getVisitFrequency(customer);
            
            return (
              <div key={customer.id} className="p-4 lg:p-6 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 lg:space-x-3 mb-2">
                      <div className="flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 bg-emerald-100 rounded-full">
                        <span className="text-emerald-600 font-semibold text-sm lg:text-lg">
                          {customer.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-base lg:text-lg font-semibold text-gray-900">{customer.name}</h4>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs lg:text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Phone className="w-3 h-3 lg:w-4 lg:h-4" />
                            <span>{customer.phone}</span>
                          </div>
                          {customer.email && (
                            <div className="flex items-center space-x-1">
                              <Mail className="w-3 h-3 lg:w-4 lg:h-4" />
                              <span>{customer.email}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-1 lg:gap-2 mb-2 lg:mb-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${loyaltyLevel.color}`}>
                        {loyaltyLevel.level}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
                        {frequency}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                        {customer.totalVisits} visits
                      </span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs lg:text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3 lg:w-4 lg:h-4" />
                        <span>
                          Joined {new Date(customer.joinDate).toLocaleDateString()}
                        </span>
                      </div>
                      {customer.lastVisit && (
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 lg:w-4 lg:h-4" />
                          <span>
                            Last visit {new Date(customer.lastVisit).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-3 lg:mt-0">
                    <button 
                      onClick={() => handleEditCustomer(customer)}
                      className="flex items-center space-x-1 lg:space-x-2 px-2 lg:px-3 py-1 lg:py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3 lg:w-4 lg:h-4" />
                      <span className="text-xs lg:text-sm">Edit</span>
                    </button>
                    <button 
                      onClick={() => handleDeleteCustomer(customer.id)}
                      className="flex items-center space-x-1 lg:space-x-2 px-2 lg:px-3 py-1 lg:py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3 lg:w-4 lg:h-4" />
                      <span className="text-xs lg:text-sm">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {filteredCustomers.length === 0 && (
          <div className="p-8 lg:p-12 text-center">
            <Search className="w-8 h-8 lg:w-12 lg:h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-sm lg:text-base text-gray-500">No customers found</p>
          </div>
        )}
      </div>

      {/* Add Customer Modal */}
      {showAddCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-4 lg:p-6">
            <div className="flex items-center justify-between mb-3 lg:mb-4">
              <h3 className="text-base lg:text-lg font-semibold text-gray-900">Add New Customer</h3>
              <button
                onClick={() => setShowAddCustomer(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3 lg:space-y-4">
              <div>
                <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={newCustomerData.name}
                  onChange={(e) => setNewCustomerData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Customer name"
                  className="w-full px-3 py-2 text-sm lg:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={newCustomerData.phone}
                  onChange={(e) => setNewCustomerData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+254712345678"
                  className="w-full px-3 py-2 text-sm lg:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-2">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={newCustomerData.email}
                  onChange={(e) => setNewCustomerData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="customer@email.com"
                  className="w-full px-3 py-2 text-sm lg:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-4 lg:mt-6">
              <button
                onClick={() => setShowAddCustomer(false)}
                className="flex-1 px-4 py-2 text-xs lg:text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCustomer}
                disabled={!newCustomerData.name || !newCustomerData.phone}
                className="flex-1 px-4 py-2 text-xs lg:text-sm bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white rounded-lg transition-colors duration-200 cursor-pointer"
              >
                Add Customer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Customer Modal */}
      {showEditCustomer && editingCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-4 lg:p-6">
            <div className="flex items-center justify-between mb-3 lg:mb-4">
              <h3 className="text-base lg:text-lg font-semibold text-gray-900">Edit Customer</h3>
              <button
                onClick={() => setShowEditCustomer(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3 lg:space-y-4">
              <div>
                <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={newCustomerData.name}
                  onChange={(e) => setNewCustomerData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Customer name"
                  className="w-full px-3 py-2 text-sm lg:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={newCustomerData.phone}
                  onChange={(e) => setNewCustomerData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+254712345678"
                  className="w-full px-3 py-2 text-sm lg:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-2">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={newCustomerData.email}
                  onChange={(e) => setNewCustomerData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="customer@email.com"
                  className="w-full px-3 py-2 text-sm lg:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-4 lg:mt-6">
              <button
                onClick={() => setShowEditCustomer(false)}
                className="flex-1 px-4 py-2 text-xs lg:text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateCustomer}
                disabled={!newCustomerData.name || !newCustomerData.phone}
                className="flex-1 px-4 py-2 text-xs lg:text-sm bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white rounded-lg transition-colors duration-200 cursor-pointer"
              >
                Update Customer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-4 lg:p-6">
            <div className="flex items-center justify-between mb-3 lg:mb-4">
              <h3 className="text-base lg:text-lg font-semibold text-gray-900">Confirm Delete</h3>
              <button
                onClick={cancelDelete}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-4 lg:mb-6">
              <p className="text-sm lg:text-base text-gray-600">
                Are you sure you want to delete this customer? This action cannot be undone and will also remove all their visits and rewards.
              </p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={cancelDelete}
                className="flex-1 px-4 py-2 text-xs lg:text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 text-xs lg:text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 cursor-pointer"
              >
                Delete Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};