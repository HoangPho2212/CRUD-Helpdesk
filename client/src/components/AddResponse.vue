<script setup lang="ts">
import { reactive } from 'vue';
import { helpdeskApi } from '../services/api';
import type { HelpdeskContract } from '../types';

const emit = defineEmits(['response-added']);
const formData = reactive<HelpdeskContract>({
  issueCode: '',
  response: '',
  category: ''
});

const submitForm = async () => {
  try {
    await helpdeskApi.create(formData);
    emit('response-added');
    // Reset form
    formData.issueCode = '';
    formData.response = '';
    formData.category = '';
  } catch (err: any) {
    alert('Create failed: ' + (err.response?.data?.message || err.message));
  }
};
</script>

<template>
  <div class="add-response">
    <h3>Add New Response</h3>
    <form @submit.prevent="submitForm">
      <div>
        <label>Issue Code:</label>
        <input v-model="formData.issueCode" required />
      </div>
      <div>
        <label>Response:</label>
        <textarea v-model="formData.response" required></textarea>
      </div>
      <div>
        <label>Category:</label>
        <select v-model="formData.category" required>
          <option value="">Select Category</option>
          <option value="IT">IT</option>
          <option value="Billing">Billing</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<style scoped>
form > div { margin-bottom: 0.5rem; }
label { display: block; }
input, textarea, select { width: 100%; box-sizing: border-box; }
</style>
