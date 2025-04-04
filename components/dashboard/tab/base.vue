<template>
  <div class="flex-1 bg-base-100 p-4 rounded-lg border border-base-200 shadow-md flex flex-col">
    <h1 class="text-2xl font-bold">
      {{ title }}
    </h1>
    <slot />
  </div>
</template>

<script lang="ts" setup>
defineProps({
  title: String,
})
</script>

<style>

</style>
