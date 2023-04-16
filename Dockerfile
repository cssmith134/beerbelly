FROM node:alpine AS builder
ENV NODE_OPTIONS --openssl-legacy-provider
ENV NODE_ENV=production

WORKDIR /app

RUN apk update
RUN apk add --no-cache libc6-compat

COPY . .
RUN npm install --include=dev
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "startClient"]
