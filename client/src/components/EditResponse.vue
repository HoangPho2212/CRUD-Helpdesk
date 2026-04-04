<script setup lang="ts">
import { reactive, watch } from 'vue';
import { helpdeskApi } from '../services/api';
import type { HelpdeskContract } from '../types';

const props = defineProps<{
  responseToEdit: HelpdeskContract
}>();

const emit = defineEmits(['response-updated', 'cancel-edit']);

const formData = reactive<HelpdeskContract>({ ...props.responseToEdit });

watch(() => props.responseToEdit, (newVal) => {
  Object.assign(formData, newVal);
});

const submitForm = async () => {
  if (!formData._id) return;
  try {
    await helpdeskApi.update(formData._id, formData);
    emit('response-updated');
  } catch (err: any) {
    alert('Update failed: ' + (err.response?.data?.message || err.message));
  }
};
</script>

<template>
  <div class="edit-response">
    <h3>Edit Response ({{ formData.issueCode }})</h3>
    <form @submit.prevent="submitForm">
      <div>
        <label>Response:</label>
        <textarea v-model="formData.response" required></textarea>
      </div>
      <div>
        <label>Category:</label>
        <select v-model="formData.category" required>
          <option value="IT">IT</option>
          <option value="Billing">Billing</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <button type="submit">Update</button>
      <button type="button" @click="$emit('cancel-edit')">Cancel</button>
    </form>
  </div>
</template>

<style scoped>
form > div { margin-bottom: 0.5rem; }
label { display: block; }
textarea, select { width: 100%; box-sizing: border-box; }
</style>
