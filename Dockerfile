FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm i



COPY app.js .

EXPOSE 8000

CMD ["node","app.js"]

