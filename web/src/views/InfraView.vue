<template>
  <div>
    <nav class="navbar navbar-dark bg-dark px-4">
      <h1 class="navbar-brand">Infra overview</h1>
      <ul class="nav nav-tabs">
        <li class="nav-link active"><RouterLink to="/infra/topology">Cluster Topology</RouterLink></li>
        <li class="nav-link">Nomad Cluster</li>
        <li class="nav-link"><RouterLink to="/infra/gha">GHA Autoscaler</RouterLink></li>
        <li class="nav-link"><RouterLink to="/infra/resume">Resume &#38; this website </RouterLink></li>
      </ul>
    </nav>
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <component :is="Component" />
      </transition>
    </router-view>
    <ProjectComponent v-if="false" projectName="Nomad Structure">
      <template #default>
        <h3>Topology</h3>
        <ul>
          <li>3 leader nodes - running nomad &#38; consul</li>
          <li>Vault secret node</li>
          <li>ASG for general purpose workers</li>
          <li>Single node ASG for public ingress/NAT egress</li>
          <li>Spot Instance ASG for build workers</li>
        </ul>
        <p>In addition, home resources are joined to the cluster via wireguard VPN</p>
        <h3>Config</h3>
        <h4>Nomad</h4>
        <ul>
          <li>Traefik job</li>
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
    <ProjectComponent projectName="Discord launcher">
      <template #default>
        <h4>Status: Planning</h4>
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

  svg text {
    text-anchor: middle;
    dominant-baseline: middle;
  }
</style>
