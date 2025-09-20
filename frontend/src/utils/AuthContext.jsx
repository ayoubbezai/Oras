import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("AuthProvider - Initializing...");
    
    const token = Cookies.get("token");
    const role = Cookies.get("role");
    const email = Cookies.get("email");
    const id = Cookies.get("id");

    console.log("AuthProvider - Cookies found:", { token: !!token, role, email, id });

    if (token && role && email && id) {
      const userData = { id: Number(id), email, role, token };
      console.log("AuthProvider - Setting user:", userData);
      setUser(userData);
    } else {
      console.log("AuthProvider - No valid cookies found, user remains null");
      setUser(null);
    }

    setLoading(false);
    console.log("AuthProvider - Initialization complete, loading set to false");
  }, []);

  const login = (userData) => {
    console.log("AuthProvider - Login called with:", userData);
    
    // Save cookies
    Cookies.set("token", userData.token, { expires: 1 });
    Cookies.set("role", userData.role, { expires: 1 });
    Cookies.set("email", userData.email, { expires: 1 });
    Cookies.set("id", userData.id.toString(), { expires: 1 }); // ✅ Ensure ID is string

    console.log("AuthProvider - Cookies saved, setting user state");
    setUser(userData);
  };

  const logout = () => {
    console.log("AuthProvider - Logout called");
    
    Cookies.remove("token");
    Cookies.remove("role");
    Cookies.remove("email");
    Cookies.remove("id");
    setUser(null);
    
    console.log("AuthProvider - User logged out, cookies removed");
  };

  // ✅ Debug log whenever user or loading changes
  useEffect(() => {
    console.log("AuthProvider - State changed:", { user, loading });
  }, [user, loading]);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};