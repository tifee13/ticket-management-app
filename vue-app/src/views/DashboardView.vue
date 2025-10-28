<script setup>
import { ref, computed, onMounted, watch, defineAsyncComponent } from 'vue'; // Removed defineComponent
import { useAuthStore } from '../stores/auth';
import { api } from '../services/api';
import { RouterLink } from 'vue-router';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'vue-sonner';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
const Pie = defineAsyncComponent(async () => {
  const module = await import('vue-chartjs');
  ChartJS.register(ArcElement, Tooltip, Legend);
  return module.Pie; // <-- use the specific Pie component
});


import CreateTicket from '../components/CreateTicket.vue';
import StatCard from '../components/StatCard.vue'; // <-- IMPORT the new component

// -- State --
const stats = ref({ total: 0, open: 0, in_progress: 0, closed: 0 });
const recentTickets = ref([]);
const loading = ref(true);
const isCreateTicketOpen = ref(false);

// -- Store and Router Access --
const authStore = useAuthStore();

// -- Fetching Data --
const fetchStats = async () => {
  // ... (fetchStats logic remains the same) ...
   if (!authStore.token) return;
  loading.value = true;
  try {
    const tickets = await api.getTickets(authStore.token);
    const sortedTickets = [...tickets].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    recentTickets.value = sortedTickets.slice(0, 5);

    stats.value = {
      total: tickets.length,
      open: tickets.filter(t => t.status === 'open').length,
      in_progress: tickets.filter(t => t.status === 'in_progress').length,
      closed: tickets.filter(t => t.status === 'closed').length,
    };
  } catch (error) {
    authStore.handleApiError(error, 'Failed to load dashboard. Please retry.');
  } finally {
    loading.value = false;
  }
};

// -- Modal Logic --
const handleOpenCreate = () => { isCreateTicketOpen.value = true; };
const handleCloseModal = () => { isCreateTicketOpen.value = false; };

const handleCreateSubmit = async (formData) => {
  // ... (handleCreateSubmit logic remains the same) ...
   try {
    const newTicketData = { ...formData, userId: authStore.user?.id };
    if (!newTicketData.userId) {
        throw new Error("User ID is missing.");
    }
    await api.createTicket(newTicketData, authStore.token);
    toast.success('Ticket created successfully!');
    await fetchStats();
    handleCloseModal();
  } catch (error) {
    authStore.handleApiError(error, 'Failed to create ticket. Please retry.');
  }
};

// -- Chart Data and Options --
const chartData = computed(() => ({
  // ... (chartData logic remains the same) ...
   labels: ['Open', 'In Progress', 'Closed'],
  datasets: [
    {
      backgroundColor: ['#34d399', '#f59e0b', '#6b7280'],
      data: [stats.value.open, stats.value.in_progress, stats.value.closed],
    },
  ],
}));

const chartOptions = ref({
  // ... (chartOptions logic remains the same) ...
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true },
    
  },
});

// -- Lifecycle Hooks --
onMounted(() => {
  // ... (onMounted logic remains the same) ...
    if (authStore.token) {
    fetchStats();
  }
});

watch(() => authStore.token, (newToken) => {
  // ... (watch logic remains the same) ...
   if (newToken && !stats.value.total) {
    fetchStats();
  }
}, { immediate: false });

</script>

<template>
  <div class="space-y-8">
    <p v-if="loading">Loading dashboard...</p>
    <template v-else>
      <div class="flex flex-col md:flex-row gap-4 justify-between items-center">
        <h1 class="text-5xl font-bold text-color-text">Dashboard</h1>
        <button
          @click="handleOpenCreate"
          class="px-6 py-3 bg-color-primary text-white rounded-lg font-semibold hover:opacity-80 w-full md:w-auto"
        >
          Create New Ticket
        </button>
      </div>

      <div class="bg-white p-6 rounded-3xl shadow-lg">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="text-center md:text-left mb-6 md:mb-0">
            <h2 class="text-2xl font-semibold text-color-text">Ticket Status</h2>
            <p class="text-6xl font-bold text-color-text mt-4">{{ stats.total }}</p>
            <p class="text-xl text-color-text">Total Tickets</p>
          </div>
          <div style="width: 200px; height: 150px">
            <Pie :data="chartData" :options="chartOptions" />
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Open" :value="stats.open" colorClass="text-color-open" />
        <StatCard title="In Progress" :value="stats.in_progress" colorClass="text-color-progress" />
        <StatCard title="Closed" :value="stats.closed" colorClass="text-color-closed" />
      </div>

      <div class="bg-white p-6 rounded-2xl shadow-lg">
         <h2 class="text-2xl font-semibold mb-4 text-color-text">Recent Tickets</h2>
        <div class="space-y-4">
          <p v-if="recentTickets.length === 0" class="text-color-text">No recent tickets.</p>
          <div v-else v-for="ticket in recentTickets" :key="ticket.id" class="border-b border-gray-200 pb-3 last:border-b-0">
            <RouterLink to="/tickets" class="font-semibold text-color-primary hover:underline">
              {{ ticket.title }}
            </RouterLink>
            <p class="text-sm text-gray-500">
              Created {{ formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true }) }}
            </p>
          </div>
        </div>
      </div>
    </template>

    <CreateTicket
      :is-open="isCreateTicketOpen"
      @close="handleCloseModal"
      @submit="handleCreateSubmit"
    />
  </div>
</template>