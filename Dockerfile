FROM node:20

WORKDIR /

COPY package*.json ./
COPY clothes.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "node", "."]