import React from "react";
import { Navigate } from "react-router-dom";

const UserRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));

  // Allow access to all authenticated users, including admins
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default UserRoute;