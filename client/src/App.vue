<script setup lang="ts">
import Navbar from './components/Navbar.vue';
</script>

<template>
  <div class="container">
    <Navbar />
    
    <main class="main-content">
      <router-view></router-view>
    </main>
    
    <footer class="app-footer">
      <p>&copy; 2026 Helpdesk System - Excellent Edition</p>
    </footer>
  </div>
</template>
