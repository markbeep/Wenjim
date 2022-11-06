FROM node:16-alpine as build-stage

WORKDIR /app

COPY package*.json /app/
RUN npm install
COPY . .
COPY public/ public/
COPY tsconfig.json .
COPY tailwind.config.js .
COPY .env.deployment .env.local

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
