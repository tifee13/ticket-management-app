<script setup>
import { ref, watch } from 'vue';
import { toast } from 'vue-sonner';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
});
const emit = defineEmits(['close', 'submit']); // Define events the component can emit

// 2. Define Reactive State (Replaces useState)
const title = ref('');
const description = ref('');
const status = ref(''); // No default, uses placeholder
const priority = ref(''); // No default, uses placeholder
const errors = ref({});

// 3. Validation Logic (Mostly the same, access state with .value)
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

  errors.value = newErrors; // Update reactive errors object
  return Object.keys(newErrors).length === 0;
};

// 4. Handle Submit (Replaces React's handleSubmit)
const handleSubmit = () => {
  if (validate()) {
    // Emit the 'submit' event with the form data
    emit('submit', {
      title: title.value,
      description: description.value,
      status: status.value,
      priority: priority.value,
    });
    // Reset form fields
    title.value = '';
    description.value = '';
    status.value = '';
    priority.value = '';
    errors.value = {}; // Clear errors
  } else {
    toast.error('Please fix the form errors.');
  }
};

// 5. Reset form when modal opens (Replaces logic in parent component)
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    title.value = '';
    description.value = '';
    status.value = '';
    priority.value = '';
    errors.value = {};
  }
});

// 6. Handle Cancel (Emit 'close' event)
const handleClose = () => {
  emit('close');
};
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex justify-center items-center bg-black/50 p-4">
    <div class="bg-color-bg w-full max-w-lg p-8 rounded-2xl shadow-2xl">
      <h2 class="text-3xl font-bold mb-6 text-color-text">
        Create New Ticket
      </h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-lg font-medium mb-2" for="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            v-model="title"
            class="w-full px-4 py-3 border border-color-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-color-primary"
          />
          <p v-if="errors.title" class="text-red-500 text-sm mt-1">{{ errors.title }}</p>
        </div>

        <div>
          <label class="block text-lg font-medium mb-2" for="description">Description</label>
          <textarea
            id="description"
            name="description"
            rows="3"
            v-model="description"
            class="w-full px-4 py-3 border border-color-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-color-primary"
          />
          <p v-if="errors.description" class="text-red-500 text-sm mt-1">{{ errors.description }}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-lg font-medium mb-2" for="status">Status *</label>
            <select
              id="status"
              name="status"
              v-model="status"
              :class="['w-full px-4 py-3 border border-color-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-color-primary']"
            >
              <option value="" disabled>Select a status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>
            <p v-if="errors.status" class="text-red-500 text-sm mt-1">{{ errors.status }}</p>
          </div>

          <div>
            <label class="block text-lg font-medium mb-2" for="priority">Priority *</label>
            <select
              id="priority"
              name="priority"
              v-model="priority"
              :class="['w-full px-4 py-3 border border-color-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-color-primary']"
            >
              <option value="" disabled>Select a priority</option>
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
            class="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-6 py-2 bg-color-primary text-white rounded-lg font-semibold hover:opacity-80"
          >
            Create Ticket
          </button>
        </div>
      </form>
    </div>
  </div>
</template>