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
<nav class="navbar navbar-expand-md navbar-dark bg-dark">
  <div class="container-fluid">
    <a class="navbar-brand" href="/">Tipene Moss</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav">
        <li class="nav-item"><RouterLink class="nav-link" to="/">Cover</RouterLink></li>
        <li class="nav-item"><RouterLink class="nav-link" to="/infra">Behind The Cover</RouterLink></li>
        <li class="nav-item"><RouterLink class="nav-link" to="/ops">Peep thru the Glass</RouterLink></li>
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
