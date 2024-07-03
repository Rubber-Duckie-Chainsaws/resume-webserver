<script setup>
  import { onMounted } from 'vue'
  import mermaid from 'mermaid'

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
  })
</script>

<template>
<nav class="navbar navbar-expand-sm navbar-dark bg-dark">
  <div class="container-fluid">
    <a class="navbar-brand" href="/">Tipene Moss</a>
    <div class="collapse navbar-collapse" id="navbarCollapse">
      <ul class="navbar-nav me-auto mb-2 mb-md-0">
        <RouterLink class="nav-item" to="/">Cover</RouterLink>
        <RouterLink class="nav-item" to="/infra">Behind The Cover</RouterLink>
        <RouterLink class="nav-item" to="/ops">Peep thru the Glass</RouterLink>
      </ul>
    </div>
  </div>
</nav>

<!-- Begin page content -->
<main class="container-fluid min-vh-100 mt-5">
  <RouterView />
</main>
</template>

<style scoped>
</style>
