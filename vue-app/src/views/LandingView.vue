<script setup>
import { RouterLink } from 'vue-router';
import WavyHero from '../components/WavyHero.vue';

// REMOVED the const IconManage, IconDashboard, IconAuth definitions
</script>

<template>
  <div>
    <WavyHero />

    <section class="py-20">
      <h2 class="text-6xl font-bold text-center mb-12">
        Features
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Feature Box 1 -->
        <div class="bg-color-card p-8 rounded-2xl shadow-lg text-center transform hover:scale-105 transition-transform">
          <!-- SVG Inlined -->
          <svg aria-hidden="true" class="w-12 h-12 text-color-primary mb-4 " fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M5 11v2m14-2v2" /></svg>
          <h3 class="text-2xl font-semibold mb-4 text-color-text">Manage Tickets</h3>
          <p>Full CRUD functionality to create, read, update, and delete support tickets with ease.</p>
        </div>
        <!-- Feature Box 2 -->
        <div class="bg-color-card p-8 rounded-2xl shadow-lg text-center transform hover:scale-105 transition-transform">
          <!-- SVG Inlined -->
          <svg aria-hidden="true" class="w-12 h-12 text-color-primary mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m3 6V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2z" /></svg>
          <h3 class="text-2xl font-semibold mb-4 text-color-text">View Dashboard</h3>
          <p>Get a high-level overview of your support status with simple, clear dashboard analysis.</p>
        </div>
        <!-- Feature Box 3 -->
        <div class="bg-color-card p-8 rounded-2xl shadow-lg text-center transform hover:scale-105 transition-transform">
          <!-- SVG Inlined -->
          <svg aria-hidden="true" class="w-12 h-12 text-color-primary mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          <h3 class="text-2xl font-semibold mb-4 text-color-text">Secure Auth</h3>
          <p>Secure authentication using session management ensures your data is safe and private.</p>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="py-20 bg-softLilac/10">
       <!-- ... content ... -->
       <h2 class="text-4xl font-bold text-center mb-16">Get started in 3 simple steps</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        <div class="flex flex-col items-center">
          <div class="flex items-center justify-center w-20 h-20 rounded-full bg-color-primary text-color-card text-3xl font-bold mb-6 shadow-lg">1</div>
          <h3 class="text-2xl font-semibold mb-3">Create an Account</h3>
          <p>Sign up in less than 30 seconds.</p>
        </div>
        <div class="flex flex-col items-center">
          <div class="flex items-center justify-center w-20 h-20 rounded-full bg-color-primary text-color-card text-3xl font-bold mb-6 shadow-lg">2</div>
          <h3 class="text-2xl font-semibold mb-3">Create Your First Ticket</h3>
          <p>Use our simple modal to log your first issue, set its priority, and add a description.</p>
        </div>
        <div class="flex flex-col items-center">
          <div class="flex items-center justify-center w-20 h-20 rounded-full bg-color-primary text-color-card text-3xl font-bold mb-6 shadow-lg">3</div>
          <h3 class="text-2xl font-semibold mb-3">Track and Resolve</h3>
          <p>Watch your ticket move from "Open" to "Resolved" from your powerful dashboard.</p>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="py-20">
       <!-- ... content ... -->
       <h2 class="text-4xl font-bold text-center mb-12">What our users are saying</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="bg-color-card p-8 rounded-2xl shadow-lg italic">
          <p class="text-lg mb-6">"Fix & Fast is a game-changer. We went from messy spreadsheets to a streamlined workflow in one afternoon. I can't recommend it enough!"</p>
          <p class="font-semibold text-color-text not-italic">- Alex, Project Manager</p>
        </div>
        <div class="bg-color-card p-8 rounded-2xl shadow-lg italic">
          <p class="text-lg mb-6">"The simplicity is what sold me. It has exactly what we need and nothing we don't. The dashboard view is perfect for our daily stand-ups."</p>
          <p class="font-semibold text-color-text not-italic">- Sarah, Team Lead</p>
        </div>
      </div>
    </section>

    <!-- Final Call to Action Section -->
    <section class="py-20 bg-color-accent text-center rounded-t-3xl">
       <!-- ... content ... -->
        <h2 class="text-4xl font-bold text-color-card mb-6">
        Ready to Take Control?
      </h2>
      <p class="text-xl text-color-card/80 mb-10 max-w-2xl mx-auto">
        Stop letting issues fall through the cracks.
        Start fixing them.
      </p>
      <RouterLink
        to="/auth/signup"
        class="px-10 py-5 bg-color-card text-color-accent text-2xl rounded-lg font-semibold shadow-2xl transform hover:scale-105 transition-transform"
      >
        Get Started
      </RouterLink>
    </section>
  </div>
</template>