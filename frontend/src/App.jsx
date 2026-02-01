// frontend/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import ClientDashboard from "./pages/ClientDashboard";
import ManageUsers from "./pages/ManageUsers";
import CreateTask from "./pages/CreateTask";

// PrivateRoute to protect dashboard routes
const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" />;

  if (role && user.role !== role) {
    return <Navigate to={user.role === "client" ? "/client-dashboard" : "/dashboard"} />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Landing Page as Home */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* USER Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute role="user">
                <UserDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/manage-users"
            element={
              <PrivateRoute role="user">
                <ManageUsers />
              </PrivateRoute>
            }
          />

          <Route
            path="/create-task"
            element={
              <PrivateRoute role="user">
                <CreateTask />
              </PrivateRoute>
            }
          />

          {/* CLIENT Routes */}
          <Route
            path="/client-dashboard"
            element={
              <PrivateRoute role="client">
                <ClientDashboard />
              </PrivateRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;