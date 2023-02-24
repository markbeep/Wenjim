FROM node:18-alpine3.17 as build-stage

WORKDIR /app

COPY package*.json /app/
RUN npm install --production
COPY . .
COPY proto .
COPY public/ public/
COPY tsconfig.json .
COPY tailwind.config.js .

ENV BACKEND_PROXY=http://wenjim-backend-staging:8080

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
