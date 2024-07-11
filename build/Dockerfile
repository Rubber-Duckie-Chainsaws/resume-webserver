FROM golang:1.22-alpine as go

WORKDIR /src
COPY cmd /src/cmd

RUN go build -o /src/webserver cmd/main.go

FROM node:lts AS node

RUN mkdir /app
WORKDIR /app
COPY web/package.json /app/package.json

RUN npm i

COPY web/vite.config.js /app/vite.config.js
COPY web/public /app/public
COPY web/src /app/src

RUN npm run build

FROM alpine
WORKDIR /app
COPY --from=go /src/webserver /app/webserver
COPY --from=node /app/dist /app/dist
COPY web/index.html /app/index.html

ENV PORT=3000
ENV DEPLOY_ENV="DEVELOPMENT"
ENV ROOT="/app"

CMD ["/app/webserver"]
