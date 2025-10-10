import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import PrivateRoute from "./components/PrivateRoute";
import AuthCombined from "./pages/AuthCombined";
import ResortDetail from "./components/ResortDetail";
import ResortList from "./components/ResortList";
import AdminLogin from "./pages/AdminLogin";
import EditResort from "./pages/EditResorts";
import { AuthProvider } from "./context/AuthContext"; // 👈 нэмэгдсэн

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Login page */}
          <Route path="/" element={<AdminLogin />} />
          <Route
            path="/resorts/:id"
            element={
              <PrivateRoute>
                <ResortDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/resorts"
            element={
              <PrivateRoute>
                <ResortList />
              </PrivateRoute>
            }
          />
          <Route
            path="/auth"
            element={
              <PrivateRoute>
                <AuthCombined />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/edit/:id"
            element={
              <PrivateRoute>
                <EditResort />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
