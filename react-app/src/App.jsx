import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/Auth/LoginPage';
import SignupPage from './pages/Auth/SignupPage';
import Dashboard from './pages/Dashboard';
import TicketManagement from './pages/TicketManagement';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route path="auth/login" element={<LoginPage />} />
        <Route path="auth/signup" element={<SignupPage />} />

        <Route 
          path="dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="tickets" 
          element={
            <ProtectedRoute>
              <TicketManagement />
            </ProtectedRoute>
          } 
        />
        
        <Route path="*" element={<h2 className="text-center text-3xl font-bold">404: Page Not Found</h2>} />
      </Route>
    </Routes>
  );
}

export default App;