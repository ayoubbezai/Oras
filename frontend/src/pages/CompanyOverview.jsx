import React from "react";
import {
  MdNotifications,
  MdSettings,
  MdAssignment,
  MdPendingActions,
  MdCheckCircle,
} from "react-icons/md";
import OverviewCard from "../components/companyDashboard/OverviewCard";
import ClaimsTable from "@/components/companyDashboard/ClaimTable";

const CompanyOverview = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}

      {/* Main content with 3 cards */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <OverviewCard
            title="Total Claims"
            count="1,248"
            icon={<MdAssignment size={24} />}
            description="All-time claims"
            trend="+12%"
            trendType="positive"
          />

          <OverviewCard
            title="Pending Claims"
            count="327"
            icon={<MdPendingActions size={24} />}
            description="Awaiting review"
            trend="+5%"
            trendType="positive"
          />

          <OverviewCard
            title="Approved Claims"
            count="842"
            icon={<MdCheckCircle size={24} />}
            description="Successfully processed"
            trend="+18%"
            trendType="positive"
          />
        </div>

        <ClaimsTable />
      </div>
    </div>
  );
};

export default CompanyOverview;
