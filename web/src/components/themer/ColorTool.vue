<template>
  <div>
    <ColorWheel @colorSelected="colorChosen" :fields="R.map(R.prop('name'), newTheme)" :size="360"></ColorWheel>
  </div>
  <div @click="tableHovering = !tableHovering" @mouseover="tableHovering = true" @mouseleave="tableHovering = false">
    {{ tableHovering }}
    <table  class="table">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Purpose</th>
          <th scope="col">Swatch</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(themePart, idx) in newTheme">
          <ColorPalette v-model="newTheme[idx]" :hovering="tableHovering">
          </ColorPalette>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
  import ColorPalette from '@/components/themer/ColorPalette.vue'
  import ColorWheel from '@/components/themer/ColorWheel.vue'

  import * as R from 'ramda'
</script>

<style scoped>
</style>
