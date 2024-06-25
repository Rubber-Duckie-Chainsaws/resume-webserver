FROM node:lts

RUN mkdir /app
WORKDIR /app
COPY package.json /app/package.json

RUN npm i
RUN npm i vite

COPY vite.config.js /app/vite.config.js
COPY public /app/public
COPY index.html /app/index.html
COPY src /app/src

RUN npm run build

CMD ["npx", "vite --host"]
