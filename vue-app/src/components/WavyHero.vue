<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
  <section class="relative pt-20 pb-32 rounded-3xl overflow-hidden">
    <!-- Decorative blurred circles -->
    <div class="absolute -top-20 -left-20 w-60 h-60 rounded-full filter blur-xl opacity-70"></div>
    <div class="absolute -bottom-20 -right-10 w-48 h-48 rounded-full filter blur-lg opacity-80"></div>

    <div class="relative z-10 app-container">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        <!-- Text Content -->
        <div class="text-center md:text-left">
          <h1 class="text-4xl font-bold lg:text-6xl mb-6 text-color-text">
            Stop Losing Track...
            <br />
            Start Fixing Fast!
          </h1>
          <p class="text-xl lg:text-2xl text-color-text mb-10 max-w-xl mx-auto md:mx-0">
            Manage, monitor, and resolve issues all in one place with our simple and powerful ticketing app.
          </p>

          <div class="flex flex-col sm:flex-row justify-center md:justify-start gap-6">
            <RouterLink
              to="/auth/signup"
              class="px-8 py-4 bg-color-card text-color-accent text-xl rounded-lg font-semibold shadow-lg transform hover:scale-105 transition-transform"
            >
              Get Started
            </RouterLink>
            <RouterLink
              to="/auth/login"
              class="px-8 py-4 bg-transparent border-2 border-color-card text-color-card text-xl rounded-lg font-semibold hover:bg-color-card hover:text-color-accent transition-colors"
            >
              Login
            </RouterLink>
          </div>
        </div>

        <!-- Hero Image -->
        <div class="hidden md:block">
          <img
            src="/shared-assets/hero-decoratives.svg"
            alt="Hero decoratives"
            class=" "
          />
        </div>

      </div>
    </div>

    <!-- Bottom Wave -->
    <div class="absolute bottom-0 left-0 w-full leading-[0]">
      <img
        src="/shared-assets/hero-wave.svg"
        alt="Hero Wave"
        class="absolute bottom-0 left-0 w-full leading-[0]"
      />
    </div>
  </section>
</template>

<style scoped>
/* Optional component-specific styles */
.bg-softLilac\/20 {
  background-color: rgba(238, 191, 240, 0.2);
}
.bg-blushPink\/40 {
  background-color: rgba(228, 152, 209, 0.4);
}
.bg-softLilac\/40 {
  background-color: rgba(238, 191, 240, 0.4);
}

:root {
  --color-card: #ffffff;
}
</style>
