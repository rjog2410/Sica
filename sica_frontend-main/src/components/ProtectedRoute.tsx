// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  requiredPermissions?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRoles = [], requiredPermissions = [] }) => {
  const { user, isAuthenticated, hasPermission } = useAuthStore();

  const hasRequiredRole = requiredRoles.length === 0 || requiredRoles.some(role => user?.roles.includes(role));
  const hasRequiredPermissions = requiredPermissions.length === 0 || hasPermission(requiredPermissions);

  if (!isAuthenticated || !hasRequiredRole || !hasRequiredPermissions) {
    // Redirigir a "/unauthorized" si no está autenticado o no tiene permisos
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
