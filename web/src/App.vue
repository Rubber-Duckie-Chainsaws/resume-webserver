<template>
  <div class="themed">
    <Header :links="appLinks">
      <template #brand>
        <a class="navbar-brand" href="/">Tipene Moss</a>
      </template>
    </Header>
  </div>

<!-- Begin page content -->
<div class="">
  <RouterView />
</div>
</template>

<script setup>
  import { ref, onMounted, watch } from 'vue'
  import { storeToRefs } from 'pinia'
  import Header from '@/components/Header.vue'
  import mermaid from 'mermaid'

  const appLinks = [
    {
      name: "Cover",
      route: "/"
    },
    {
      name: "Behind the Cover",
      route: "/infra"
    },
    {
      name: "Peep thru the Glass",
      route: "/ops"
    },
    {
      name: "Make it look better",
      route: "/themer"
    }
  ]

  import { useThemeStore } from '@/stores/theme'

  const themes = useThemeStore()
  const { chosen } = storeToRefs(themes)

  onMounted(() => {
    mermaid.initialize({
      startOnLoad: true,
      flowchart: {
        useMaxWidth: 0,
      },
      sequenceDiagram: {
        useMaxWidth: 0
      }
    })
    themes.changeTheme(chosen.value)
  })
</script>

<style scoped>
.btn-bd-primary {
  --bd-violet-bg: #712cf9;
  --bd-violet-rgb: 112.520718, 44.062154, 249.437846;

  --bs-btn-font-weight: 600;
  --bs-btn-color: var(--bs-white);
  --bs-btn-bg: var(--bd-violet-bg);
  --bs-btn-border-color: var(--bd-violet-bg);
  --bs-btn-hover-color: var(--bs-white);
  --bs-btn-hover-bg: #6528e0;
  --bs-btn-hover-border-color: #6528e0;
  --bs-btn-focus-shadow-rgb: var(--bd-violet-rgb);
  --bs-btn-active-color: var(--bs-btn-hover-color);
  --bs-btn-active-bg: #5a23c8;
  --bs-btn-active-border-color: #5a23c8;
}

.bd-mode-toggle {
  z-index: 1500;
}

.bd-mode-toggle .dropdown-menu .active .bi {
  display: block !important;
}
</style>
