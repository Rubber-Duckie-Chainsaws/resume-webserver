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
      <div class="d-flex flex-column align-items-center">
        <h4 class="pb-0 mb-0">{{ node.name }}</h4>
        <p><em>User</em></p>
        <p style="text-align: center">{{ node.description }}</p>
      </div>
    </foreignObject>
  </g>
</template>

<script setup>
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
</script>

<style scoped>
.interactable {
  cursor: pointer;
}

.plain {
  cursor: default;
}
</style>
