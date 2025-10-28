<script setup>
const currentYear = new Date().getFullYear();
</script>

<template>
  <footer class="flex justify-center items-center bg-color-accent shadow-inner mt-16 text-center">
    <div class="app-container py-12">
      <div>
        <ul class="flex justify-center space-x-4">
          <li><a href="#" class="text-color-card/70 hover:text-color-card">Privacy Policy</a></li>
          <li><a href="#" class="text-color-card/70 hover:text-color-card">Terms of Service</a></li>
        </ul>
      </div>
      <p class="">&copy; {{ currentYear }} Fix & Fast. All rights reserved.</p>
    </div>
  </footer>
</template>