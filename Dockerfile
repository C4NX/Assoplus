# Development Stage
FROM node:22-bookworm AS development
WORKDIR /app
RUN corepack enable
CMD ["pnpm", "dev"]

# Build Stage (Production)
FROM node:22-bookworm AS build_production
WORKDIR /app
RUN corepack enable
COPY . ./
ENV NODE_ENV=production
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN pnpm fetch --frozen-lockfile
RUN pnpx prisma generate
RUN pnpm build

# Production Stage
FROM node:22-bookworm AS production
ARG DATABASE_URL
WORKDIR /app
COPY --from=build_production /app/.output /app
COPY --from=build_production /app/node_modules/.prisma /app/server/node_modules/.prisma
COPY --from=build_production /app/prisma /app/prisma

# Install Prisma to deploy migrations before starting the server
RUN corepack enable
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN pnpm i -g prisma

# Deploy and start the server
ENV NODE_ENV=production
ENV PORT 80
ENV HOST 0.0.0.0
EXPOSE 80
CMD ["/bin/sh", "-c", "prisma migrate deploy && node /app/server/index.mjs"]
