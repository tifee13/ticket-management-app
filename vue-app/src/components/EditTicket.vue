<script setup>
import { ref, watch } from 'vue';
import { toast } from 'vue-sonner';

// 1. Define Props and Emits
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  ticketToEdit: {
    type: Object, // The ticket object being edited
    default: null, // Default to null if not provided or when closed
  },
});
const emit = defineEmits(['close', 'submit']);

// 2. Define Reactive State (initialized empty, updated by watch)
const title = ref('');
const description = ref('');
const status = ref('');
const priority = ref('');
const ticketId = ref(null); // Keep track of the ID
const errors = ref({});

// 3. Watch for prop changes to update the form (Replaces useEffect)
watch(() => [props.isOpen, props.ticketToEdit], ([newIsOpen, newTicket]) => {
  if (newIsOpen && newTicket) {
    // Populate form when modal opens with a valid ticket
    title.value = newTicket.title || '';
    description.value = newTicket.description || '';
    status.value = newTicket.status || 'open'; // Default if missing
    priority.value = newTicket.priority || 'low'; // Default if missing
    ticketId.value = newTicket.id;
    errors.value = {}; // Clear previous errors
  } else if (!newIsOpen) {
     // Optional: Clear form when modal closes (might not be needed if handled by parent)
     title.value = '';
     description.value = '';
     status.value = '';
     priority.value = '';
     ticketId.value = null;
     errors.value = {};
  }
}, { immediate: true }); // immediate: true runs the watcher once on component setup

// 4. Validation Logic (Same as CreateTicket, using .value)
const validate = () => {
  const newErrors = {};
  const allowedStatuses = ["open", "in_progress", "closed"];
  const allowedPriorities = ["low", "medium", "high"];

  if (!title.value) newErrors.title = 'Title is mandatory.';
  if (!status.value) newErrors.status = 'Status is mandatory.';
  else if (!allowedStatuses.includes(status.value)) {
    newErrors.status = 'Status must be one of: open, in_progress, closed.';
  }
  if (!priority.value) newErrors.priority = 'Priority is mandatory.';
  else if (!allowedPriorities.includes(priority.value)) {
      newErrors.priority = 'Priority must be one of: low, medium, high.';
  }
  if (description.value && description.value.length > 500) {
    newErrors.description = 'Description must be 500 characters or less.';
  }

  errors.value = newErrors;
  return Object.keys(newErrors).length === 0;
};

// 5. Handle Submit (Emit updated data including the ID)
const handleSubmit = () => {
  if (validate()) {
    emit('submit', {
      id: ticketId.value, // Include the ID for update
      title: title.value,
      description: description.value,
      status: status.value,
      priority: priority.value,
    });
    // No need to reset here, modal will close via parent
  } else {
    toast.error('Please fix the form errors.');
  }
};

// 6. Handle Cancel
const handleClose = () => {
  emit('close');
};
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex justify-center items-center bg-black/50 p-4">
    <div class="bg-color-bg w-full max-w-lg p-8 rounded-2xl shadow-2xl">
      <h2 class="text-3xl font-bold mb-6 text-color-text">
        Edit Ticket
      </h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-lg font-medium mb-2" for="edit-title">Title *</label>
          <input
            type="text"
            id="edit-title"
            name="title"
            v-model="title"
            class="w-full px-4 py-3 border border-color-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-color-primary"
          />
          <p v-if="errors.title" class="text-red-500 text-sm mt-1">{{ errors.title }}</p>
        </div>

        <div>
          <label class="block text-lg font-medium mb-2" for="edit-description">Description</label>
          <textarea
            id="edit-description"
            name="description"
            rows="3"
            v-model="description"
            class="w-full px-4 py-3 border border-color-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-color-primary"
          />
          <p v-if="errors.description" class="text-red-500 text-sm mt-1">{{ errors.description }}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-lg font-medium mb-2" for="edit-status">Status *</label>
            <select
              id="edit-status"
              name="status"
              v-model="status"
              class="w-full px-4 py-3 border border-color-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-color-primary"
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>
            <p v-if="errors.status" class="text-red-500 text-sm mt-1">{{ errors.status }}</p>
          </div>

          <div>
            <label class="block text-lg font-medium mb-2" for="edit-priority">Priority *</label>
            <select
              id="edit-priority"
              name="priority"
              v-model="priority"
              class="w-full px-4 py-3 border border-color-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-color-primary"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <p v-if="errors.priority" class="text-red-500 text-sm mt-1">{{ errors.priority }}</p>
          </div>
        </div>

        <div class="flex justify-end gap-4 pt-4">
          <button
            type="button"
            @click="handleClose"
            class="px-6 py-2 bg-gray-200 text-color-primary rounded-lg font-semibold hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-6 py-2 bg-color-primary text-gray-200 rounded-lg font-semibold hover:opacity-80"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>
</template>