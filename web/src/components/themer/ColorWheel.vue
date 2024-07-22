<template>
  <div>
    <div class="toolGrid">
      <div class="container">
        <canvas ref="wheel" :width="size" :height="size" style="border: 1px solid black;"></canvas>
        <canvas ref="harmonies" :width="size" :height="size"></canvas>
        <canvas ref="interaction" :width="size" :height="size" @click="handleColorSelect"></canvas>
      </div>
      <div class="swatches">
        <div class="col types">
          <h3>Stuff</h3>
          <div style="display: flex; flex-direction: column">
            <div>
              <RadioButton v-model="selectedAuxillary" @click="changeAuxillary" inputId="aux1" name="mono" value="monochrome" />
              <label for="aux1">Monochrome</label>
            </div>
            <div>
              <RadioButton v-model="selectedAuxillary" @click="changeAuxillary" inputId="aux2" name="analogous" value="analogous" />
              <label for="aux2">Analogous</label>
            </div>
            <div>
              <RadioButton v-model="selectedAuxillary" @click="changeAuxillary" inputId="aux3" name="triad" value="triad" />
              <label for="aux4">Triad</label>
            </div>
            <div>
              <RadioButton v-model="selectedAuxillary" @click="changeAuxillary" inputId="aux4" name="complement" value="complement" />
              <label for="aux3">Complementary</label>
            </div>
            <div>
              <RadioButton v-model="selectedAuxillary" @click="changeAuxillary" inputId="aux5" name="analog" value="split" />
              <label for="aux5">Split Complementary</label>
            </div>
          </div>
        </div>
        <div class="col display">
          <TransitionGroup v-if="swatches" name="swatches" tag="div">
            <div v-for="(swatch, idx) in swatches" @contextmenu="showContext(idx, swatch, $event)" :key="swatch" :style="{ margin: '10px', padding: '3em', background: swatch, border: '1px solid black' }">
              {{ swatch }}
              <ContextMenu ref="menus" :model="items" />
            </div>
          </TransitionGroup>
        </div>
      </div>
      <div class="controls">
        <Slider v-model="luminosity" @change="luminosityChange" :min=0 :max=1 :step="0.01" />
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, computed, watch } from 'vue'
  import Knob from 'primevue/knob'
  import RadioButton from 'primevue/radiobutton'
  import ContextMenu from 'primevue/contextmenu'
  import Slider from 'primevue/slider'
  import { rgb2hsl, hex2rgb, rgb2hex, hsl2rgb, hsl2hex } from '@/composables/global.js'
  import * as R from 'ramda'

  const emits = defineEmits(['colorSelected'])
  const props = defineProps({
    size: Number,
    fields: Array
  })

  //canvas references
  // We want to wipe them clean at certain times so they have been split into 3 layers
  const wheel = ref()
  const harmonies = ref()
  const interaction = ref()


  const segmentCount = ref(360)
  const luminosity = ref(0.5)
  const selectedColor = ref()
  const selectedAuxillary = ref('monochrome')
  var ctx = null
  const sizePx = props.size+'px'
  const menus = ref()
  const applyingColor = ref(null)



  // Handlers
  function luminosityChange() {
    drawCircle(segmentCount.value)
  }

  function showContext(idx, swatch, event) {
    applyingColor.value = swatch
    menus.value[idx].show(event)
  }

  function changeAuxillary() {
    clearBullseyes(harmonies)
  }

  function handleColorSelect(event) {
    const x = event.offsetX
    const y = event.offsetY
    const fixedX = x - (props.size / 2)
    const fixedY = y - (props.size / 2)
    const radius = Math.sqrt(fixedX**2 + fixedY**2)
    clearBullseyes(interaction)
    clearBullseyes(harmonies)
    addBullseye(x, y, 12, interaction)

    const radians = Math.atan2(fixedY, fixedX)
    const fixedRadians = radians < 0 ? 2*Math.PI + radians : radians
    const degrees = fixedRadians * (180 / Math.PI)

    selectedColor.value = rgb2hex(...R.map(R.multiply(255), hsl2rgb(degrees, radius/(props.size/2), luminosity.value)))
  }



  // Canvas Ops
  function clearBullseyes(targetCanvas) {
    ctx = targetCanvas.value.getContext('2d')
    ctx.clearRect(0, 0, props.size, props.size)
  }

  function addBullseye(x, y, radius, targetCanvas) {
    ctx = targetCanvas.value.getContext('2d')

    const outerRadius = radius
    const innerRadius = radius*0.8

    ctx.fillStyle = "white"
    ctx.moveTo(x+(outerRadius/2), y)
    ctx.beginPath()
    ctx.arc(x, y, outerRadius, toRadians(0), toRadians(360), false)
    ctx.arc(x, y, innerRadius, toRadians(360), toRadians(0), true)
    ctx.fill()
    ctx.globalAlpha = 0.2
    ctx.moveTo(x+(innerRadius/2), y)
    ctx.beginPath()
    ctx.arc(x, y, innerRadius, toRadians(360), toRadians(0), true)
    ctx.fill()
    ctx.globalAlpha = 1
  }

  function drawCircle(segments) {
    wheel.value.offscreenCanvas = document.createElement("canvas")
    wheel.value.offscreenCanvas.width = props.size
    wheel.value.offscreenCanvas.height = props.size

    ctx = wheel.value.offscreenCanvas.getContext('2d');

    const halfCircle = props.size / 2
    const outerCircle = props.size / 2
    const innerCircle = 0

    const segmentSize = 360 / segments

    for (var i = 0; i < segments; i++) {
      const arc = i * segmentSize
      const priorArc = ((i-1) * segmentSize) % 360
      const nextArc = ((i+1) * segmentSize) % 360
      const radian = toRadians(arc)
      const outerCoords = R.map(R.add(halfCircle), radiansToXY(radian, outerCircle))
      const innerCoords = R.map(R.add(halfCircle), radiansToXY(radian, innerCircle))
      const innerColor = R.map(R.multiply(255), hsl2rgb(arc, 0.05, luminosity.value))
      const outerColor = R.map(R.multiply(255), hsl2rgb(arc, 1, luminosity.value))
      //console.log("Arc: ", arc, "Next Arc: ", nextArc, "Prior Arc: ", priorArc)
      //console.log("Inner: [", innerColor[0], ", ", innerColor[1], ", ", innerColor[2], "], Outer: [",outerColor[0], ", ", outerColor[1], ", ", outerColor[2], "]")
      //console.log("Inner: [", innerCoords[0], ", ", innerCoords[1], "], Outer: [",outerCoords[0], ", ", outerCoords[1], "]")

      const gradient = ctx.createLinearGradient(innerCoords[0], innerCoords[1], outerCoords[0], outerCoords[1])
      gradient.addColorStop(0, rgb2hex(...innerColor))
      gradient.addColorStop(1, rgb2hex(...outerColor))

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(halfCircle, halfCircle, outerCircle, toRadians(priorArc), toRadians(nextArc), false)
      ctx.arc(halfCircle, halfCircle, innerCircle, toRadians(nextArc), toRadians(priorArc), true)
      ctx.fill()
      ctx.arc(halfCircle, halfCircle, innerCircle, toRadians(priorArc), toRadians(nextArc), true)
    }

    wheel.value.getContext('2d').drawImage(wheel.value.offscreenCanvas, 0, 0)
  }



  // Utility Functions
  function toRadians(degrees) {
    return (Math.PI/180)*degrees
  }

  function radiansToXY(radians, radius) {
    return [radius * Math.cos(radians), radius * Math.sin(radians)]
  }


  onMounted(() => {
    drawCircle(segmentCount.value)
    drawCircle(segmentCount.value)
  })

  const items = computed(() => {
    return R.map((x) => {
      return {
        label: x,
        command: () => {
          if (applyingColor.value != null) {
            emits('colorSelected', x, applyingColor.value)
          }
        }
      }
    }, props.fields)
  })

  const auxilaries = computed(() => {
    if (selectedColor.value == "" || selectedColor.value == null) {
      return [[], []]
    }
    if (selectedAuxillary == "") {
      return [[], []]
    }
    const hsl = rgb2hsl(...hex2rgb(selectedColor.value.slice(1)))
    console.log(hsl)
    switch(selectedAuxillary.value) {
      case "monochrome":
        const topDiff = (1 + hsl[1]) * (1.0/3.0)
        const bottomDiff = hsl[1] * (1.0/3.0)
        const lighter = [hsl[0], -1*hsl[1]+topDiff, hsl[2]]
        const lightest = [hsl[0], -1*hsl[1]+topDiff, Math.min(1, hsl[2]*1.3)]
        const darker = [hsl[0], -1*hsl[1]+bottomDiff, hsl[2]]
        const darkest = [hsl[0], -1*hsl[1]+bottomDiff, hsl[2]*0.75]
        return [[lightest, lighter], [darker, darkest]]
        break;
      case "analogous":
        var leftAnalogue = [hsl[0]-20, -1*hsl[1], hsl[2]]
        var rightAnalogue = [hsl[0]+20, -1*hsl[1], hsl[2]]
        return [[leftAnalogue], [rightAnalogue]]
        break;
      case "triad":
        var leftAnalogue = [hsl[0]-120, -1*hsl[1], hsl[2]]
        var rightAnalogue = [hsl[0]+120, -1*hsl[1], hsl[2]]
        return [[leftAnalogue], [rightAnalogue]]
        break;
      case "complement":
        const complement = [180+hsl[0], -1*hsl[1], hsl[2]]
        return [[], [complement]]
        break;
      case "split":
        const leftComplement = [150+hsl[0], -1*hsl[1], hsl[2]]
        const rightComplement = [210+hsl[0], -1*hsl[1], hsl[2]]
        return [[leftComplement], [rightComplement]]
        break;
      default:
        return []
        break;
    }
  })

  const swatches = computed(() => {
    if (selectedColor.value == "" || selectedColor.value == null) {
      return []
    }
    if (interaction.value && auxilaries.value.length > 0) {
      const targets = R.unnest(auxilaries.value)
      for (var i = 0; i < targets.length; i++) {
        const hsl = targets[i]
        const coords = radiansToXY(toRadians(hsl[0]), (props.size/2)*hsl[1])
        addBullseye(coords[0]+(props.size/2), coords[1]+(props.size/2), 8, harmonies)
      }
      return R.reduce(R.concat, [], [R.map(hsl2hex, auxilaries.value[0]), [selectedColor.value], R.map(hsl2hex, auxilaries.value[1])])
    }
  })
</script>

<style scoped>
  .container {
    position: relative;
    height: v-bind(sizePx);
    width: v-bind(sizePx);
  }

  .toolGrid {
    /*display: grid;
    grid-template-columns: 1fr 1fr;*/

    display: flex;
    flex-direction: column;
  }

  .controls {
    /*grid-column: span 2;*/
    padding: 2em;
  }

  .swatches {
    display: flex;
    width: 100%;
    & .types {
      flex: 1 0 0;
    }
    & .display {
      flex: 1 0 0;
    }
  }

  .swatches-move, /* apply transition to moving elements */
  .swatches-enter-active,
  .swatches-leave-active {
    transition: all 0.5s ease;
  }

  .swatches-enter-from,
  .swatches-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }

  .container-fill {
    min-width: v-bind(sizePx);
    min-height: v-bind(sizePx);
  }

  canvas {
    position: absolute;
  }
</style>
