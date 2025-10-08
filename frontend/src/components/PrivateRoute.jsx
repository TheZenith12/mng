import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function PrivateRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !user.isAdmin) {
    return <Navigate to="/admin" />;
  }

  return children;
}
