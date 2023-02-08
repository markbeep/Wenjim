FROM node:16-alpine as build-stage

WORKDIR /app

COPY package*.json /app/
RUN npm install --production
COPY . .
COPY public/ public/
COPY tsconfig.json .
COPY tailwind.config.js .

ENV BACKEND_PROXY=http://wenjim-backend-staging:5000

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
