<template>
  <div class="toolGrid">
    <div class="container">
      <canvas ref="wheel" :width="size" :height="size" style="border: 1px solid black;"></canvas>
      <canvas ref="harmonies" :width="size" :height="size"></canvas>
      <canvas ref="interaction" :width="size" :height="size" @click="handleColorSelect"></canvas>
    </div>
    <div class="previous-swatches">
      <Swatch v-for="(swatch, index) in swatchHistory" :rounded="false" :color="swatch.color" :favourite="swatch.favourite" @favourited="swatch.favourite = !swatch.favourite" @previousSelected="previousSelected" :key="index" />
    </div>
    <div class="controls">
      <Slider class="saturation" v-model="saturation" @change="saturationChange" :min=0 :max=1 :step="0.01" />
      <input @keyup.enter="selectedColor = inputColor" v-model.lazy="inputColor" />
      <div class="toggles">
        <SelectButton v-model="selectedAuxillary" :options="['monochrome', 'analogous', 'triad', 'complement', 'split']" />
      </div>
    </div>
    <div v-if="swatches" class="harmonies">
      <div v-for="(color, idx) in swatches" @click="showContext(idx, color, $event)" :key="color" >
        <Swatch :color="R.tail(color)" :canFavourite="false" :showColor="true" />
        <ContextMenu ref="menus" :model="items" />
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, computed, watch } from 'vue'
  import Knob from 'primevue/knob'
  import RadioButton from 'primevue/radiobutton'
  import SelectButton from 'primevue/selectbutton'
  import ContextMenu from 'primevue/contextmenu'
  import Slider from 'primevue/slider'
  import Swatch from '@/components/themer/Swatch.vue'
  import { rgb2hsl, hex2rgb, rgb2hex, hsl2rgb, hsl2hex, hex2hsl, toRadians, radiansToXY } from '@/composables/global.js'
  import * as R from 'ramda'

  const emit = defineEmits(['colorSelected', 'colorDesired'])
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
  const saturation = ref(0.5)
  const inputColor = ref()
  const selectedColor = ref()
  const selectedAuxillary = ref('')
  var ctx = null
  const sizePx = props.size+'px'
  const menus = ref()
  const applyingColor = ref(null)
  const previousSwatches = ref([])


  // Handlers
  function saturationChange() {
    drawCircle(segmentCount.value)
    const hsl = hex2hsl(selectedColor.value)
    const coords = radiansToXY(toRadians(hsl[0]), (2 - (2*hsl[2]))*canvasCenter.value)
    selectOnColorWheel(...coords)
  }

  function showContext(idx, swatch, event) {
    applyingColor.value = swatch
    menus.value[idx].show(event, swatch)
  }

  function handleColorSelect(event) {
    const x = event.offsetX
    const y = event.offsetY
    const coords = [x - canvasCenter.value, y - canvasCenter.value]
    selectOnColorWheel(...coords)
    clearBullseyes(harmonies)
    addToHistory(selectedColor.value)
  }

  function selectOnColorWheel(x, y) {
    const radius = Math.sqrt(x**2 + y**2)
    clearBullseyes(interaction)
    addBullseye(x, y, 12, interaction)

    const radians = Math.atan2(y, x)
    // We get back -PI >= x > PI, when we want 0 >= x > 2*PI
    const fixedRadians = radians < 0 ? 2*Math.PI + radians : radians
    const degrees = fixedRadians * (180 / Math.PI)

    const hsl = [degrees, saturation.value, (1-radius/canvasCenter.value * 0.5)]

    selectedColor.value = rgb2hex(...hsl2rgb(...hsl))
  }

  function previousSelected(color) {
    if (color == selectedColor.value) {
      console.log("Doing nothing, it's already this color")
    } else {
      const hsl = hex2hsl(color)
      const coords = radiansToXY(toRadians(hsl[0]), (2 - (2*hsl[2]))*canvasCenter.value)
      saturation.value = hsl[1]
      selectOnColorWheel(...coords)
    }
  }



  // Canvas Ops
  function clearBullseyes(targetCanvas) {
    ctx = targetCanvas.value.getContext('2d')
    ctx.clearRect(0, 0, props.size, props.size)
  }

  function addBullseye(x, y, radius, targetCanvas) {
    x = x + canvasCenter.value
    y = y + canvasCenter.value
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
      const innerColor = hsl2rgb(arc, saturation.value, 1)
      const outerColor = hsl2rgb(arc, saturation.value, 0.5)
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
  function addHue(hue, degrees) {
    return hue + degrees > 0 ? (hue + degrees) % 360 : 360 - (Math.abs(degrees) - hue)
  }

  function addToHistory(colorValue) {
    colorValue = R.tail(colorValue)
    if (R.any(R.whereEq({color: colorValue}), previousSwatches.value)) {
      return
    }
    var appending = {color: colorValue, favourite: false}
    for (var swatchIdx = 0; swatchIdx < previousSwatches.value.length; swatchIdx++) {
      const swatch = previousSwatches.value[swatchIdx]
      if (!swatch.favourite) {
        const temp = swatch
        previousSwatches.value[swatchIdx] = appending
        appending = temp
      }
    }
    previousSwatches.value = R.append(appending, previousSwatches.value)
  }

  watch(saturation, () => {
    drawCircle(segmentCount.value)
  })
  watch(selectedAuxillary, () => clearBullseyes(harmonies))


  onMounted(() => {
    drawCircle(segmentCount.value)
  })

  const items = computed(() => {
    return [
      {
        "label": "Pick color",
        command: () => {
          if (applyingColor.value != null) {
            addToHistory(applyingColor.value)
            previousSelected(applyingColor.value.slice(1))
          }
        }
      },
      {
        "label": "Save to...",
        "items": R.map((x) => ({
          label: x,
          command: () => {
            if (applyingColor.value != null) {
              addToHistory(applyingColor.value)
              emit('colorSelected', x, applyingColor.value.slice(1))
            }
          }
        }), props.fields)
      }
    ]
  })

  const canvasCenter = computed(() => {
    return props.size/2
  })

  const auxilaries = computed(() => {
    if (selectedColor.value == "" || selectedColor.value == null) {
      return [[], []]
    }
    if (selectedAuxillary == "") {
      return [[], []]
    }
    const hsl = rgb2hsl(...hex2rgb(selectedColor.value.slice(1)))
    switch(selectedAuxillary.value) {
      case "monochrome":
        const halfDist = (val, target, multi=0.5) => (Math.abs(val - target) * multi)
        const topDiff = (1 - hsl[2]) * (1.0/3.0)
        const bottomDiff = (hsl[2]-0.5) * (1.0/3.0)
        const [, lighter] = R.mapAccum((a, b) => [a+halfDist(a, 1), [hsl[0], hsl[1], a+halfDist(a, 1, 0.45)]], hsl[2], R.repeat(hsl[2], 4))
        const [, darker] = R.mapAccum((a, b) => [a-halfDist(a, 0.15), [hsl[0], hsl[1], a-halfDist(a, 0.15, 0.6)]], hsl[2], R.repeat(hsl[2], 4))
        return [R.reverse(lighter), darker]
        break;
      case "analogous":
        var leftAnalogue = R.map((x) => [addHue(hsl[0], (-1*x*22)), hsl[1], hsl[2]], R.range(1, 3))
        var rightAnalogue = R.map((x) => [addHue(hsl[0], (x*22)), hsl[1], hsl[2]], R.range(1, 3))
        return [R.reverse(leftAnalogue), rightAnalogue]
        break;
      case "triad":
        var leftAnalogue = [addHue(hsl[0], -120), hsl[1], hsl[2]]
        var rightAnalogue = [addHue(hsl[0], 120), hsl[1], hsl[2]]
        return [[leftAnalogue], [rightAnalogue]]
        break;
      case "complement":
        const complement = [addHue(hsl[0], 180), hsl[1], hsl[2]]
        return [[], [complement]]
        break;
      case "split":
        const leftComplement = [addHue(hsl[0], 150), hsl[1], hsl[2]]
        const rightComplement = [addHue(hsl[0], 210), hsl[1], hsl[2]]
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
    if (interaction.value) {
      if (auxilaries.value.length > 0) {
        const targets = R.unnest(auxilaries.value)
        clearBullseyes(harmonies)
        for (var i = 0; i < targets.length; i++) {
          const hsl = targets[i]
          const coords = radiansToXY(toRadians(hsl[0]), (2 - (2*hsl[2]))*canvasCenter.value)
          addBullseye(coords[0], coords[1], 8, harmonies)
        }
        return R.reduce(R.concat, [], [R.map(hsl2hex, auxilaries.value[0]), [selectedColor.value], R.map(hsl2hex, auxilaries.value[1])])
      } else {
        return [selectedColor.value]
      }
    }
  })

  const swatchHistory = computed(() => {
    return R.slice(0, 8, R.concat(previousSwatches.value, R.repeat({color: "", favourite: false}, 8)))
  })

  const toolGridSize = computed(() => {
    return props.size + "px";
  })
</script>

<style scoped>
  .container {
    position: relative;
    margin: auto;
    height: v-bind(sizePx);
    width: v-bind(sizePx);
    grid-column: span 2;
  }

  .toolGrid {
    display: contents;
  }

  .previous-swatches {
    display: grid;
    grid-column: span 2;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(2, minmax(120px, 1fr));
    grid-gap: 20px;
  }

  .controls {
    grid-column: span 2;
    display: grid;
    grid-template-columns: repeat(3, 1fr);

    & .saturation {
      grid-column: span 2;
    }
  }

  .toggles {
    grid-column: span 2;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @container (min-width: 590px) {
    .container {
      margin: 0;
    }

    .previous-swatches {
      grid-column: span 1;
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: repeat(4, 1fr);
    }

    .controls {
      grid-column: span 3;
    }

    .toggles {
      grid-column: span 3;
    }

    .harmonies {
      grid-column: span 3;
    }
  }

  @container (min-width: 780px) {
  }

  .harmonies {
    grid-column: span 3;
    grid-row: span 2;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
    grid-gap: 10px;
    min-height: 360px;
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
