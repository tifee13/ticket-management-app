const USERS_KEY = 'ticketapp_users';
const TICKETS_KEY = 'ticketapp_tickets';

const readFromStorage = (key) => {
  return JSON.parse(localStorage.getItem(key) || '[]');
};

const writeToStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const initStorage = () => {
  if (!localStorage.getItem(USERS_KEY)) {
    writeToStorage(USERS_KEY, []);
  }
  if (!localStorage.getItem(TICKETS_KEY)) {
    writeToStorage(TICKETS_KEY, [

      { id: 't1', title: 'Fix login button', description: 'The login button is not working on mobile.', status: 'open', priority: 'high', createdAt: new Date().toISOString() },
      { id: 't2', title: 'Update hero image', description: '', status: 'in_progress', priority: 'medium', createdAt: new Date().toISOString() },
      { id: 't3', title: 'Deploy to Vercel', description: 'Final deployment', status: 'closed', priority: 'low', createdAt: new Date().toISOString() },
    ]);
  }
};
initStorage();

const verifyToken = async (token) => {
  return new Promise((resolve, reject) => {
    if (!token) {
      return reject(new Error('No token provided.'));
    }
    const users = readFromStorage(USERS_KEY);
    const userId = token.split('mock-token-')[1];
    const user = users.find(u => u.id === userId);

    if (user) {
      return resolve(user);
    }
    return reject(new Error('Invalid token.'));
  });
};


export const api = {
  async signup(email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = readFromStorage(USERS_KEY);
        const normalizedEmail = email.toLowerCase();
        const userExists = users.find(u => u.email === normalizedEmail);
        if (userExists) {
          return reject(new Error('User already exists.'));
        }
        const newUser = { id: `u${Date.now()}`, email: normalizedEmail, password };
        users.push(newUser);
        writeToStorage(USERS_KEY, users);
        return resolve({ ...newUser, token: `mock-token-${newUser.id}` });
      }, 500);
    });
  },

  async login(email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = readFromStorage(USERS_KEY);
        const normalizedEmail = email.toLowerCase();
        const user = users.find(u => u.email === normalizedEmail && u.password === password);
        if (user) {
          return resolve({ ...user, token: `mock-token-${user.id}` });
        }
        return reject(new Error('Invalid email or password.'));
      }, 500);
    });
  },

  async getTickets(token) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await verifyToken(token);
        
        const allTickets = readFromStorage(TICKETS_KEY);
        
        const userTickets = allTickets.filter(ticket => ticket.userId === user.id);
        
        setTimeout(() => resolve(userTickets), 300);

      } catch (error) {
        return reject(error);
      }
    });
  },

  async createTicket(ticketData, token) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await verifyToken(token);
        
        if (!ticketData.userId || ticketData.userId !== user.id) {
            return reject(new Error('User ID mismatch.'));
        }

        const tickets = readFromStorage(TICKETS_KEY);
        const newTicket = { 
          ...ticketData, 
          id: `t${Date.now()}`, 
          createdAt: new Date().toISOString() 
        };
        tickets.push(newTicket);
        writeToStorage(TICKETS_KEY, tickets);
        
        setTimeout(() => resolve(newTicket), 300);

      } catch (error) {
        return reject(error);
      }
    });
  },

  async updateTicket(ticketId, updates, token) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await verifyToken(token);
        const tickets = readFromStorage(TICKETS_KEY);
        const index = tickets.findIndex(t => t.id === ticketId);

        if (index === -1) {
          return reject(new Error('Ticket not found.'));
        }

        if (tickets[index].userId !== user.id) {
          return reject(new Error('Unauthorized: You do not own this ticket.'));
        }

        tickets[index] = { ...tickets[index], ...updates };
        writeToStorage(TICKETS_KEY, tickets);
        
        setTimeout(() => resolve(tickets[index]), 300);

      } catch (error) {
        return reject(error);
      }
    });
  },

  async deleteTicket(ticketId, token) {
    return new Promise(async (resolve, reject) => {
       try {
        const user = await verifyToken(token);
        let tickets = readFromStorage(TICKETS_KEY);
        const ticketToDelete = tickets.find(t => t.id === ticketId);

        if (!ticketToDelete) {
          return reject(new Error('Ticket not found.'));
        }

        if (ticketToDelete.userId !== user.id) {
          return reject(new Error('Unauthorized: You do not own this ticket.'));
        }
        
        tickets = tickets.filter(t => t.id !== ticketId);
        writeToStorage(TICKETS_KEY, tickets);
        
        setTimeout(() => resolve(true), 300);

      } catch (error) {
        return reject(error);
      }
    });
  },
};