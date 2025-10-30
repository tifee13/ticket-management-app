<template>
  <div class="flex flex-col items-center justify-center text-center py-20">
    <h1 class="text-9xl font-bold text-color-primary">404</h1>
    <h2 class="text-4xl font-semibold text-color-text mt-4 mb-6">
      Page Not Found
    </h2>
    <p class="text-xl text-color-text/80 mb-10 max-w-md">
      Sorry, the page you are looking for doesn't exist or has been moved.
    </p>
    <router-link
      to="/"
      class="px-8 py-4 bg-color-primary text-white text-lg rounded-lg font-semibold hover:opacity-80 transition-opacity"
    >
      Go Back Home
    </router-link>
  </div>
</template>

<script setup>
</script>
