<script setup lang="ts">
import { reactive, computed } from 'vue';
import { helpdeskApi } from '../services/api';
import type { HelpdeskContract } from '../types';

const emit = defineEmits(['response-added']);
const formData = reactive<HelpdeskContract>({
  issueCode: '',
  response: '',
  category: ''
});

const isCodeValid = computed(() => {
  if (!formData.issueCode) return true; // Don't show error if empty
  return /^[A-Z]{3}-\d{3}$/.test(formData.issueCode);
});

const submitForm = async () => {
  if (!isCodeValid.value) return;
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
        <label>Issue Code (ABC-123):</label>
        <input v-model="formData.issueCode" required />
        <p v-if="!isCodeValid && formData.issueCode" class="error">
          Format must be 3 uppercase letters, hyphen, 3 digits (e.g. ABC-123)
        </p>
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
      <button type="submit" :disabled="!isCodeValid || !formData.issueCode">Submit</button>
    </form>
  </div>
</template>

<style scoped>
form > div { margin-bottom: 0.5rem; }
label { display: block; }
input, textarea, select { width: 100%; box-sizing: border-box; }
.error { color: red; font-size: 0.8rem; margin: 4px 0; }
</style>
