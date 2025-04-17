<template>
  <div class="dashboard-tab-base">
    <h1 class="dashboard-tab-title">
      <slot name="title" />
    </h1>
    <slot />
  </div>
</template>

<script lang="ts" setup>
</script>

<style lang="postcss">
.dashboard-tab-base {
  @apply flex-1 bg-base-100 p-4 rounded-lg border border-base-200 shadow-md flex flex-col;
}

.dashboard-tab-title {
  @apply text-2xl font-bold mb-2;
}
</style>
