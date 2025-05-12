// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs"

export default withNuxt(
  {
    rules: {
      "@typescript-eslint/no-extraneous-class": ["error", { allowWithDecorator: true }],
      "no-unsafe-optional-chaining": "off",
    },
  },
  {
    files: ["**/Association/Panel/News.vue"],
    rules: {
      "vue/no-v-html": "off",
    },
  },
)
