import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/vendors',
      name: 'vendors',
      component: () => import('../views/VendorsView.vue')
    },
    {
      path: '/visit-us',
      name: 'visit-us',
      component: () => import('../views/VisitUsView.vue')
    },
    {
      path: '/become-a-vendor',
      name: 'become-a-vendor',
      component: () => import('../views/BecomeVendorView.vue')
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/ContactView.vue')
    },
    {
      path: '/events',
      name: 'events',
      component: () => import('../views/EventsView.vue')
    },
    {
      path: '/init',
      name: 'initialization',
      component: () => import('../views/InitPage.vue')
    }
  ]
})

export default router