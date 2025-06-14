# Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN rm -rf node_modules package-lock.json && npm install

COPY . .

RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start:dev"]
