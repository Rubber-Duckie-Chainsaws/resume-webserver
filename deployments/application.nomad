job "resume-webserver" {
  datacenters = ["aws-NYC-1"]
  type = "service"

  constraint {
    attribute = "${node.class}"
    value = "worker"
  }

  namespace = "prod"

  group "webserver" {

    ephemeral_disk {
      migrate = true
      size = 300
      sticky = true
    }


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
        THEME_ROOT="${NOMAD_TASK_DIR}/themes"
        ROOT = "/app"
        AWS_DEFAULT_REGION="us-east-1"
      }

      template {
        data = <<EOF
S3_BUCKET={{ with secret "kv/data/prod/resume-webserver/config" }}{{.Data.data.s3}}{{ end }}
        EOF

        destination = "secrets/env"
        env = true
      }

      config {
        image = "434190342226.dkr.ecr.us-east-1.amazonaws.com/resume-webserver/webserver:v1"
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
