import React from 'react';

const OverviewCard = ({ title, count, icon, description, trend, trendType }) => {
  // Determine trend color based on type
  const trendColor = trendType === 'positive' ? 'text-green-500' : 
                     trendType === 'negative' ? 'text-red-500' : 
                     'text-yellow-500';
  
  // Trend arrow based on type
  const trendArrow = trendType === 'positive' ? '↑' : 
                     trendType === 'negative' ? '↓' : 
                     '→';

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
          <p className="text-3xl font-bold text-gray-800">{count}</p>
        </div>
        <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
          {icon}
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{description}</p>
        {trend && (
          <span className={`text-sm font-medium ${trendColor}`}>
            {trendArrow} {trend}
          </span>
        )}
      </div>
    </div>
  );
};

export default OverviewCard;