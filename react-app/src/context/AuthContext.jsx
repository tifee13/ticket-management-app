import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);
const SESSION_KEY = 'ticketapp_session';
const USERS_KEY = 'ticketapp_users';

const readFromStorage = (key) => {
  return JSON.parse(localStorage.getItem(key) || '[]');
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(SESSION_KEY));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      const userId = token.split('mock-token-')[1];
      const users = readFromStorage(USERS_KEY);
      const foundUser = users.find(u => u.id === userId);

      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem(SESSION_KEY, token);
      } else {
        setUser(null);
        setToken(null);
        localStorage.removeItem(SESSION_KEY);
      }
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
    setLoading(false);
  }, [token]);

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(SESSION_KEY);
    navigate('/');
    toast.success('Logged out.');
  };
  
  const handleApiError = (error, genericMessage) => {
    console.error("API Error:", error);

    if (error.message === 'Invalid token.' || error.message === 'No token provided.') {
      toast.error('Your session has expired — please log in again.');
      logout(); 
    } else if (error.message === 'Invalid email or password.') {
      toast.error('Invalid email or password.'); 
    } else {
      toast.error(genericMessage || 'An unknown error occurred.');
    }
  };

  const login = async (email, password) => {
    try {
      const userData = await api.login(email, password);
      setToken(userData.token);
      setUser(userData);
      localStorage.setItem(SESSION_KEY, userData.token);
      navigate('/dashboard');
      toast.success('Login successful!');
    } catch (error) {
      handleApiError(error, 'Login failed. Please retry.');
    }
  };

  const signup = async (email, password) => {
    try {
      const userData = await api.signup(email, password);
      setToken(userData.token);
      setUser(userData);
      localStorage.setItem(SESSION_KEY, userData.token);
      navigate('/dashboard');
      toast.success('Signup successful!');
    } catch (error) {
      handleApiError(error, 'Signup failed. Please retry.');
    }
  };

  const authValue = {
    user,
    token,
    loading,
    login,
    signup,
    logout,
    handleApiError,
  };

  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};