job "resume-webserver" {
  datacenters = ["aws-NYC-1"]
  type = "service"

  constraint {
    attribute = "${node.class}"
    value = "worker"
  }

  namespace = "prod"

  group "webserver" {

    network {
      port "web" {
      }
    }

    task "vue-spa" {
      driver = "docker"

      resources {
        memory = 500
      }

      vault {}

      env {
        PORT = "${NOMAD_PORT_web}"
        DEPLOY_ENV="PRODUCTION"
      }

      template {
        data = <<EOF
S3_BUCKET={{ with secret "kv/data/default/resume-webserver/config" }}{{.Data.data.s3}}{{ end }}
        EOF

        destination = "secrets/env"
        env = true
      }

      config {
        image = "434190342226.dkr.ecr.us-east-1.amazonaws.com/resume-webserver/webserver:latest"
        ports = ["web"]
      }

      service {
        name = "portfolio"
        provider = "consul"
        tags = [
          "traefik.enable=true",
          "traefik.http.routers.resume-portfolio-https.tls=true",
          "traefik.http.routers.resume-portfolio-https.entrypoints=websecure",
          "traefik.http.routers.resume-portfolio-https.tls.certresolver=myresolver",
          "traefik.http.routers.resume-portfolio-https.tls.domains[0].main=resume.tipene.dev",
          "traefik.http.routers.resume-portfolio-https.rule=Host(`resume.tipene.dev`)",
        ]
        port = "web"
      }
    }
  }
}
