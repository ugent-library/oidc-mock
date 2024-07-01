FROM node:18-alpine3.19

WORKDIR /app

COPY package*.json .
COPY server.mjs .

RUN npm install

EXPOSE 3333

CMD ["node", "/app/server.mjs"]