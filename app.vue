<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - Asso+` : "Asso+"
  },
  htmlAttrs: {
    "data-theme": "emerald",
  },
})
</script>

<style>
html,
body {
  height: 100dvh;
}
</style>
