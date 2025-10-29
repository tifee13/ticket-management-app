import { ref, computed, watchEffect } from 'vue'; // 1. Import watchEffect
import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';
import { api } from '../services/api';
import { toast } from 'vue-sonner';

const SESSION_KEY = 'ticketapp_session';
const USERS_KEY = 'ticketapp_users';

const readFromStorage = (key) => JSON.parse(localStorage.getItem(key) || '[]');

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();
  const user = ref(null);
  const token = ref(localStorage.getItem(SESSION_KEY));
  const loading = ref(true);

  // --- Inactivity Timer State ---
  const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
  const inactivityTimerRef = ref(null);
  const activityEvents = [
    'mousemove',
    'keydown',
    'click',
    'scroll',
    'touchstart',
  ];

  // Computed property
  const isAuthenticated = computed(() => !!token.value);

  // --- Actions ---

  function logout(showToast = true) {
    user.value = null;
    token.value = null;
    localStorage.removeItem(SESSION_KEY);
    router.push('/');
    if (showToast) {
      toast.success('Logged out.');
    }
  }

  // --- Inactivity Helper Functions ---
  function resetTimer() {
    if (inactivityTimerRef.value) {
      clearTimeout(inactivityTimerRef.value);
    }
    inactivityTimerRef.value = setTimeout(() => {
      toast.error('You have been logged out due to inactivity.');
      logout(false); // Call the store's own logout action
    }, INACTIVITY_TIMEOUT_MS);
  }

  function handleActivity() {
    resetTimer();
  }

  // --- Watcher for Inactivity (Vue's useEffect equivalent) ---
  watchEffect((onCleanup) => {
    // This function runs immediately and whenever 'token.value' changes

    if (token.value) {
      // User is logged in, start listening
      activityEvents.forEach((event) => {
        window.addEventListener(event, handleActivity);
      });
      resetTimer(); // Start the timer

      // onCleanup is Vue's way of handling "cleanup" from useEffect
      onCleanup(() => {
        activityEvents.forEach((event) => {
          window.removeEventListener(event, handleActivity);
        });
        if (inactivityTimerRef.value) {
          clearTimeout(inactivityTimerRef.value);
        }
      });
    }
  });

  // --- Initialization ---
  function initializeAuth() {
    if (token.value) {
      const userId = token.value.split('mock-token-')[1];
      const users = readFromStorage(USERS_KEY);
      const foundUser = users.find(u => u.id === userId);
      if (foundUser) {
        user.value = foundUser;
      } else {
        logout(false); // Token is invalid, clear it without toast
      }
    } else {
      user.value = null;
    }
    loading.value = false;
  }

  initializeAuth(); // Call initialization

  // --- Other Actions ---
  function handleApiError(error, genericMessage) {
    console.error("API Error:", error);
    if (error.message === 'Invalid token.' || error.message === 'No token provided.') {
      toast.error('Your session has expired — please log in again.');
      logout();
    } else if (error.message === 'Invalid email or password.') {
      toast.error('Invalid email or password.');
    } else {
      toast.error(genericMessage || 'An unknown error occurred.');
    }
  }

  async function login(email, password) {
    try {
      const userData = await api.login(email, password);
      token.value = userData.token;
      user.value = userData;
      localStorage.setItem(SESSION_KEY, userData.token);
      router.push('/dashboard');
      toast.success('Login successful!');
    } catch (error) {
      handleApiError(error, 'Login failed. Please retry.');
    }
  }

  async function signup(email, password) {
    try {
      const userData = await api.signup(email, password);
      token.value = userData.token;
      user.value = userData;
      localStorage.setItem(SESSION_KEY, userData.token);
      router.push('/dashboard');
      toast.success('Signup successful!');
    } catch (error) {
      handleApiError(error, 'Signup failed. Please retry.');
    }
  }

  return { 
    user, 
    token, 
    loading, 
    isAuthenticated, 
    login, 
    signup, 
    logout, 
    handleApiError, 
    initializeAuth 
  };
});