import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ConflictDetail from '../views/ConflictDetail.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { 
      path: '/', 
      name: 'home', 
      component: HomeView 
    },
    { 
      path: '/conflicts/:id', 
      name: 'conflict-detail', 
      component: ConflictDetail, 
      props: true 
    },
    {
    path: '/:pathMatch(.*)*',
    redirect: "/"
  }
  ]
})
export default router