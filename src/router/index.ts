import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  { path: '/login', component: () => import('@/views/login/LoginIndex.vue'), meta: { title: '登入/注册' } }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
router.afterEach(function (to) {
  document.title = to.meta.title as string
})
export default router
