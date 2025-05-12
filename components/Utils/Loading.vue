<template>
  <div
    v-if="status === 'pending' || status === 'error'"
    class="loading-container"
  >
    <!-- Error state -->
    <Icon
      v-if="status === 'error'"
      name="mdi:error-outline"
      class="text-5xl"
    />
    <h1
      v-if="status === 'error'"
      class="error-title"
    >
      Une erreur est survenue
    </h1>
    <p
      v-if="status === 'error'"
      class="error-message"
    >
      <slot name="error">
        Une erreur est survenue lors du chargement des données. Veuillez réessayer.
      </slot>
    </p>
    <!-- Loading state -->
    <Icon
      v-if="status === 'pending'"
      name="mdi:loading"
      class="text-5xl animate-spin"
    />
    <p
      v-if="status === 'pending'"
      class="loading-message"
    >
      <slot name="loading">
        Chargement des données...
      </slot>
    </p>
  </div>
  <!-- Success state -->
  <template v-if="status === 'success'">
    <slot />
  </template>
</template>

<script lang="ts" setup>
import type { AsyncDataRequestStatus } from "nuxt/app"

defineProps<{
  status: AsyncDataRequestStatus
}>()
</script>

<style scoped>
.loading-container {
  @apply flex flex-col items-center justify-center h-full;
}

.error-title {
  @apply text-2xl font-bold;
}

.error-message {
  @apply text-lg;
}

.loading-message {
  @apply mt-4 text-lg;
}
</style>
