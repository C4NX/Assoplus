<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { initFlowbite } from "flowbite"
import { onMounted } from "vue"
import { useFlowbite } from "~/composables/useFlowbite"

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - Asso+` : "Asso+"
  },
})

// initialize components based on data attribute selectors
onMounted(() => {
  useFlowbite(() => {
    initFlowbite()
  })
})
</script>

<style>
html,
body {
  height: 100dvh;
}
</style>
