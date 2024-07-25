<template>
  <div class="grid-2 themed">
    <div class="resume">
      <h1>Resume</h1>
      <PDFViewer :url="url" />
    </div>
    <div class="cover-letter">
      <h1>About Me</h1>
      <p>My name is Tipene, and I am a software developer with a focus on ops, IAC and dev tooling. My passion is helping to empower my peers to be able to do their best work. Given that my core skills are not front-end or otherwise immediately self-evident, this page serves to provide <RouterLink to="/infra">a breakdown of some of the behind the scenes moving pieces</RouterLink>, with accompanying github links for those who are curious. Thank you for taking the time to view my portfolio, which I've worked hard to put together to showcase my abilities.</p>
      <p>My journey to developer tooling has been one of self-discovery, as my initial career aspirations were more in line with that of a full stack web developer. Eventually I actually got my chance on a small, 4-man dev team. It was there that the value of having someone looking after the tooling and build processes practically jumped off the page at me -- doing work that would allow devs to focus on shipping products, not fighting with how to get them into production each release. Sensing an opportunity, I dove straight in, sparking a passion for building something my colleagues could depend on, and whittling away at instability and uncertainty.</p>
      <p>Now, 7 years on, I feel I have a solid handle on building and servicing dependable build and tooling platforms. I take pride in delivering solutions tailored to easing burdens, and reducing toil. I'm not afraid to roll up my sleeves, step into the fray and get stuck in on important, yet uncelebrated work, seeing it through to keep everyone on track and chugging along. I am highly motivated to solve tricky problems, build solutions, and be a part of a dynamic team. Hopefully what you find here is enough to pique your curiosity and give you a sense of my capabilities. I believe I can bring value to you and your team, and I eagerly await hearing from you about what we might build together next.</p>
      <h3 class="text-end font-italic">Thanks,</h3>
      <h4 class="text-end">Tipene</h4>
    </div>
  </div>
</template>

<script setup>
  import { ref } from "vue"
  import PDFViewer from '@/components/PDFViewer.vue'

  const url = ref("/s3/tmoss/resume.pdf")
</script>

<style scoped>
  .grid-2 {
    height: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(520px, 1fr));
  }

  .resume {
    max-width: 800px;
    margin: 0 2em;
  }

  .cover-letter {
    & p:first-of-type:first-letter {
      -webkit-initial-letter: 2;
      initial-letter: 2;
      color: var(--bs-primary);
    }
  }

  .flex-fill {
    flex: 1 1 auto;
  }
</style>
