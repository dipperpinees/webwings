FROM node:20-alpine
RUN apk update
RUN apk add --no-cache libc6-compat go gcc musl-dev

WORKDIR /app

COPY . .

RUN npm install

RUN npm run generate

RUN npm run build

CMD ["npm", "run", "start"]