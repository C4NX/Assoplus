FROM node:22-alpine AS build
WORKDIR /app

RUN corepack enable

# Copy the entire project
COPY . ./

# Install dependencies
RUN pnpm i \
    && pnpm run build

# Build Stage 2

FROM node:22-alpine
WORKDIR /app

# Only `.output` folder is needed from the build stage
COPY --from=build /app/.output/ ./

# Change the port and host
ENV PORT 80
ENV HOST 0.0.0.0
EXPOSE 80

CMD ["node", "/app/server/index.mjs"]