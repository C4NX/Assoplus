<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const { setLocale, availableLocales } = useI18n()

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - Asso+` : "Asso+"
  },
  htmlAttrs: {
    "data-theme": "emerald",
  },
})

const setLocaleIfAvailable = (locale: string) => {
  if (availableLocales.includes(locale)) {
    setLocale(locale)
    localStorage.setItem("locale", locale)
  }
}

onMounted(() => {
  const locale = localStorage.getItem("locale")
  if (locale) {
    setLocaleIfAvailable(locale)
  }
})
</script>

<style>
html,
body {
  height: 100dvh;
}
</style>
