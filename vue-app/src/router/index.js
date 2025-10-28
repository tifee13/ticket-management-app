import { createRouter, createWebHistory } from 'vue-router';
import LandingView from '../views/LandingView.vue';
import LoginView from '../views/Auth/LoginView.vue';
import SignupView from '../views/Auth/SignupView.vue';
import DashboardView from '../views/DashboardView.vue';
import TicketManagementView from '../views/TicketManagementView.vue';
import NotFoundView from '../views/NotFoundView.vue'; // Create this simple component
import { useAuthStore } from '../stores/auth'; // We'll create this next

const routes = [
  { path: '/', name: 'Landing', component: LandingView },
  { path: '/auth/login', name: 'Login', component: LoginView, meta: { requiresGuest: true } },
  { path: '/auth/signup', name: 'Signup', component: SignupView, meta: { requiresGuest: true } },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: { requiresAuth: true } // Mark as protected
  },
  {
    path: '/tickets',
    name: 'Tickets',
    component: TicketManagementView,
    meta: { requiresAuth: true } // Mark as protected
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundView }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard (like ProtectedRoute)
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore(); // Access Pinia store

  if (to.meta.requiresAuth && !authStore.token) {
    // Redirect to login if route requires auth and user is not logged in
    next({ name: 'Login' });
  } else if (to.meta.requiresGuest && authStore.token) {
    // Redirect to dashboard if route is for guests and user IS logged in
    next({ name: 'Dashboard' });
  } else {
    // Otherwise, allow navigation
    next();
  }
});

export default router;