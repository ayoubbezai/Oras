import React, { useState } from "react";
import {
  MdMenu,
  MdMenuOpen,
  MdLogout,
  MdDashboard,
  MdAccountBox,
  MdManageAccounts,
  MdPerson,
  MdSportsSoccer,
  MdSettings,

} from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { ImUsers } from "react-icons/im";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../services/auth";

const ComapnySidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogoutClick = async () => {
    await logout();
    navigate("/login"); // redirect after logout
  };

  const primaryColor = "#00296b";

  const sidebarLinks = [
    {
      label: "Overview",
      icon: <MdDashboard size={30} />,
      path: "/company/overview",
    },
    {
      label: "Claims Management",
      icon: <ImUsers size={30} />,
      path: "/company/claims-management",
    },
    {
      label: "Clients",
      icon: <FaUsers size={30} />,
      path: "/company/clients",
    },
    {
      label: "Collaboration",
      icon: <MdAccountBox size={30} />,
      path: "/company/collaboration",
    },
    {
      label: "Analytics & Reports",
      icon: <MdPerson size={30} />,
      path: "/company/analytics-reports",
    },
    {
      label: "Settings",
      icon: <MdSettings size={30} />,
      path: "/company/settings",
    },
  ];

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div
      className={`${
        isOpen ? "w-70" : "w-20"
      } h-screen flex flex-col justify-between transition-all duration-300`}
      style={{ backgroundColor: "white", borderRight: "1px solid #E5F5F3" }}
    >
      {/* Header */}
      <div className="relative flex flex-col items-center pt-4 px-3">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute top-2 right-2 p-2 rounded-full transition hover:bg-gray-100"
          style={{ color: primaryColor }}
        >
          {isOpen ? <MdMenuOpen size={30} /> : <MdMenu size={20} />}
        </button>

        {/* Sidebar Links */}
        <nav className="w-full mt-10">
          <ul className="flex flex-col gap-1">
            {sidebarLinks.map((link, idx) => (
              <Link
                to={link.path}
                key={idx}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition cursor-pointer ${
                  isActive(link.path)
                    ? "bg-blue-600 text-white font-medium" // active state
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span
                  className={`${
                    isActive(link.path) ? "text-white" : "text-[#7A8C89]"
                  }`}
                >
                  {link.icon}
                </span>
                {isOpen && <span>{link.label}</span>}
              </Link>
            ))}
          </ul>
        </nav>
      </div>

      {/* Logout */}
      <div className="mb-4 text-center px-2">
        {isOpen ? (
          <button
            className="w-full text-background font-bold bg-primary hover:bg-primary-200 flex items-center justify-center gap-2 py-1.5 rounded text-sm transition border"
            onClick={handleLogoutClick}
          >
            <MdLogout size={30} className="text-secondary " />
            Logout
          </button>
        ) : (
          <button
            className="p-2 rounded-full transition bg-primary hover:bg-primary-200"
            title="Logout"
            onClick={handleLogoutClick}
          >
            <MdLogout size={30} className="text-secondary " />
          </button>
        )}
      </div>
    </div>
  );
};

export default ComapnySidebar;
