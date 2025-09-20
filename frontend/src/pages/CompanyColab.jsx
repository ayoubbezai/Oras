import React, { useState } from 'react';
import { 
  MdEmail, 
  MdPhone, 
  MdLocationOn, 
  MdBusiness, 
  MdMoreVert, 
  MdEdit, 
  MdDelete, 
  MdStar, 
  MdStarBorder, 
  MdPeople, 
  MdHandshake,
  MdDirectionsCar,
  MdEngineering,
  MdAssignment,
  MdExpandMore,
  MdExpandLess
} from 'react-icons/md';

const CompanyColab = () => {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companies, setCompanies] = useState([
    {
      id: 1,
      name: "Insurance Partners Inc.",
      industry: "Insurance Services",
      email: "partners@insurancepartners.com",
      phone: "+1 (555) 123-4567",
      location: "New York, NY",
      contactPerson: "Sarah Johnson",
      status: "active",
      rating: 4.8,
      collaborationScore: 92,
      employees: 250,
      projects: 47,
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
      since: "2015",
      drivers: [
        { id: 1, name: "John Smith", experience: "5 years", status: "Active" },
        { id: 2, name: "Emma Wilson", experience: "3 years", status: "Active" }
      ],
      reports: [
        { id: 1, title: "Q1 2023 Collaboration", date: "Mar 15, 2023", status: "Completed" },
        { id: 2, title: "Insurance Claims Analysis", date: "Apr 22, 2023", status: "In Progress" }
      ]
    },
    {
      id: 2,
      name: "Claim Solutions LLC",
      industry: "Claims Management",
      email: "info@claimsolutions.com",
      phone: "+1 (555) 234-5678",
      location: "San Francisco, CA",
      contactPerson: "Michael Chen",
      status: "active",
      rating: 4.9,
      collaborationScore: 95,
      employees: 180,
      projects: 52,
      logo: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
      since: "2018",
      drivers: [
        { id: 1, name: "Mike Johnson", experience: "7 years", status: "Active" },
        { id: 2, name: "Sarah Williams", experience: "4 years", status: "On Leave" }
      ],
      reports: [
        { id: 1, title: "Annual Claims Report", date: "Jan 30, 2023", status: "Completed" },
        { id: 2, title: "Q2 Performance Review", date: "Jun 15, 2023", status: "Pending" }
      ]
    },
    {
      id: 3,
      name: "Risk Management Partners",
      industry: "Risk Assessment",
      email: "contact@riskmanagement.com",
      phone: "+1 (555) 345-6789",
      location: "Chicago, IL",
      contactPerson: "David Kim",
      status: "active",
      rating: 4.6,
      collaborationScore: 88,
      employees: 120,
      projects: 29,
      logo: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
      since: "2016",
      drivers: [
        { id: 1, name: "Thomas Brown", experience: "6 years", status: "Active" },
        { id: 2, name: "Olivia Davis", experience: "2 years", status: "Active" }
      ],
      reports: [
        { id: 1, title: "Risk Assessment Q1", date: "Feb 10, 2023", status: "Completed" },
        { id: 2, title: "Safety Audit Report", date: "May 5, 2023", status: "In Progress" }
      ]
    }
  ]);

  const [filter, setFilter] = useState('all');

  const filteredCompanies = companies.filter(company => 
    filter === 'all' || company.status === filter
  );

  const toggleStatus = (id) => {
    setCompanies(companies.map(company =>
      company.id === id 
        ? { ...company, status: company.status === 'active' ? 'inactive' : 'active' }
        : company
    ));
  };

  const deleteCompany = (id) => {
    if (window.confirm('Are you sure you want to remove this company?')) {
      setCompanies(companies.filter(company => company.id !== id));
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= Math.floor(rating) 
          ? <MdStar key={i} className="text-yellow-400 text-sm" />
          : <MdStarBorder key={i} className="text-yellow-400 text-sm" />
      );
    }
    return stars;
  };

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'active':
      case 'available':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in progress':
        return 'bg-blue-100 text-blue-800';
      case 'on leave':
        return 'bg-yellow-100 text-yellow-800';
      case 'busy':
        return 'bg-orange-100 text-orange-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Company Collaborations</h2>
          <p className="text-gray-600">Manage your partner companies and collaboration relationships</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Companies</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Add Company
          </button>
        </div>
      </div>

      {/* Horizontal Company Cards */}
      <div className="space-y-4">
        {filteredCompanies.map((company) => (
          <div 
            key={company.id} 
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 overflow-hidden"
          >
            {/* Main Card Content - Horizontal Layout */}
            <div className="flex flex-col md:flex-row">
              {/* Company Logo and Basic Info */}
              <div className="md:w-1/4 p-6 border-r border-gray-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="w-16 h-16 rounded-lg object-cover border-2 border-white shadow-sm"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{company.name}</h3>
                      <p className="text-blue-600 text-sm">{company.industry}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      {renderStars(company.rating)}
                      <span className="text-sm text-gray-600 ml-2">({company.rating})</span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      company.collaborationScore >= 90 
                        ? 'bg-green-100 text-green-800' 
                        : company.collaborationScore >= 80 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      Score: {company.collaborationScore}%
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Since {company.since}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    company.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {company.status}
                  </span>
                </div>
              </div>

              {/* Contact Information */}
              <div className="md:w-1/4 p-6 border-r border-gray-200">
                <h4 className="font-medium text-gray-700 mb-4 flex items-center">
                  <MdPeople className="text-blue-500 mr-2" />
                  Contact Info
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <MdEmail className="text-blue-500 mr-3 flex-shrink-0" />
                    <span className="text-sm truncate">{company.email}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MdPhone className="text-blue-500 mr-3 flex-shrink-0" />
                    <span className="text-sm">{company.phone}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MdLocationOn className="text-blue-500 mr-3 flex-shrink-0" />
                    <span className="text-sm">{company.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MdPeople className="text-blue-500 mr-3 flex-shrink-0" />
                    <span className="text-sm">{company.contactPerson}</span>
                  </div>
                </div>
              </div>

              {/* Drivers Information */}
              <div className="md:w-1/4 p-6 border-r border-gray-200">
                <h4 className="font-medium text-gray-700 mb-4 flex items-center">
                  <MdDirectionsCar className="text-blue-500 mr-2" />
                  Drivers
                </h4>
                <div className="space-y-3">
                  {company.drivers.map(driver => (
                    <div key={driver.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{driver.name}</p>
                        <p className="text-xs text-gray-600">{driver.experience}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(driver.status)}`}>
                        {driver.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reports Information */}
              <div className="md:w-1/4 p-6">
                <h4 className="font-medium text-gray-700 mb-4 flex items-center">
                  <MdAssignment className="text-blue-500 mr-2" />
                  Reports
                </h4>
                <div className="space-y-3">
                  {company.reports.map(report => (
                    <div key={report.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{report.title}</p>
                        <p className="text-xs text-gray-600">{report.date}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card Footer with Actions */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSelectedCompany(selectedCompany?.id === company.id ? null : company)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                >
                  {selectedCompany?.id === company.id ? (
                    <>
                      <MdExpandLess className="mr-1" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <MdExpandMore className="mr-1" />
                      Show More Details
                    </>
                  )}
                </button>
                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleStatus(company.id)}
                    className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                    title={company.status === 'active' ? 'Deactivate' : 'Activate'}
                  >
                    <MdEdit />
                  </button>
                  <button
                    onClick={() => deleteCompany(company.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    title="Remove"
                  >
                    <MdDelete />
                  </button>
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            {selectedCompany?.id === company.id && (
              <div className="px-6 py-4 bg-blue-50 border-t border-blue-200">
                <h4 className="font-medium text-gray-700 mb-3">Additional Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                    <p className="text-2xl font-bold text-gray-800">{company.employees}</p>
                    <p className="text-sm text-gray-600">Employees</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                    <p className="text-2xl font-bold text-gray-800">{company.projects}</p>
                    <p className="text-sm text-gray-600">Projects</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                    <p className="text-2xl font-bold text-gray-800">{company.since}</p>
                    <p className="text-sm text-gray-600">Partner Since</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCompanies.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🏢</div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">No companies found</h3>
          <p className="text-gray-500">
            {filter === 'all' 
              ? 'Get started by adding your first partner company'
              : `No ${filter} companies found`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default CompanyColab;