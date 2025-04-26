// src/routes/userRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const UserRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));

  if (user?.role === "admin") {
    return <Navigate to="/notfound" replace />;
  }

  return children;
};

export default UserRoute;
