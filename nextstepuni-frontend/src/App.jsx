import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';

import ChatbotWidget from './components/ChatbotWidget';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import UniversitiesPage from './pages/UniversitiesPage';
import UniversityDetailPage from './pages/UniversityDetailPage';
import BursariesPage from './pages/BursariesPage';
import BursaryDetailPage from './pages/BursaryDetailPage';
import ProfilePage from './pages/ProfilePage';
import RecommendationsPage from './pages/RecommendationsPage';
import AdminUniversitiesPage from './pages/AdminUniversitiesPage';
import AdminBursariesPage from './pages/AdminBursariesPage';
import AdminStudentsPage from './pages/AdminStudentsPage';
import AdminFacultiesPage from './pages/AdminFacultiesPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import SavedPage from './pages/SavedPage';


// ProtectedRoute — redirects to login if not authenticated
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">Loading...</div>;
  return user ? children : <Navigate to="/login" replace />;
}

// StudentRoute — only students can access
function StudentRoute({ children }) {
  const { user, loading, isStudent } = useAuth();
  if (loading) return <div className="loading">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!isStudent) return <Navigate to="/dashboard" replace />;
  return children;
}

function AdminRoute({ children }) {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <div className="loading">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/universities" replace />;
  return children;
}

export default function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/universities" element={<UniversitiesPage />} />
          <Route path="/universities/:id" element={<UniversityDetailPage />} />
          <Route path="/bursaries" element={<BursariesPage />} />
          <Route path="/bursaries/:id" element={<BursaryDetailPage />} />

          <Route path="/dashboard" element={
            <ProtectedRoute><DashboardPage /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><ProfilePage /></ProtectedRoute>
          } />
          <Route path="/recommendations" element={
            <StudentRoute><RecommendationsPage /></StudentRoute>
          } />

          <Route path="/" element={<Navigate to="/universities" replace />} />
          <Route path="*" element={<Navigate to="/universities" replace />} />

          <Route path="/admin/universities" element={
            <AdminRoute><AdminUniversitiesPage /></AdminRoute>
          } />
          <Route path="/admin/bursaries" element={
            <AdminRoute><AdminBursariesPage /></AdminRoute>
          } />
          <Route path="/admin/students" element={
            <AdminRoute><AdminStudentsPage /></AdminRoute>
          } />
          <Route path="/admin/faculties" element={
            <AdminRoute><AdminFacultiesPage /></AdminRoute>
          } />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          <Route path="/saved" element={
            <ProtectedRoute><SavedPage /></ProtectedRoute>
          } />
        </Routes>
      </div>
      <ChatbotWidget />
    </div>
  );
}