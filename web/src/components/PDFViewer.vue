<template>
  <div ref="canvasWrapper" class="position-relative canvasWrapper">
    <nav class="w-100 navbar navbar-expand-sm bg-body-secondary interface">
      <button class="btn btn-primary" @click="prevPage">
        Back
        <i class="bi bi-arrow-left"></i>
      </button>
      <p class="navbar-text">{{ currentPage }} of {{ totalPages }}</p>
      <button class="btn btn-primary" @click="nextPage">
        <i class="bi bi-arrow-right"></i>
        Next
      </button>
    </nav>
    <canvas class="w-100 h-100" ref="pdfCanvas"></canvas>
  </div>
</template>

<script setup>
  const props = defineProps({
    url: String
  })

  import { ref, onMounted, onUnmounted, watch } from "vue"
  import * as pdfjsLib from "pdfjs-dist"
  import "pdfjs-dist/build/pdf.worker"

  const pdfCanvas = ref(null)
  const canvasWrapper = ref(null)
  let pdf = null
  const currentPage = ref(1)
  const totalPages = ref(0)

  const resizeObserver = new ResizeObserver(() => {
    console.log("Resize observered")
    getPage()
  })

  onMounted(() => {
    const loadingTask = pdfjsLib.getDocument(props.url)
    loadingTask.promise.then(handlePdf)
  })

  onUnmounted(() => {
    resizeObserver.disconnect()
  })

  watch(currentPage, getPage)

  function nextPage() {
    if (currentPage.value < totalPages.value) {
      currentPage.value += 1
    }
  }

  function prevPage() {
    if (currentPage.value > 1) {
      currentPage.value -= 1
    }
  }


  function handlePage(page) {
    var desiredWidth = canvasWrapper.value.clientWidth
    var viewport = page.getViewport({ scale: 1, });
    var scale = desiredWidth / viewport.width;
    var scaledViewport = page.getViewport({ scale: scale, });

    //const viewport = page.getViewport({scale: pdfCanvas.value.width / page.getViewport({scale: 1}).width});
    //const outputScale = window.devicePixelRatio || 1
    const outputScale = 1

    const context = pdfCanvas.value.getContext('2d')

    pdfCanvas.value.width = Math.floor(scaledViewport.width * outputScale)
    pdfCanvas.value.height = Math.floor(scaledViewport.height * outputScale)
    pdfCanvas.value.style.width = Math.floor(scaledViewport.width) + "px"
    pdfCanvas.value.style.height = Math.floor(scaledViewport.height) + "px"

    const transform = outputScale !== 1
      ? [outputScale, 0, 0, outputScale, 0, 0]
      : null

    const renderContext = {
      canvasContext: context,
      transform: transform,
      viewport: scaledViewport
    }
    page.render(renderContext)
  }

  function getPage() {
    pdf.getPage(currentPage.value).then(handlePage)
  }

  function handlePdf(loadedPdf) {
    pdf = loadedPdf
    totalPages.value = pdf.numPages
    currentPage.value = 1
    getPage()
    resizeObserver.observe(canvasWrapper.value)
  }
</script>

<style scoped>
.interface {
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}

.canvasWrapper {
  position: relative;
}

.canvasWrapper:hover .interface {
  display: flex;
  justify-content: space-between
}
</style>
