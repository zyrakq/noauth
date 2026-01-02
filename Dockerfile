# Base image for building
FROM node:22.7-alpine AS build

RUN apk add --no-cache python3 make g++

# Working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the root directory
COPY lerna.json ./
COPY package*.json ./
COPY packages/client/package*.json ./packages/client/
COPY packages/common/package*.json ./packages/common/
COPY packages/backend/package*.json ./packages/backend/
COPY packages/server/package*.json ./packages/server/

# Install dependencies in the root directory
RUN npm install

# Copy the rest of the project files
COPY . .

# Build all packages
RUN npm run build:hosted

# Image for client
FROM nginx:alpine AS client

# Copy built files from the previous stage
COPY --from=build /usr/src/app/packages/client/build /usr/share/nginx/html

# Copy Nginx configuration file
COPY packages/client/nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copy env-config.js generation script
COPY packages/client/generate-env-config.sh /docker-entrypoint.d/40-generate-env-config.sh
RUN chmod +x /docker-entrypoint.d/40-generate-env-config.sh

# Nginx will automatically run scripts from /docker-entrypoint.d/ before starting
CMD ["nginx", "-g", "daemon off;"]

# Image for server
FROM node:22.7-alpine AS server

# Working directory
WORKDIR /usr/src/app

# Copy files from the previous stage
COPY --from=build /usr/src/app /usr/src/app

# Run Prisma migrations
RUN npx prisma migrate deploy

# Expose port
EXPOSE 8080

# Start the server
CMD ["sh", "-c", "npm run start:server"]
