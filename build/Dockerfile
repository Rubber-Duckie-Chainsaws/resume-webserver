FROM node:lts

RUN mkdir /app
WORKDIR /app
COPY package.json /app/package.json

RUN npm i && npm run build

CMD ["npx", "vite --host"]
