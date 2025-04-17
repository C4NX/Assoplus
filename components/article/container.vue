<template>
  <div class="legal-container">
    <div class="legal-card">
      <header class="legal-header">
        <img
          src="/logo.svg"
          alt="Asso+ logo"
          class="legal-logo"
          width="80"
          height="80"
        >
        <h1 class="legal-title">
          <slot name="title" />
        </h1>
      </header>

      <div class="legal-content">
        <slot />
      </div>

      <footer class="legal-footer">
        <NuxtLinkLocale
          href="/"
          class="back-link"
        >
          {{ $t('back') }}
        </NuxtLinkLocale>
        <div class="version-info">
          {{ $t('last_updated') }}: {{ lastUpdated }}
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue"

defineProps({
  lastUpdated: {
    type: String,
    default: new Date().toLocaleDateString(),
  },
})
</script>

<style scoped>
.legal-container {
  @apply min-h-screen flex items-center justify-center py-2 md:py-10;
  background: linear-gradient(135deg, #f5f5f5 25%, #e0e0e0 100%);
}

.legal-card {
  @apply max-w-4xl w-full p-8 md:p-12 rounded-2xl shadow-xl mt-20;
  @apply bg-white/90 backdrop-blur-sm;
  @apply transition-all duration-300;
  @apply hover:shadow-2xl;
}

.legal-header {
  @apply flex flex-col items-center mb-8 text-center;
}

.legal-logo {
  @apply mb-4;
  @apply transition-transform duration-300;
}

.legal-title {
  @apply text-3xl md:text-4xl font-bold mb-4;
  @apply text-neutral-800;
  letter-spacing: -0.02em;
}

.legal-content {
  @apply prose prose-neutral max-w-none;
  @apply text-lg leading-relaxed;
}

.legal-footer {
  @apply mt-12 pt-6 border-t border-neutral-200;
  @apply flex flex-col md:flex-row items-center justify-between;
  @apply text-sm text-neutral-600;
}

.back-link {
  @apply font-medium text-primary hover:underline mb-4 md:mb-0;
}

.version-info {
  @apply mt-2 md:mt-0;
}

@media (max-width: 768px) {
  .legal-card {
    @apply p-6;
  }

  .legal-title {
    @apply text-2xl;
  }

  .legal-content {
    @apply text-base;
  }
}
</style>
