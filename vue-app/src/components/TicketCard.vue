<script setup>
import { computed } from 'vue';
import { formatDistanceToNow } from 'date-fns';

// 1. Define Props
const props = defineProps({
  ticket: {
    type: Object,
    required: true,
  },
});

// 2. Define Emits
const emit = defineEmits(['edit', 'delete']);

// 3. Computed Properties for Dynamic Classes and Formatting
const statusStyles = {
  open: 'bg-color-open text-green-800 border-green-200',
  in_progress: 'bg-color-progress text-yellow-800 border-yellow-200',
  closed: 'bg-color-closed text-gray-800 border-gray-200',
};

const priorityStyles = {
  low: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-red-100 text-red-800 border-red-200',
};

const statusClass = computed(() => {
  return statusStyles[props.ticket?.status] || statusStyles['closed'];
});

const priorityClass = computed(() => {
  return priorityStyles[props.ticket?.priority] || priorityStyles['low'];
});

const timeAgo = computed(() => {
  return props.ticket?.createdAt
    ? formatDistanceToNow(new Date(props.ticket.createdAt), { addSuffix: true })
    : 'just now';
});

// 4. Methods to Emit Events
const handleEdit = () => {
  emit('edit', props.ticket); // Pass the ticket data back
};

const handleDelete = () => {
  emit('delete', props.ticket.id); // Pass the ticket ID back
};
</script>

<template>
  <div class="bg-color-card p-6 rounded-2xl shadow-lg flex flex-col justify-between h-full">
    <div>
      <h3 class="text-2xl font-semibold text-color-text mb-3">{{ ticket.title }}</h3>

      <div class="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
        <span
          :class="['px-3 py-1 text-xs font-bold rounded-full capitalize border', statusClass]"
        >
          {{ ticket.status ? ticket.status.replace('_', ' ') : 'Unknown' }}
        </span>
        <span
          :class="['px-3 py-1 text-xs font-bold rounded-full capitalize border', priorityClass]"
        >
          {{ ticket.priority || 'low' }}
        </span>
        <span class="text-sm text-gray-500">{{ timeAgo }}</span>
      </div>

      <p class="text-color-text mb-6 break-words">
        {{ ticket.description || 'No description provided.' }}
      </p>
    </div>

    <div class="flex justify-end gap-4 border-t border-gray-200 pt-4">
      <button
        @click="handleEdit"
        class="font-medium text-color-primary hover:text-color-secondary focus:outline-none focus:ring-2 focus:ring-color-primary rounded px-2"
        aria-label="Edit ticket"
      >
        Edit
      </button>
      <button
        @click="handleDelete"
        class="font-medium text-gray-500 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 rounded px-2"
        aria-label="Delete ticket"
      >
        Delete
      </button>
    </div>
  </div>
</template>