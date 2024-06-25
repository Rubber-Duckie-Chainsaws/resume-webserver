<script setup>
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
<header>
  <!-- Fixed navbar -->
  <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Tipene Moss</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarCollapse">
        <ul class="navbar-nav me-auto mb-2 mb-md-0">
          <RouterLink class="nav-item" to="/">Cover</RouterLink>
          <RouterLink class="nav-item" to="/infra">Behind The Cover</RouterLink>
          <RouterLink class="nav-item" to="/ops">Peep thru the Glass</RouterLink>
        </ul>
        <form class="d-flex" role="search">
          <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
          <button class="btn btn-outline-success" type="submit">Search</button>
        </form>
      </div>
    </div>
  </nav>
</header>

<!-- Begin page content -->
<main class="container-fluid" style="padding-top: 60px;">
  <RouterView />
</main>
</template>

<style scoped>
</style>
