FROM node:20

WORKDIR /app

COPY package*.json ./
# COPY clothes.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD [ "node", "."]