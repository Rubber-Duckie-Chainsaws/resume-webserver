<template>
  <canvas ref="pdfCanvas"></canvas>
</template>

<script setup>
  const props = defineProps({
    url: String
  })

  import { ref, onMounted } from "vue"
  import * as pdfjsLib from "pdfjs-dist"
  import "pdfjs-dist/build/pdf.worker"

  const pdfCanvas = ref(null)

  onMounted(() => {
    const loadingTask = pdfjsLib.getDocument(props.url)
    loadingTask.promise.then(handlePdf)
  })

  function handlePdf(pdf) {
    pdf.getPage(1).then(function(page) {
      const scale = 1.5
      const viewport = page.getViewport({ scale: scale })
      const outputScale = window.devicePixelRatio || 1

      const context = pdfCanvas.value.getContext('2d')

      pdfCanvas.value.width = Math.floor(viewport.width * outputScale)
      pdfCanvas.value.height = Math.floor(viewport.height * outputScale)
      pdfCanvas.value.style.width = Math.floor(viewport.width) + "px"
      pdfCanvas.value.style.height = Math.floor(viewport.height) + "px"

      const transform = outputScale !== 1
        ? [outputScale, 0, 0, outputScale, 0, 0]
        : null

      const renderContext = {
        canvasContext: context,
        transform: transform,
        viewport: viewport
      }
      page.render(renderContext)
    })
  }
</script>

<style scoped>

</style>
