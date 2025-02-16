// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss", "@nuxt/icon", "@nuxt/eslint"],
  devtools: { enabled: true },
  compatibilityDate: "2024-11-01",
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
})
