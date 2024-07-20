<template>
<nav class="navbar navbar-expand-md secondary-bg">
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
        <li class="nav-item"><RouterLink class="nav-link" to="/themer">Make it look better</RouterLink></li>
      </ul>
    </div>
  </div>
</nav>

<!-- Begin page content -->
<main class="container-fluid min-vh-100 mt-5">
  <RouterView />
</main>
</template>

<script setup>
  import { ref, onMounted, watch } from 'vue'
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
