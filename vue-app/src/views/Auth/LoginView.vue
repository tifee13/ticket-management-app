<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useAuthStore } from '../../stores/auth'; // Import Pinia store
import { toast } from 'vue-sonner';

// --- State ---
const email = ref('');
const password = ref('');
const errors = ref({});

// --- Store Access ---
const authStore = useAuthStore();

// --- Validation ---
const validate = () => {
  const newErrors = {};
  if (!email.value) newErrors.email = 'Email is required.';
  // Add more email validation if needed (e.g., regex)
  if (!password.value) newErrors.password = 'Password is required.';
  errors.value = newErrors;
  return Object.keys(newErrors).length === 0;
};

// --- Submit Handler ---
const handleSubmit = () => {
  if (!validate()) {
    toast.error('Please fix the errors in the form.');
    return;
  }
  // Call the login action from the Pinia store
  authStore.login(email.value, password.value);
};
</script>

<template>
  <div class="flex justify-center items-center py-12">
    <div class="w-full max-w-md bg-color-accent p-10 rounded-2xl shadow-xl">
      <h2 class="text-5xl font-bold text-center mb-8 text-color-bg">
        Welcome Back!
      </h2>
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label class="block text-lg font-medium mb-2" for="login-email">Email</label>
          <input
            type="email"
            id="login-email"
            v-model="email"
            autocomplete="email"
            class="w-full px-4 py-3 border border-color-primary rounded-lg focus:outline-none focus:ring-2 focus:color-bg"
          />
          <p v-if="errors.email" class="text-red-300 text-sm mt-1">{{ errors.email }}</p>
        </div>

        <div>
          <label class="block text-lg font-medium mb-2" for="login-password">Password</label>
          <input
            type="password"
            id="login-password"
            v-model="password"
            autocomplete="current-password"
            class="w-full px-4 py-3 border border-color-primary rounded-lg focus:outline-none focus:ring-2 focus:color-bg"
          />
          <p v-if="errors.password" class="text-red-300 text-sm mt-1">{{ errors.password }}</p>
        </div>

        <button
          type="submit"
          class="w-full py-3 text-color-card font-semibold rounded-lg hover:text-color-bg text-2xl"
        >
          Login
        </button>
      </form>

      <p class="text-center mt-6">
        Don't have an account?
        <RouterLink to="/auth/signup" class="font-semibold text-color-text hover:text-color-bg">
          Sign Up
        </RouterLink>
      </p>
    </div>
  </div>
</template>
