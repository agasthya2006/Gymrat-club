// src/components/common/RoleGuard.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070709] flex flex-col items-center justify-center text-zinc-300 font-mono">
        <div className="w-10 h-10 border-2 border-zinc-800 border-t-[#E1601B] rounded-full animate-spin mb-3" />
        <p className="text-xs tracking-wider text-zinc-400">Verifying access permissions...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Role mismatch: redirect to user's authorized home
    if (user.role === 'MEMBER') return <Navigate to="/member/dashboard" replace />;
    if (user.role === 'COACH') return <Navigate to="/coach/dashboard" replace />;
    if (user.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
