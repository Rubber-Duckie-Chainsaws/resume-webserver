FROM node:lts

RUN mkdir /app
WORKDIR /app
COPY package.json /app/package.json

RUN npm i

COPY vite.config.js .
COPY public .
COPY index.html .
COPY src .

RUN npm run build

CMD ["npx", "vite --host"]
