import 'bootstrap/js/dist/button'
import 'bootstrap/js/dist/modal'
import 'bootstrap/dist/css/bootstrap.min.css'

import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

/**********************************\
 *            Router              *
 * TODO: Move to own package/file *
\**********************************/
import { createWebHistory, createRouter } from 'vue-router'
import CoverView from '@/views/CoverView.vue'
import InfraView from '@/views/InfraView.vue'
import OpsView from '@/views/OpsView.vue'

const routes = [
  { path: '/', component: CoverView },
  { path: '/infra', component: InfraView },
  { path: '/ops', component: OpsView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})


createApp(App)
  .use(router)
  .mount('#app')
