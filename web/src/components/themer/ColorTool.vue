<template>
  <div class="grid">
    <div class="selector">
      <h3>Theme Selector</h3>
      <Select v-model="selectedTheme" :options="themes.availableThemes" placeholder="Select a theme" @change="loadTheme" />
      <input v-model="themeName" />
      <input v-model="themeDescription" />
      <button @click="sendTheme">Save</button>
    </div>
    <div>
      <ColorWheel @colorSelected="colorChosen" :fields="R.map(R.prop('name'), currentTheme)" :size="360"></ColorWheel>
    </div>
    <div>
      <div style="margin: 0.8em 3px;" v-for="(themePart, idx) in currentTheme">
        <ColorPalette v-model="currentTheme[idx]" @colorSelected="colorChosen">
        </ColorPalette>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { storeToRefs } from 'pinia'
  import ColorPalette from '@/components/themer/ColorPalette.vue'
  import ColorWheel from '@/components/themer/ColorWheel.vue'
  import Select from 'primevue/select'
  import * as R from 'ramda'

  import { useThemeStore } from '@/stores/theme'

  const themes = useThemeStore()
  const { currentTheme } = storeToRefs(themes)
  const selectedTheme = ref("")
  const themeName = ref("")
  const themeDescription = ref("")

  function colorChosen(name, colorValue) {
    themes.updateColor(name, colorValue)
  }

  function loadTheme() {
    themes.fetchTheme(selectedTheme.value)
  }

  function sendTheme() {
    themes.submitTheme(themeName.value, themeDescription.value)
  }

  onMounted(() => {
    themes.fetchAvailable()
  })
</script>

<style scoped>
  .grid {
    display: grid;
    grid-template-columns: 2fr;
  }

  .selector {
    grid-column: span 2;
    padding: 1em;
  }
</style>
