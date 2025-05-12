<template>
  <NuxtLayout>
    <NuxtLoadingIndicator />
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - Asso+` : "Asso+"
  },
  htmlAttrs: {
    "data-theme": "assoplus",
  },
})

useSeoMeta({
  description: "Gérez plus facilement votre association et rendez-la visible avec Asso+.",
  keywords: "asso, association, asso+, asso plus, gestion d'association, gestion asso",
  twitterTitle: 'Asso+',
  twitterDescription: "Gérez plus facilement votre association et rendez-la visible avec Asso+.",
  twitterImage: "/og-image.png",
})

</script>

<style>
html,
body {
  height: 100dvh;
}
</style>
