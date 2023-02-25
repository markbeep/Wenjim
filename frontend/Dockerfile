FROM node:18-bullseye-slim as build-stage

WORKDIR /app

COPY frontend/package*.json /app/
RUN npm install --omit=dev
COPY proto /proto
COPY frontend/ /app

ENV BACKEND_PROXY=http://wenjim-envoy-staging:8080

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
