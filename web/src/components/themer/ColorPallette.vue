<template>
  <tr>
    <td>Primary</td>
    <td>The color of the main text</td>
    <td>
      <div class="p-3 rounded-2" style="background-color: var(--bs-body-color); border: 1px solid black;" @click="toggle">&nbsp;</div>
      <Popover ref="test">
        <div class="bg-light">
          <ColorPicker v-model="theme['--bs-body-color']" @change="updateColours" inline />
          <!--<input type="color" class="form-control form-control-color" @change="updateColours" v-model="theme['--bs-body-color']" ref="bs-body-color-select">-->
        </div>
      </popover>
    </td>
  </tr>
</template>

<script setup>
import Popover from 'primevue/popover'
import ColorPicker from 'primevue/colorpicker'

</script>

<style scoped>
</style>
