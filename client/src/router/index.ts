import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ManagementView from '../views/ManagementView.vue';
import QuizView from '../views/QuizView.vue';
import SystemInfoView from '../views/SystemInfoView.vue';

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/management', name: 'management', component: ManagementView },
  { path: '/quiz', name: 'quiz', component: QuizView },
  { path: '/info', name: 'info', component: SystemInfoView }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
