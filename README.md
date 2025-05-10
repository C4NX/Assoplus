<div align="center">
    <img src="docs/logo.png" width="128">
    <h1>
        Asso +
    </h1>
</div>

## 📄 Description

Asso+ is a tool for easy association management.

> [!IMPORTANT]  
> This is a school project for CNAM Grand-Est 2024-2025. It is not finished, and can have bugs and issues.

## ✨ Getting Started

To start using Asso+, run the following command:
```sh
npm install
npm run dev
```

This will start the application, and you can access it in your web browser at `http://localhost:3000`.

### 📦 Environment Variables

| Variable | Description |
| --- | --- |
| NUXT_SMTP_HOST **(needed)** | SMTP host for email sending |
| NUXT_SMTP_PORT **(needed)**  | SMTP port for email sending |
| NUXT_SMTP_SECURE **(needed)**  | Whether to use secure connection for email sending |
| NUXT_SMTP_FROM **(needed)**  | Email address used as the sender |
| NUXT_BASE_URL **(needed)**  | Base URL of the application |
| NUXT_S3_ACCESS_KEY_ID **(needed)**  | Access key ID for S3 storage |
| NUXT_S3_SECRET_ACCESS_KEY **(needed)**  | Secret access key for S3 storage |
| NUXT_S3_REGION **(needed)**  | Region of the S3 storage |
| NUXT_S3_BUCKET **(needed)**  | Name of the S3 bucket |
| NUXT_S3_ENDPOINT **(needed)**  | Endpoint of the S3 storage |
| NUXT_SESSION_PASSWORD **(needed)**  | Password for session management |
| NUXT_OAUTH_GOOGLE_CLIENT_ID **(needed)**  | Client ID for Google OAuth |
| NUXT_OAUTH_GOOGLE_CLIENT_SECRET **(needed)** | Client secret for Google OAuth |
| NUXT_OAUTH_GOOGLE_REDIRECT_URL **(needed)** | Redirect URL for Google OAuth (e.g. http://host/api/auth/google) |
| NUXT_BASE_URL **(needed)** | Base URL of the application (e.g. http://localhost:3000) |
| NUXT_PUBLIC_VERSION | Public version of the application |
| NUXT_PUBLIC_CONTACT_EMAIL | Contact email (e.g. assoplus@exemple.com) |

### 🐋 Docker

```yml
services:
  assoplus:
    build:
      target: production
      context: .
      dockerfile: Dockerfile
    environment:
      # See environment variables above
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