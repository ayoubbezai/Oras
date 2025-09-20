import React from "react";
import AppContent from "./AppContent";
import { AuthProvider } from "./utils/AuthContext";

function App() {
  console.log("App component rendering..."); // ✅ Debug log
  
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;