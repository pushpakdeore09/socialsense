import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../store/useAuth";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuth((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
