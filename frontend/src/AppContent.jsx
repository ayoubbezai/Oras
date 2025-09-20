// src/AppContent.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ProtectedRoute from "./utils/ProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminLayout from "./layouts/AdminLayout";
import LandingPage from "./pages/LandingPage";

// Company Pages
import CompanyLayout from "./layouts/CompanyLayout";
import CompanyOverview from "./pages/CompanyOverview";
import CompanyClients from "./pages/CompanyDrivers";
import CompanySettings from "./pages/CompanySettings";
import CompanyColab from "./pages/CompanyColab";
import AdminOverview from "./pages/AdminOverview";
import AdminReports from "./pages/AdminReports";
import CompanyClaims from "./pages/ComapnyClaims";
import CompanyReports from "./pages/CompanyReports";
import Doc from "./pages/Doc";

const AppContent = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/documentation" element={<Doc />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* Nested admin routes */}
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<AdminOverview />} />
          <Route path="analytics-reports" element={<AdminReports />} />
        </Route>

        {/* Company Routes */}
        <Route
          path="/company"
          element={
            <ProtectedRoute allowedRoles={["company_admin"]}>
              <CompanyLayout />
            </ProtectedRoute>
          }
        >
          {/* Nested company routes */}
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<CompanyOverview />} />
          <Route path="clients" element={<CompanyClients />} />
          <Route path="collaboration" element={<CompanyColab />} />
          <Route path="claims-management" element={<CompanyClaims />} />
          <Route path="analytics-reports" element={<CompanyReports />} />
          <Route path="settings" element={<CompanySettings />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppContent;
