<template>
  <div>
    <h4>{{ name }}</h4>
    <form>
      <div class="row" v-for="(subsettings, setting) in settings" style="border: 1px solid black;">
        <div class="col" style="border-right: 1px solid black;">
          <h4>{{ setting }}</h4>
        </div>
        <div class="col-10">
          <div v-for="(config, name) in subsettings">
            {{ name }}: <input type="text" v-model.number="settings[setting][name]" /><br />
            <input type="range" class="form-range" min="50" max="1000" v-model.number="settings[setting][name]" />
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
const props = defineProps({
  name: String
})
const settings = defineModel()
</script>

<style scoped>

</style>
