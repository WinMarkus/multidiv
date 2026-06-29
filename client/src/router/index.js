import { createRouter, createWebHistory } from 'vue-router'
import MathGame from '../components/MathGame.vue'
import AustrianQuiz from '../components/AustrianQuiz.vue'
import ShapesQuiz from '../components/ShapesQuiz.vue'
import ShapeMovements from '../components/ShapeMovements.vue'
import BodmasQuiz from '../components/BodmasQuiz.vue'

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
  },
  {
    path: '/shapes-quiz',
    name: 'ShapesQuiz',
    component: ShapesQuiz
  },
  {
    path: '/shape-movements',
    name: 'ShapeMovements',
    component: ShapeMovements
  },
  {
    path: '/bodmas',
    name: 'BodmasQuiz',
    component: BodmasQuiz
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
