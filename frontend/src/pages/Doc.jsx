import React, { useState } from 'react';
import { 
  MdCode, 
  MdSecurity, 
  MdDescription, 
  MdDataUsage,
  MdLocationOn,
  MdDirectionsCar,
  MdAssignment,
  MdPeople,
  MdAccountBalance,
  MdExpandMore,
  MdExpandLess,
  MdContentCopy,
  MdCheck
} from 'react-icons/md';

const Doc = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [copiedEndpoint, setCopiedEndpoint] = useState(null);

  const copyToClipboard = (text, endpointName) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(endpointName);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const apiEndpoints = [
    {
      name: 'accident-locations',
      title: 'Accident Hotspots',
      description: 'Get locations with high accident concentrations',
      method: 'GET',
      endpoint: '/api/v1/government/accident-locations',
      parameters: [
        { name: 'start_date', type: 'string', required: false, description: 'Start date (YYYY-MM-DD)' },
        { name: 'end_date', type: 'string', required: false, description: 'End date (YYYY-MM-DD)' },
        { name: 'severity', type: 'string', required: false, description: 'Filter by severity (low, medium, high)' },
        { name: 'limit', type: 'number', required: false, description: 'Number of results to return' }
      ],
      response: `{
  "data": [
    {
      "location": {
        "latitude": 40.7128,
        "longitude": -74.0060,
        "address": "123 Main St, New York, NY"
      },
      "accident_count": 45,
      "severity_index": 8.7,
      "trend": "increasing",
      "last_updated": "2023-06-15T10:30:00Z"
    }
  ],
  "metadata": {
    "total_locations": 125,
    "timeframe": "2023-01-01 to 2023-06-15"
  }
}`
    },
    {
      name: 'vehicle-statistics',
      title: 'Vehicle Crash Statistics',
      description: 'Get statistics on vehicle types involved in accidents',
      method: 'GET',
      endpoint: '/api/v1/government/vehicle-statistics',
      parameters: [
        { name: 'make', type: 'string', required: false, description: 'Filter by vehicle make' },
        { name: 'model', type: 'string', required: false, description: 'Filter by vehicle model' },
        { name: 'year', type: 'number', required: false, description: 'Filter by vehicle year' },
        { name: 'min_accidents', type: 'number', required: false, description: 'Minimum number of accidents' }
      ],
      response: `{
  "data": [
    {
      "vehicle_type": "Sedan",
      "make": "Toyota",
      "model": "Camry",
      "year": 2021,
      "accident_count": 78,
      "average_severity": 6.2,
      "common_collision_types": ["rear-end", "side-impact"]
    }
  ],
  "metadata": {
    "time_period": "last_12_months",
    "total_vehicles_tracked": 24500
  }
}`
    },
    {
      name: 'insurance-data',
      title: 'Insurance Information',
      description: 'Access insurance data for analysis and regulatory purposes',
      method: 'GET',
      endpoint: '/api/v1/government/insurance-data',
      parameters: [
        { name: 'company_id', type: 'string', required: false, description: 'Filter by insurance company ID' },
        { name: 'region', type: 'string', required: false, description: 'Filter by geographical region' },
        { name: 'policy_type', type: 'string', required: false, description: 'Filter by policy type' }
      ],
      response: `{
  "data": [
    {
      "insurance_company": "SafeDrive Insurance",
      "company_id": "INS-2023-001",
      "active_policies": 12500,
      "claims_ratio": 0.23,
      "average_claim_amount": 4250,
      "common_claim_types": ["collision", "comprehensive"],
      "region_coverage": ["Northeast", "Midwest"]
    }
  ],
  "metadata": {
    "last_updated": "2023-06-15T08:45:00Z",
    "data_source": "National Insurance Database"
  }
}`
    },
    {
      name: 'driver-statistics',
      title: 'Driver Statistics',
      description: 'Get statistical data about drivers and accident patterns',
      method: 'GET',
      endpoint: '/api/v1/government/driver-statistics',
      parameters: [
        { name: 'age_range', type: 'string', required: false, description: 'Filter by age range (e.g., 18-25)' },
        { name: 'license_type', type: 'string', required: false, description: 'Filter by license type' },
        { name: 'experience_years', type: 'number', required: false, description: 'Filter by years of driving experience' }
      ],
      response: `{
  "data": [
    {
      "demographic": "25-34 years",
      "accident_count": 245,
      "average_severity_score": 5.8,
      "common_violations": ["speeding", "distracted_driving"],
      "time_of_day_peak": "16:00-19:00",
      "accident_trend": "decreasing"
    }
  ],
  "metadata": {
    "reporting_period": "2023-Q2",
    "total_drivers_in_dataset": 50000
  }
}`
    },
    {
      name: 'claims-analysis',
      title: 'Claims Analysis',
      description: 'Detailed analysis of insurance claims data',
      method: 'GET',
      endpoint: '/api/v1/government/claims-analysis',
      parameters: [
        { name: 'status', type: 'string', required: false, description: 'Filter by claim status' },
        { name: 'min_amount', type: 'number', required: false, description: 'Minimum claim amount' },
        { name: 'max_amount', type: 'number', required: false, description: 'Maximum claim amount' },
        { name: 'timeframe', type: 'string', required: false, description: 'Timeframe for analysis' }
      ],
      response: `{
  "data": [
    {
      "claim_id": "CLM-2023-04567",
      "date_submitted": "2023-05-15",
      "date_resolved": "2023-06-01",
      "status": "approved",
      "amount": 5670,
      "vehicle_type": "SUV",
      "accident_severity": "high",
      "processing_time_days": 17,
      "location": {
        "city": "Chicago",
        "state": "IL",
        "latitude": 41.8781,
        "longitude": -87.6298
      }
    }
  ],
  "analytics": {
    "average_processing_time": 14.5,
    "approval_rate": 0.78,
    "average_claim_amount": 4320,
    "common_denial_reasons": ["fraud_suspected", "coverage_lapsed"]
  }
}`
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Government API Documentation
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Access comprehensive accident, vehicle, insurance, driver, and claims data for analysis and policy making
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">API Endpoints</h2>
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveSection('overview')}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${
                    activeSection === 'overview'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <MdDescription className="mr-3" />
                  Overview
                </button>
                <button
                  onClick={() => setActiveSection('authentication')}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${
                    activeSection === 'authentication'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <MdSecurity className="mr-3" />
                  Authentication
                </button>
                
                {apiEndpoints.map((endpoint) => (
                  <button
                    key={endpoint.name}
                    onClick={() => setActiveSection(endpoint.name)}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${
                      activeSection === endpoint.name
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {endpoint.name === 'accident-locations' && <MdLocationOn className="mr-3" />}
                    {endpoint.name === 'vehicle-statistics' && <MdDirectionsCar className="mr-3" />}
                    {endpoint.name === 'insurance-data' && <MdAccountBalance className="mr-3" />}
                    {endpoint.name === 'driver-statistics' && <MdPeople className="mr-3" />}
                    {endpoint.name === 'claims-analysis' && <MdAssignment className="mr-3" />}
                    {endpoint.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {activeSection === 'overview' && (
              <div className="bg-white rounded-xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">API Overview</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-600 mb-6">
                    Our Government API provides secure access to comprehensive accident and insurance data 
                    for analysis, policy making, and public safety initiatives. All data is anonymized and 
                    aggregated to protect privacy while providing valuable insights.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-blue-50 p-5 rounded-lg">
                      <div className="flex items-center mb-3">
                        <MdDataUsage className="text-blue-500 text-2xl mr-3" />
                        <h3 className="font-semibold text-gray-800">Data Coverage</h3>
                      </div>
                      <ul className="text-gray-600 space-y-2">
                        <li>• 50,000+ accident records</li>
                        <li>• 25,000+ vehicles analyzed</li>
                        <li>• 15,000+ insurance claims</li>
                        <li>• Real-time data updates</li>
                      </ul>
                    </div>
                    
                    <div className="bg-green-50 p-5 rounded-lg">
                      <div className="flex items-center mb-3">
                        <MdSecurity className="text-green-500 text-2xl mr-3" />
                        <h3 className="font-semibold text-gray-800">Security Features</h3>
                      </div>
                      <ul className="text-gray-600 space-y-2">
                        <li>• OAuth 2.0 authentication</li>
                        <li>• Role-based access control</li>
                        <li>• GDPR compliant data handling</li>
                        <li>• Regular security audits</li>
                      </ul>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Getting Started</h3>
                  <ol className="list-decimal pl-5 text-gray-600 space-y-2">
                    <li>Register for a government developer account</li>
                    <li>Obtain API credentials from the portal</li>
                    <li>Review the authentication process</li>
                    <li>Start making API calls to relevant endpoints</li>
                  </ol>
                </div>
              </div>
            )}

            {activeSection === 'authentication' && (
              <div className="bg-white rounded-xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Authentication</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-600 mb-6">
                    All API requests require authentication using OAuth 2.0. Government entities must 
                    register for an account and obtain client credentials.
                  </p>
                  
                  <div className="bg-gray-50 p-5 rounded-lg mb-6">
                    <h3 className="font-semibold text-gray-800 mb-3">Request Access Token</h3>
                    <div className="bg-gray-800 text-green-400 p-4 rounded-md font-mono text-sm mb-3 overflow-x-auto">
                      POST /oauth/token<br/>
                      Content-Type: application/x-www-form-urlencoded<br/>
                      <br/>
                      grant_type=client_credentials&<br/>
                      client_id=YOUR_CLIENT_ID&<br/>
                      client_secret=YOUR_CLIENT_SECRET
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Using the Access Token</h3>
                  <p className="text-gray-600 mb-4">
                    Include the access token in the Authorization header of your requests:
                  </p>
                  <div className="bg-gray-800 text-green-400 p-4 rounded-md font-mono text-sm mb-6 overflow-x-auto">
                    Authorization: Bearer YOUR_ACCESS_TOKEN
                  </div>
                  
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                    <p className="text-yellow-700">
                      <strong>Note:</strong> Access tokens expire after 1 hour. Make sure to handle token 
                      refresh in your application.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {apiEndpoints.map((endpoint) => (
              activeSection === endpoint.name && (
                <div key={endpoint.name} className="bg-white rounded-xl shadow-sm p-8 mb-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">{endpoint.title}</h2>
                      <p className="text-gray-600">{endpoint.description}</p>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {endpoint.method}
                    </span>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-800">Endpoint</h3>
                      <button
                        onClick={() => copyToClipboard(endpoint.endpoint, endpoint.name)}
                        className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                      >
                        {copiedEndpoint === endpoint.name ? (
                          <>
                            <MdCheck className="mr-1" /> Copied!
                          </>
                        ) : (
                          <>
                            <MdContentCopy className="mr-1" /> Copy
                          </>
                        )}
                      </button>
                    </div>
                    <div className="bg-gray-800 text-green-400 p-4 rounded-md font-mono text-sm overflow-x-auto">
                      {endpoint.endpoint}
                    </div>
                  </div>
                  
                  {endpoint.parameters.length > 0 && (
                    <div className="mb-6">
                      <h3 className="font-semibold text-gray-800 mb-3">Parameters</h3>
                      <div className="bg-gray-50 rounded-lg overflow-hidden">
                        <table className="min-w-full">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Parameter</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Required</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {endpoint.parameters.map((param, index) => (
                              <tr key={index}>
                                <td className="px-4 py-3 text-sm font-mono text-gray-800">{param.name}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{param.type}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">
                                  {param.required ? 'Yes' : 'No'}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600">{param.description}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Response Example</h3>
                    <div className="bg-gray-800 text-green-400 p-4 rounded-md font-mono text-sm overflow-x-auto">
                      <pre>{endpoint.response}</pre>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Doc;