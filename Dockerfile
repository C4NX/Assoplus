FROM node:22-alpine AS build
WORKDIR /app
RUN corepack enable

# Copy the entire project
COPY . ./

# Install dependencies and build the project
RUN pnpm i \
    && yes | pnpm run build

# Development Stage
FROM node:22-alpine AS development
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm i
CMD ["pnpm", "dev"]

# Production Stage
FROM node:22-alpine AS production
ARG DATABASE_URL
WORKDIR /app

# Only `.output` folder is needed from the build stage
COPY --from=build /app/.output /app/dist
COPY --from=build /app/prisma /app/prisma

# Install corepack and prisma
RUN corepack enable
ENV PNPM_HOME=/app/.pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN pnpm i -g prisma@6.4.0

# Change the port and host
ENV PORT 80
ENV HOST 0.0.0.0
EXPOSE 80

CMD ["/bin/sh", "-c", "prisma migrate deploy && node /app/dist/server/index.mjs"]
