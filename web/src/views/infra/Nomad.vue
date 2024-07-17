<template>
  <div>
    <D3 :payload="json_data" />
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
  </div>
</template>

<script setup>
  import D3 from '@/components/D3.vue'
  import ProjectComponent from '@/components/ProjectComponent.vue'
  import MermaidComponent from '@/components/MermaidComponent.vue'

  const json_data = {
      "nodes":[
        {"name":"me", "type": "user", "width": "240", "height": "140", "x": 0, "y": 0, "description": "Me. Tipene. Hybrid developer/operator/user"},
      ],
      "links":[
      ],
      "groups":[
      ],
      "context": `# Nomad Toplogy

This is the topology map for the hybrid cloud nomad cluster I run for
my own personal edification. Mercifully there aren't too many moving pieces. Contained
herein is a birds eye view of them, as well as a bit of detail on the parts that make
them up, to give a better understanding of how it all works

## A brief rundown

* 3 leader nodes - running nomad & consul
* Vault secret node
* ASG for general purpose workers
* Single node ASG for public ingress/NAT egress
* Spot Instance ASG for build workers

In addition, home resources are joined to the cluster via wireguard VPN
  `
  }

</script>

<style scoped>

</style>
