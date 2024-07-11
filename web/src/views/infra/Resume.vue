<template>
    <ProjectComponent projectName="Resume">
      <template #default>
        <h3>This webserver</h3>
        <ul>
          <li>Site built with vue and vite</li>
          <li>Hosted as nomad application on worker node</li>
          <li>Resume stored in s3, presented to user via presigned s3 links</li>
        </ul>
        <a href="https://github.com/rubber-duckie-chainsaws/resume-webserver" class="repo-link">Repo</a>
        <h3>The actual PDF</h3>
        <p>
          Resume's built based on directories for users
          Resume built in LaTex using <a href="https://github.com/jitinnair1/autoCV">repo as template</a>
        </p>
        <p>
          On PR closed to main:
          <ol>
            <li>use latex action</li>
            <li>Upload to s3</li>
          </ol>
        </p>
        <a href="https://github.com/rubber-duckie-chainsaws/resume" class="repo-link">Repo</a>
      </template>
    </ProjectComponent>
</template>

<script setup>
  import ProjectComponent from '@/components/ProjectComponent.vue'
  import MermaidComponent from '@/components/MermaidComponent.vue'
</script>
