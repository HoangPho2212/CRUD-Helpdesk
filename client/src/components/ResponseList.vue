<script setup lang="ts">
/**
 * ResponseList.vue - Display and Search Logic
 * This component displays the table of helpdesk responses and 
 * handles the real-time filtering (search) functionality.
 */
import { ref, onMounted, computed } from 'vue';
import { helpdeskApi } from '../services/api';
import type { HelpdeskContract } from '../types';

const emit = defineEmits(['edit-response']);
const props = defineProps({
  // Controls if the "Edit/Delete" column is visible (hidden on Dashboard, shown on Management)
  showActions: { type: Boolean, default: false }
});

const responses = ref<HelpdeskContract[]>([]);
const searchQuery = ref(''); // Stores the user's input from the search bar
const isLoading = ref(false);
const error = ref<string | null>(null);

// Lifecycle Hook: Fetches data from the API as soon as the component is "mounted" in the browser
const fetchResponses = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const res = await helpdeskApi.getAll();
    responses.value = res.data;
  } catch (err: any) {
    error.value = 'Failed to fetch responses. ' + (err.response?.data?.message || err.message);
  } finally {
    isLoading.value = false;
  }
};

//SEARCH LOGIC (Computed Property)//
const filteredResponses = computed(() => {
  if (!searchQuery.value) return responses.value;
  const query = searchQuery.value.toLowerCase();
  return responses.value.filter(r => 
    r.issueCode.toLowerCase().includes(query) || 
    r.category.toLowerCase().includes(query)
  );
});

// Deletes a response after user confirmation
const deleteResponse = async (id: string) => {
  if (confirm('Are you sure you want to delete this response?')) {
    try {
      await helpdeskApi.delete(id);
      await fetchResponses(); // Refresh the list after deletion
    } catch (err: any) {
      alert('Delete failed: ' + (err.response?.data?.message || err.message));
    }
  }
};

onMounted(fetchResponses);

// Allows parent components to trigger a data refresh
defineExpose({ fetchResponses });
</script>

<template>
  <div class="response-list">
    <h2>Helpdesk Responses</h2>
    
    <!-- Search Bar Input -->
    <div class="search-bar">
      <input v-model="searchQuery" placeholder="Search by issue code or category..." />
    </div>

    <!-- State-based Rendering -->
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="filteredResponses.length === 0" class="no-results">
      No responses match your search.
    </div>

    <!-- Main Data Table -->
    <table v-else border="1">
      <thead>
        <tr>
          <th>Issue Code</th>
          <th>Response</th>
          <th>Category</th>
          <th v-if="showActions">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in filteredResponses" :key="item._id">
          <td>{{ item.issueCode }}</td>
          <td>{{ item.response }}</td>
          <td>{{ item.category }}</td>
          <td v-if="showActions">
            <!-- Emits an event to the parent component to start the "Edit" process -->
            <button @click="$emit('edit-response', item)">Edit</button>
            <button @click="deleteResponse(item._id!)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
