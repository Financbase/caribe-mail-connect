import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Auth from './Auth';
import ResetPassword from './auth/ResetPassword';
import UpdatePassword from './auth/UpdatePassword';
import PRMCMS from './Index';

export default function AppRouter() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Auth routes - accessible when not authenticated */}
        <Route 
          path="/auth" 
          element={isAuthenticated ? <Navigate to="/" replace /> : <Auth />} 
        />
        <Route 
          path="/auth/reset-password" 
          element={isAuthenticated ? <Navigate to="/" replace /> : <ResetPassword />} 
        />
        <Route 
          path="/auth/update-password" 
          element={<UpdatePassword />} 
        />
        
        {/* Protected routes - require authentication */}
        <Route 
          path="/*" 
          element={isAuthenticated ? <PRMCMS /> : <Navigate to="/auth" replace />} 
        />
      </Routes>
    </Router>
  );
}