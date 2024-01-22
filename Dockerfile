FROM node:18

WORKDIR /

RUN npm install

RUN npm run build

EXPOSE 8080