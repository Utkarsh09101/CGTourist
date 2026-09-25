import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-2" />
        <span className="text-sm text-slate-500 font-medium">Verifying access...</span>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role restriction check
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If not authorized for this specific role, send to their corresponding role portal
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'guide') return <Navigate to="/guide/dashboard" replace />;
    return <Navigate to="/tourist/dashboard" replace />;
  }

  return children;
}
