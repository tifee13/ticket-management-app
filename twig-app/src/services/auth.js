const USERS_KEY = 'ticketapp_users';
const SESSION_KEY = 'ticketapp_session';
const TICKETS_KEY = 'ticketapp_tickets';
const SAMPLE_TICKETS_KEY = 'sample_tickets';

// Initialize storage with default data
const initStorage = () => {
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify([]));
  }

  // Ensure the main tickets storage exists and is empty by default
  if (!localStorage.getItem(TICKETS_KEY)) {
    localStorage.setItem(TICKETS_KEY, JSON.stringify([]));
  }

  // Seed sample/demo tickets in a separate key so they are read-only and not merged with user tickets
  if (!localStorage.getItem(SAMPLE_TICKETS_KEY)) {
    localStorage.setItem(SAMPLE_TICKETS_KEY, JSON.stringify([
      { id: 't1', title: 'Fix login button', description: 'The login button is not working on mobile.', status: 'open', priority: 'high', createdAt: new Date().toISOString() },
      { id: 't2', title: 'Update hero image', description: '', status: 'in_progress', priority: 'medium', createdAt: new Date().toISOString() },
      { id: 't3', title: 'Deploy to Vercel', description: 'Final deployment', status: 'closed', priority: 'low', createdAt: new Date().toISOString() },
    ]));
  }
};

// Initialize storage on script load
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
    
    // Return user without sensitive data
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
            
            // Return user without sensitive data
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

          // Store user
          users.push(newUser);
          localStorage.setItem(USERS_KEY, JSON.stringify(users));

          // Create session
          const token = `mock-token-${newUser.id}`;
          localStorage.setItem(SESSION_KEY, token);
          
          // Return user without sensitive data
          const { password: _, ...safeUser } = newUser;
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
      
      // Redirect to login page and preserve any redirect parameter
      const currentUrl = new URL(window.location.href);
      const redirect = currentUrl.searchParams.get('redirect');
      const loginUrl = redirect ? `/auth/login?redirect=${encodeURIComponent(redirect)}` : '/auth/login';
      
      window.location.href = loginUrl;
    } catch (error) {
      console.error('Logout failed:', error);
      window.location.href = '/auth/login';
    }
  }
};

window.auth = auth; // Make auth available globally