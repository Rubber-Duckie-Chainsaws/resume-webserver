<template>
  <div class="themed infra">
    <Header :primary="false" :center="true" :links="links">
      <template #brand>
        <a href="#" @click.prevent.stop="" style="cursor: default">Infra overview</a>
      </template>
    </Header>
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <component :is="Component" />
      </transition>
    </router-view>
    <!--
    <ProjectComponent projectName="Discord launcher">
      <template #default>
        <h4>Status: Planning</h4>
        <p>Stuff and things</p>
        more stuff
      </template>
    </ProjectComponent>
    -->
  </div>
</template>

<script setup>
  import Header from '@/components/Header.vue'
  import ProjectComponent from '@/components/ProjectComponent.vue'

  const links = [
    {
      "name": "Cluster Topology",
      "route": "/infra/topology",
    },
    {
      "name": "Nomad Cluster",
      "route": "/infra/nomad",

    },
    {
      "name": "GHA Autoscaler",
      "route": "/infra/gha",

    },
    {
      "name": "Resume & this Website",
      "route": "/infra/resume",

    },
  ]
</script>

<style scoped>
  .row {
    border-top: 1px solid grey;
  }

  .infra {
    height: 100vh;
  }

  .fade-enter-active, .fade-leave-active, .fade-move {
    transition: all 800ms;
    opacity: 1;
  }
  .fade-enter-from, .fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
    opacity: 0;
    transform: translateX(80px);
  }

  svg text {
    text-anchor: middle;
    dominant-baseline: middle;
  }
</style>
