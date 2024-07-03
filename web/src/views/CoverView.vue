<template>
  <div class="row min-vh-100 h-100">
    <div class="col d-flex flex-column">
      <h1>Resume</h1>
      <div class="embed-responsive flex-fill">
        <embed src="https://rdc-resume-content-20240619063922322800000001.s3.amazonaws.com/tmoss/resume.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAWKF6C3BJKRQD2X5U%2F20240703%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240703T151156Z&X-Amz-Expires=259200&X-Amz-SignedHeaders=host&X-Amz-Signature=35f43e37e19a168ef8e607f1b372badc03cf9bc863128ec9f15b90ac03638a5e" type="application/pdf" width="100%" height="100%"/>
      </div>
    </div>
    <div class="col cover-letter">
      <h1>About Me</h1>
      <p>My name is Tipene, and I'm a software developer with a focus on ops, IAC and dev tooling. My passion is helping to empower my peers to be able to do their best work. Given that my core skillsets are not frontend or otherwise immediately self-evident, found on this page will be <RouterLink to="/infra">a breakdown of some of the behind the scenes moving pieces</RouterLink> with accompanying github links for those curious. Thank you for taking the time to view my portfolio, which I've worked hard to put together as a showcase of my capabilities.</p>
      <p>My journey to developer tooling has been one of self-discovering for me, as my initial career aspirations were more in line with that of a full stack web developer. Eventually I actually got my chance at a small 4 man dev team. It was there the value of having someone looking after the tooling and build processes practically jumped off the page at me, allowing devs to focus on shipping products, and not fighting with how to get it out into production each release. Sensing an opportunity I dove straight in, sparking a passion for building something my colleagues could depend on, and whittling away at instability and uncertainty.</p>
      <p>Now, 7 years on, I feel I have a solid handle on building ans ervicing dependanble build and tooling platforms, taking pride in my work and delivering solutions tailored to easing burdens, and reducing toil. I'm not afraid to roll up my sleeves, step into the fray and get stuck in on important, yet uncelebrated work, seeing it through to keep everyone on track and chugging along. I'm highly motivated to solve tricky problem, build solutions, and be apart of a dynamic team. Hopefully what you find here is enough to pique your curiousity and given you a sense of what I'm capable of. I believe I can bring value to you and your team, and I eagerly away hearing from you about what we might build together next.</p>
      <h3 class="text-end font-italic">Thanks,</h3>
      <h4 class="text-end">Tipene</h4>
    </div>
  </div>
</template>

<script scoped>

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
