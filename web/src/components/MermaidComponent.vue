<template>
  <div>
    <pre class="mermaid">
      <slot>Mermaid schematic</slot>
    </pre>
  </div>
</template>

<script setup>
  const props = defineProps(['projectName'])
  import { onMounted } from 'vue'
  import mermaid from 'mermaid'

  onMounted(() => {
    mermaid.run()
  })
</script>

<style scoped>

</style>
