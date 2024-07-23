FROM node:20-alpine3.19 as base

WORKDIR /app

FROM base As builder

COPY . .

RUN 