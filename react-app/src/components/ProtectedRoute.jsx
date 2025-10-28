import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading session...</div>;
  }
    
  if (!token) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children; 
};

export default ProtectedRoute;