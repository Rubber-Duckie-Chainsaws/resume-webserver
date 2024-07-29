<template>
  <div>
    <h3>Settings</h3>
    <div v-for="(config, key, idx) in currentTheme.configs">
      <h4>{{ key }}</h4>
      <SelectButton v-model="config.value" :options="config.options" />
    </div>
  </div>
</template>

<script setup>
  import { storeToRefs } from 'pinia'
  import { useThemeStore } from '@/stores/theme'
  import SelectButton from 'primevue/selectbutton'

  const themes = useThemeStore()

  const { currentTheme } = storeToRefs(themes)
</script>
