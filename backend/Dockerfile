FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install concurrently

COPY . .

CMD ["npx", "concurrently", "-k", "npm:start", "node mail-consumer/mailConsumer.js"]
