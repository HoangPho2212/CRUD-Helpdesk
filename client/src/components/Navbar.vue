<template>
  <nav class="navbar">
    <div class="nav-brand">Helpdesk System</div>
    <div class="nav-links">
      <router-link to="/">Dashboard</router-link>
      <router-link to="/management">Management</router-link>
      <router-link to="/quiz">Training Quiz</router-link>
      <router-link to="/info">System Info</router-link>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #333;
  color: white;
  padding: 1rem 2rem;
  margin-bottom: 20px;
  border-radius: 4px;
}
.nav-brand { font-size: 1.5rem; font-weight: bold; }
.nav-links { display: flex; gap: 20px; }
.nav-links a {
  color: #ccc;
  text-decoration: none;
  font-weight: bold;
}
.nav-links a.router-link-active { color: white; border-bottom: 2px solid white; }
.nav-links a:hover { color: white; }
</style>
