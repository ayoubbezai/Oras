import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const role = Cookies.get("role");   // 👈 read role cookie
    if (role && allowedRoles.includes(role)) {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
    }
    setLoading(false);
  }, [allowedRoles]);

  if (loading) return <div>Loading...</div>;
  if (!isAuthorized) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;
