<template>
  <div class="styled themed swatch" @click="selectPrevious">
    <p class="secondary" v-if="label" :style="{top: '-1.4em', left: '-2px', 'border-bottom-right-radius': '0.8em', 'padding-left': '1em'}" >{{ label }}</p>
    <p class="secondary" v-if="showColor" :style="{bottom: '-1.4em', right: '-2px', 'border-top-left-radius': '0.8em', 'padding-right': '1em'}">#{{ color }}</p>
    <div v-if="canFavourite" class="favourite">
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
    label: String,
    color: String,
    favourite: Boolean,
    rounded: {
      type: Boolean,
      default: true,
    },
    canFavourite: {
      type: Boolean,
      default: true
    },
    showColor: {
      type: Boolean,
      default: false
    }
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

  const borderRadius = computed(() => {
    return prop.rounded ? "1.4em" : "0"
  })

  const htmlCode = computed(() => {
    return prop.color == "" ? "grey" : "#" + prop.color
  })
</script>

<style scoped>
  .styled {
    position: relative;
    background-color: v-bind(htmlCode);
    /*background: v-bind(background);*/
    border: 1px solid var(--accent-background);
    border-radius: v-bind(borderRadius);
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

  .swatch {
    height: 100%;
    width: 100%;
    border: 1px solid var(--accent-color);
  }

  .swatch svg {
    height: 0;
    transition: height 350ms ease-in-out;
  }

  .swatch:hover svg {
    height: 30px;
  }
/*  .styled {
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
  }*/
</style>
