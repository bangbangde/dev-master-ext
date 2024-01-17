import { createApp, ref } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from '@/views/App.vue'
import '@/styles/base.scss'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue')
    },
    {
      path: '/storage',
      name: 'storage',
      component: () => import('@/views/StorageViewer.vue')
    },
    {
      path: '/chatTabs',
      name: 'chatTabs',
      component: () => import('@/views/components/ChatTabs.vue')
    }
  ]
})

const app = createApp(App)
app.use(router)
app.mount('#app')
