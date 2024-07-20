<template>
  <div>
    <nav class="navbar bg-secondary px-4">
      <h1 class="navbar-brand">Infra overview</h1>
      <nav class="nav nav-tabs">
        <RouterLink class="nav-link" to="/infra/topology">Cluster Topology</RouterLink>
        <RouterLink class="nav-link" to="/infra/nomad">Nomad Cluster</RouterLink>
        <RouterLink class="nav-link" to="/infra/gha">GHA Autoscaler</RouterLink>
        <RouterLink class="nav-link" to="/infra/resume">Resume &#38; this website</RouterLink>
      </nav>
    </nav>
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <component :is="Component" />
      </transition>
    </router-view>
    <ProjectComponent projectName="Discord launcher">
      <template #default>
        <h4>Status: Planning</h4>
      </template>
    </ProjectComponent>
  </div>
</template>

<script setup>
  import ProjectComponent from '@/components/ProjectComponent.vue'
</script>

<style scoped>
  .row {
    border-top: 1px solid grey;
  }

  svg text {
    text-anchor: middle;
    dominant-baseline: middle;
  }
</style>
