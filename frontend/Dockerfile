FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

ARG REACT_APP_API_URL
ARG REACT_APP_WS_URL
ARG REACT_APP_USE_REAL_API

ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_WS_URL=$REACT_APP_WS_URL
ENV REACT_APP_USE_REAL_API=$REACT_APP_USE_REAL_API

COPY . .
RUN rm -f .env .env.local .env.production .env.production.local

RUN npm run build

FROM node:18-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/build ./build

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]