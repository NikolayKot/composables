import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TestForm from '@/components/TestForm.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/form',
      name: 'form',
      component: TestForm,
    },
    {
      path: '/posts',
      name: 'posts',
      component: () => import('@/views/PostsPage.vue'),
    },
  ],
})

export default router
