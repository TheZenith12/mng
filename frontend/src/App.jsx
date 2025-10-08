import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import PrivateRoute from "./components/PrivateRoute";
import AuthCombined from "./pages/AuthCombined"; // 👈 login form чинь эндээс гарч байгаа
import ResortDetail from "./components/ResortDetail";
import ResortList from "./components/ResortList";
import AdminLogin from "./pages/AdminLogin"; // 👈 шинэ admin login

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/resorts/:id" element={<ResortDetail />} />
      <Route path="/auth" element={<AuthCombined />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route
        path="/admin/dashboard"
        element={
          <PrivateRoute>
            <AdminDashboard />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
