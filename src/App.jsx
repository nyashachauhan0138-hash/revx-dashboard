import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

import Login from './pages/Login';
import Register from './pages/Register';
import CustomerDashboard from './pages/CustomerDashboard';
import Cars from './pages/Cars';
import MyRentals from './pages/MyRentals';
import AdminDashboard from './pages/AdminDashboard';
import ManageRentals from './pages/ManageRentals';
import ForgotPassword from './pages/ForgotPassword'; // ✅ NEW


// Blocks a page if user is not logged in
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>

          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 🔐 Forgot Password (NEW) */}
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Customer routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute><CustomerDashboard /></ProtectedRoute>
          } />
          <Route path="/cars" element={
            <ProtectedRoute><Cars /></ProtectedRoute>
          } />
          <Route path="/my-rentals" element={
            <ProtectedRoute><MyRentals /></ProtectedRoute>
          } />

          {/* Admin routes */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/admin/rentals" element={
            <ProtectedRoute adminOnly={true}><ManageRentals /></ProtectedRoute>
          } />

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/login" />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;