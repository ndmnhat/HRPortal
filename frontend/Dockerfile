FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache bash wget openjdk17-jre

COPY package*.json ./
RUN npm ci

COPY . .

# Default spec URL; can be overridden via env or shared file
ENV OPENAPI_SPEC_URL=http://backend:3000/openapi.json

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3001

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
