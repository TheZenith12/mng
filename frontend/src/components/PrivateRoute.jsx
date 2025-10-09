import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  // Хэрэв хэрэглэгч login хийгээгүй бол /admin (login page) руу буцаана
  if (!user) {
    return <Navigate to="/admin" replace />;
  }

  // Хэрэв login хийсэн бол хуудсыг харуулна
  return children;
};

export default PrivateRoute;
