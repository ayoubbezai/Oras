import React, { useState } from 'react';
import { MdSearch, MdFilterList, MdDownload, MdVisibility, MdEdit, MdMoreVert } from 'react-icons/md';

const ClaimsTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // Sample claims data
  const claimsData = [
    {
      id: 'CLM-2024-001',
      policyNumber: 'POL-987654',
      claimant: 'John Doe',
      vehicle: 'Toyota Camry 2022',
      incidentDate: '2024-01-15',
      claimDate: '2024-01-16',
      status: 'approved',
      amount: '$2,450',
      assessor: 'Sarah Wilson'
    },
    {
      id: 'CLM-2024-002',
      policyNumber: 'POL-123456',
      claimant: 'Alice Johnson',
      vehicle: 'Honda Civic 2021',
      incidentDate: '2024-01-10',
      claimDate: '2024-01-12',
      status: 'pending',
      amount: '$1,780',
      assessor: 'Mike Chen'
    },
    {
      id: 'CLM-2024-003',
      policyNumber: 'POL-234567',
      claimant: 'Robert Brown',
      vehicle: 'Ford F-150 2023',
      incidentDate: '2024-01-08',
      claimDate: '2024-01-09',
      status: 'rejected',
      amount: '$3,200',
      assessor: 'Emily Davis'
    },
    {
      id: 'CLM-2024-004',
      policyNumber: 'POL-345678',
      claimant: 'Maria Garcia',
      vehicle: 'Tesla Model 3 2023',
      incidentDate: '2024-01-05',
      claimDate: '2024-01-07',
      status: 'processing',
      amount: '$8,500',
      assessor: 'David Kim'
    },
    {
      id: 'CLM-2024-005',
      policyNumber: 'POL-456789',
      claimant: 'James Wilson',
      vehicle: 'BMW X5 2022',
      incidentDate: '2024-01-03',
      claimDate: '2024-01-04',
      status: 'approved',
      amount: '$4,300',
      assessor: 'Lisa Taylor'
    },
    {
      id: 'CLM-2024-006',
      policyNumber: 'POL-567890',
      claimant: 'Patricia Lee',
      vehicle: 'Hyundai Tucson 2021',
      incidentDate: '2024-01-01',
      claimDate: '2024-01-02',
      status: 'pending',
      amount: '$2,100',
      assessor: 'Michael Brown'
    },
    {
      id: 'CLM-2024-007',
      policyNumber: 'POL-678901',
      claimant: 'Thomas Moore',
      vehicle: 'Chevrolet Silverado 2023',
      incidentDate: '2023-12-28',
      claimDate: '2023-12-29',
      status: 'processing',
      amount: '$5,600',
      assessor: 'Jennifer Lopez'
    },
    {
      id: 'CLM-2024-008',
      policyNumber: 'POL-789012',
      claimant: 'Susan Clark',
      vehicle: 'Nissan Rogue 2022',
      incidentDate: '2023-12-25',
      claimDate: '2023-12-26',
      status: 'approved',
      amount: '$3,800',
      assessor: 'Kevin Martin'
    },
    {
      id: 'CLM-2024-009',
      policyNumber: 'POL-890123',
      claimant: 'William Anderson',
      vehicle: 'Audi Q7 2023',
      incidentDate: '2023-12-22',
      claimDate: '2023-12-23',
      status: 'rejected',
      amount: '$7,200',
      assessor: 'Amanda Scott'
    },
    {
      id: 'CLM-2024-010',
      policyNumber: 'POL-901234',
      claimant: 'Elizabeth White',
      vehicle: 'Subaru Outback 2021',
      incidentDate: '2023-12-20',
      claimDate: '2023-12-21',
      status: 'processing',
      amount: '$2,900',
      assessor: 'Brian Johnson'
    }
  ];

  // Filter claims based on search and filters
  const filteredClaims = claimsData.filter(claim => {
    const matchesSearch = 
      claim.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.claimant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.policyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.vehicle.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || claim.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header with filters */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Recent Claims</h2>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search input */}
            <div className="relative">
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search claims..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="rejected">Rejected</option>
            </select>
            
            {/* Export button */}
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <MdDownload />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Claim ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Policy Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Claimant</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Incident Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Claim Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assessor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredClaims.map((claim) => (
              <tr key={claim.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-medium text-blue-600">{claim.id}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{claim.policyNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap">{claim.claimant}</td>
                <td className="px-6 py-4 whitespace-nowrap">{claim.vehicle}</td>
                <td className="px-6 py-4 whitespace-nowrap">{claim.incidentDate}</td>
                <td className="px-6 py-4 whitespace-nowrap">{claim.claimDate}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(claim.status)}`}>
                    {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{claim.amount}</td>
                <td className="px-6 py-4 whitespace-nowrap">{claim.assessor}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <button className="p-1 text-blue-600 hover:bg-blue-50 rounded" title="View Details">
                      <MdVisibility />
                    </button>
                    <button className="p-1 text-gray-600 hover:bg-gray-50 rounded" title="Edit">
                      <MdEdit />
                    </button>
                    <button className="p-1 text-gray-600 hover:bg-gray-50 rounded" title="More options">
                      <MdMoreVert />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer with pagination */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{filteredClaims.length}</span> of {claimsData.length} claims
          </p>
          
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-1 border border-blue-500 bg-blue-50 text-blue-600 rounded-md text-sm font-medium">
              1
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              3
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimsTable;