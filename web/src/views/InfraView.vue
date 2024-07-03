<template>
  <div>
    <h1>Infra overview</h1>
    <ProjectComponent projectName="Nomad Structure">
      <template #default>
        <p>Blurb about the general layout and structure of the nomad cluster</p>
        <ul>
          <li>Stuff about the worker constraints</li>
          <li>Stuff about the jobs deployed</li>
            <ul>
              <li>CNI plugin</li>
              <li>autoscaler</li>
              <li>batch GHA job</li>
              <li>this webserver</li>
            </ul>
          <li>Vault + consul + traefik</li>
        </ul>
        <h4>Include bit here about stuff I'd change</h4>
        <ul>
          <li>Yes I know about a load balancer, but $$$</li>
          <li>Yes I know about central logging, but 4 machines</li>
          <li>Yes I know about NAT gateways</li>
          <li>With time Vault would do X, Y, Z</li>
        </ul>
        <a href="https://github.com/rubber-duckie-chainsaws/IAC">IAC</a>
        <br />
        <a href="https://github.com/rubber-duckie-chainsaws/tf-catalog">TF catalog</a>
        <br />
        <a href="https://github.com/rubber-duckie-chainsaws/tf-primitives">Underlying TF modules</a>
        <br />
        <a href="https://github.com/rubber-duckie-chainsaws/provisioning">Nomad/ansible/packer</a>
      </template>
      <template #visualization>
        <MermaidComponent>
          flowchart BT
            subgraph AWS
                subgraph Leaders
                    nomad1[Nomad Server]
                    consul1[Consul Server]
                end
                subgraph public[Public]
                    consul3[Consul Agent]
                    nomad3[Nomad Agent]
                    nat[Nat Gateway]
                    traefik[Traefik LB]
                    wireguard1[Wireguard VPN]
                end
                subgraph secrets[Secrets]
                    vault[Vault Server]
                end
                subgraph asg1[ASG]
                    subgraph worker[Worker]
                        consul2[Consul Agent]
                        nomad2[Nomad Agent]
                        services[Nomad Jobs]
                    end
                end
                subgraph asg2[ASG - Spot instance]
                    subgraph build[Build]
                        consul4[Consul Agent]
                        nomad4[Nomad Agent]
                        gha[Github Actions]
                    end
                end
            end
            subgraph home[Home]
                subgraph workerhome[Worker]
                    consul5[Consul Agent]
                    nomad5[Nomad Agent]
                    services2[Nomad Jobs]
                    wireguard2[Wireguard VPN]<-->wireguard1
                end
                subgraph client[Me]
                    vim
                    nomad6[Nomad cli]
                    terraform[Terraform]
                    git
                end
            end
        </MermaidComponent>
      </template>
    </ProjectComponent>
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
  </div>
</template>

<script setup>
  import ProjectComponent from '@/components/ProjectComponent.vue'
  import MermaidComponent from '@/components/MermaidComponent.vue'
</script>

<style scoped>
  .row {
    border-top: 1px solid grey;
  }
</style>
