FROM node:20

WORKDIR /

COPY package*.json ./
# COPY clothes.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD [ "node", "."]