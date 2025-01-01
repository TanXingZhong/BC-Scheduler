import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ user, isAdmin, children }) => {
  if (!user) {
    return <Navigate to="/login" />;
  }
  if (!isAdmin) {
    return <Navigate to="/" />;
  }
  return children;
};

export default ProtectedRoute;
