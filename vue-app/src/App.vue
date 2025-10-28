<!-- src/App.vue -->
<script setup>
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import { RouterView } from 'vue-router'; 
import { Toaster } from 'vue-sonner';    // Make sure Toaster is imported

</script>

<template>
  <div class="flex flex-col min-h-screen">
    <Header />
    <main class="flex-grow app-container py-8">
      <RouterView /> <!-- RouterView must be present -->
    </main>
    <Footer />
    <!-- Ensure the position prop is correctly set -->
    <Toaster position="top-right" richColors closeButton />
  </div>
</template>