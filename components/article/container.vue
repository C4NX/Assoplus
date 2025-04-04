<template>
  <div class="bg-grid">
    <div class="min-h-screen mt-20 mb-10 mx-10 border-2 rounded-md p-4 space-y-2 bg-base-100">
      <h1 class="text-center font-bold text-xl">
        <img
          src="/logo.svg"
          class="mx-auto mb-2 w-20"
        >
        {{ $t(title) }}
      </h1>
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  title: {
    type: String,
    default: "Article Title",
  },
})
</script>

<style></style>
