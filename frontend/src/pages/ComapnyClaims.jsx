import React, { useState } from 'react';
import {
  MdSearch,
  MdFilterList,
  MdViewModule,
  MdViewList,
  MdEdit,
  MdDelete,
  MdAssignment,
  MdDirectionsCar,
  MdPerson,
  MdCalendarToday,
  MdAttachMoney,
  MdCheckCircle,
  MdPending,
  MdCancel
} from 'react-icons/md';

const CompanyClaims = () => {
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample claims data
  const [claims, setClaims] = useState([
    {
      id: 'CL-2023-001',
      driverId: 'DRV-001',
      driverName: 'John Smith',
      carNumber: 'ABC-1234',
      carModel: 'Toyota Camry 2021',
      accidentDate: '2023-05-15',
      reportDate: '2023-05-16',
      location: 'New York, NY',
      description: 'Rear-end collision at traffic light',
      status: 'approved',
      estimatedCost: 4200,
      approvedAmount: 4000,
      insuranceCompany: 'Insurance Partners Inc.',
      adjuster: 'Sarah Johnson',
      photos: 5,
      documents: 3
    },
    {
      id: 'CL-2023-002',
      driverId: 'DRV-002',
      driverName: 'Emma Wilson',
      carNumber: 'XYZ-5678',
      carModel: 'Honda Civic 2020',
      accidentDate: '2023-05-18',
      reportDate: '2023-05-19',
      location: 'San Francisco, CA',
      description: 'Side collision while changing lanes',
      status: 'pending',
      estimatedCost: 3500,
      approvedAmount: null,
      insuranceCompany: 'Claim Solutions LLC',
      adjuster: 'Michael Chen',
      photos: 3,
      documents: 2
    },
    {
      id: 'CL-2023-003',
      driverId: 'DRV-003',
      driverName: 'Mike Johnson',
      carNumber: 'DEF-9012',
      carModel: 'Ford F-150 2022',
      accidentDate: '2023-05-20',
      reportDate: '2023-05-21',
      location: 'Chicago, IL',
      description: 'Parking lot damage - hit by shopping cart',
      status: 'rejected',
      estimatedCost: 1200,
      approvedAmount: 0,
      insuranceCompany: 'Risk Management Partners',
      adjuster: 'David Kim',
      photos: 4,
      documents: 1
    },
    {
      id: 'CL-2023-004',
      driverId: 'DRV-004',
      driverName: 'Sarah Williams',
      carNumber: 'GHI-3456',
      carModel: 'Tesla Model 3 2023',
      accidentDate: '2023-05-22',
      reportDate: '2023-05-23',
      location: 'Miami, FL',
      description: 'Hail damage during storm',
      status: 'approved',
      estimatedCost: 8500,
      approvedAmount: 8000,
      insuranceCompany: 'Coastal Insurance Group',
      adjuster: 'Lisa Taylor',
      photos: 8,
      documents: 4
    },
    {
      id: 'CL-2023-005',
      driverId: 'DRV-005',
      driverName: 'Thomas Brown',
      carNumber: 'JKL-7890',
      carModel: 'Chevrolet Malibu 2019',
      accidentDate: '2023-05-25',
      reportDate: '2023-05-26',
      location: 'Boston, MA',
      description: 'Front collision with deer',
      status: 'pending',
      estimatedCost: 5300,
      approvedAmount: null,
      insuranceCompany: 'Legal Shield Partners',
      adjuster: 'James Wilson',
      photos: 6,
      documents: 3
    }
  ]);

  // Filter claims based on status and search term
  const filteredClaims = claims.filter(claim => {
    const matchesStatus = filterStatus === 'all' || claim.status === filterStatus;
    const matchesSearch = 
      claim.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.carNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.insuranceCompany.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  // Get status icon and color
  const getStatusInfo = (status) => {
    switch(status) {
      case 'approved':
        return { icon: <MdCheckCircle className="text-green-500" />, color: 'bg-green-100 text-green-800' };
      case 'pending':
        return { icon: <MdPending className="text-yellow-500" />, color: 'bg-yellow-100 text-yellow-800' };
      case 'rejected':
        return { icon: <MdCancel className="text-red-500" />, color: 'bg-red-100 text-red-800' };
      default:
        return { icon: null, color: 'bg-gray-100 text-gray-800' };
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="w-[97%] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Claims Management</h1>
          <p className="text-gray-600">Manage and track all insurance claims</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MdSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search claims by ID, driver, car number, or insurance company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filters and View Toggle */}
            <div className="flex items-center space-x-4">
              {/* Status Filter */}
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="appearance-none pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Statuses</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <MdFilterList className="text-gray-400" />
                </div>
              </div>

              {/* View Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-md ${viewMode === 'table' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                >
                  <MdViewList size={20} />
                </button>
                <button
                  onClick={() => setViewMode('card')}
                  className={`p-2 rounded-md ${viewMode === 'card' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                >
                  <MdViewModule size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Claims Count */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing {filteredClaims.length} of {claims.length} claims
          </p>
        </div>

        {/* Table View */}
        {viewMode === 'table' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Claim ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver & Vehicle</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accident Details</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Financials</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Insurance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredClaims.map((claim) => {
                    const statusInfo = getStatusInfo(claim.status);
                    return (
                      <tr key={claim.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <MdAssignment className="text-blue-500 mr-2" />
                            <span className="text-sm font-medium text-gray-900">{claim.id}</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Reported: {formatDate(claim.reportDate)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <MdPerson className="text-gray-400 mr-2" />
                            <span className="text-sm font-medium text-gray-900">{claim.driverName}</span>
                          </div>
                          <div className="flex items-center mt-1">
                            <MdDirectionsCar className="text-gray-400 mr-2" />
                            <span className="text-xs text-gray-500">{claim.carNumber} • {claim.carModel}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{claim.description}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            <MdCalendarToday className="inline mr-1" />
                            {formatDate(claim.accidentDate)} • {claim.location}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            Est: {formatCurrency(claim.estimatedCost)}
                          </div>
                          <div className="text-xs text-gray-500">
                            Approved: {claim.approvedAmount ? formatCurrency(claim.approvedAmount) : 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{claim.insuranceCompany}</div>
                          <div className="text-xs text-gray-500">Adjuster: {claim.adjuster}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                            {statusInfo.icon}
                            <span className="ml-1 capitalize">{claim.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">
                            <MdEdit />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <MdDelete />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Card View */}
        {viewMode === 'card' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClaims.map((claim) => {
              const statusInfo = getStatusInfo(claim.status);
              return (
                <div key={claim.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                  {/* Card Header */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          <MdAssignment className="text-blue-500 mr-2" />
                          <h3 className="text-lg font-semibold text-gray-800">{claim.id}</h3>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Reported: {formatDate(claim.reportDate)}</p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        {statusInfo.icon}
                        <span className="ml-1 capitalize">{claim.status}</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-4">
                    {/* Driver Info */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Driver Information</h4>
                      <div className="flex items-center">
                        <MdPerson className="text-gray-400 mr-2" />
                        <span className="text-sm text-gray-800">{claim.driverName}</span>
                        <span className="text-xs text-gray-500 ml-2">({claim.driverId})</span>
                      </div>
                    </div>

                    {/* Vehicle Info */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Vehicle Information</h4>
                      <div className="flex items-center">
                        <MdDirectionsCar className="text-gray-400 mr-2" />
                        <span className="text-sm text-gray-800">{claim.carNumber}</span>
                      </div>
                      <p className="text-xs text-gray-600 ml-6">{claim.carModel}</p>
                    </div>

                    {/* Accident Info */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Accident Details</h4>
                      <p className="text-sm text-gray-800">{claim.description}</p>
                      <div className="flex items-center mt-1 text-xs text-gray-600">
                        <MdCalendarToday className="mr-1" />
                        {formatDate(claim.accidentDate)} • {claim.location}
                      </div>
                    </div>

                    {/* Financial Info */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Financial Information</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-xs text-gray-600">Estimated Cost</p>
                          <p className="text-sm font-medium text-gray-800">{formatCurrency(claim.estimatedCost)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Approved Amount</p>
                          <p className="text-sm font-medium text-gray-800">
                            {claim.approvedAmount ? formatCurrency(claim.approvedAmount) : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Insurance Info */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Insurance Information</h4>
                      <p className="text-sm text-gray-800">{claim.insuranceCompany}</p>
                      <p className="text-xs text-gray-600">Adjuster: {claim.adjuster}</p>
                    </div>

                    {/* Documents */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Attachments</h4>
                      <div className="flex space-x-4">
                        <span className="text-xs text-gray-600">{claim.photos} photos</span>
                        <span className="text-xs text-gray-600">{claim.documents} documents</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-end space-x-2">
                    <button className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-md hover:bg-blue-200 transition-colors">
                      <MdEdit className="inline mr-1" /> Edit
                    </button>
                    <button className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-md hover:bg-red-200 transition-colors">
                      <MdDelete className="inline mr-1" /> Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {filteredClaims.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">No claims found</h3>
            <p className="text-gray-500">
              {filterStatus === 'all' 
                ? 'Get started by creating your first claim'
                : `No ${filterStatus} claims found`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyClaims;