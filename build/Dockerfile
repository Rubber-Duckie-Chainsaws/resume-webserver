FROM node:lastest

RUN mkdir /app
WORKDIR /app
COPY package.json /app/package.json

RUN npm i && npm build

CMD ["npx", "vite --host"]
