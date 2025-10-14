import { createRouter, createWebHistory } from 'vue-router'
import MathGame from '../components/MathGame.vue'
import AustrianQuiz from '../components/AustrianQuiz.vue'

const routes = [
  {
    path: '/',
    name: 'MathGame',
    component: MathGame
  },
  {
    path: '/austria-quiz',
    name: 'AustrianQuiz',
    component: AustrianQuiz
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router