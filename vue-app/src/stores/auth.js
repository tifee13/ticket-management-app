import { ref, computed } from 'vue';
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
  const loading = ref(true); // Initial loading state

  // Computed property like React's derived state
  const isAuthenticated = computed(() => !!token.value);

  // Equivalent to useEffect on mount / token change
  function initializeAuth() {
    if (token.value) {
      const userId = token.value.split('mock-token-')[1];
      const users = readFromStorage(USERS_KEY);
      const foundUser = users.find(u => u.id === userId);
      if (foundUser) {
        user.value = foundUser;
      } else {
        // Token is invalid, clear it
        logout(false); // Pass false to prevent showing toast on initial load
      }
    } else {
      user.value = null;
    }
    loading.value = false;
  }

  // Call initialization once
  initializeAuth();

  // --- Actions ---
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

  function logout(showToast = true) {
    user.value = null;
    token.value = null;
    localStorage.removeItem(SESSION_KEY);
    router.push('/');
    if (showToast) {
      toast.success('Logged out.');
    }
  }

  return { user, token, loading, isAuthenticated, login, signup, logout, handleApiError, initializeAuth };
});