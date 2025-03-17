<!-- components/AppLoader.vue -->
<template>
  <div
    v-if="isLoading"
    class="flex flex-col items-center justify-center h-screen w-screen"
  >
    <span class="fixed right-2 bottom-2">{{ version }}</span>
    <div class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-emerald-500" />
  </div>
  <slot v-else />
</template>

<script setup>
const authStore = useAuthStore()
const isLoading = computed(() => authStore.isLoading)
const { public: { version } } = useRuntimeConfig()
</script>
