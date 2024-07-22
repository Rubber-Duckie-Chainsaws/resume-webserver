<template>
  <td>{{ themePart.name }}</td>
  <transition name="slide">
  <td v-show="hovering">{{ themePart.description }}</td>
  </transition>
  <td>
    <div class="p-3 rounded-2 styled" :style="'background-color: var('+themePart.varName+'); border: 1px solid black;'" @click="toggle">&nbsp;</div>
    <p>#{{ themePart.colorValue }}</p>
    <Popover ref="colorpicker">
      <div class="bg-light">
        <ColorPicker v-model="themePart.colorValue" @change="updateColor" inline />
      </div>
    </popover>
  </td>
</template>

<script setup>
  import { ref, watch, onMounted } from 'vue'
  import Popover from 'primevue/popover'
  import ColorPicker from 'primevue/colorpicker'
  import * as R from 'ramda'

  const props = defineProps(['hovering'])

  onMounted(() => {
    watch(themePart.value, () => {
      updateColor()
    })
  })

  const colorpicker = ref()

  function toggle(e) {
    colorpicker.value.toggle(e)
  }

  function hexToRgb(hex) {
    return R.map(x => parseInt(x, 16), R.splitEvery(2, hex))
  }

  function rgbToHex(r, g, b) {
    return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)
  }

  function updateColor() {
    document.documentElement.style.setProperty(themePart.value.varName, "#"+themePart.value.colorValue)
    document.documentElement.style.setProperty(themePart.value.varName+'-rgb', hexToRgb(themePart.value.colorValue))
  }

  const themePart = defineModel()
</script>

<style scoped>
  .styled {
    background-color: var(v-bind(themePart.varName));
    border: 1px solid black;
    padding: 1.2em 1.5em;
  }

  .slide-enter-active, .slide-leave-active {
    transition: opacity 800ms;
    opacity: 1;
  }
  .slide-enter, .slide-leave-to /* .slide-leave-active in <2.1.8 */ {
    transition: opacity 800ms;
    opacity: 0;
  }
</style>
