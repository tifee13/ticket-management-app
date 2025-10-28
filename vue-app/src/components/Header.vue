<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import MobileMenu from './mobileMenu.vue';


const authStore = useAuthStore();
const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const getDesktopNavLinkClass = ({ isActive }) =>
  isActive
    ? 'text-color-bg hover:text-color-text'
    : 'text-color-bg hover:text-color-text';

</script>

<template>
  <div>
    <header class="bg-color-accent shadow-md sticky top-0 z-40">
      <nav class="app-container flex justify-between items-center h-24">
        <RouterLink :to="authStore.isAuthenticated ? '/dashboard' : '/'" class="text-4xl font-bold text-color-text">
          Fix & Fast
        </RouterLink>

        <div class="hidden md:flex items-center gap-8">
          <template v-if="authStore.isAuthenticated">
            <RouterLink to="/dashboard" v-slot="{ isActive }">
              <span :class="getDesktopNavLinkClass({ isActive })">Dashboard</span>
            </RouterLink>
            <RouterLink to="/tickets" v-slot="{ isActive }">
              <span :class="getDesktopNavLinkClass({ isActive })">Tickets</span>
            </RouterLink>
            <button
              @click="authStore.logout"
              class="px-5 py-2 bg-color-card text-color-accent rounded-lg font-semibold hover:bg-color-text hover:text-color-card transition-colors"
            >
              Logout
            </button>
          </template>
          <template v-else>
            <RouterLink to="/auth/login" v-slot="{ isActive }">
              <span :class="getDesktopNavLinkClass({ isActive })">Login</span>
            </RouterLink>
            <RouterLink
              to="/auth/signup"
              class="px-5 py-2 bg-color-card text-color-accent rounded-lg font-semibold hover:bg-color-text hover:text-color-card transition-colors"
            >
              Sign up
            </RouterLink>
          </template>
        </div>

        <div class="md:hidden">
          <button
            type="button"
            class="text-color-text"
            @click="toggleMobileMenu"
            aria-label="Open main menu"
          >
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-8 h-8">
               <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
             </svg>
          </button>
        </div>
      </nav>
    </header>

    <MobileMenu :is-open="isMobileMenuOpen" @close="toggleMobileMenu" />
  </div>
</template>

<style scoped>
/* Optional component-specific styles */
</style>