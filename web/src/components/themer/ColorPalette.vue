<template>
  <div>
    <div @click="toggle">
      <swatch :canFavourite="false" :label="themePart.name" :showColor="true" :color="themePart.colorValue" />
    </div>
    <Popover ref="colorpicker">
      <div>
        <ColorPicker v-model="themePart.colorValue" @change="updateColor" inline />
        <h4>{{ themePart.description }}</h4>
      </div>
    </popover>
  </div>
</template>

<script setup>
  import { ref, watch, computed } from 'vue'
  import Popover from 'primevue/popover'
  import ColorPicker from 'primevue/colorpicker'
  import * as R from 'ramda'

  import Swatch from '@/components/themer/Swatch.vue'

  const props = defineProps(['hovering'])
  const emit = defineEmits(['colorSelected'])

  const colorpicker = ref()

  function toggle(e) {
    colorpicker.value.toggle(e)
  }

  const themePart = defineModel()

  const htmlCode = computed(() => {
    return '#'+themePart.value.colorValue
  })

  function updateColor() {
    emit('colorSelected', themePart.value.name, themePart.value.colorValue)
  }
</script>

<style scoped>
  .styled {
    min-height: 120px;
  }
</style>
