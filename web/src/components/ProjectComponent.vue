<template>
  <div class="row">
    <header>
      <h2>{{ projectName }}</h2>
    </header>
    <div class="col">
      <slot>Project Details</slot>
    </div>
    <div class="col" v-if="$slots.visualization">
      <slot name="visualization"></slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['projectName'])
import { ref, onMounted } from 'vue'
</script>

<style scoped>

</style>
