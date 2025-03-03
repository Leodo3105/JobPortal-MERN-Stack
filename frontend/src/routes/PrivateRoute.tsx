import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface PrivateRouteProps {
  allowedRoles?: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  // Nếu đang loading, hiển thị spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Nếu chưa xác thực, chuyển hướng đến trang đăng nhập
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Nếu có quy định về role và role của user không nằm trong allowedRoles, chuyển hướng đến dashboard
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // Nếu mọi điều kiện đều thoả mãn, render component con
  return <Outlet />;
};

export default PrivateRoute;