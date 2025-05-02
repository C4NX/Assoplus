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
</script>

<style>
html,
body {
  height: 100dvh;
}
</style>
