// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxt/icon",
    "@nuxt/eslint",
    "@nuxtjs/i18n",
    "@prisma/nuxt",
    "@pinia/nuxt",
    "nuxt-seo-utils",
    "nuxt-auth-utils",
    "@nuxt/image",
  ],
  ssr: true,
  devtools: { enabled: false },
  runtimeConfig: {
    oauth: {
      google: {
        clientId: "",
        clientSecret: "",
      },
    },
    s3: {
      endpoint: "",
      accessKeyId: "",
      secretAccessKey: "",
      region: "",
      bucket: "",
    },
    smtp: {
      host: "",
      port: 587,
      user: "",
      pass: "",
      secure: "false",
      from: "",
    },
    baseUrl: "",
    public: {
      version: "1.0.0",
    },
  },
  routeRules: {
    "/terms": { prerender: true },
    "/privacy": { prerender: true },
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
  i18n: {
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
    },
    /* https://github.com/nuxt-modules/i18n/issues/3238#issuecomment-2672492536 */
    bundle: {
      optimizeTranslationDirective: false,
    },
    locales: [
      {
        code: "en",
        iso: "en-US",
        name: "English",
      },
      {
        code: "fr",
        iso: "fr-FR",
        name: "Français",
      },
    ],
    defaultLocale: "fr",
    experimental: {
      localeDetector: "./localeDetector.ts",
    },
  },
  icon: {
    provider: "server",
  },
  prisma: {
    skipPrompts: true,
    generateClient: true,
  },
  seo: {
    meta: {
      title: "Asso+",
      description: "Rendez votre association visible et gérez mieux votre association avec Asso+.",
      applicationName: "Asso+",
      google: "nositelinkssearchbox",
      googlebot: "notranslate",
    },
  },
})
