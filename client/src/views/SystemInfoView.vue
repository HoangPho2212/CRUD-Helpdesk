<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { helpdeskApi } from '../services/api';

const count = ref<number | null>(null);
const techStack = [
  { name: 'Frontend', tools: 'Vue 3, Vite, TypeScript, Vue Router' },
  { name: 'Backend', tools: 'Express.js, Node.js' },
  { name: 'Database', tools: 'MongoDB, Mongoose' },
  { name: 'Testing', tools: 'Jest, Supertest' }
];

onMounted(async () => {
  try {
    const res = await helpdeskApi.getCount();
    count.value = res.data.count;
  } catch (err) {
    console.error('Failed to load system info', err);
  }
});
</script>

<template>
  <div class="system-info-view">
    <h2>System Information</h2>
    
    <div class="info-grid">
      <div class="info-card">
        <h3>Statistics</h3>
        <p><strong>Total Helpdesk Responses:</strong> {{ count !== null ? count : 'Loading...' }}</p>
      </div>
      
      <div class="info-card">
        <h3>Technology Stack</h3>
        <ul>
          <li v-for="item in techStack" :key="item.name">
            <strong>{{ item.name }}:</strong> {{ item.tools }}
          </li>
        </ul>
      </div>
      
      <div class="info-card">
        <h3>App Details</h3>
        <p><strong>Version:</strong> 1.0.0 (Excellent Grade Edition)</p>
        <p><strong>Environment:</strong> Development</p>
      </div>
    </div>
  </div>
</template>
