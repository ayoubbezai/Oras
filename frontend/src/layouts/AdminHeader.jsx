import React from "react";
import { MdNotifications, MdSettings } from "react-icons/md";

const AdminHeader = () => {
  return (
    <div className="w-full bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800">
          Insurance Admin Dashboard
        </h1>

        {/* Right side with icons and user info */}
        <div className="flex items-center space-x-6">
          {/* Notifications bell */}
          <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
            <MdNotifications size={24} />
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              3
            </span>
          </button>

          {/* Settings */}
          <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
            <MdSettings size={24} />
          </button>

          {/* User profile */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
              JD
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-800">John Doe</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
