<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { helpdeskApi } from '../services/api';
import type { HelpdeskContract } from '../types';

const emit = defineEmits(['edit-response']);
const responses = ref<HelpdeskContract[]>([]);
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
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
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
        <tr v-for="item in responses" :key="item._id">
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
table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
th, td { padding: 0.5rem; text-align: left; }
</style>
