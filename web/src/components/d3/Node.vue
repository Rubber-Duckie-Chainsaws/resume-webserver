<template>
  <g @click="clicked" :class="node.children.length > 0 ? 'interactable' : 'plain'">
    <rect v-bind:style="{'fill': color}"
          class="shadow"
          x="0"
          y="0"
          :rx="4"
          :ry="4"
          :width="node.width+'px'"
          :height="node.height+'px'">
    </rect>
    <foreignObject x="0" y="0" :width="node.width+'px'" :height="node.height+'px'">
      <div>
        <h4>{{ node.name }}</h4>
        <p><em>{{ modelType }}</em></p>
        <p style="text-align: center">{{ node.description }}</p>
      </div>
    </foreignObject>
  </g>
</template>

<script setup>
  import { computed } from 'vue'
  import * as R from 'ramda'

  const props = defineProps({
    node: Object,
    color: String
  })

  const emit = defineEmits(['focus-change'])

  function clicked() {
    if (props.node.children.length > 0) {
      emit('focus-change', props.node.name, 'container')
    }
  }

  const modelType = computed(() => {
    return R.head(props.node.type).toUpperCase() + R.tail(props.node.type)
  })
</script>

<style scoped>
</style>
