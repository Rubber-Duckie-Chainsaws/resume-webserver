import 'bootstrap/js/dist/button'
import 'bootstrap/js/dist/collapse'
import 'bootstrap/js/dist/modal'
import 'bootstrap/js/dist/offcanvas'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

import { createApp } from 'vue'
import '@/styles/base.css'
import App from './App.vue'
import 'vite/modulepreload-polyfill'

/**********************************\
 *            Router              *
 * TODO: Move to own package/file *
\**********************************/
import { createWebHistory, createRouter } from 'vue-router'
import CoverView from '@/views/CoverView.vue'
import InfraView from '@/views/InfraView.vue'
import Topology from '@/views/infra/Topology.vue'
import Nomad from '@/views/infra/Nomad.vue'
import GHAAutoscaler from '@/views/infra/GHAAutoscaler.vue'
import Resume from '@/views/infra/Resume.vue'
import OpsView from '@/views/OpsView.vue'
import Themer from '@/views/Themer.vue'

const routes = [
  { path: '/', component: CoverView },
  {
    path: '/infra',
    component: InfraView,
    children: [
      {
        path: '', component: Topology, alias: ['topology']
      },
      {
        path: 'nomad', component: Nomad
      },
      {
        path: 'gha', component: GHAAutoscaler
      },
      {
        path: 'resume', component: Resume
      },
    ]
  },
  { path: '/ops', component: OpsView },
  { path: '/themer', component: Themer },
]

const router = createRouter({
  linkActiveClass: 'active',
  linkExactActiveClass: 'active',
  history: createWebHistory(),
  routes,
})


/**********************************\
 *           Showdown             *
 * TODO: Move to own package/file *
\**********************************/

import PrimeVue from 'primevue/config'


/**********************************\
 *           Showdown             *
 * TODO: Move to own package/file *
\**********************************/
import { VueShowdownPlugin } from 'vue-showdown'

createApp(App)
  .use(router)
  .use(PrimeVue, {})
  .use(VueShowdownPlugin, {
    flavor: 'github',
  })
  .mount('#app')
