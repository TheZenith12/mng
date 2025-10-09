import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import PrivateRoute from "./components/PrivateRoute";
import AuthCombined from "./pages/AuthCombined";
import ResortDetail from "./components/ResortDetail";
import ResortList from "./components/ResortList";
import AdminLogin from "./pages/AdminLogin";
import EditResort from "./pages/EditResorts";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/resorts/:id" element={<ResortDetail />} />
      <Route path="/resorts" element={<ResortList />} />
      <Route path="/auth" element={<AuthCombined />} />
      <Route path="/admin" element={<AdminLogin />} /> {/* admin login */}
      <Route
        path="/admin/dashboard"
        element={
          <PrivateRoute adminOnly={true}>
            <AdminDashboard />
          </PrivateRoute>
        }
      />
      <Route path="/admin/edit/:id" element={<EditResort />} />
    </Routes>
  );
}
