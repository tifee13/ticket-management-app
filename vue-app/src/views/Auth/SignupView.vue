<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useAuthStore } from '../../stores/auth'; // Import Pinia store
import { toast } from 'vue-sonner';

// --- State ---
const name = ref('');
const email = ref('');
const password = ref('');
const errors = ref({});

// --- Store Access ---
const authStore = useAuthStore();

// --- Validation ---
const validate = () => {
  const newErrors = {};
  if (!name.value) newErrors.name = 'Name is required.';
  if (!email.value) newErrors.email = 'Email is required.';
  // Add more email validation if needed (e.g., regex)
  if (!password.value) newErrors.password = 'Password is required.';
  else if (password.value.length < 6) newErrors.password = "Password must be at least 6 characters.";
  errors.value = newErrors;
  return Object.keys(newErrors).length === 0;
};

// --- Submit Handler ---
const handleSubmit = () => {
  if (!validate()) {
    toast.error('Please fix the errors in the form.');
    return;
  }
  // Call the signup action from the Pinia store
  // Note: Your current api.js signup doesn't use the 'name' field, but we collect it here.
  // Modify api.js if you want to store the name.
  authStore.signup(email.value, password.value);
};
</script>

<template>
  <div class="flex justify-center items-center py-12">
    <div class="w-full max-w-md bg-color-accent p-10 rounded-2xl shadow-xl">
      <h2 class="text-5xl font-bold text-center mb-8 text-color-bg">
        Create Account
      </h2>
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label class="block text-lg font-medium mb-2" for="signup-name">Name</label>
          <input
            type="text"
            id="signup-name"
            v-model="name"
            autocomplete="name"
            class="w-full px-4 py-3 border border-color-primary rounded-lg focus:outline-none focus:ring-2 focus:color-bg "
          />
          <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
        </div>

        <div>
          <label class="block text-lg font-medium mb-2" for="signup-email">Email</label>
          <input
            type="email"
            id="signup-email"
            v-model="email"
            autocomplete="email"
            class="w-full px-4 py-3 border border-color-primary rounded-lg focus:outline-none focus:ring-2 focus:color-bg"
          />
          <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
        </div>

        <div>
          <label class="block text-lg font-medium mb-2" for="signup-password">Password</label>
          <input
            type="password"
            id="signup-password"
            v-model="password"
            autocomplete="new-password"
            class="w-full px-4 py-3 border border-color-primary rounded-lg focus:outline-none focus:ring-2 focus:color-bg"
          />
          <p v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</p>
        </div>

        <button
          type="submit"
          class="w-full py-3 text-color-card font-semibold rounded-lg hover:text-color-bg text-2xl"
        >
          Sign Up
        </button>
      </form>

      <p class="text-center mt-6">
        Already have an account?
        <RouterLink to="/auth/login" class="font-semibold text-color-text hover:text-color-bg">
          Login
        </RouterLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Optional component-specific styles */
</style>