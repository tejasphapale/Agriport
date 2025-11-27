import { createRouter, createWebHistory } from 'vue-router'

// Import all views
import HomeView from '../views/HomeView.vue'
import TransportView from '../views/TransportView.vue'
import AboutView from '../views/AboutView.vue'
import CropsView from '../views/CropsView.vue'
import lightsensor from '../views/lightsensor.vue'
import tmanage from '../views/tmanage.vue'
import LoginView from '../views/LoginView.vue'

const routes = [
  { path: '/', name: 'Login', component: LoginView },
  { path: '/home', name: 'Home', component: HomeView, meta: { requiresAuth: true } },
  { path: '/transport', name: 'Transport', component: TransportView, meta: { requiresAuth: true } },
  { path: '/records', name: 'Records', component: TransportView, meta: { requiresAuth: true } },
  { path: '/about', name: 'About', component: AboutView, meta: { requiresAuth: true } },
  { path: '/crop', name: 'Crops', component: CropsView, meta: { requiresAuth: true } },
  { path: '/tmanage', name: 'Manage Transport', component: tmanage, meta: { requiresAuth: true } },
  { path: '/lightsensor', name: 'Payment', component: lightsensor, meta: { requiresAuth: true } },
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: {
      template: `
        <div style="text-align:center;padding:2rem">
          <h2>404 - Page Not Found</h2>
          <router-link to="/">Go to Login</router-link>
        </div>
      `,
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// ✅ Corrected navigation guard
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('loggedInUser'))

  if (to.meta.requiresAuth && !user) {
    // Not logged in → go to login
    return next('/')
  }

  if (to.path === '/' && user) {
    // Already logged in → redirect home
    return next('/home')
  }

  next()
})

export default router
