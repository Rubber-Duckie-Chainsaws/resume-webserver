<template>
  <div class="swatch" @click="selectPrevious">
    <div class="favourite">
      <svg
        @click.stop="toggleFavourite"
        v-if="color != ''"
        width="30px"
        height="30px">
          <circle
              stroke="red"
              :fill="favourite ? 'green' : 'none'"
              cx=15
              cy=15
              r=15></circle>
      </svg>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue'
  import { toRadians, radiansToXY } from '@/composables/global.js'

  const prop = defineProps({
    color: String,
    favourite: Boolean
  })
  const emit = defineEmits(["previousSelected", "favourited"])

  const favourited = ref(false)

  function toggleFavourite() {
    emit("favourited")
  }

  function selectPrevious() {
    if (prop.color != "") {
      emit("previousSelected", prop.color)
    } else {
      console.log("Can't click an empty swatch")
    }
  }

  const background = computed(() => {
    return prop.color == "" ? "grey" : prop.color
  })
</script>

<style scoped>
  .swatch {
    border: 1px solid var(--accent-color);
    background: v-bind(background);
  }

  .swatch svg {
    height: 0;
    transition: height 350ms ease-in-out;
  }

  .swatch:hover svg {
    height: 30px;
  }
</style>
