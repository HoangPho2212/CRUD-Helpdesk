<script setup lang="ts">
import { ref } from 'vue';
import AddResponse from '../components/AddResponse.vue';
import EditResponse from '../components/EditResponse.vue';
import ResponseList from '../components/ResponseList.vue';
import type { HelpdeskContract } from '../types';

const listRef = ref<InstanceType<typeof ResponseList> | null>(null);
const currentEdit = ref<HelpdeskContract | null>(null);

const onResponseAdded = () => {
  listRef.value?.fetchResponses();
};

const onEditResponse = (response: HelpdeskContract) => {
  currentEdit.value = response;
  window.scrollTo({ top: 0, behavior: 'smooth' });
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
  <div class="management-view">
    <div class="form-section">
      <AddResponse v-if="!currentEdit" @response-added="onResponseAdded" />
      <EditResponse v-else :response-to-edit="currentEdit" @response-updated="onResponseUpdated" @cancel-edit="cancelEdit" />
    </div>
    
    <div class="list-section">
      <ResponseList ref="listRef" @edit-response="onEditResponse" />
    </div>
  </div>
</template>

<style scoped>
.management-view { display: flex; flex-direction: column; gap: 20px; }
.form-section { padding: 15px; border: 1px solid #ddd; border-radius: 4px; background: #fafafa; }
</style>
