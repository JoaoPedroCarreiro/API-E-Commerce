FROM node:18

WORKDIR /

RUN npm install

RUN npm run start

EXPOSE 8080