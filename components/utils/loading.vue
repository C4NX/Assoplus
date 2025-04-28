<template>
  <div v-if="status === 'pending' || status === 'error'" class="loading-container">
    <!-- Error state -->
    <Icon name="mdi:error-outline" class="text-5xl" v-if="status === 'error'" />
    <h1 class="error-title" v-if="status === 'error'">Une erreur est survenue</h1>
    <p class="error-message" v-if="status === 'error'">
      <slot name="error">
        Une erreur est survenue lors du chargement des données. Veuillez réessayer.
      </slot>
    </p>
    <!-- Loading state -->
    <Icon name="mdi:loading" class="text-5xl animate-spin" v-if="status === 'pending'" />
    <p class="loading-message" v-if="status === 'pending'">
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
import type { AsyncDataRequestStatus } from 'nuxt/app'

defineProps<{
  status: AsyncDataRequestStatus
}>()

</script>

<style scoped lang="postcss">
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