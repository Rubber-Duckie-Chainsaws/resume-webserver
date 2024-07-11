<template>
  <div class="position-relative canvasWrapper">
    <nav class="position-absolute top-0 start-0 w-100 navbar navbar-expand-sm bg-body-secondary interface">
      <div class="container-fluid">
        <button class="btn btn-primary" @click="prevPage">
          <i class="bi bi-arrow-left"></i>
        </button>
        <p class="navbar-text">{{ currentPage }} of {{ totalPages }}</p>
        <button class="btn btn-primary" @click="nextPage">
          <i class="bi bi-arrow-right"></i>
        </button>
      </div>
    </nav>
    <canvas ref="pdfCanvas"></canvas>
  </div>
</template>

<script setup>
  const props = defineProps({
    url: String
  })

  import { ref, onMounted, watch } from "vue"
  import * as pdfjsLib from "pdfjs-dist"
  import "pdfjs-dist/build/pdf.worker"

  const pdfCanvas = ref(null)
  let pdf = null
  const currentPage = ref(1)
  const totalPages = ref(0)

  onMounted(() => {
    const loadingTask = pdfjsLib.getDocument(props.url)
    loadingTask.promise.then(handlePdf)
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
  }

  function getPage() {
    pdf.getPage(currentPage.value).then(handlePage)
  }

  function handlePdf(loadedPdf) {
    pdf = loadedPdf
    totalPages.value = pdf.numPages
    currentPage.value = 1
    getPage()
  }
</script>

<style scoped>
.interface {
  display: none;
}

.canvasWrapper:hover .interface {
  display: flex;
}
</style>
