<template>
  <div>
    <D3 :payload="json_data" />
  </div>
</template>

<script setup>
  import D3 from '@/components/D3.vue'

  const json_data = {
      "nodes":[
        {"name":"me", "type": "user", "width": "240", "height": "140", "x": 0, "y": 0, "description": "Me. Tipene. Hybrid developer/operator/user"},
        {"name": "customers", "type": "user", "width": "240", "height": "140", "x": 0, "y": 0, "description": "Public users ingressing through the traefik public node"},
        {"name": "opeators", "type": "user", "width": "240", "height": "140", "x": 0, "y": 0, "description": "Admin users who operate and maintain the cluster"},
        {"name": "leader", "type": "system", "width": "240", "height": "140", "x": 0, "y": 0, "description": "Consul and nomad server that orchestrate and administrate the entire system", "context": `# Leader ASG
The leader nodes sit together at the top of the cluster. They live in an ASG of 3, occupy their own VPC with only the vault singleton node, have their own AMI, and in general orchestrate and keep the whole system working.`},
        {"name": "public", "type": "system", "width": "240", "height": "140", "x": 0, "y": 0, "description": "Singleton node that stands in for load balancer and NAT gateway"},
        {"name": "worker", "type": "system", "width": "240", "height": "140", "x": 0, "y": 0, "description": "General purpose worker to run nomad workloads"},
        {"name": "build", "type": "system", "width": "240", "height": "140", "x": 0, "y": 0, "description": "Build specific spot instance nodes for hosting GHA jobs on. Ephemeral"},
        {"name": "private", "type": "system", "width": "240", "height": "140", "x": 0, "y": 0, "description": "Personal machines running from home to bolster cluster capacity"},
        {"name":"nomad", "type": "container", "parent": "leader", "width": "240", "height": "140", "x": 0, "y": 0, "description": "The orchestration service for making it all work"},
        {"name":"consul", "type": "container", "parent": "leader", "width": "240", "height": "140", "x": 0, "y": 0},
        {"name":"consul1", "type": "container", "parent": "leader", "width": "240", "height": "140", "x": 0, "y": 0},
        {"name":"consul2", "type": "container", "parent": "leader", "width": "240", "height": "140", "x": 0, "y": 0},
        {"name":"consul3", "type": "container", "parent": "leader", "width": "240", "height": "140", "x": 0, "y": 0},
        {"name":"consul4", "type": "container", "parent": "leader", "width": "240", "height": "140", "x": 0, "y": 0},
        {"name":"consul5", "type": "container", "parent": "leader", "width": "240", "height": "140", "x": 0, "y": 0},
        {"name":"consul6", "type": "container", "parent": "leader", "width": "240", "height": "140", "x": 0, "y": 0},
        {"name":"consul11", "type": "container", "parent": "leader", "width": "240", "height": "140", "x": 0, "y": 0},
        {"name":"consul12", "type": "container", "parent": "leader", "width": "240", "height": "140", "x": 0, "y": 0},
        {"name":"consul13", "type": "container", "parent": "leader", "width": "240", "height": "140", "x": 0, "y": 0},
        {"name":"consul14", "type": "container", "parent": "leader", "width": "240", "height": "140", "x": 0, "y": 0},
        {"name":"consul15", "type": "container", "parent": "leader", "width": "240", "height": "140", "x": 0, "y": 0},
        {"name":"consul16", "type": "container", "parent": "leader", "width": "240", "height": "140", "x": 0, "y": 0},
        {"name":"vault", "type": "container", "width": "240", "height": "140", "x": 0, "y": 0},
        {"name":"wireguard", "type": "container", "parent": "public", "width": "240", "height": "140", "x": 0, "y": 0, "description": "VPN for creating tunnel network between cloud and home resources", "context": "We use wireguard to join home cluster resources (currently just my old laptop but hopefully soon more compute resources) into the nomad cluster. We don't use an overlay network for simplicity, instead just advertising the available subnets to one another and allowing the VPN to NAT between them"},
        {"name":"NAT/Gateway", "type": "container", "parent": "public", "width": "240", "height": "140", "x": 0, "y": 0, "description": "Internet Gateway/NAT access for the rest of the cluster to the greater internet", "context": "Following AWS's decision to bill each public IP address (and because it's sound business practice), the cluster was migrated from the default AWS VPC into a new VPC which didn't default to public IPs in public subnets. The public node now sits as the only know directly addressable. As a result in addition to it's other duties, it acts as a internet gateway for the other nodes to fetch updates, or download assets (docker images, typically). Budgeting constraints were really the only reason this was selected over a vendored internet gateway from AWS directly"},
        {"name": "traefik", "type": "container", "parent": "public", "width": "240", "height": "140", "x": 0, "y": 0, "description": "Load balancer and cert manager"},
        {"name": "rabbit", "type": "component", "width": "240", "height": "140", "x": 0, "y": 0, "description": "Message Queue for GHA autoscheduler"},
        {"name": "webhook", "type": "component", "width": "240", "height": "140", "x": 0, "y": 0, "description": "HTTP Webhook receiver for github GHA build triggers"},
      ],
      "links":[
        {"source": "me", "target": "nomad", "verb": "uses"},
        {"source": "customers", "target": "traefik", "verb": "visits"},
        {"source": "nomad", "target": "worker", "verb": "provisions"},
        {"source": "nomad", "target": "public", "verb": "provisions"},
        {"source": "nomad", "target": "private", "verb": "provisions"},
        {"source": "worker", "target": "NAT/Gateway", "verb": "communicates"},
        {"source": "build", "target": "NAT/Gateway", "verb": "communicates"},
        {"source": "leader", "target": "NAT/Gateway", "verb": "communicates"},
        {"source": "webhook", "target": "rabbit", "verb": "queues request"},
      ],
      "groups":[
        {"name": "aws", "members": ["public", "worker", "build"]},
        {"name": "home", "members": ["private"]}
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
