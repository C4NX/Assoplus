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
    devProxy: {
      host: 'localhost',
    },
  },
  devServer: {
    host: '0',
  },
  vite: {
    resolve: {
      alias: {
        '.prisma/client/index-browser': './node_modules/.prisma/client/index-browser',
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
  prisma: {
    skipPrompts: true,
    generateClient: true,
  },
  icon: {
    provider: "server",
  },
  i18n: {
    vueI18n: "./i18n.config.ts",
  },
})
