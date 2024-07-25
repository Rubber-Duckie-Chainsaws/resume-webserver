<template>
  <div class="responsive-wrapper">
    <div class="responsive-container">
      <h3>Theme Selector</h3>
      <div class="grid">
        <Select class="theme-picker" v-model="chosen" :options="themes.availableThemes" placeholder="Select a theme" @change="loadTheme" />
        <SplitButton label="Reload" @click="reloadColors" :model="saveList" />
        <Dialog v-model:visible="saving" modal header="Save new template...">
          <div>
            <h3>Theme Name</h3>
            <input v-model="themeName" />
            <h3>Theme Description</h3>
            <input v-model="themeDescription" />
            <button @click="cancelSave">Cancel</button>
            <button @click="sendTheme">Save</button>
          </div>
        </Dialog>
        <ColorWheel @colorSelected="colorChosen" :fields="R.map(R.prop('name'), currentTheme)" :size="canvasSize"></ColorWheel>
        <div class="color-palette">
          <div style="margin: 0.8em 3px;" v-for="(themePart, idx) in currentTheme">
            <ColorPalette v-model="currentTheme[idx]" @colorSelected="colorChosen" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import ColorPalette from '@/components/themer/ColorPalette.vue'
  import ColorWheel from '@/components/themer/ColorWheel.vue'
  import SplitButton from 'primevue/splitbutton'
  import Select from 'primevue/select'
  import Dialog from 'primevue/dialog'
  import * as R from 'ramda'

  import { useThemeStore } from '@/stores/theme'

  const themes = useThemeStore()
  const { chosen, currentTheme } = storeToRefs(themes)
  const themeName = ref("")
  const themeDescription = ref("")
  const canvasSize = ref(360)
  const saving = ref(false)

  const saveList = [
    {
      label: "Save",
      command: () => {
        themes.submitTheme(chosen.value, "", true)
      }
    },
    {
      label: "Save as new...",
      command: () => {
        saving.value = true
      }
    },
  ]

  function colorChosen(name, colorValue) {
    themes.updateColor(name, colorValue)
  }

  function cancelSave() {
    saving.value = false
    themeName.value = ""
    themeDescription.value = ""
  }

  function loadTheme() {
    themes.fetchTheme(chosen.value)
  }

  function sendTheme() {
    if (themeName.value != "" && themeDescription.value != "") {
      themes.submitTheme(themeName.value, themeDescription.value)
    } else {
      console.log("Add toast here")
    }
    saving = false
  }

  function reloadColors() {
    themes.changeTheme(chosen.value)
  }

  onMounted(() => {
    themes.fetchAvailable()
  })

  const gridSize = computed(() => {
    return (canvasSize.value / 2) + "px"
  })

  const maxSize = computed(() => {
    return ((canvasSize.value * 2) + 80) + "px" // 4 columns, based on the canvas size + gutters/padding
  })
</script>

<style scoped>
  .responsive-wrapper {
    width: 100%;
    max-width: v-bind(maxSize);
  }

  .responsive-container {
  }

  .grid {
    margin: 0.8em;
    display: grid;
    grid-template-columns: repeat(2, minmax(v-bind(gridSize), 1fr));
    grid-gap: 10px;
    grid-auto-flow: row dense;
  }

  .color-palette {
    grid-column: span 2;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    grid-gap: 10px;
  }

  @media only screen and (min-width: 1200px) {
    .responsive-container {
      container-type: inline-size;
    }
  }

  @container (min-width: 590px) {
    .grid {
      grid-template-columns: repeat(3, minmax(v-bind(gridSize), 1fr));
    }

    .theme-picker {
      grid-column: span 2;
    }

    .color-palette {
      grid-column: span 3;
    }
  }

  @container (min-width: 780px) {
    .grid {
      grid-template-columns: repeat(4, minmax(v-bind(gridSize), 1fr));
    }

    .theme-picker {
      grid-column: span 3;
    }

    .grid-4 {
      grid-column: span 4;
    }

    .color-palette {
      grid-column: span 1;
      grid-row: span 6;
    }
  }
</style>
