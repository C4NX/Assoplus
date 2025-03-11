// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxt/icon",
    "@nuxt/eslint",
    "@nuxtjs/i18n",
    "@prisma/nuxt",
    "@pinia/nuxt",
  ],
  devtools: { enabled: false },
  runtimeConfig: {
    jwtSecret: "",
  },
  compatibilityDate: "2024-11-01",
  nitro: {
    experimental: {
      // https://www.prisma.io/docs/orm/overview/databases/database-drivers#nuxt
      wasm: true,
    },
  },
  vite: {
    resolve: {
      alias: {
        ".prisma/client/index-browser": "node_modules/.prisma/client/index-browser.js",
      },
    },
  },
  eslint: {
    config: {
      stylistic: {
        indent: 2,
        quotes: "double",
        semi: false,
        jsx: false,
      },
    },
  },
  icon: {
    provider: "server",
  },
  prisma: {
    skipPrompts: true,
    generateClient: true,
  },
})
