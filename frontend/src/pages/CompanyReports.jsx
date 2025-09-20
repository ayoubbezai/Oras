import React, { useState } from 'react';
import {
  MdTrendingUp,
  MdTrendingDown,
  MdAccountBalance,
  MdPeople,
  MdAssignment,
  MdLocalAtm,
  MdBarChart,
  MdPieChart,
  MdShowChart,
  MdCalendarToday
} from 'react-icons/md';

// Simple chart components (in a real app, you'd use a library like Chart.js or Recharts)
const BarChart = ({ data, color = 'blue' }) => {
  const maxValue = Math.max(...data.map(item => item.value));
  
  return (
    <div className="flex items-end justify-between h-48 pt-4">
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center flex-1 px-1">
          <div 
            className={`w-full rounded-t bg-${color}-500 transition-all duration-300 hover:opacity-80`}
            style={{ height: `${(item.value / maxValue) * 100}%` }}
          ></div>
          <div className="text-xs text-gray-500 mt-2 truncate">{item.label}</div>
        </div>
      ))}
    </div>
  );
};

const PieChart = ({ data }) => {
  return (
    <div className="relative w-40 h-40 mx-auto">
      <div className="absolute inset-0 rounded-full border-8 border-blue-500"></div>
      <div className="absolute inset-0 rounded-full border-8 border-green-500 rotate-90"></div>
      <div className="absolute inset-0 rounded-full border-8 border-yellow-500 rotate-180"></div>
      <div className="absolute inset-0 rounded-full border-8 border-red-500 rotate-270"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-bold">100%</div>
          <div className="text-xs text-gray-500">Total</div>
        </div>
      </div>
    </div>
  );
};

const LineChart = ({ data }) => {
  return (
    <div className="h-48 relative">
      <div className="absolute bottom-0 left-0 right-0 top-6 grid grid-cols-5 gap-4 items-end">
        {data.map((item, index) => (
          <div 
            key={index}
            className="h-full flex flex-col justify-end"
          >
            <div 
              className="bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
              style={{ height: `${item.value}%` }}
            ></div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-200"></div>
    </div>
  );
};

const CompanyReports = () => {
  const [timeRange, setTimeRange] = useState('monthly');

  // Sample data - in a real app, this would come from an API
  const claimsData = [
    { label: 'Jan', value: 45 },
    { label: 'Feb', value: 52 },
    { label: 'Mar', value: 48 },
    { label: 'Apr', value: 67 },
    { label: 'May', value: 59 },
    { label: 'Jun', value: 63 }
  ];

  const revenueData = [
    { label: 'Jan', value: 75 },
    { label: 'Feb', value: 82 },
    { label: 'Mar', value: 78 },
    { label: 'Apr', value: 92 },
    { label: 'May', value: 88 },
    { label: 'Jun', value: 95 }
  ];

  const policyTypes = [
    { type: 'Auto', value: 45, color: 'blue' },
    { type: 'Home', value: 25, color: 'green' },
    { type: 'Life', value: 20, color: 'yellow' },
    { type: 'Health', value: 10, color: 'red' }
  ];

  const metrics = [
    {
      title: 'Total Policies',
      value: '2,458',
      change: '+12.5%',
      isPositive: true,
      icon: <MdAccountBalance className="text-blue-500" />
    },
    {
      title: 'Active Claims',
      value: '147',
      change: '-3.2%',
      isPositive: false,
      icon: <MdAssignment className="text-yellow-500" />
    },
    {
      title: 'Revenue',
      value: '$1.2M',
      change: '+8.7%',
      isPositive: true,
      icon: <MdLocalAtm className="text-green-500" />
    },
    {
      title: 'Customers',
      value: '8,742',
      change: '+5.3%',
      isPositive: true,
      icon: <MdPeople className="text-purple-500" />
    }
  ];

  const claimStatusData = [
    { status: 'Approved', count: 85, color: 'bg-green-500' },
    { status: 'Pending', count: 42, color: 'bg-yellow-500' },
    { status: 'Rejected', count: 20, color: 'bg-red-500' }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="h-[97%] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Insurance Analytics Dashboard</h1>
          <p className="text-gray-600">Comprehensive overview of your insurance company performance</p>
        </div>

        {/* Time Range Selector */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <MdCalendarToday className="text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">Time Range:</span>
            </div>
            <div className="flex space-x-2">
              {['weekly', 'monthly', 'quarterly', 'yearly'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    timeRange === range
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-2xl font-bold text-gray-800">{metric.value}</div>
                <div className="text-2xl">{metric.icon}</div>
              </div>
              <div className="text-sm font-medium text-gray-600 mb-2">{metric.title}</div>
              <div className={`flex items-center text-sm ${
                metric.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.isPositive ? (
                  <MdTrendingUp className="mr-1" />
                ) : (
                  <MdTrendingDown className="mr-1" />
                )}
                {metric.change}
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Claims Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Claims Overview</h2>
              <MdBarChart className="text-gray-400" />
            </div>
            <BarChart data={claimsData} color="blue" />
            <div className="mt-4 text-center text-sm text-gray-500">
              Number of claims processed {timeRange}
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Revenue Trend</h2>
              <MdShowChart className="text-gray-400" />
            </div>
            <LineChart data={revenueData} />
            <div className="mt-4 text-center text-sm text-gray-500">
              Revenue growth {timeRange}
            </div>
          </div>
        </div>

        {/* Additional Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Policy Distribution */}
          <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Policy Distribution</h2>
              <MdPieChart className="text-gray-400" />
            </div>
            <PieChart data={policyTypes} />
            <div className="mt-6 space-y-3">
              {policyTypes.map((policy, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full bg-${policy.color}-500 mr-2`}></div>
                    <span className="text-sm text-gray-600">{policy.type}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-800">{policy.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Claim Status */}
          <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Claim Status Analysis</h2>
              <MdAssignment className="text-gray-400" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {claimStatusData.map((status, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-gray-800 mb-2">{status.count}</div>
                  <div className={`h-2 rounded-full ${status.color} mb-2`}></div>
                  <div className="text-sm text-gray-600">{status.status}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <div className="text-blue-500 mr-3">
                  <MdTrendingUp size={24} />
                </div>
                <div>
                  <div className="text-sm font-medium text-blue-800">
                    Claims processing efficiency improved by 15%
                  </div>
                  <div className="text-xs text-blue-600">
                    Compared to last {timeRange}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Recent Activities</h2>
          <div className="space-y-4">
            {[
              { action: 'New Policy', details: 'Auto insurance for John Doe', time: '2 hours ago' },
              { action: 'Claim Approved', details: 'Claim #CL-2023-0456 approved', time: '5 hours ago' },
              { action: 'Payment Processed', details: 'Premium payment for Sarah Smith', time: '1 day ago' },
              { action: 'Policy Renewal', details: 'Home insurance renewed for Robert Johnson', time: '2 days ago' }
            ].map((activity, index) => (
              <div key={index} className="flex items-start border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <div className="bg-blue-100 p-2 rounded-lg mr-4">
                  <MdAccountBalance className="text-blue-500" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-800">{activity.action}</div>
                  <div className="text-sm text-gray-600">{activity.details}</div>
                </div>
                <div className="text-xs text-gray-500">{activity.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyReports;