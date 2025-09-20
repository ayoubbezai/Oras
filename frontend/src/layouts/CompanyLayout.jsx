import React from "react";
import { Outlet } from "react-router-dom";
import ComapnySidebar from "./CompanySidebar";
import AdminHeader from "../layouts/AdminHeader";

const CompanyLayout = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <ComapnySidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header always visible */}
        <AdminHeader />

        {/* Page content */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default CompanyLayout;
