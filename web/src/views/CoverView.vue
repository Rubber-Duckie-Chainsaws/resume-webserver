<template>
  <div class="row min-vh-100 h-100">
    <div class="col-lg col-sm-8 d-flex flex-column pb-2 order-sm-2 order-lg-1">
      <h1>Resume</h1>
      <PDFViewer :url="url" />
      <!--<div class="embed-responsive flex-fill">
        <embed src="https://rdc-resume-content-20240619063922322800000001.s3.amazonaws.com/tmoss/resume.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAWKF6C3BJKRQD2X5U%2F20240709%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240709T134229Z&X-Amz-Expires=259200&X-Amz-SignedHeaders=host&X-Amz-Signature=62815c9dbe53166cf6aa82c131e207e81d259a3ea718da9db03d257503568e6c" type="application/pdf" width="100%" height="90%"/>
      </div>-->
    </div>
    <div class="col-lg col-sm-8 cover-letter order-sm-1 order-lg-2">
      <h1>About Me</h1>
      <p>My name is Tipene, and I am a software developer with a focus on ops, IAC and dev tooling. My passion is helping to empower my peers to be able to do their best work. Given that my core skills are not front-end or otherwise immediately self-evident, this page serves to provide <RouterLink to="/infra">a breakdown of some of the behind the scenes moving pieces</RouterLink> with accompanying github links for those who are curious. Thank you for taking the time to view my portfolio, which I've worked hard to put together to showcase my abilities.</p>
      <p>My journey to developer tooling has been one of self-discovery, as my initial career aspirations were more in line with that of a full stack web developer. Eventually I actually got my chance on a small, 4-man dev team. It was there the value of having someone looking after the tooling and build processes practically jumped off the page at me, allowing devs to focus on shipping products, and not fighting with how to get it out into production each release. Sensing an opportunity I dove straight in, sparking a passion for building something my colleagues could depend on, and whittling away at instability and uncertainty.</p>
      <p>Now, 7 years on, I feel I have a solid handle on building and servicing dependanble build and tooling platforms, taking pride in my work and delivering solutions tailored to easing burdens, and reducing toil. I'm not afraid to roll up my sleeves, step into the fray and get stuck in on important, yet uncelebrated work, seeing it through to keep everyone on track and chugging along. I am highly motivated to solve tricky problems, build solutions, and be a part of a dynamic team. Hopefully what you find here is enough to pique your curiosity and give you a sense of my capabilities. I believe I can bring value to you and your team, and I eagerly await hearing from you about what we might build together next.</p>
      <h3 class="text-end font-italic">Thanks,</h3>
      <h4 class="text-end">Tipene</h4>
    </div>
  </div>
</template>

<script setup>
  import { ref } from "vue"
  import PDFViewer from '@/components/PDFViewer.vue'

  const url = ref("https://rdc-resume-content-20240619063922322800000001.s3.amazonaws.com/tmoss/resume.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAWKF6C3BJKRQD2X5U%2F20240709%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240709T134229Z&X-Amz-Expires=259200&X-Amz-SignedHeaders=host&X-Amz-Signature=62815c9dbe53166cf6aa82c131e207e81d259a3ea718da9db03d257503568e6c")
</script>

<style scoped>
  .cover-letter {
    & p:first-of-type:first-letter {
      -webkit-initial-letter: 2;
      initial-letter: 2;
      color: #660033;
    }
  }

  .flex-fill {
    flex: 1 1 auto;
  }
</style>
