const USERS_KEY = 'ticketapp_users';
const SESSION_KEY = 'ticketapp_session';
const TICKETS_KEY = 'ticketapp_tickets';
const SAMPLE_TICKETS_KEY = 'sample_tickets';

// Initialize storage with default data
const initStorage = () => {
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify([]));
  }
  if (!localStorage.getItem(TICKETS_KEY)) {
    localStorage.setItem(TICKETS_KEY, JSON.stringify([]));
  }
  if (!localStorage.getItem(SAMPLE_TICKETS_KEY)) {
    localStorage.setItem(SAMPLE_TICKETS_KEY, JSON.stringify([
      { id: 't1', title: 'Fix login button', description: 'The login button is not working on mobile.', status: 'open', priority: 'high', createdAt: new Date().toISOString() },
      { id: 't2', title: 'Update hero image', description: '', status: 'in_progress', priority: 'medium', createdAt: new Date().toISOString() },
      { id: 't3', title: 'Deploy to Vercel', description: 'Final deployment', status: 'closed', priority: 'low', createdAt: new Date().toISOString() },
    ]));
  }
};

initStorage();

const auth = {
  isAuthenticated() {
    const token = localStorage.getItem(SESSION_KEY);
    if (!token) return false;

    const userId = token.split('mock-token-')[1];
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    return users.some(user => user.id === userId);
  },

  getCurrentUser() {
    const token = localStorage.getItem(SESSION_KEY);
    if (!token) return null;

    const userId = token.split('mock-token-')[1];
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find(user => user.id === userId);
    if (!user) return null;
    
    const { password, ...safeUser } = user;
    return safeUser;
  },

  async login(email, password) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
            const normalizedEmail = email.toLowerCase();
            const user = users.find(u => u.email === normalizedEmail && u.password === password);
            
            if (user) {
              const token = `mock-token-${user.id}`;
              localStorage.setItem(SESSION_KEY, token);
              
              // --- THIS IS THE FIX ---
              // Set a cookie for the server-side PHP check
              document.cookie = "ticketapp_session=true; path=/; max-age=86400"; // 86400 seconds = 1 day
              // ---------------------

              const { password, ...safeUser } = user;
              resolve({ ...safeUser, token });
            } else {
              reject(new Error('Invalid email or password.'));
            }
          } catch (error) {
            reject(new Error('Login failed. Please try again.'));
          }
        }, 500);
      });
    },

  async signup(email, password, name = '') {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
          const normalizedEmail = email.toLowerCase();
          
          if (users.some(u => u.email === normalizedEmail)) {
            reject(new Error('User already exists.'));
            return;
          }

          const newUser = {
            id: `u${Date.now()}`,
            email: normalizedEmail,
            name,
            password,
            createdAt: new Date().toISOString()
          };

          users.push(newUser);
          localStorage.setItem(USERS_KEY, JSON.stringify(users));

          // --- ✅ FIX: Added backticks (`) ---
          const token = `mock-token-${newUser.id}`;
          localStorage.setItem(SESSION_KEY, token);
          
          const { password: _, ...safeUser } = newUser;
          window.dispatchEvent(new CustomEvent('authChange', { detail: { user: safeUser } }));
          resolve({ ...safeUser, token });
        } catch (error) {
          reject(new Error('Failed to create account. Please try again.'));
        }
      }, 500);
    });
  },

  logout() {
      try {
          localStorage.removeItem(SESSION_KEY);

          document.cookie = "ticketapp_session=; path=/; max-age=0";
          
      } catch (error) {
          console.error('Logout failed:', error);
      }
  },

  handleApiError(error, genericMessage) {
    console.error("API Error:", error);

    if (error.message === 'Invalid token.' || error.message === 'No token provided.') {
      window.showToast('Your session has expired — please log in again.', 'error');
      auth.logout(); 
    } else if (error.message === 'Invalid email or password.') {
      window.showToast('Invalid email or password.', 'error'); 
    } else if (error.message === 'User already exists.') {
      window.showToast('This email is already registered.', 'error');
    } else {
      window.showToast(genericMessage || error.message || 'An unknown error occurred.', 'error');
    }
  }
};

window.auth = auth; // Make auth available globally