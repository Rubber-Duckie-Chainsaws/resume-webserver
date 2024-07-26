import { createApp } from 'vue'
import '@/styles/global.css'
//import '@/styles/wireframe.css' // For debugging weird layouts
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
import ThemeView from '@/views/ThemeView.vue'

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
  { path: '/themer', component: ThemeView },
]

const router = createRouter({
  linkActiveClass: 'active',
  linkExactActiveClass: 'active',
  history: createWebHistory(),
  routes,
})


/**********************************\
 *           PrimeVue             *
 * TODO: Move to own package/file *
\**********************************/

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'


/**********************************\
 *            Pinia               *
 * TODO: Move to own package/file *
\**********************************/

import { createPinia } from 'pinia'

const pinia = createPinia()

/**********************************\
 *           Showdown             *
 * TODO: Move to own package/file *
\**********************************/
import { VueShowdownPlugin } from 'vue-showdown'


import Button from '@/components/Button.vue'

createApp(App)
  .use(router)
  .use(pinia)
  .use(PrimeVue, {theme:{preset: Aura}})
  //.use(PrimeVue, {unstyled: true})
  .use(VueShowdownPlugin, {
    flavor: 'github',
  })
  .component('Button', Button)
  .mount('#app')
