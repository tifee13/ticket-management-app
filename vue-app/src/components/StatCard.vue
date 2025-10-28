<script setup>
defineProps({
  title: String,
  value: [String, Number],
  colorClass: String,
});
</script>

<template>
  <div class="bg-white p-6 rounded-2xl shadow-lg text-center">
    <h3 :class="['text-5xl font-bold', colorClass || 'text-color-text']">
      {{ value }}
    </h3>
    <p class="text-xl text-color-text mt-2">
      {{ title }}
    </p>
  </div>
</template>

<style scoped>
/* Optional component-specific styles */
</style>