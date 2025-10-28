<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useAuthStore } from '../stores/auth';
import { api } from '../services/api';
import { toast } from 'vue-sonner';

// Import child components
import TicketCard from '../components/TicketCard.vue';
import CreateTicket from '../components/CreateTicket.vue';
import EditTicket from '../components/EditTicket.vue';

// --- State ---
const tickets = ref([]);
const loading = ref(true);
const isCreateTicketOpen = ref(false);
const isEditTicketOpen = ref(false);
const currentTicket = ref(null); // Holds ticket data for editing
const searchTerm = ref('');
const statusFilter = ref('all'); // 'all', 'open', 'in_progress', 'closed'

// --- Store Access ---
const authStore = useAuthStore();

// --- Fetching Data ---
const fetchTickets = async () => {
  if (!authStore.token) return;
  loading.value = true;
  try {
    const data = await api.getTickets(authStore.token);
    tickets.value = data;
  } catch (error) {
    authStore.handleApiError(error, 'Failed to load tickets. Please retry.');
  } finally {
    loading.value = false;
  }
};

// --- Computed Property for Filtering ---
const filteredTickets = computed(() => {
  return tickets.value
    .filter(ticket => {
      if (statusFilter.value === 'all') return true;
      return ticket.status === statusFilter.value;
    })
    .filter(ticket => {
      const term = searchTerm.value.toLowerCase();
      return (
        ticket.title.toLowerCase().includes(term) ||
        (ticket.description && ticket.description.toLowerCase().includes(term)) // Check if description exists
      );
    });
});

// --- Modal Handling ---
const handleOpenCreate = () => {
  isCreateTicketOpen.value = true;
};

const handleOpenEdit = (ticket) => {
  currentTicket.value = { ...ticket }; // Clone ticket data to avoid direct mutation
  isEditTicketOpen.value = true;
};

const handleCloseModal = () => {
  isCreateTicketOpen.value = false;
  isEditTicketOpen.value = false;
  currentTicket.value = null; // Clear current ticket when closing edit modal
};

// --- CRUD Operations ---
const handleDelete = async (ticketId) => {
  if (window.confirm('Are you sure you want to delete this ticket?')) {
    try {
      await api.deleteTicket(ticketId, authStore.token);
      toast.success('Ticket deleted!');
      await fetchTickets(); // Refresh list
    } catch (error) {
      authStore.handleApiError(error, 'Failed to delete ticket. Please retry.');
    }
  }
};

const handleCreateSubmit = async (formData) => {
  try {
    const newTicketData = { ...formData, userId: authStore.user?.id };
     if (!newTicketData.userId) {
        throw new Error("User ID is missing.");
    }
    await api.createTicket(newTicketData, authStore.token);
    toast.success('Ticket created successfully!');
    await fetchTickets(); // Refresh list
    handleCloseModal();
  } catch (error) {
    authStore.handleApiError(error, 'Failed to create ticket. Please retry.');
  }
};

const handleUpdateSubmit = async (formData) => {
  try {
    // Ensure userId isn't accidentally overwritten if it's not in formData
    const updateData = { ...formData };
    // delete updateData.userId; // Optionally remove userId if API handles it based on token

    await api.updateTicket(formData.id, updateData, authStore.token);
    toast.success('Ticket updated successfully!');
    await fetchTickets(); // Refresh list
    handleCloseModal();
  } catch (error) {
    authStore.handleApiError(error, 'Failed to update ticket. Please retry.');
  }
};

// --- Lifecycle Hooks ---
onMounted(() => {
  if (authStore.token) {
    fetchTickets();
  }
});

// Watch for token changes (e.g., login completes while on this page)
watch(() => authStore.token, (newToken) => {
  if (newToken) {
    fetchTickets();
  } else {
    // If token becomes null (logout), clear tickets
    tickets.value = [];
  }
});

</script>

<template>
  <div class="space-y-8">
    <div class="flex flex-col md:flex-row gap-4 justify-between items-center">
      <h1 class="text-5xl font-bold text-color-text">Manage Tickets</h1>
      <button
        @click="handleOpenCreate"
        class="px-6 py-3 bg-color-primary text-color-card rounded-lg font-semibold hover:opacity-80 w-full md:w-auto"
      >
        Create New Ticket
      </button>
    </div>

    <div class="flex flex-col md:flex-row gap-4 p-4 bg-color-card rounded-lg shadow">
      <div class="flex-1">
        <label for="search" class="sr-only">Search Tickets</label>
        <input
          type="text"
          id="search"
          placeholder="Search by title or description..."
          v-model="searchTerm"
          class="w-full px-4 py-3 border border-color-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-color-primary"
        />
      </div>
      <div class="w-full md:w-1/4">
        <label for="statusFilter" class="sr-only">Filter by Status</label>
        <select
          id="statusFilter"
          v-model="statusFilter"
          class="w-full px-4 py-3 border border-color-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-color-primary"
        >
          <option value="all">All Statuses</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="closed">Closed</option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="text-center py-10">
      <p>Loading tickets...</p>
      </div>
    <div v-else>
      <div v-if="filteredTickets.length === 0" class="text-center text-lg text-gray-500 py-10">
        <p>No tickets found matching your criteria.</p>
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TicketCard
          v-for="ticket in filteredTickets"
          :key="ticket.id"
          :ticket="ticket"
          @edit="handleOpenEdit(ticket)"
          @delete="handleDelete(ticket.id)"
        />
      </div>
    </div>

    <CreateTicket
      :is-open="isCreateTicketOpen"
      @close="handleCloseModal"
      @submit="handleCreateSubmit"
    />
    <EditTicket
      v-if="isEditTicketOpen && currentTicket"
      :is-open="isEditTicketOpen"
      :ticket-to-edit="currentTicket"
      @close="handleCloseModal"
      @submit="handleUpdateSubmit"
    />

  </div>
</template>

<style scoped>
/* Optional component-specific styles */
</style>