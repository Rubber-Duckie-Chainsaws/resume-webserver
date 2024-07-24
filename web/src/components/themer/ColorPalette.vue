<template>
  <div>
    <div class="styled themed" @click="toggle">
        <p class="secondary" :style="{top: '-1.4em', left: '-2px', 'border-bottom-right-radius': '0.8em', 'padding-left': '1em'}" >{{ themePart.name }}</p>
      <!--<transition name="slide">
      </transition>-->
      <p class="secondary" :style="{bottom: '-1.4em', right: '-2px', 'border-top-left-radius': '0.8em', 'padding-right': '1em'}">#{{ themePart.colorValue }}</p>
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
    position: relative;
    background-color: v-bind(htmlCode);
    border: 1px solid var(--accent-background);
    padding: 3.5em 4.2em;
    border-radius: 1.4em;
    overflow: hidden;
  }

  .styled {
    & p {
      position: absolute;
      padding: 6px;
      border: 1px solid var(--accent-background);
      opacity: 1;
    }
    &:hover p{
      opacity: 0;
      transition: opacity 400ms;
    }
  }

  .slide-enter-active, .slide-leave-active {
    transition: all 800ms;
    opacity: 1;
  }
  .slide-enter, .slide-leave-to /* .slide-leave-active in <2.1.8 */ {
    transition: all 800ms;
    opacity: 0;
  }
</style>
