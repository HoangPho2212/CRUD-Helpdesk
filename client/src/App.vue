<script setup lang="ts">
import { ref } from 'vue';
import ResponseList from './components/ResponseList.vue';
import AddResponse from './components/AddResponse.vue';
import EditResponse from './components/EditResponse.vue';
import type { HelpdeskContract } from './types';

const listRef = ref<InstanceType<typeof ResponseList> | null>(null);
const currentEdit = ref<HelpdeskContract | null>(null);

const onResponseAdded = () => {
  listRef.value?.fetchResponses();
};

const onEditResponse = (response: HelpdeskContract) => {
  currentEdit.value = response;
};

const onResponseUpdated = () => {
  currentEdit.value = null;
  listRef.value?.fetchResponses();
};

const cancelEdit = () => {
  currentEdit.value = null;
};
</script>

<template>
  <div class="container">
    <h1>Helpdesk Management System</h1>
    
    <div class="main-content">
      <div class="form-section">
        <AddResponse v-if="!currentEdit" @response-added="onResponseAdded" />
        <EditResponse v-else :response-to-edit="currentEdit" @response-updated="onResponseUpdated" @cancel-edit="cancelEdit" />
      </div>

      <div class="list-section">
        <ResponseList ref="listRef" @edit-response="onEditResponse" />
      </div>
    </div>
  </div>
</template>

<style>
body { font-family: sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; }
.container { max-width: 1000px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
h1 { text-align: center; color: #333; }
.main-content { display: flex; flex-direction: column; gap: 20px; }
@media (min-width: 768px) {
  .main-content { flex-direction: row; }
  .form-section { flex: 1; }
  .list-section { flex: 2; }
}
.form-section { padding: 15px; border: 1px solid #ddd; border-radius: 4px; background: #fafafa; }
</style>
