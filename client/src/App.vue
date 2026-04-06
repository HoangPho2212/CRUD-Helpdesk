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

<style>
body { font-family: sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; color: #333; }
.container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); min-height: 80vh; display: flex; flex-direction: column; }
.main-content { flex: 1; padding: 20px 0; }
.app-footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #777; font-size: 0.9rem; }
button { cursor: pointer; padding: 8px 16px; border-radius: 4px; border: 1px solid #ccc; background: #fff; transition: all 0.2s; }
button:hover { background: #f0f0f0; border-color: #999; }
button:disabled { cursor: not-allowed; opacity: 0.6; }
input, textarea, select { border: 1px solid #ddd; border-radius: 4px; padding: 8px; }
</style>
