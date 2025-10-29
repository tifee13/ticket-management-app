import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);
const SESSION_KEY = 'ticketapp_session';
const USERS_KEY = 'ticketapp_users';

const readFromStorage = (key) => {
  // This logic was originally outside the function, fixed.
  return JSON.parse(localStorage.getItem(key) || '[]');
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(SESSION_KEY));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // --- Inactivity Timer Setup ---
  const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
  const inactivityTimerRef = useRef(null);

  // --- Functions ---

  // Wrapped logout in useCallback to safely use it in useEffect
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(SESSION_KEY); // Fixed typo 'removeltem'
    navigate('/');
    toast.success('Logged out.');
  }, [navigate]); // Dependency array for useCallback

  // --- Effect Hook 1: Session Loading ---
  // This hook handles loading the user's session from the token.
  useEffect(() => {
    if (token) {
      const userId = token.split('mock-token-')[1];
      const users = readFromStorage(USERS_KEY);
      const foundUser = users.find(u => u.id === userId);

      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem(SESSION_KEY, token);
      } else {
        // Token was invalid, so log out
        setUser(null);
        setToken(null);
        localStorage.removeItem(SESSION_KEY); // Fixed typo 'removeltem'
      }
    } else {
      // No token, ensure session is clear
      localStorage.removeItem(SESSION_KEY); // Fixed typo 'removeltem'
    }
    setLoading(false);
  }, [token]); // This hook only runs when 'token' changes

  // --- Effect Hook 2: Inactivity Timer ---
  // This hook sets up and tears down the activity listeners.
  useEffect(() => {
    const activityEvents = [
      'mousemove',
      'keydown',
      'click',
      'scroll',
      'touchstart',
    ];

    const resetTimer = () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      inactivityTimerRef.current = setTimeout(() => {
        toast.error('You have been logged out due to inactivity.');
        logout(); // Calls the useCallback-wrapped logout
      }, INACTIVITY_TIMEOUT_MS);
    };

    const handleActivity = () => {
      resetTimer();
    };

    // Only set up listeners if the user is logged in
    if (token) {
      activityEvents.forEach((event) => {
        window.addEventListener(event, handleActivity);
      });
      resetTimer(); // Start the timer on load
    }

    // This is the CRITICAL cleanup function
    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [token, logout]); // This hook runs if 'token' or 'logout' changes

  // --- API Handlers ---

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

  // --- Value & Return ---

  const authValue = {
    user,
    token,
    loading,
    login,
    signup,
    logout,
    handleApiError,
  };

  // Fixed logic: was outside the AuthProvider function
  if (loading) {
    return null; // Or a loading spinner
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