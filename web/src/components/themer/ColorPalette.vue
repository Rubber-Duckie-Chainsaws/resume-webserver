<template>
  <div>
    <div @click="toggle">
      <swatch :canFavourite="false" :label="themePart.name" :showColor="true" :color="themePart.colorValue" />
    </div>
    <Popover ref="colorpicker">
      <div class="popover-contents">
        <InputGroup>
          <InputGroupAddon>
            <i>#</i>
          </InputGroupAddon>
          <input @keyup.enter="hexInputted" v-model.lazy="hexCode" />
        </InputGroup>
        <ColorPicker v-model="themePart.colorValue" @change="updateColor" inline />
        <h4>{{ themePart.description }}</h4>
      </div>
    </popover>
  </div>
</template>

<script setup>
  import { ref, watch, onMounted, computed } from 'vue'
  import Popover from 'primevue/popover'
  import InputGroup from 'primevue/inputgroup'
  import InputGroupAddon from 'primevue/inputgroupaddon'
  import ColorPicker from 'primevue/colorpicker'

  import * as R from 'ramda'

  import Swatch from '@/components/themer/Swatch.vue'

  const props = defineProps(['hovering'])
  const emit = defineEmits(['colorSelected'])
  const hexCode = ref()

  const colorpicker = ref()

  function toggle(e) {
    colorpicker.value.toggle(e)
  }

  const themePart = defineModel()

  const htmlCode = computed(() => {
    return '#'+themePart.value.colorValue
  })


  onMounted(() => {
    hexCode.value = themePart.value.colorValue
  })

  function hexInputted(e) {
    themePart.value.colorValue = hexCode.value
    toggle(e)
    updateColor()
  }

  function updateColor() {
    emit('colorSelected', themePart.value.name, themePart.value.colorValue)
  }
</script>

<style scoped>
  .styled {
    min-height: 120px;
  }

  .popover-contents {
    display: flex;
    flex-flow: column nowrap;

    * {
      flex: 1 1 auto;
    }
  }
</style>
