<script setup>
import { RouterLink } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
});
const emit = defineEmits(['close']);
const authStore = useAuthStore();

// REMOVED: const CloseIcon = { ... };

const handleLogout = () => {
  emit('close');
  authStore.logout();
};

const getNavLinkClass = (isActive) => {
  return isActive
    ? 'block text-2xl font-semibold bg-color-primary px-4 py-3 rounded-lg text-color-card'
    : 'block text-2xl font-medium px-4 py-3 rounded-lg text-color-bg hover:bg-color-text';
};
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
    <div
      class="fixed inset-0 bg-black/60 backdrop-blur-sm"
      aria-hidden="true"
      @click="emit('close')"
    ></div>

    <nav class="fixed top-0 left-0 z-50 h-full w-full max-w-sm bg-color-accent p-6 shadow-2xl">
      <div class="flex items-center justify-between mb-10">
        <RouterLink :to="authStore.isAuthenticated ? '/dashboard' : '/'" @click="emit('close')" class="text-3xl font-bold text-color-bg">
          Fix & Fast
        </RouterLink>
        <button
          type="button"
          class="-m-2.5 p-2.5 text-color-bg"
          @click="emit('close')"
          aria-label="Close menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-8 h-8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="space-y-4">
        <template v-if="authStore.isAuthenticated">
          <RouterLink to="/dashboard" v-slot="{ isActive, href, navigate }" custom>
            <a :href="href" @click="(e) => { navigate(e); emit('close'); }" :class="getNavLinkClass(isActive)">Dashboard</a>
          </RouterLink>
          <RouterLink to="/tickets" v-slot="{ isActive, href, navigate }" custom>
            <a :href="href" @click="(e) => { navigate(e); emit('close'); }" :class="getNavLinkClass(isActive)">Tickets</a>
          </RouterLink>
          <hr class="border-white/20 my-6" />
          <button
            @click="handleLogout"
            class="w-full text-left text-2xl font-medium px-4 py-3 rounded-lg text-red-500 hover:bg-color-text"
          >
            Logout
          </button>
        </template>
        <template v-else>
           <RouterLink to="/auth/login" v-slot="{ isActive, href, navigate }" custom>
             <a :href="href" @click="(e) => { navigate(e); emit('close'); }" :class="getNavLinkClass(isActive)">Login</a>
          </RouterLink>
           <RouterLink to="/auth/signup" v-slot="{ isActive, href, navigate }" custom>
             <a :href="href" @click="(e) => { navigate(e); emit('close'); }" :class="getNavLinkClass(isActive)">Sign up</a>
          </RouterLink>
        </template>
      </div>
    </nav>
  </div>
</template>

<style scoped>
/* Optional component-specific styles */
</style>