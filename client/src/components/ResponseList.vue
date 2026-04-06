<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { helpdeskApi } from '../services/api';
import type { HelpdeskContract } from '../types';

const emit = defineEmits(['edit-response']);
const responses = ref<HelpdeskContract[]>([]);
const searchQuery = ref('');
const isLoading = ref(false);
const error = ref<string | null>(null);

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

const filteredResponses = computed(() => {
  if (!searchQuery.value) return responses.value;
  const query = searchQuery.value.toLowerCase();
  return responses.value.filter(r => 
    r.issueCode.toLowerCase().includes(query) || 
    r.category.toLowerCase().includes(query)
  );
});

const deleteResponse = async (id: string) => {
  if (confirm('Are you sure you want to delete this response?')) {
    try {
      await helpdeskApi.delete(id);
      await fetchResponses();
    } catch (err: any) {
      alert('Delete failed: ' + (err.response?.data?.message || err.message));
    }
  }
};

onMounted(fetchResponses);

defineExpose({ fetchResponses });
</script>

<template>
  <div class="response-list">
    <h2>Helpdesk Responses</h2>
    
    <div class="search-bar">
      <input v-model="searchQuery" placeholder="Search by issue code or category..." />
    </div>

    <div v-if="isLoading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="filteredResponses.length === 0" class="no-results">
      No responses match your search.
    </div>
    <table v-else border="1">
      <thead>
        <tr>
          <th>Issue Code</th>
          <th>Response</th>
          <th>Category</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in filteredResponses" :key="item._id">
          <td>{{ item.issueCode }}</td>
          <td>{{ item.response }}</td>
          <td>{{ item.category }}</td>
          <td>
            <button @click="$emit('edit-response', item)">Edit</button>
            <button @click="deleteResponse(item._id!)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.error { color: red; }
.search-bar { margin-bottom: 1rem; }
.search-bar input { width: 100%; padding: 8px; box-sizing: border-box; }
.no-results { padding: 20px; text-align: center; color: #666; font-style: italic; }
table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
th, td { padding: 0.5rem; text-align: left; }
</style>
