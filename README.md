<div align="center">
    <img src="docs/logo.png" width="128">
    <h1>
        Asso +
    </h1>
</div>

## 📄 Description

Asso+ is a tool for easy association management.

## ✨ Getting Started

To start using Asso+, run the following command:
```sh
pnpm install
pnpm run dev
```

This will start the application, and you can access it in your web browser at `http://localhost:3000`.

### 🐋 Docker

```yml
services:
  assoplus:
    build:
      target: production
      context: .
      dockerfile: Dockerfile
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@localhost:5432/assoplus
      - NUXT_SMTP_HOST=
      - NUXT_SMTP_PORT=
      - NUXT_SMTP_SECURE=
      - NUXT_SMTP_FROM=
      - NUXT_BASE_URL=
      - NUXT_S3_ACCESS_KEY_ID=
      - NUXT_S3_SECRET_ACCESS_KEY=
      - NUXT_S3_REGION=
      - NUXT_S3_BUCKET=
      - NUXT_S3_ENDPOINT=
      - NUXT_PUBLIC_VERSION=
      - NUXT_SESSION_PASSWORD=
      - NUXT_AUTH_REGISTER_VERIFY_SECRET=
      - NUXT_OAUTH_GOOGLE_CLIENT_ID=
      - NUXT_OAUTH_GOOGLE_CLIENT_SECRET=
      - NUXT_OAUTH_GOOGLE_REDIRECT_URL=http://<host>/api/auth/google
    ports:
      - "80:80"
    depends_on:
      assoplus-db:
        condition: service_healthy
  assoplus-db:
    image: postgres:12
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: assoplus
    ports:
      - "5432:5432"
    healthcheck:
      test: [ "CMD-SHELL", "pg_isready -U postgres -d postgres" ]
      interval: 5s
      timeout: 2s
      retries: 20
```