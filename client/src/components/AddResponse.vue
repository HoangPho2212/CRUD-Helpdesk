<script setup lang="ts">
/**
 * AddResponse.vue - Data Entry & Validation
 * This component handles creating new records and ensures they 
 * follow the correct format before they ever reach the server.
 */
import { reactive, computed } from 'vue';
import { helpdeskApi } from '../services/api';
import type { HelpdeskContract } from '../types';

const emit = defineEmits(['response-added']);

// 'reactive' creates a single state object for the entire form
const formData = reactive<HelpdeskContract>({
  issueCode: '',
  response: '',
  category: ''
});

/**
 * REGEX VALIDATION (Computed Property)
 * Enforces the format: 3 Uppercase Letters, Hyphen, 3 Digits (e.g., ABC-123)
 */
const isCodeValid = computed(() => {
  if (!formData.issueCode) return true; // Don't show error while the   user hasn't typed anything
  return /^[A-Z]{3}-\d{3}$/.test(formData.issueCode);
});

const submitForm = async () => {
  if (!isCodeValid.value) return; // Prevent submission if validation fails
  try {
    await helpdeskApi.create(formData);
    emit('response-added'); // Tell the parent to refresh the table
    // Reset the form fields after success
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
        <!-- DYNAMIC ERROR MESSAGE -->
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
      <!-- Axious -> POST Request  -->
    </form>
  </div>
</template>
