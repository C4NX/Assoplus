# Development Stage
FROM node:22-bookworm AS development
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "run", "dev"]

# Build Stage (Production)
FROM node:22-bookworm AS build_production
WORKDIR /app
COPY package*.json ./
COPY . ./
RUN npm ci
ENV NODE_ENV=production
RUN npx prisma generate \
    && npm run build

# Production Stage
FROM node:22-bookworm AS production
ARG DATABASE_URL
WORKDIR /app
COPY --from=build_production /app/.output /app
COPY --from=build_production /app/prisma /app/prisma

# Install Prisma to deploy migrations before starting the server
RUN npm install -g prisma

# Deploy and start the server
ENV NODE_ENV=production
ENV PORT 80
ENV HOST 0.0.0.0
EXPOSE 80
CMD ["/bin/sh", "-c", "prisma migrate deploy && node /app/server/index.mjs"]
