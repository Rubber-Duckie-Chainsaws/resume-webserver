<template>
    <ProjectComponent projectName="GHA Autoscaling">
      <template #default>
        <ol>
          <li>On qualifying GHA event submit webhook to nomad-gha-autoscaler api</li>
          <li>After confirming webhook secret, submit celery chain signature to start new build instance</li>
          <li>nomad-gha-autoscaler worker picks up job from queue and:
            <ol>
              <li>Requests a new instance via aws autoscaling cmd</li>
              <li>Requests a new GHA runner registration token from github via REST api</li>
              <li>Submit a new batch job to nomad with build as the role constraint</li>
            </ol>
          </li>
          <li>Nomad batch job:
            <ol>
              <li>Registers ephemeral GHA runner ready to accept GHA workflow</li>
              <li>Creates poststart job to make the node as ineligible (so it won't be scheduled for another GHA action once this one is done)</li>
              <li>Creates a poststop job to aws autoscaling terminate the instance once the workflow job exits (whether successful or not)</li>
            </ol>
          </li>
        </ol>
        <a href="https://github.com/rubber-duckie-chainsaws/nomad-gha-autoscaler">auto scaler</a>
      </template>
      <template #visualization>
        <MermaidComponent>
          sequenceDiagram
          box Github.com
            participant repo
            participant Github
          end
          link repo: Repo @ https://github.com/Rubber-Duckie-Chainsaws/resume
          repo->>Github: PR
          activate repo
          box Nomad Autoscaler
            participant api
            participant worker
          end
          link api: Repo @ https://github.com/Rubber-Duckie-Chainsaws/nomad-gha-autoscaler/tree/main/api
          link worker: Repo @ https://github.com/Rubber-Duckie-Chainsaws/nomad-gha-autoscaler/tree/main/worker
          link worker: Celery @ https://github.com/Rubber-Duckie-Chainsaws/nomad-gha-autoscaler/tree/main/worker
          Github->>api: Webhook() nomad-gha-autoscaler
          destroy api
          api->>+worker: Celery dispatch
          par
            create participant EC2
            worker->>+EC2: aws autoscaling set-desired-capacity
            EC2-->>EC2: Scale up beings
            EC2-->>worker: 200 OK
          and
            worker->>Github: /v1/repo/token
            Github-->>worker: {token: ...}
          and
            create participant Nomad
            worker-->>Nomad: /v1/job/dispatch
            destroy worker
            Nomad-->>worker: 200 OK
          end
          Nomad-->>Nomad: wait for instance availability
          create participant build-instance
          EC2--)-build-instance: Becomes avaialble
          link build-instance: think @ https://google.com
          destroy Nomad
          Nomad->>build-instance: Start GHA job
          build-instance->>Github: Register GHA worker
          Github->>build-instance: workflow
          build-instance-->>build-instance: Run workflow
          build-instance->>Github: Result
          destroy build-instance
          build-instance->>+EC2: aws autoscaling terminate-instance-in-auto-scaling-group
          EC2-->>EC2: Process destruction
          Github->>repo: PR check pass/fail
          deactivate repo
        </MermaidComponent>
      </template>
    </ProjectComponent>
</template>

<script setup>
  import ProjectComponent from '@/components/ProjectComponent.vue'
  import MermaidComponent from '@/components/MermaidComponent.vue'
</script>

<style scoped>

</style>
